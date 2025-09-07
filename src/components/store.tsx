import { createStore } from "solid-js/store";
import { BlockUnion } from "../types";

interface GlobalStore {
  nodes: BlockUnion[];
  width: number;
  height: number;
  panZoom: number | null;
  snapGrid: [number, number] | null;
}

const [blocks, setBlocks] = createStore<GlobalStore>({
  nodes: [],
  width: 1000,
  height: 1000,
  panZoom: null,
  snapGrid: null,
});

export { blocks, setBlocks };
