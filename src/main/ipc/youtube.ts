import fs from "fs/promises"
import { BrowserWindow, ipcMain } from "electron";
import { access, constants, readdirSync } from "fs"
import { createHash } from "crypto"
import { basePath } from "../config/paths";
import path from "path";
import { cleanYoutubeUrl, downloadCacheImage, extractYouTubeDescription, getYouTubeVideoId } from "../utils/youtube";
import * as cheerio from "cheerio"
import { createDir } from "../utils/fs";
import youtubedl from "youtube-dl-exec"

export function registerYoutubeIpc(mainWindow: BrowserWindow) {
    // duplicated in Url.tsx in the frontend
    type MetaData = {
        title: string
        description: string
        image: ArrayBuffer
        favicon: ArrayBuffer
    }

    ipcMain.handle("scrapeUrl", async (_event, data: { url: string; cache: boolean }): Promise<MetaData> => {
        const { url, cache } = data
        try {
            //TODO: before anything check if this url is alredy cached
            const urlHashed = createHash("sha256").update(url).digest("hex").slice(0, 16)
            const filePath = `${basePath}/cache/urls/${urlHashed}/${urlHashed}.json`
            let exists = true
            try {
                await access(filePath, constants.F_OK)
            } catch {
                exists = false
            }

            if (exists) {
                const json = JSON.parse(await fs.readFile(`${basePath}/cache/urls/${urlHashed}/${urlHashed}.json`, "utf-8"))

                const files = await fs.readdir(`${basePath}/cache/urls/${urlHashed}`)
                const image = files.find((file) => path.parse(file).name === "image")
                const favicon = files.find((file) => path.parse(file).name === "favicon")

                const imageBuffer = image ? await fs.readFile(`${basePath}/cache/urls/${urlHashed}/${image}`) : new ArrayBuffer(0)
                const faviconBuffer = favicon ? await fs.readFile(`${basePath}/cache/urls/${urlHashed}/${favicon}`) : new ArrayBuffer(0)

                return { title: json.title, description: json.description, image: imageBuffer, favicon: faviconBuffer }
            }

            const res = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " + "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9"
                }
            })

            if (!res.ok) throw new Error(`HTTP error: ${res.status}`)

            const html = await res.text()
            const $ = cheerio.load(html)

            let title =
                $("meta[property='og:title']").attr("content") || $("meta[name='twitter:title']").attr("content") || $("title").text() || "placeholder"

            let description =
                $("meta[property='og:description']").attr("content") ||
                $("meta[name='twitter:description']").attr("content") ||
                $("meta[name='description']").attr("content") ||
                "placeholder"

            let image =
                $("meta[property='og:image']").attr("content") ||
                $("meta[name='twitter:image']").attr("content") ||
                $("link[rel='image_src']").attr("href") ||
                $("img").first().attr("src") ||
                "placeholder.png"

            let favicon =
                $("link[rel='icon']").attr("href") ||
                $("link[rel='shortcut icon']").attr("href") ||
                $("link[rel='apple-touch-icon']").attr("href") ||
                "placeholder.png"

            const hostname = new URL(url).hostname.replace(/^www\./, "")
            if (hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtu.be") {
                const full = extractYouTubeDescription(html)
                console.log("extractYouTubeDescriptionextractYouTubeDescriptionextractYouTubeDescription")
                console.log(full)
                if (full) description = full
            }


            // Normalize relative URLs
            const baseUrl = new URL(url)

            if (image && !image.startsWith("http")) {
                image = new URL(image, baseUrl).toString()
            }
            if (favicon && !favicon.startsWith("http")) {
                favicon = new URL(favicon, baseUrl).toString()
            }

            if (cache) {
                const urlHash = createHash("sha256").update(url).digest("hex").slice(0, 16)
                const imagePath = await downloadCacheImage(image, image, urlHash, "image")
                const faviconPath = await downloadCacheImage(favicon, favicon, urlHash, "favicon")
                const json = JSON.stringify(
                    {
                        title: title,
                        description: description
                    },
                    null,
                    2
                )
                console.log(json)
                await fs.writeFile(`${basePath}/cache/urls/${urlHash}/${urlHash}.json`, json, "utf-8")

                const imageBuffer = imagePath != null ? await fs.readFile(imagePath) : new ArrayBuffer(10)
                const faviconBuffer = faviconPath != null ? await fs.readFile(faviconPath) : new ArrayBuffer(10)
                return { title, description, image: imageBuffer, favicon: faviconBuffer }
            }

            //TODO: change to return the buffer data for image not urls
            console.log("pppppppppppppppppppppppppppppppppppppppppppppppp")
            console.log("pppppppppppppppppppppppppppppppppppppppppppppppp")
            console.log("pppppppppppppppppppppppppppppppppppppppppppppppp")
            console.log(description)
            console.log("pppppppppppppppppppppppppppppppppppppppppppppppp")
            console.log("pppppppppppppppppppppppppppppppppppppppppppppppp")
            console.log("pppppppppppppppppppppppppppppppppppppppppppppppp")
            return { title, description, image: new ArrayBuffer(10), favicon: new ArrayBuffer(10) }
        } catch (err) {
            console.error("scrapeUrl failed:", url, err)

            return {
                title: "placeholder",
                description: "placeholder",
                image: new ArrayBuffer(10),
                favicon: new ArrayBuffer(10)
            }
        }
    })


    ipcMain.handle("cacheYoutubeVid", async (event, url: string) => {
        console.log("download started")
        console.log(url)
        createDir("cache/youtube")
        const vidId = getYouTubeVideoId(url)
        if (!vidId) {
            return {
                success: false,
                message: "failed to get id from youtube url"
            }
        }

        //TODO: check the file doesnt exist first
        const files = readdirSync(`${basePath}/cache/youtube/`)
        const file = files.find((file) => file.startsWith(vidId)) ? files.find((file) => file.startsWith(vidId)) : null
        if (file) {
            console.log("file is already downloaded")
            event.sender.send("youtube-download-complete", {
                vidId
            })
            return {
                success: true,
                fileName: file,
                message: "file is already downloaded"
            }
        }

        // https://www.youtube.com/watch?v=VDdLF1YubI0&list=RDVDdLF1YubI0&start_radio=1
        //? clean url
        const clearUrl = cleanYoutubeUrl(url)
        if (!clearUrl) return {
            success: false,
            message: "the url is invalid"
        }
        const subprocess = youtubedl.exec(clearUrl, {
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ["referer:youtube.com", "user-agent:googlebot"],
            output: `${basePath}/cache/youtube/${vidId}.%(ext)s`,
            newline: true
        })

        let lastSent = 0
        let downloading = ""
        subprocess.stdout?.on("data", (data) => {
            const line = data.toString()
            console.log(line)
            const matchDownload = line.match(/(\d+(?:\.\d+)?)%/)
            const matchFileName = line.match(/\[download\]\s+Destination:\s(.+)/)
            if (matchFileName) {
                downloading = matchFileName ? matchFileName[1].trim() : null
            }
            if (matchDownload) {
                const now = Date.now()
                if (now - lastSent < 500) return
                lastSent = now

                const progress = parseFloat(matchDownload[1])
                console.log("progress:", progress)

                event.sender.send("youtube-download-progress", {
                    downloading,
                    progress,
                    vidId
                })

                mainWindow.setProgressBar(progress / 100)
            }
        })

        subprocess.stderr?.on("data", (data) => {
            console.error(data.toString())
        })

        return new Promise((resolve, reject) => {
            subprocess.on("close", () => {
                console.log("Download complete")
                mainWindow.setProgressBar(-1)
                event.sender.send("youtube-download-complete", {
                    vidId
                })
                resolve({
                    success: true,
                    message: "download complete"
                })
            })

            subprocess.on("error", (err) => {
                console.error(err)
                mainWindow.setProgressBar(-1)
                reject({
                    success: false,
                    message: err.message
                })
            })
        })
    })


    ipcMain.handle("deleteCachedYoutubeVid", async (event, url: string) => {
        const vidId = getYouTubeVideoId(url)
        if (!vidId) {
            return {
                success: false,
                message: "failed to get id from youtube url"
            }
        }
        //TODO: check the file doesnt exist first
        const files = readdirSync(`${basePath}/cache/youtube/`)
        const file = files.find((file) => file.startsWith(vidId)) ? files.find((file) => file.startsWith(vidId)) : null
        if (file) {
            console.log("deleting file:", path.join(`${basePath}/cache/youtube/`, file))
            await fs.unlink(path.join(`${basePath}/cache/youtube/`, file))
            // TODO: here we delete the file
            return {
                success: true,
                message: "file is deleted"
            }
        }

        return {
            success: true,
            message: "file was not found"
        }
    })


    ipcMain.handle("checkCacheYoutubeVidExists", async (event, url: string) => {
        const vidId = getYouTubeVideoId(url)
        if (!vidId) {
            return {
                success: false,
                message: "failed to get id from youtube url"
            }
        }
        //TODO: check the file doesnt exist first
        const files = readdirSync(`${basePath}/cache/youtube/`)
        const file = files.find((file) => file.startsWith(vidId)) ? files.find((file) => file.startsWith(vidId)) : null
        if (file) {
            return {
                success: true,
                fileName: file,
                message: "file exists"
            }
        } else {
            return {
                success: false,
                message: "file was not found"
            }
        }
    })
}
