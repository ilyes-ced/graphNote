import { dialog, ipcMain, shell } from "electron";
import { Paths, basePath } from "../config/paths";
import { getFolderSize, importLocalImage, safeJoin, writeUnique } from "../utils/fs";
import path from "path";
import fs from "fs/promises"
import { readJSON } from "../utils/nodes";


export function registerFilesIpc() {
    ipcMain.handle("writeFile", async (_, { name, data, fileType }) => {
        let subDir = ""
        switch (fileType) {
            case "image":
                subDir = "images"
                break;
            default:
                break;
        }

        const dir = safeJoin(basePath, subDir)
        safeJoin(dir, name)

        const finalName = await writeUnique(dir, name, data)

        return {
            success: true,
            path: path.join(subDir, finalName)
        }
    })


    ipcMain.handle("copyFile", async (_, { src }) => {
        return {
            success: true,
            path: await importLocalImage(src)
        }
    })

    ipcMain.handle("readImage", async (_, filePath: string) => {
        console.log(filePath)
        console.log(safeJoin(basePath, filePath))
        const data = await fs.readFile(safeJoin(basePath, filePath))
        return data
    })

    ipcMain.handle("selectFile", async () => {
        const result = await dialog.showOpenDialog({
            properties: ["openFile"],
            filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "avif"] }]
        })
        return await importLocalImage(result.filePaths[0])
    })


    ipcMain.handle("getSizes", async (_) => {
        //TODO: error handling for each one individually
        const totalSize = await getFolderSize(basePath)
        const imageSize = await getFolderSize(path.join(basePath, "images"))
        const youtubeCacheSize = await getFolderSize(path.join(basePath, "cache", "youtube"))
        const urlMetadataSize = await getFolderSize(path.join(basePath, "cache", "urls"))

        return {
            totalSize,
            imageSize,
            youtubeCacheSize,
            urlMetadataSize
        }
    })

    ipcMain.handle("downloadImgUrl", async (_, imgUrl: string) => {
        console.log(imgUrl)
        const res = await fetch(imgUrl)
        console.log(res)
        // maybe using wget is the best method

        return {
            success: true,
            path: imgUrl
        }
    })


    ipcMain.handle("openFileDefault", async (_, filePath: string) => {
        const error = await shell.openPath(safeJoin(basePath, filePath))
        if (error) throw new Error(error)
    })


    //TODO
    ipcMain.handle("deleteUnusedFiles", async (_) => {
        // search the nodes.json file for all used files
        // then list all files and delete all that is not included in that list
        // nodes with files: Url, Tierlist, Board, Document, Image

        const json = await readJSON(Paths.nodes)
        const nodes = Object.values(json).flat()

        //let used_files = []

        nodes.forEach((n: any) => {
            switch (n.type) {
                case "Url":
                    // if website cache, if youtube in youtube folder
                    // cache/url/hash/* (keep the entire folder)
                    // cache/youtube/vidId.xxx
                    break;
                case "TierList":
                    // images in tiers
                    break;
                case "Board":
                    //bg and icon
                    break;
                case "Document":
                    // doc file
                    break;
                case "Image":
                    // img
                    break;
                default:
                    break;
            }
        })
    })




    ipcMain.handle("getLocalVideo", async (_, vidName: string) => {
        return `http://127.0.0.1:3232/videos/${encodeURIComponent(vidName)}`
    })

}
