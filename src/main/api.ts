import { ipcMain } from "electron";
import { mkdir, copyFile as fsCopyFile } from "fs/promises";
import path from "path";
import fs from "fs/promises";

const basePath = "/home/clippy/Documents/GraphNote";
const baseDir = "/home/clippy/Documents";

const nodesPath = `${basePath}/nodes.json`;
const edgesPath = `${basePath}/edges.json`;

function getNextName(fileName: string, counter: number) {
    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);
    return `${name}_${counter}${ext}`;
}

async function ensureDir() {
    await mkdir(basePath, { recursive: true });
}

async function readJSON(filePath: string) {
    try {
        await ensureDir();

        try {
            const text = await fs.readFile(filePath, "utf-8");
            return JSON.parse(text);
        } catch {
            await fs.writeFile(filePath, JSON.stringify({}, null, 2));
            return {};
        }

    } catch (err) {
        console.error("Failed to read:", filePath, err);
        return {};
    }
}

async function writeJSON(filePath: string, data: any) {
    try {
        await ensureDir();
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error("Failed to write:", filePath, err);
        return false;
    }
}

/* ------------------- GRAPH ------------------- */

ipcMain.handle("getNodes", async () => {
    return await readJSON(nodesPath);
});

ipcMain.handle("saveNodes", async (_, nodes) => {
    return { success: await writeJSON(nodesPath, nodes) };
});

ipcMain.handle("saveEdges", async (_, edges) => {
    return { success: await writeJSON(edgesPath, edges) };
});

ipcMain.handle("readGraph", async () => {
    const nodes = await readJSON(nodesPath);
    const edges = await readJSON(edgesPath);

    return { nodes, edges };
});

/* ------------------- FILE ------------------- */

ipcMain.handle("readFile", async (_, { folderPath, filePath }) => {

    const fullFolder = `${baseDir}/${folderPath}`;
    const fullFile = `${baseDir}/${filePath}`;

    await mkdir(fullFolder, { recursive: true });

    try {
        await fs.access(fullFile);
    } catch {
        await fs.writeFile(fullFile, JSON.stringify({}, null, 2));
    }

    const text = await fs.readFile(fullFile, "utf-8");

    return { text };
});


ipcMain.handle("writeFile", async (_, { filePath, text }) => {

    const fullFile = path.join(baseDir, filePath);

    if (!fullFile.startsWith(baseDir)) {
        throw new Error("Invalid path");
    }

    const dir = path.dirname(fullFile);

    await mkdir(dir, { recursive: true });

    await fs.writeFile(fullFile, text);

    return {
        success: true,
        path: fullFile
    };
});


ipcMain.handle("getAvailableFilePath", async (_, { path: inputPath }) => {

    const folderPath = "GraphNote";

    let counter = 0;
    let finalPath = "";

    while (true) {

        const originalFile = path.basename(inputPath);

        const fileName =
            counter === 0
                ? originalFile
                : getNextName(originalFile, counter);

        const fullPath = path.join(baseDir, folderPath, fileName);

        try {
            await fs.access(fullPath);
        } catch {
            finalPath = path.join(folderPath, fileName);
            break;
        }

        counter++;
    }

    return {
        success: true,
        path: finalPath
    };
});


ipcMain.handle("copyFileUnique", async (_, { path: inputPath }) => {

    const folder = "GraphNote";
    const fileName = path.basename(inputPath);

    let counter = 0;
    let finalPath = "";

    await mkdir(path.join(baseDir, folder), { recursive: true });

    while (true) {

        const name =
            counter === 0
                ? fileName
                : getNextName(fileName, counter);

        const fullPath = path.join(baseDir, folder, name);

        try {
            await fs.access(fullPath);
        } catch {
            finalPath = fullPath;
            break;
        }

        counter++;
    }

    const source = path.join(baseDir, inputPath);

    await fsCopyFile(source, finalPath);

    return {
        res: true,
        text: path.basename(finalPath)
    };
});