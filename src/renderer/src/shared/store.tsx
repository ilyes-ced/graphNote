import { createStore } from "solid-js/store";
import { NodeUnion, Edge } from "../types";


interface Command {
  undo(): void
  redo(): void
}

export const defaultViewportZoom = 1



interface UserConfig {
  pdfReaderType: "side" | "modal" | "external",
  youtubeVidCache: boolean, //? if set to true, youtube videos will be downloaded
  cacheUrlData: boolean,
  pdfScale: number, //? for pdf reader clarity, 1 is blurry 1.5 is decent any more takes very long to laod
  gridStyle: "dots" | "grid",
  showMiniMap: boolean
}

interface GlobalStore {
  //? no board id is "home"
  //? < board nodeID, nodes>
  nodes: Record<string, NodeUnion[]>;
  edges: Record<string, Edge[]>;

  panZoom: number | null;
  snapGrid: [number, number] | null;

  activeBoards: { title: string; id: string }[];
  activeSidebar: "nodes" | "nodeStyles";
  showColorMenu: boolean;
  showStorageMenu: boolean;

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

  arrowLines: Map<String, any[]>,


  // each action is put here
  // actionsHistory: Actions[];
  // each undo action is put here for redo (ctrl+y) when new actions are added to actions ARRAY, undoneActions is emptied 
  // 
  // undoneActions: Actions[];
  actionsHistory: Command[],
  historyPointer: number;


  settingsModal: boolean;


  pdfFile: String | null;

  userConfig: UserConfig;


}

const [store, setStore] = createStore<GlobalStore>({
  nodes: {},
  edges: {},

  panZoom: null,
  snapGrid: [10, 10],

  activeBoards: [{ title: "home", id: "home" }],
  activeSidebar: "nodes",
  showColorMenu: false,
  showStorageMenu: false,
  activeTags: [],

  dragThreshold: 5,
  dragging: null,
  selectedNodes: new Set([]),

  copiedNodes: [],

  viewport: {
    x: 0,
    y: 0,
    width: 4000, // 4000 to make sure to target most resolutions like 4k 
    height: 4000,
    scale: defaultViewportZoom,
  },

  arrowLines: new Map<string, any[]>(),

  actionsHistory: [],
  historyPointer: -1,

  settingsModal: false,

  pdfFile: null,

  userConfig: {
    pdfReaderType: "modal",
    youtubeVidCache: true,
    cacheUrlData: true,
    pdfScale: 1.5,
    gridStyle: "grid",
    showMiniMap: false,

  },
});

export { store, setStore };
