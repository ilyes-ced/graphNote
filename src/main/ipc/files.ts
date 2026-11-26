import { dialog, ipcMain, shell } from "electron";
import { Paths, baseDir, basePath } from "../config/paths";
import { copyUnique, getFolderSize, safeJoin, writeUnique } from "../utils/fs";
import path from "path";
import fs from "fs/promises"
import { existsSync, mkdirSync } from "fs"
import { getNextName, readJSON } from "../utils/nodes";


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
        const fileName = await copyUnique(src, Paths.images)

        return {
            success: true,
            path: path.join("images", fileName)
        }
    })

    ipcMain.handle("readImage", async (_event, filePath: string) => {
        const data = await fs.readFile(path.join(basePath, filePath))
        return data
    })

    ipcMain.handle("selectFile", async () => {
        const result = await dialog.showOpenDialog({
            properties: ["openFile"],
            filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp"] }]
        })

        if (result.canceled) return null

        const sourcePath = result.filePaths[0]
        const ext = path.extname(sourcePath)
        const name = path.basename(sourcePath, ext)

        const destDir = path.join(basePath, "image")

        if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true })
        }

        let counter = 0
        let finalName = ""
        let finalPath = ""

        while (true) {
            finalName = counter === 0 ? `${name}${ext}` : `${name}_${counter}${ext}`

            finalPath = path.join(destDir, finalName)

            try {
                await fs.access(finalPath)
                counter++
            } catch {
                break
            }
        }

        await fs.copyFile(sourcePath, finalPath)

        return path.join("image", finalName)
    })


    ipcMain.handle("getSizes", async (_) => {
        const totalSize = await getFolderSize(basePath)
        const imageSize = await getFolderSize(path.join(basePath, "image"))
        const youtubeCacheSize = await getFolderSize(path.join(basePath, "cache", "youtube"))
        const urlMetadataSize = await getFolderSize(path.join(basePath, "cache", "urls"))

        return {
            totalSize,
            imageSize,
            youtubeCacheSize,
            urlMetadataSize
        }
    })




    ipcMain.handle("downloadImgUrl", async (_event, imgUrl: string) => {
        console.log(imgUrl)
        const res = await fetch(imgUrl)
        console.log(res)
        // maybe using wget is the best method

        return {
            success: true,
            path: imgUrl
        }
    })





    ipcMain.handle("getAvailableFilePath", async (_, { path: inputPath }) => {
        const folderPath = "GraphNote"

        let counter = 0
        let finalPath = ""

        while (true) {
            const originalFile = path.basename(inputPath)

            const fileName = counter === 0 ? originalFile : getNextName(originalFile, counter)

            const fullPath = path.join(baseDir, folderPath, fileName)

            try {
                await fs.access(fullPath)
            } catch {
                finalPath = path.join(folderPath, fileName)
                break
            }

            counter++
        }

        return {
            success: true,
            path: finalPath
        }
    })




    ipcMain.handle("openFileDefault", async (event, filePath: string) => {
        console.log(path.join(basePath, filePath))
        const error = await shell.openPath(path.join(basePath, filePath))
        if (error) throw new Error(error)
    })



    ipcMain.handle("deleteUnusedFiles", async (event) => {
        // search the nodes.json file for all used files
        // then list all files and delete all that is not included in that list
        // nodes with files: Url, Tierlist, Board, Document, Image

        const json = await readJSON(Paths.nodes)
        const nodes = Object.values(json).flat()

        let used_files = []

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
