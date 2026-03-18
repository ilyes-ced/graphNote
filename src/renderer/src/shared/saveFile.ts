
// function getNextName(name: string, counter: number) {
//   const nameParts = name.split(".");
//   const ext = nameParts.length > 1 ? "." + nameParts.pop() : "";
//   const baseName = nameParts.join(".");

//   let newName = name;

//   newName = `${baseName}${counter}${ext}`;

//   return newName;
// }

// const checkFile = async (filePath: string): Promise<string> => {
//   try {
//     const data = await window.api.getAvailableFilePath({ path: filePath });
//     return data.path;
//   } catch (err) {
//     console.error("Error getting available file path:", err);
//     throw err;
//   }
// };

//* true=succefully copied, string=error message
export default async (
  fileData: {
    name: string,
    data: Uint8Array
  }
): Promise<{ res: boolean; text: string }> => {
  try {
    const result = await window.api.writeNodeFile({ name: fileData.name, data: fileData.data });
    return result;
  } catch (error) {
    console.error("Error saving the node file:", error);
    return { res: false, text: String(error) };
  }
};