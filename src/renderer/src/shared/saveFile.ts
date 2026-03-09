
function getNextName(name: string, counter: number) {
  const nameParts = name.split(".");
  const ext = nameParts.length > 1 ? "." + nameParts.pop() : "";
  const baseName = nameParts.join(".");

  let newName = name;

  newName = `${baseName}${counter}${ext}`;

  return newName;
}

const checkFile = async (filePath: string): Promise<string> => {
    try {
    const data = await window.api.getAvailableFilePath({ path: filePath });
    return data.path;
  } catch (err) {
    console.error("Error getting available file path:", err);
    throw err;
  }
};

//* true=succefully copied, string=error message
export default async (
  path: string
): Promise<{ res: boolean; text: string }> => {
    try {
    const result = await window.api.copyFileUnique({ path: filePath });
    return result;
  } catch (error) {
    console.error("Error copying the file:", error);
    return { res: false, text: String(error) };
  }
};