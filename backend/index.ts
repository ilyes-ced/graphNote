import { mkdir } from "fs/promises";
import path from "path";

const basePath = "/home/clippy/Documents/GraphNote";
const baseDir = "/home/clippy/Documents";

const nodesPath = `${basePath}/nodes.json`;
const edgesPath = `${basePath}/edges.json`;

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
};


type CheckFileBody = {
    path: string;
};

function getNextName(fileName: string, counter: number) {
    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);
    return `${name}_${counter}${ext}`;
}
type CopyBody = {
    path: string;
};


async function ensureDir() {
    await mkdir(basePath, { recursive: true });
}

async function readJSON(path: string) {
    try {
        const file = Bun.file(path);

        if (!(await file.exists())) {
            await Bun.write(path, JSON.stringify({}, null, 2));
            return {};
        }

        return await file.json();
    } catch (err) {
        console.error("Failed to read:", path, err);
        return {};
    }
}

async function writeJSON(path: string, data: any) {
    try {
        await ensureDir();
        await Bun.write(path, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error("Failed to write:", path, err);
        return false;
    }
}


const server = Bun.serve({
    port: 3001,

    routes: {
        "/": () => new Response("GraphNote Bun API"),


        "/options": {
            async OPTIONS() {
                return new Response(null, { headers });
            }
        },
        "/:any*": {
            async OPTIONS() {
                return new Response(null, { headers });
            },
        },

        "/getNodes": async () => {
            const nodes = await readJSON(nodesPath);

            return Response.json(nodes, {
                headers,
            });
        },


        "/saveNodes": {
            async POST(req) {
                const nodes = await req.json();

                const ok = await writeJSON(nodesPath, nodes);

                return Response.json({ success: ok }, {
                    headers,
                });
            },
        },


        "/saveEdges": {
            async POST(req) {
                const edges = await req.json();

                const ok = await writeJSON(edgesPath, edges);

                return Response.json({ success: ok }, {
                    headers,
                });
            },
        },


        "/readGraph": async () => {
            const nodes = await readJSON(nodesPath);
            const edges = await readJSON(edgesPath);

            return Response.json({ nodes, edges }, {
                headers,
            });
        },


        "/readFile": {
            async POST(req) {
                const { folderPath, filePath } = await req.json();

                const baseDir = "/home/clippy/Documents";
                const fullFolder = `${baseDir}/${folderPath}`;
                const fullFile = `${baseDir}/${filePath}`;

                await mkdir(fullFolder, { recursive: true });

                const file = Bun.file(fullFile);

                if (!(await file.exists())) {
                    await Bun.write(fullFile, JSON.stringify({}, null, 2));
                }

                const text = await Bun.file(fullFile).text();

                return Response.json({ text }, {
                    headers,
                });
            },
        },


        "/writeFile": {
            async POST(req) {
                try {
                    const { filePath, text } = await req.json();


                    const fullFile = path.join(baseDir, filePath);

                    // Prevent path traversal
                    if (!fullFile.startsWith(baseDir)) {
                        return Response.json({ error: "Invalid path" }, { status: 400, headers });
                    }

                    const dir = path.dirname(fullFile);

                    await mkdir(dir, { recursive: true });

                    await Bun.write(fullFile, text);

                    return Response.json({
                        success: true,
                        path: fullFile,
                    }, {
                        headers,
                    });

                } catch (err) {
                    console.error("writeFile error:", err);

                    return Response.json(
                        { success: false },
                        { status: 500, headers }
                    );
                }
            },
        },
        "/getAvailableFilePath": {
            async POST(req) {
                try {
                    const { path: inputPath } = await req.json();

                    const folderPath = "GraphNote";

                    let counter = 0;
                    let finalPath = "";

                    while (true) {
                        const originalFile = path.basename(inputPath);
                        const fileName =
                            counter === 0 ? originalFile : getNextName(originalFile, counter);

                        const fullPath = path.join(baseDir, folderPath, fileName);

                        const file = Bun.file(fullPath);

                        if (!(await file.exists())) {
                            finalPath = path.join(folderPath, fileName);
                            break;
                        }

                        counter++;
                    }

                    return Response.json({
                        success: true,
                        path: finalPath,
                    }, {
                        headers,
                    });
                } catch (err) {
                    console.error("getAvailableFilePath error:", err);

                    return Response.json(
                        { success: false },
                        { status: 500 });
                }
            },
        },


        "/copyFileUnique": {
            async POST(req) {
                try {
                    const { path: inputPath } = (await req.json()) as CopyBody;

                    const folder = "GraphNote";
                    const fileName = path.basename(inputPath);

                    let counter = 0;
                    let finalPath = "";

                    await mkdir(path.join(baseDir, folder), { recursive: true });

                    while (true) {
                        const name =
                            counter === 0 ? fileName : getNextName(fileName, counter);

                        const fullPath = path.join(baseDir, folder, name);

                        const file = Bun.file(fullPath);

                        if (!(await file.exists())) {
                            finalPath = fullPath;
                            break;
                        }

                        counter++;
                    }

                    const source = path.join(baseDir, inputPath);

                    await copyFile(source, finalPath);

                    return Response.json({
                        res: true,
                        text: path.basename(finalPath),
                    }, {
                        headers,
                    });
                } catch (err) {
                    console.error("copyFileUnique error:", err);

                    return Response.json({
                        res: false,
                        text: String(err),
                    }, {
                        headers,
                    });
                }
            },
        }

    },
});






console.log(`GraphNote API running at ${server.url}`);

function copyFile(source: string, finalPath: string) {
    throw new Error("Function not implemented.");
}
