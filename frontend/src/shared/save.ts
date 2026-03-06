import { Edge, NodeUnion } from "../types";
import { store } from "./store";

//? saves the JSON object as file
// TODO: make debounce for disk write operation, to avoid writing too much to disk
async function saveNodesJSON() {
  let nodes = store.nodes;
  await fetch("http://localhost:3001/saveNodes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nodes),
  });
}
async function saveEdgesJSON() {
  let edges = store.edges;
  await fetch("http://localhost:3001/saveEdges", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(edges),
  });
}

//? read the saved JSON object as file
async function readJSON(): Promise<{
  nodes: Record<string, NodeUnion[]> | null;
  edges: Record<string, Edge[]> | null;
} | null> {
  // read nodes and edges
  const res = await fetch("http://localhost:3001/readGraph");
  const data = await res.json();

  let nodes = null;
  let edges = null;

  if (data.nodes) nodes = parseNodesData(JSON.stringify(data.nodes));
  if (data.edges) edges = parseEdgesData(JSON.stringify(data.edges));

  //? temporary: make backups of the nodes file each time the app is opened incase the json file gets borked
  const datetime = new Date().toISOString().replace(/[:.]/g, "-"); // safe for filesystems
  console.info("date time:", datetime);


  //TODO replace this tauri logic
  // const fileName = `GraphNote/nodesBackup/nodes_${datetime}.json`;
  // console.info("file name:", fileName);
  // await readOrCreateFiles(
  //   "GraphNote/nodesBackup",
  //   fileName
  // );
  // const nodesJson = JSON.stringify(nodes, null, 2);
  // await writeTextFile(fileName, nodesJson, {
  //   baseDir: BaseDirectory.Document,
  // });
  /////////////////////////////////////////////////////////////////////

  return { nodes, edges };
}

const parseNodesData = (text: string): Record<string, NodeUnion[]> => {
  //todo: the index resetting might be needed for each used workspace
  const parsed: Record<string, NodeUnion[]> = JSON.parse(text);
  const allNodes: NodeUnion[] = Object.values(parsed).flat();

  //! maybe do each workspace at a time
  allNodes.sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  for (let i = 0; i < allNodes.length; i++) {
    allNodes[i].zIndex = i;
  }

  //* might no longer be needed in the future
  allNodes.forEach((node) => {
    if (node.zIndex === undefined || node.zIndex === null) {
      node.zIndex = 0;
    }
  });

  const finalNodes: Record<string, NodeUnion[]> = {};
  for (const [parentId, nodes] of Object.entries(parsed)) {
    finalNodes[parentId] = nodes.map(
      (n) => allNodes.find((x) => x.id === n.id)!
    );
  }

  // //? reset the zIndex to the lowest possible
  // // i think it works as intended
  // const nodes: NodeUnion[] = JSON.parse(text).sort(
  //   (a: NodeUnion, b: NodeUnion) => (a.zIndex || 0) - (b.zIndex || 0)
  // );
  // for (let index = 0; index < nodes.length; index++) {
  //   nodes[index].zIndex = index;
  // }
  // //? give zIndex to nodes that dont have one
  // nodes.forEach((node) => {
  //   if (!node.zIndex) node.zIndex = 0;
  // });

  return finalNodes;
};

const parseEdgesData = (text: string): Record<string, Edge[]> => {
  const finalEdges: Record<string, Edge[]> = JSON.parse(text);
  return finalEdges;
};

const readOrCreateFiles = async (
  folderPath: string,
  filePath: string
): Promise<string | null> => {
  try {
    const res = await fetch("http://localhost:3001/readFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderPath, filePath }),
    });

    if (!res.ok) {
      throw new Error("Failed to read file");
    }

    const data = await res.json();

    return data.text ?? null;
  } catch (err) {
    console.error(`Failed to read or create ${filePath}:`, err);
    return null;
  }
};

export { saveNodesJSON, saveEdgesJSON, readJSON };
