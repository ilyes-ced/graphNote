import { createStore } from "solid-js/store";
import { BlockUnion } from "../types";

interface GlobalStore {
  nodes: BlockUnion[];
  width: number;
  height: number;
  panZoom: number | null;
  snapGrid: [number, number] | null;

  viewport: {
    x: number;
    y: number;
    scale: number;
  };
}

const [store, setStore] = createStore<GlobalStore>({
  nodes: [],
  width: 1000,
  height: 1000,
  panZoom: null,
  snapGrid: null,
  viewport: {
    x: 0,
    y: 0,
    scale: 1,
  },
});

export { store, setStore };
