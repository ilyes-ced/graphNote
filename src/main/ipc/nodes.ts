import { ipcMain } from "electron";
import { backup, getNextName, readJSON, writeJSON } from "../utils/nodes";
import { Paths, basePath } from "../config/paths";
import { ensureDir } from "../utils/fs";
import path from "path";
import { mkdir } from "fs/promises";
import fs from "fs/promises";

export function registerNodesIpc() {
    ipcMain.handle("getNodes", async () => {
        return await readJSON(Paths.nodes)
    })

    ipcMain.handle("getEdges", async () => {
        return await readJSON(Paths.edges)
    })

    ipcMain.handle("getSettings", async () => {
        return await readJSON(Paths.settings)
    })

    ipcMain.handle("saveNodes", async (_, nodes) => {
        return { success: await writeJSON(Paths.nodes, nodes) }
    })

    ipcMain.handle("saveEdges", async (_, edges) => {
        return { success: await writeJSON(Paths.edges, edges) }
    })

    ipcMain.handle("saveSettings", async (_, settings) => {
        return { success: await writeJSON(Paths.settings, settings) }
    })

    ipcMain.handle("readGraph", async () => {
        const nodes = await readJSON(Paths.nodes)
        const edges = await readJSON(Paths.edges)
        return { nodes, edges }
    })

    ipcMain.handle("backUpSave", async () => {
        const nodes = await readJSON(Paths.nodes)
        const edges = await readJSON(Paths.edges)

        backup("nodes", JSON.stringify(nodes))
        backup("edges", JSON.stringify(edges))
    })

    ipcMain.handle("writeNodeFile", async (_, { name, data, type }) => {
        console.log(name, data, type)
        ensureDir()

        let counter = 0
        let finalName = ""
        let finalPath = ""

        // Determine unique file name
        while (true) {
            finalName = counter === 0 ? name : getNextName(name, counter)
            finalPath = path.join(basePath, type, finalName)
            await mkdir(path.dirname(finalPath), { recursive: true })

            try {
                await fs.access(finalPath)
                counter++
            } catch {
                break
            }
        }

        await fs.writeFile(finalPath, data)

        return {
            res: true,
            text: finalName,
            path: path.join(type, finalName)
        }
    })

}
