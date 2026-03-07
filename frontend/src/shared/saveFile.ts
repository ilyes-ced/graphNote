
function getNextName(name: string, counter: number) {
  const nameParts = name.split(".");
  const ext = nameParts.length > 1 ? "." + nameParts.pop() : "";
  const baseName = nameParts.join(".");

  let newName = name;

  newName = `${baseName}${counter}${ext}`;

  return newName;
}

const checkFile = async (filePath: string): Promise<string> => {
  const res = await fetch("http://localhost:3001/getAvailableFilePath", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path: filePath }),
  });

  const data = await res.json();

  return data.path;
};

//* true=succefully copied, string=error message
export default async (
  path: string
): Promise<{ res: boolean; text: string }> => {
  try {
    const res = await fetch("http://localhost:3001/copyFileUnique", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
    });

    return await res.json();
  } catch (error) {
    console.log("error copying the file:", error);
    return { res: false, text: String(error) };
  }
};