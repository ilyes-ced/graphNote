import fs, { mkdir } from "fs/promises"
import path from "path"
import { ensureDir } from "./fs"
import { baseDir } from "../config/paths"

function getExtensionFromUrl(url: string): string | null {
    const pathname = new URL(url).pathname
    const ext = path.extname(pathname)
    return ext || null
}

function getNextName(fileName: string, counter: number) {
    const ext = path.extname(fileName)
    const name = path.basename(fileName, ext)
    return `${name}_${counter}${ext}`
}

async function readJSON(filePath: string) {
    try {
        await ensureDir()

        try {
            const text = await fs.readFile(filePath, "utf-8")
            return JSON.parse(text)
        } catch {
            await fs.writeFile(filePath, JSON.stringify({}, null, 2))
            return {}
        }
    } catch (err) {
        console.error("Failed to read:", filePath, err)
        return {}
    }
}

async function writeJSON(filePath: string, data: any) {
    try {
        await ensureDir()
        await fs.writeFile(filePath, JSON.stringify(data, null, 2))
        return true
    } catch (err) {
        console.error("Failed to write:", filePath, err)
        return false
    }
}

async function backup(type: "nodes" | "edges", data: any) {
    const datetime = new Date().toISOString().replace(/[:.]/g, "-")
    console.log(datetime)
    const folderPath = `GraphNote/${type}Backup`
    const filePath = `${folderPath}/${type}_${datetime}.json`
    console.log(filePath)

    const fullFile = path.join(baseDir, filePath)
    if (!fullFile.startsWith(baseDir)) {
        throw new Error("Invalid path")
    }

    const dir = path.dirname(fullFile)
    await mkdir(dir, { recursive: true })

    await fs.writeFile(fullFile, data)
    return {
        success: true,
        path: fullFile
    }
}

export { getExtensionFromUrl, getNextName, readJSON, writeJSON, backup }