import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
    getNodes: () => ipcRenderer.invoke("getNodes"),

    saveNodes: (nodes: any) =>
        ipcRenderer.invoke("saveNodes", nodes),

    saveEdges: (edges: any) =>
        ipcRenderer.invoke("saveEdges", edges),

    readGraph: () =>
        ipcRenderer.invoke("readGraph"),

    readFile: (data: any) =>
        ipcRenderer.invoke("readFile", data),

    writeFile: (data: any) =>
        ipcRenderer.invoke("writeFile", data),

    getAvailableFilePath: (data: any) =>
        ipcRenderer.invoke("getAvailableFilePath", data),

    copyFileUnique: (data: any) =>
        ipcRenderer.invoke("copyFileUnique", data),

    readImage: (filePath: string) =>
        ipcRenderer.invoke("readImage", filePath),

    writeNodeFile: (data: any) =>
        ipcRenderer.invoke("writeNodeFile", data),


}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}


