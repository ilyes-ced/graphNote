import { createStore } from "solid-js/store";
import { NodeUnion } from "../types";

interface GlobalStore {
  nodes: NodeUnion[];
  width: number;
  height: number;
  panZoom: number | null;
  snapGrid: [number, number] | null;

  activeBoards: { name: string; id: string }[];

  dragThreshold: number;
  dragging: NodeUnion["id"] | null;
  selectedNodes: Set<string>; // node id

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
  snapGrid: [10, 10],

  activeBoards: [{ name: "Home", id: "0" }],

  dragThreshold: 5,
  dragging: null,
  selectedNodes: new Set([]),

  viewport: {
    x: 0,
    y: 0,
    scale: 1,
  },
});

export { store, setStore };
