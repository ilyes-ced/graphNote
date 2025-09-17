import { setStore, store } from "@/components/store";

const addSelected = (e: MouseEvent, nodeId: string) => {
  // if click is on child dont do it
  console.log("selecting:", nodeId);
  e.stopPropagation();
  if (store.selectedNodes.has(nodeId)) {
    const newSet = new Set(store.selectedNodes);
    newSet.delete(nodeId);
    setStore("selectedNodes", newSet);
  } else {
    setStore("selectedNodes", (prev) => new Set(prev).add(nodeId));
  }
  console.log("adding :", store.selectedNodes);
};

export { addSelected };
