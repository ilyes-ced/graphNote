import {
  BaseDirectory,
  copyFile,
  exists,
  readTextFile,
} from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";

//* true=succefully copied, string=error message
export default async (path: string): Promise<true | string> => {
  //? note sure about this one might cause errors outside of home directory
  //? might also cause problems in windows not sure tho
  //? copy the dragged file to our saves folder
  try {
    const fileName = path.split("/").splice(-1)[0];
    const folderPath = "GraphNote";
    const fullPath = await join(folderPath, fileName);

    console.info("file name: ", fileName);
    console.info("file fullPath: ", fullPath);
    console.info("file path: ", path);

    const fileExists = await exists(fullPath, {
      baseDir: BaseDirectory.Document,
    });

    if (!fileExists) {
      await copyFile(path, fullPath, {
        fromPathBaseDir: BaseDirectory.Document,
        toPathBaseDir: BaseDirectory.Document,
      });
      console.info("finished copying:", path, "to:", fileName);
    } else {
      console.error("file already exists did not create");
      return "file already exists did not create";
    }
    return true;
  } catch (error) {
    console.log("error copying the file: ", error);
    return error as string;
  }
};
