import { basePath } from "../config/paths"
import { createDir } from "./fs"
import { getExtensionFromContentType } from "./mime"
import { getExtensionFromUrl } from "./nodes"
import fs from "fs/promises"

function extractYouTubeDescription(html: string): string | null {
    // Grab the JSON assigned to ytInitialPlayerResponse
    const marker = "ytInitialPlayerResponse = "
    const start = html.indexOf(marker)
    if (start === -1) return null

    const jsonStart = start + marker.length
    // Walk braces to find the end of the JSON object (regex is unreliable here)
    let depth = 0
    let inString = false
    let escaped = false
    for (let i = jsonStart; i < html.length; i++) {
        const c = html[i]
        if (inString) {
            if (escaped) escaped = false
            else if (c === "\\") escaped = true
            else if (c === '"') inString = false
            continue
        }
        if (c === '"') inString = true
        else if (c === "{") depth++
        else if (c === "}") {
            depth--
            if (depth === 0) {
                try {
                    const data = JSON.parse(html.slice(jsonStart, i + 1))
                    return data?.videoDetails?.shortDescription ?? null
                } catch {
                    return null
                }
            }
        }
    }
    return null
}

//TODO fix this
async function downloadCacheImage(image: string, url: string, urlName: string, type: "image" | "favicon"): Promise<string | null> {
    try {
        const res = await fetch(image)
        if (!res.ok || !res.body) {
            throw new Error(`Failed to download: ${res.status}`)
        }
        const contentType = res.headers.get("content-type")
        let ext = getExtensionFromContentType(contentType)
        // 2. Fallback to URL extension if needed
        if (ext === ".jpg") {
            const urlExt = getExtensionFromUrl(url)
            if (urlExt) ext = urlExt
        }
        await createDir(`cache/urls/${urlName}`)
        const buffer = Buffer.from(await res.arrayBuffer())
        await fs.writeFile(`${basePath}/cache/urls/${urlName}/${type}${ext}`, buffer)
        return `${basePath}/cache/urls/${urlName}/${type}${ext}`
    } catch (e) {
        console.log("failed to cache the image", e)
        return null
    }
    return null
}


function getYouTubeVideoId(url) {
    try {
        const u = new URL(url)

        // youtu.be/<id>
        if (u.hostname.includes("youtu.be")) {
            return u.pathname.slice(1)
        }

        // youtube.com/watch?v=<id>
        if (u.searchParams.has("v")) {
            return u.searchParams.get("v")
        }

        // youtube.com/embed/<id> or /shorts/<id>
        const parts = u.pathname.split("/")
        const index = parts.findIndex((p) => ["embed", "shorts"].includes(p))

        if (index !== -1 && parts[index + 1]) {
            return parts[index + 1]
        }

        return null
    } catch {
        return null
    }
}

function cleanYoutubeUrl(url: string): string | null {
    try {
        const parsed = new URL(url)
        const v = parsed.searchParams.get("v")
        if (!v) return null
        return `https://www.youtube.com/watch?v=${v}`
    } catch {
        return null // invalid URL
    }
}

export { extractYouTubeDescription, downloadCacheImage, getYouTubeVideoId, cleanYoutubeUrl }