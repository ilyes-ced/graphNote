import { ipcMain } from "electron";
import { backup, readJSON, writeJSON } from "../utils/nodes";
import { Paths } from "../config/paths";

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
}
