import os from "node:os"
import path from "node:path"

export const baseDir = path.join(os.homedir(), "Documents")
export const basePath = path.join(baseDir, "GraphNote")

export const Paths = {
    nodes: path.join(basePath, "nodes.json"),
    edges: path.join(basePath, "edges.json"),
    settings: path.join(basePath, "settings.json"),
    images: path.join(basePath, "image"),
    urlCache: path.join(basePath, "cache", "urls"),
    youtubeCache: path.join(basePath, "cache", "youtube"),
    backups: (type: "nodes" | "edges") => path.join(basePath, `${type}Backup`),
}