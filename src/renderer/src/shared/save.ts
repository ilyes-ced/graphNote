import { Edge, NodeUnion } from "../types";
import { store } from "./store";

//? saves the JSON object as file
// TODO: make debounce for disk write operation, to avoid writing too much to disk
async function saveNodesJSON() {
  let nodes = JSON.parse(JSON.stringify(store.nodes));
  await window.api.saveNodes(nodes);
}

async function saveEdgesJSON() {
  let edges = JSON.parse(JSON.stringify(store.edges));
  await window.api.saveEdges(edges);
}

//? read the saved JSON object as file
async function readJSON(): Promise<{
  nodes: Record<string, NodeUnion[]> | null;
  edges: Record<string, Edge[]> | null;
} | null> {
  // read nodes and edges
  const res = await window.api.readGraph();
  const data = await res.json();

  let nodes = null;
  let edges = null;

  if (data.nodes) nodes = parseNodesData(JSON.stringify(data.nodes));
  if (data.edges) edges = parseEdgesData(JSON.stringify(data.edges));

  //? temporary: make backups of the nodes file each time the app is opened incase the json file gets borked
  const datetime = new Date().toISOString().replace(/[:.]/g, "-");

  const folderPath = "GraphNote/nodesBackup";
  const filePath = `${folderPath}/nodes_${datetime}.json`;

  console.info("file name:", filePath);

  const nodesJson = JSON.stringify(nodes, null, 2);

  await window.api.writeFile({
    filePath,
    text: nodesJson,
  });
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



export { saveNodesJSON, saveEdgesJSON, readJSON };
