import { writeUnique } from "../utils/fs";
import { getExtensionFromContentType } from "../utils/mime";
import { Paths } from "../config/paths";
import path from "path";
import * as cheerio from "cheerio"


function resolveImageUrl(input: string): string {
    const trimmed = input.trim()
    if (/^https?:\/\//i.test(trimmed)) return trimmed

    if (trimmed.startsWith("<")) {
        const $ = cheerio.load(trimmed)

        const candidate =
            $("img").first().attr("src") ||
            $("meta[property='og:image'], meta[name='twitter:image']").first().attr("content") ||
            $("meta[src]").first().attr("src") ||
            $("meta[content]").first().attr("content") ||
            $("link[rel='image_src']").first().attr("href")

        if (candidate) {
            if (candidate.startsWith("//")) return `https:${candidate}`
            if (/^https?:\/\//i.test(candidate)) return candidate
        }
    }

    throw new Error(`Unexpected url type: ${input}`)
}

async function downloadImage(input: string) {
    const res = await fetch(resolveImageUrl(input), { signal: AbortSignal.timeout(15_000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const ext = getExtensionFromContentType(res.headers.get("content-type")) ?? ".jpg"
    const name = await writeUnique(Paths.images, `download_image${ext}`, Buffer.from(await res.arrayBuffer()))
    return path.join("images", name)
}

export { resolveImageUrl, downloadImage }