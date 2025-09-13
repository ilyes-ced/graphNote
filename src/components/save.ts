import {
  BaseDirectory,
  writeTextFile,
  readTextFile,
  exists,
  create,
} from "@tauri-apps/plugin-fs";
import { NodeUnion } from "../types";

//? saves the JSON object as file
// TODO: make debounce for disk write operation, to avoid writing too much to disk
async function writeJSON(nodes: NodeUnion[]) {
  const json = JSON.stringify(nodes, null, 2);
  await writeTextFile("save.json", json, {
    baseDir: BaseDirectory.Document,
  });
}

//? read the saved JSON object as file
async function readJSON(): Promise<NodeUnion[] | null> {
  try {
    let fileExists = await exists("save.json", {
      baseDir: BaseDirectory.Document,
    });

    if (!fileExists) {
      await create("save.json", {
        baseDir: BaseDirectory.Document,
      });
    }

    const text = await readTextFile("save.json", {
      baseDir: BaseDirectory.Document,
    });
    //? reset the zIndex
    // i think it works as intended
    const nodes: NodeUnion[] = JSON.parse(text).sort(
      (a: NodeUnion, b: NodeUnion) => (a.zIndex || 0) - (b.zIndex || 0)
    );
    for (let index = 0; index < nodes.length; index++) {
      nodes[index].zIndex = index;
    }

    //? give nodes without zindex one
    nodes.forEach((node) => {
      if (!node.zIndex) node.zIndex = 0;
    });

    return nodes;
  } catch (err) {
    console.error("Failed to read or parse save.json:", err);
    return null;
  }
}

export { writeJSON, readJSON };
