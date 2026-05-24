import { createStore } from "solid-js/store";
import { NodeUnion, Edge } from "../types";
import { createEffect, onMount } from "solid-js";


interface Command {
  undo(): void
  redo(): void
}

export const defaultViewportZoom = 1



onMount(async () => {
  try {
    const data = await window.api.getSettings();
    setStore("userConfig", data ?? {});
    setStore("userConfig", data)
  } catch (err) {
    console.error("Failed to get edges:", err);
  }
  createEffect(async () => {
    console.log(store.userConfig.pdfReaderType, store.userConfig.youtubeVidCache, store.userConfig.cacheUrlData, store.userConfig.pdfScale, store.userConfig.gridStyle, store.userConfig.showMiniMap, store.userConfig.homeBoardStyle, store.userConfig.homeBoardStyle.bgImagePath, store.userConfig.homeBoardStyle.bgColor, store.userConfig.homeBoardStyle.gridColor,)
    await window.api.saveSettings(JSON.parse(JSON.stringify(store.userConfig)));
  })
})


interface UserConfig {
  pdfReaderType: "side" | "modal" | "external",
  youtubeVidCache: boolean, //? if set to true, youtube videos will be downloaded
  cacheUrlData: boolean,
  pdfScale: number, //? for pdf reader clarity, 1 is blurry 1.5 is decent any more takes very long to laod
  gridStyle: "dots" | "grid",
  showMiniMap: boolean,
  homeBoardStyle: {
    bgImagePath?: string,
    bgColor?: string
    gridColor?: string
  }
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

  //TODO: later read these from config file, and save changes 
  //TODO: create effect: when this part changes save changes to settings.json
  userConfig: {
    pdfReaderType: "modal",
    youtubeVidCache: true,
    cacheUrlData: true,
    pdfScale: 1.5,
    gridStyle: "grid",
    showMiniMap: false,
    homeBoardStyle: {
      bgImagePath: "",
      bgColor: "",
      gridColor: ""
    }
  },
});

export { store, setStore };
