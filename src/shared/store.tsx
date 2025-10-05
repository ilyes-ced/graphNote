import { createStore } from "solid-js/store";
import { NodeUnion, Edge } from "../types";
import { Editor } from "@tiptap/core";

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
  activeSidebar: "nodes" | "noteStyles" | "nodeStyles";
  showColorMenu: boolean;

  noteEditor: Editor | null;

  dragThreshold: number;
  dragging: NodeUnion["id"] | null;
  // todo: reset when changing workspace
  selectedNodes: Set<string>; // node id

  copiedNodes: NodeUnion[];

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
  activeSidebar: "noteStyles",
  showColorMenu: true,

  noteEditor: null,

  dragThreshold: 5,
  dragging: null,
  selectedNodes: new Set([]),

  copiedNodes: [],

  viewport: {
    x: 0,
    y: 0,
    scale: 1,
  },
});

export { store, setStore };
