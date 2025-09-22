import { createStore } from "solid-js/store";
import { NodeUnion, Edge } from "../types";

interface GlobalStore {
  //? no board id is "home"
  //? < board nodeID, nodes>
  nodes: Record<string, NodeUnion[]>;
  edges: Record<string, Edge[]>;

  width: number;
  height: number;
  panZoom: number | null;
  snapGrid: [number, number] | null;

  activeBoards: { name: string; id: string }[];

  dragThreshold: number;
  dragging: NodeUnion["id"] | null;
  // todo: reset when changing workspace
  selectedNodes: Set<string>; // node id

  viewport: {
    x: number;
    y: number;
    scale: number;
  };
}

const [store, setStore] = createStore<GlobalStore>({
  nodes: {},
  edges: {},

  width: 1000,
  height: 1000,
  panZoom: null,
  snapGrid: [10, 10],

  activeBoards: [{ name: "home", id: "home" }],

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
