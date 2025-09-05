import {
  BaseDirectory,
  writeTextFile,
  readTextFile,
} from "@tauri-apps/plugin-fs";
import { BlockUnion } from "../types";

//? saves the JSON object as file
// TODO: make debounce for disk write operation
async function writeJSON(blocks: BlockUnion[]) {
  const json = JSON.stringify(blocks, null, 2);

  await writeTextFile("blocks.json", json, {
    baseDir: BaseDirectory.Home,
  });
}

//? read the saved JSON object as file
async function readJSON(): Promise<BlockUnion[] | null> {
  try {
    const text = await readTextFile("blocks.json", {
      baseDir: BaseDirectory.Home,
    });

    const data = JSON.parse(text);
    return data as BlockUnion[];
  } catch (err) {
    console.error("Failed to read or parse blocks.json:", err);
    return null;
  }
}
