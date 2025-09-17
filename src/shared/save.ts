import {
  BaseDirectory,
  writeTextFile,
  readTextFile,
  exists,
  mkdir,
} from "@tauri-apps/plugin-fs";
import { NodeUnion } from "../types";

//? saves the JSON object as file
// TODO: make debounce for disk write operation, to avoid writing too much to disk
async function writeJSON(nodes: NodeUnion[]) {
  const json = JSON.stringify(nodes, null, 2);
  await writeTextFile("GraphNote/save.json", json, {
    baseDir: BaseDirectory.Document,
  });
}

//? read the saved JSON object as file
async function readJSON(): Promise<NodeUnion[] | null> {
  try {
    // maybe make them user defined later
    const folderPath = "GraphNote";
    const filePath = "GraphNote/save.json";
    /////////////////////////////////////////////////////////
    // check folder exists of not create
    const folderExists = await exists(folderPath, {
      baseDir: BaseDirectory.Document,
    });
    if (!folderExists) {
      console.info("Creating directory:", folderPath);
      await mkdir("GraphNote", {
        baseDir: BaseDirectory.Document,
        recursive: true,
      });
      console.info("Created directory:", folderPath);
    }
    /////////////////////////////////////////////////////////
    // check save file exists of not create it with an empty array
    const fileExists = await exists(filePath, {
      baseDir: BaseDirectory.Document,
    });
    if (!fileExists) {
      console.info("Creating empty JSON file:", filePath);
      // empty json objects array // must be array
      await writeTextFile(filePath, JSON.stringify([], null, 2), {
        baseDir: BaseDirectory.Document,
      });
    }
    /////////////////////////////////////////////////////////

    const text = await readTextFile("GraphNote/save.json", {
      baseDir: BaseDirectory.Document,
    });

    //? reset the zIndex to the lowest possible
    // i think it works as intended
    const nodes: NodeUnion[] = JSON.parse(text).sort(
      (a: NodeUnion, b: NodeUnion) => (a.zIndex || 0) - (b.zIndex || 0)
    );
    for (let index = 0; index < nodes.length; index++) {
      nodes[index].zIndex = index;
    }

    //? give zIndex to nodes that dont have one
    nodes.forEach((node) => {
      if (!node.zIndex) node.zIndex = 0;
    });

    return nodes;
  } catch (err) {
    console.error("Failed to read or parse GraphNote/save.json:", err);
    return null;
  }
}

export { writeJSON, readJSON };
