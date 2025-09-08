import {
  BaseDirectory,
  writeTextFile,
  readTextFile,
} from "@tauri-apps/plugin-fs";
import { NodeUnion } from "../types";

//? saves the JSON object as file
// TODO: make debounce for disk write operation, to avoid writing too much to disk
async function writeJSON(blocks: NodeUnion[]) {
  const json = JSON.stringify(blocks, null, 2);

  await writeTextFile("blocks.json", json, {
    baseDir: BaseDirectory.Home,
  });
}

//? read the saved JSON object as file
async function readJSON(): Promise<NodeUnion[] | null> {
  try {
    const text = await readTextFile("blocks.json", {
      baseDir: BaseDirectory.Home,
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
    console.error("Failed to read or parse blocks.json:", err);
    return null;
  }
}

export { writeJSON, readJSON };
