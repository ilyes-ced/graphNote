import { BrowserWindow, ipcMain } from "electron";
import { access, mkdir } from "fs/promises";
import path from "path";
import fs from "fs/promises";
import * as cheerio from "cheerio";
import { createHash } from "crypto";
import { constants, createWriteStream, readdirSync } from "fs";
import { Innertube, UniversalCache } from 'youtubei.js';
import youtubedl from 'youtube-dl-exec';

const basePath = "/home/clippy/Documents/GraphNote";
const baseDir = "/home/clippy/Documents";
const nodesPath = `${basePath}/nodes.json`;
const edgesPath = `${basePath}/edges.json`;


// duplicated in Url.tsx in the frontend
type MetaData = {
    title: string;
    description: string;
    image: ArrayBuffer;
    favicon: ArrayBuffer;
};



function getExtensionFromContentType(contentType: string | null): string {
    if (!contentType) return ".jpg"; // fallback

    const map: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/gif": ".gif",
        "image/bmp": ".bmp",
        "image/svg+xml": ".svg",
    };

    return map[contentType.split(";")[0]] || ".jpg";
}

function getExtensionFromUrl(url: string): string | null {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname);
    return ext || null;
}




function getNextName(fileName: string, counter: number) {
    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);
    return `${name}_${counter}${ext}`;
}

async function ensureDir() {
    await mkdir(basePath, { recursive: true });
}


async function createDir(folderName: string) {
    await mkdir(`${basePath}/${folderName}`, { recursive: true });
}

async function readJSON(filePath: string) {
    try {
        await ensureDir();

        try {
            const text = await fs.readFile(filePath, "utf-8");
            return JSON.parse(text);
        } catch {
            await fs.writeFile(filePath, JSON.stringify({}, null, 2));
            return {};
        }

    } catch (err) {
        console.error("Failed to read:", filePath, err);
        return {};
    }
}

async function writeJSON(filePath: string, data: any) {
    try {
        await ensureDir();
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error("Failed to write:", filePath, err);
        return false;
    }
}

/* ------------------- GRAPH ------------------- */

ipcMain.handle("getNodes", async () => {
    return await readJSON(nodesPath);
});

ipcMain.handle("getEdges", async () => {
    return await readJSON(edgesPath);
});

ipcMain.handle("saveNodes", async (_, nodes) => {
    return { success: await writeJSON(nodesPath, nodes) };
});

ipcMain.handle("saveEdges", async (_, edges) => {
    return { success: await writeJSON(edgesPath, edges) };
});

ipcMain.handle("readGraph", async () => {
    const nodes = await readJSON(nodesPath);
    const edges = await readJSON(edgesPath);

    return { nodes, edges };
});

/* ------------------- FILE ------------------- */

ipcMain.handle("readFile", async (_, { folderPath, filePath }) => {

    const fullFolder = `${baseDir}/${folderPath}`;
    const fullFile = `${baseDir}/${filePath}`;

    await mkdir(fullFolder, { recursive: true });

    try {
        await fs.access(fullFile);
    } catch {
        await fs.writeFile(fullFile, JSON.stringify({}, null, 2));
    }

    const text = await fs.readFile(fullFile, "utf-8");

    return { text };
});


ipcMain.handle("writeFile", async (_, { text, data }) => {
    const fullFile = path.join(basePath, text);

    if (!fullFile.startsWith(basePath)) {
        throw new Error("Invalid path");
    }

    const dir = path.dirname(fullFile);

    await mkdir(dir, { recursive: true });

    ensureDir()

    let counter = 0;
    let finalName = "";
    let finalPath = "";

    // Determine unique file name
    while (true) {
        finalName =
            counter === 0 ? text : getNextName(text, counter);
        finalPath = path.join(basePath, finalName);

        try {
            await fs.access(finalPath);
            counter++;
        } catch {
            break;
        }
    }

    await fs.writeFile(finalPath, data);

    return {
        success: true,
        path: finalName
    };
});


ipcMain.handle("getAvailableFilePath", async (_, { path: inputPath }) => {

    const folderPath = "GraphNote";

    let counter = 0;
    let finalPath = "";

    while (true) {

        const originalFile = path.basename(inputPath);

        const fileName =
            counter === 0
                ? originalFile
                : getNextName(originalFile, counter);

        const fullPath = path.join(baseDir, folderPath, fileName);

        try {
            await fs.access(fullPath);
        } catch {
            finalPath = path.join(folderPath, fileName);
            break;
        }

        counter++;
    }

    return {
        success: true,
        path: finalPath
    };
});


ipcMain.handle(
    "writeNodeFile",
    async (_event, { name: inputName, data }: { name: string; data: Uint8Array }) => {
        ensureDir()

        let counter = 0;
        let finalName = "";
        let finalPath = "";

        // Determine unique file name
        while (true) {
            finalName =
                counter === 0 ? inputName : getNextName(inputName, counter);
            finalPath = path.join(basePath, finalName);

            try {
                await fs.access(finalPath);
                counter++;
            } catch {
                break;
            }
        }

        await fs.writeFile(finalPath, data);

        return {
            res: true,
            text: finalName,
            path: finalPath
        };
    }
);

ipcMain.handle('readImage', async (_event, filePath: string) => {
    const data = await fs.readFile(path.join(basePath, filePath));
    return data;
});




ipcMain.handle("scrapeUrl", async (_event, data: { url: string; cache: boolean }): Promise<MetaData> => {
    const { url, cache } = data;
    try {

        //TODO: before anything check if this url is alredy cached
        const urlHashed = createHash("sha256").update(url).digest("hex").slice(0, 16);
        const filePath = `${basePath}/cache/urls/${urlHashed}/${urlHashed}.json`;
        let exists = true;
        try {
            await access(filePath, constants.F_OK);
        } catch {
            exists = false;
        }

        if (exists) {
            const json = JSON.parse(await fs.readFile(`${basePath}/cache/urls/${urlHashed}/${urlHashed}.json`, "utf-8"));

            const files = await fs.readdir(`${basePath}/cache/urls/${urlHashed}`);
            const image = files.find(file =>
                path.parse(file).name === "image"
            );
            const favicon = files.find(file =>
                path.parse(file).name === "favicon"
            );


            const imageBuffer = image ? await fs.readFile(`${basePath}/cache/urls/${urlHashed}/${image}`) : new ArrayBuffer(0)
            const faviconBuffer = favicon ? await fs.readFile(`${basePath}/cache/urls/${urlHashed}/${favicon}`) : new ArrayBuffer(0)

            return { title: json.title, description: json.description, image: imageBuffer, favicon: faviconBuffer };
        }


        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; URLPreviewBot/1.0)"
            }
        });

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const html = await res.text();
        const $ = cheerio.load(html);

        let title = $("meta[property='og:title']").attr("content")
            || $("meta[name='twitter:title']").attr("content")
            || $("title").text()
            || "placeholder";

        let description = $("meta[property='og:description']").attr("content")
            || $("meta[name='twitter:description']").attr("content")
            || $("meta[name='description']").attr("content")
            || "placeholder";

        let image = $("meta[property='og:image']").attr("content")
            || $("meta[name='twitter:image']").attr("content")
            || $("link[rel='image_src']").attr("href")
            || $("img").first().attr("src")
            || "placeholder.png";

        let favicon = $("link[rel='icon']").attr("href")
            || $("link[rel='shortcut icon']").attr("href")
            || $("link[rel='apple-touch-icon']").attr("href")
            || "placeholder.png";

        // Normalize relative URLs
        const baseUrl = new URL(url);

        if (image && !image.startsWith("http")) {
            image = new URL(image, baseUrl).toString();
        }
        if (favicon && !favicon.startsWith("http")) {
            favicon = new URL(favicon, baseUrl).toString();
        }

        if (cache) {
            const urlHash = createHash("sha256").update(url).digest("hex").slice(0, 16);
            const imagePath = await downloadCacheImage(image, image, urlHash, "image")
            const faviconPath = await downloadCacheImage(favicon, favicon, urlHash, "favicon")
            const json = JSON.stringify({
                title: title,
                description: description
            }, null, 2);
            console.log(json)
            await fs.writeFile(`${basePath}/cache/urls/${urlHash}/${urlHash}.json`, json, "utf-8");

            const imageBuffer = imagePath != null ? await fs.readFile(imagePath) : new ArrayBuffer(10)
            const faviconBuffer = faviconPath != null ? await fs.readFile(faviconPath) : new ArrayBuffer(10)
            return { title, description, image: imageBuffer, favicon: faviconBuffer };
        }



        //TODO: change to return the buffer data for image not urls
        return { title, description, image: new ArrayBuffer(10), favicon: new ArrayBuffer(10) };
    } catch (err) {
        return {
            title: "placeholder",
            description: "placeholder",
            image: new ArrayBuffer(10),
            favicon: new ArrayBuffer(10),
        };
    }
});


ipcMain.handle("backUpSave", async () => {
    const nodes = await readJSON(nodesPath);
    const edges = await readJSON(edgesPath);

    backup("nodes", JSON.stringify(nodes))
    backup("edges", JSON.stringify(edges))
});


const backup = async (type: "nodes" | "edges", data: any) => {
    const datetime = new Date().toISOString().replace(/[:.]/g, "-");
    console.log(datetime)
    const folderPath = `GraphNote/${type}Backup`;
    const filePath = `${folderPath}/${type}_${datetime}.json`;
    console.log(filePath)

    const fullFile = path.join(baseDir, filePath);
    if (!fullFile.startsWith(baseDir)) {
        throw new Error("Invalid path");
    }

    const dir = path.dirname(fullFile);
    await mkdir(dir, { recursive: true });

    await fs.writeFile(fullFile, data);
    return {
        success: true,
        path: fullFile
    };
}




ipcMain.handle("downloadImgUrl", async (_event, imgUrl: string) => {
    console.log(imgUrl)
    const res = await fetch(imgUrl);
    console.log(res)
    // maybe using wget is the best method

    return {
        success: true,
        path: imgUrl
    };
});





const downloadCacheImage = async (image: string, url: string, urlName: string, type: "image" | "favicon"): Promise<string | null> => {
    try {
        const res = await fetch(image);
        if (!res.ok || !res.body) {
            throw new Error(`Failed to download: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        let ext = getExtensionFromContentType(contentType);
        // 2. Fallback to URL extension if needed
        if (ext === ".jpg") {
            const urlExt = getExtensionFromUrl(url);
            if (urlExt) ext = urlExt;
        }
        await createDir(`cache/urls/${urlName}`)
        const buffer = Buffer.from(await res.arrayBuffer());
        await fs.writeFile(`${basePath}/cache/urls/${urlName}/${type}${ext}`, buffer);
        return `${basePath}/cache/urls/${urlName}/${type}${ext}`
    } catch (e) {
        console.log("failed to cache the image", e)
        return null
    }
    return null
}



function getYouTubeVideoId(url) {
    try {
        const u = new URL(url);

        // youtu.be/<id>
        if (u.hostname.includes("youtu.be")) {
            return u.pathname.slice(1);
        }

        // youtube.com/watch?v=<id>
        if (u.searchParams.has("v")) {
            return u.searchParams.get("v");
        }

        // youtube.com/embed/<id> or /shorts/<id>
        const parts = u.pathname.split("/");
        const index = parts.findIndex(p => ["embed", "shorts"].includes(p));

        if (index !== -1 && parts[index + 1]) {
            return parts[index + 1];
        }

        return null;
    } catch {
        return null;
    }
}



export function registerApi(mainWindow: BrowserWindow) {
    ipcMain.handle("cacheYoutubeVid", async (event, url: string) => {
        console.log("download started")
        createDir("cache/youtube")
        const vidId = getYouTubeVideoId(url)
        if (!vidId) {
            return {
                success: false,
                message: "failed to get id from youtube url",
            }
        }

        //TODO: check the file doesnt exist first
        const files = readdirSync(`${basePath}/cache/youtube/`)
        if (files
            .find(file => file.startsWith(vidId))
            ? path.join(`${basePath}/cache/youtube/`, files.find(file => file.startsWith(vidId))!)
            : null) {
            console.log("file is already downloaded")
            return {
                success: true,
                message: "file is already downloaded"
            }
        }

        const subprocess = youtubedl.exec(url, {
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,

            addHeader: [
                'referer:youtube.com',
                'user-agent:googlebot'
            ],

            output: `${basePath}/cache/youtube/${vidId}_%(title)s.%(ext)s`,
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
}