import { mkdir } from "fs/promises";

const basePath = "/home/clippy/Documents/GraphNote";

const nodesPath = `${basePath}/nodes.json`;
const edgesPath = `${basePath}/edges.json`;


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


        "/getNodes": async () => {
            const nodes = await readJSON(nodesPath);

            return Response.json(nodes, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            });
        },


        "/saveNodes": {
            async POST(req) {
                const nodes = await req.json();

                const ok = await writeJSON(nodesPath, nodes);

                return Response.json({ success: ok });
            },
        },


        "/saveEdges": {
            async POST(req) {
                const edges = await req.json();

                const ok = await writeJSON(edgesPath, edges);

                return Response.json({ success: ok });
            },
        },


        "/readGraph": async () => {
            const nodes = await readJSON(nodesPath);
            const edges = await readJSON(edgesPath);

            return Response.json({ nodes, edges });
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

                return Response.json({ text });
            },
        }
    },
});






console.log(`GraphNote API running at ${server.url}`);