import { BaseDirectory, copyFile, exists } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";

function getNextName(name: string, counter: number) {
  const nameParts = name.split(".");
  const ext = nameParts.length > 1 ? "." + nameParts.pop() : "";
  const baseName = nameParts.join(".");

  let newName = name;

  newName = `${baseName}${counter}${ext}`;

  return newName;
}

const checkFile = async (path: string): Promise<string> => {
  let finalPath: string;
  let counter = 0;

  while (true) {
    const filePath = path.split("/").splice(-1)[0];
    const fileName = counter === 0 ? filePath : getNextName(filePath, counter);
    const folderPath = "GraphNote";
    const fullPath = await join(folderPath, fileName);
    const fileExists = await exists(fullPath, {
      baseDir: BaseDirectory.Document,
    });
    if (!fileExists) {
      finalPath = fullPath;
      break;
    }
    counter++;
  }

  return finalPath;
};

//* true=succefully copied, string=error message
export default async (
  path: string
): Promise<{ res: boolean; text: string }> => {
  //? note sure about this one might cause errors outside of home directory
  //? might also cause problems in windows not sure tho
  //? copy the dragged file to our saves folder
  try {
    const fullPath = await checkFile(path);
    console.log("creating file:", fullPath);

    await copyFile(path, fullPath, {
      fromPathBaseDir: BaseDirectory.Document,
      toPathBaseDir: BaseDirectory.Document,
    });
    console.info("finished copying:", path, "to:", fullPath);

    return { res: true, text: fullPath };
  } catch (error) {
    console.log("error copying the file: ", error);
    return { res: false, text: error as string };
  }
};
