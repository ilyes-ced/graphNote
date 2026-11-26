import { mkdir } from "node:fs/promises";
import { basePath } from "../config/paths"
import path from "node:path";
import fs from "node:fs/promises"

async function ensureDir() {
    mkdir(basePath, { recursive: true })
}

async function createDir(folderName: string) {
    mkdir(`${basePath}/${folderName}`, { recursive: true })
}

function safeJoin(root: string, ...parts: string[]) {
    const full = path.resolve(root, ...parts)
    const rel = path.relative(root, full)
    if (rel.startsWith("..") || path.isAbsolute(rel)) throw new Error("Invalid path")
    return full
}

async function writeUnique(dir: string, name: string, data: string | Uint8Array) {
    await fs.mkdir(dir, { recursive: true })
    const ext = path.extname(name)
    const base = path.basename(name, ext)
    for (let i = 0; ; i++) {
        const finalName = i === 0 ? name : `${base}_${i}${ext}`
        try {
            await fs.writeFile(path.join(dir, finalName), data, { flag: "wx" })
            return finalName
        } catch (e: any) {
            if (e.code !== "EEXIST") throw e
        }
    }
}

async function copyUnique(src: string, dir: string) {
    return writeUnique(dir, path.basename(src), await fs.readFile(src))
}

async function getFolderSize(folderPath) {
    let totalSize = 0

    async function walk(dir) {
        const files = await fs.readdir(dir)

        for (const file of files) {
            const fullPath = path.join(dir, file)
            const stats = await fs.stat(fullPath)

            if (stats.isDirectory()) {
                await walk(fullPath)
            } else {
                totalSize += stats.size
            }
        }
    }

    await walk(folderPath)

    return totalSize
}


export { ensureDir, createDir, safeJoin, writeUnique, copyUnique, getFolderSize }