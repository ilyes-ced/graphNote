import { createStore } from "solid-js/store";
import { NodeUnion, Edge } from "../types";
import { Editor } from "@tiptap/core";
import { Action } from "@/actionTypes";

interface GlobalStore {
  //? no board id is "home"
  //? < board nodeID, nodes>
  nodes: Record<string, NodeUnion[]>;
  edges: Record<string, Edge[]>;

  actionHistory: Action[];

  panZoom: number | null;
  snapGrid: [number, number] | null;

  activeBoards: { name: string; id: string }[];
  activeSidebar: "nodes" | "noteStyles" | "nodeStyles";
  showColorMenu: boolean;

  noteEditor: Editor | null;
  activeTags: string[]; // has all active nodes like strong, p, h1 .....

  dragThreshold: number;
  dragging: NodeUnion["id"] | null;
  // todo: reset when changing workspace
  selectedNodes: Set<string>; // node id

  copiedNodes: NodeUnion[];

  viewport: {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
  };
}

const [store, setStore] = createStore<GlobalStore>({
  nodes: {},
  edges: {},

  actionHistory: [],

  panZoom: null,
  snapGrid: [10, 10],

  activeBoards: [{ name: "home", id: "home" }],
  activeSidebar: "nodes",
  showColorMenu: false,
  noteEditor: null,
  activeTags: [],

  dragThreshold: 5,
  dragging: null,
  selectedNodes: new Set([]),

  copiedNodes: [],

  viewport: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    scale: 1,
  },
});

export { store, setStore };
