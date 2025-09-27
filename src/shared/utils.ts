import { setStore, store } from "@/components/store";
import { saveEdgesJSON, saveNodesJSON } from "./save";

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

const saveChanges = () => {
  setTimeout(() => {
    saveNodesJSON();
    saveEdgesJSON();
  }, 0);
};

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export { addSelected, debounce, saveChanges };
