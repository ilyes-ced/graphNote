import { ipcMain } from "electron";
import { mkdir } from "fs/promises";
import path from "path";
import fs from "fs/promises";
import * as cheerio from "cheerio";

const basePath = "/home/clippy/Documents/GraphNote";
const baseDir = "/home/clippy/Documents";
const nodesPath = `${basePath}/nodes.json`;
const edgesPath = `${basePath}/edges.json`;




// duplicated in Url.tsx in the frontend
type MetaData = {
    title: string;
    description: string;
    image: string;
    favicon: string;
};



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

ipcMain.handle("getEdges", async () => {
    return await readJSON(edgesPath);
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


ipcMain.handle(
    "writeNodeFile",
    async (_event, { name: inputName, data }: { name: string; data: Uint8Array }) => {
        ensureDir()

        let counter = 0;
        let finalName = "";
        let finalPath = "";

        // Determine unique file name
        while (true) {
            finalName =
                counter === 0 ? inputName : getNextName(inputName, counter);
            finalPath = path.join(basePath, finalName);

            try {
                await fs.access(finalPath);
                counter++;
            } catch {
                break;
            }
        }

        await fs.writeFile(finalPath, data);

        return {
            res: true,
            text: finalName,
            path: finalPath
        };
    }
);

ipcMain.handle('readImage', async (_event, filePath: string) => {
    const data = await fs.readFile(path.join(basePath, filePath));
    return data;
});




ipcMain.handle("scrapeUrl", async (_event, url: string): Promise<MetaData> => {
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; URLPreviewBot/1.0)"
            }
        });

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const html = await res.text();
        const $ = cheerio.load(html);

        let title = $("meta[property='og:title']").attr("content")
            || $("meta[name='twitter:title']").attr("content")
            || $("title").text()
            || "placeholder";

        let description = $("meta[property='og:description']").attr("content")
            || $("meta[name='twitter:description']").attr("content")
            || $("meta[name='description']").attr("content")
            || "placeholder";

        let image = $("meta[property='og:image']").attr("content")
            || $("meta[name='twitter:image']").attr("content")
            || $("link[rel='image_src']").attr("href")
            || $("img").first().attr("src")
            || "placeholder.png";

        let favicon = $("link[rel='icon']").attr("href")
            || $("link[rel='shortcut icon']").attr("href")
            || $("link[rel='apple-touch-icon']").attr("href")
            || "placeholder.png";

        // Normalize relative URLs
        const baseUrl = new URL(url);

        if (image && !image.startsWith("http")) {
            image = new URL(image, baseUrl).toString();
        }
        if (favicon && !favicon.startsWith("http")) {
            favicon = new URL(favicon, baseUrl).toString();
        }
        return { title, description, image, favicon };
    } catch (err) {
        return {
            title: "placeholder",
            description: "placeholder",
            image: "placeholder.png",
            favicon: "placeholder.png",
        };
    }
});


ipcMain.handle("backUpSave", async () => {
    const nodes = await readJSON(nodesPath);
    const edges = await readJSON(nodesPath);

    backup("nodes", JSON.stringify(nodes))
    backup("edges", JSON.stringify(edges))
});
const backup = async (type: "nodes" | "edges", data: any) => {
    const datetime = new Date().toISOString().replace(/[:.]/g, "-");
    console.log(datetime)
    const folderPath = `GraphNote/${type}Backup`;
    const filePath = `${folderPath}/${type}_${datetime}.json`;
    console.log(filePath)

    const fullFile = path.join(baseDir, filePath);
    if (!fullFile.startsWith(baseDir)) {
        throw new Error("Invalid path");
    }

    const dir = path.dirname(fullFile);
    await mkdir(dir, { recursive: true });

    await fs.writeFile(fullFile, data);
    return {
        success: true,
        path: fullFile
    };
}