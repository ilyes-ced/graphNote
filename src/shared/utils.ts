import { setStore, store } from "@/components/store";
import { saveEdgesJSON, saveNodesJSON } from "./save";
import { payload } from "@/types";
import saveFile from "@/shared/saveFile";
import { Event } from "@tauri-apps/api/event";

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

const fileCategories = {
  image: ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "tiff", "ico"],
  video: ["mp4", "mkv", "mov", "avi", "webm", "flv"],
  music: ["mp3", "wav", "ogg", "flac", "m4a"],
  office: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "pdf"],
  code: [
    "js",
    "ts",
    "py",
    "rs",
    "java",
    "c",
    "cpp",
    "cs",
    "html",
    "css",
    "js",
    "ts",
    "jsx",
    "tsx",
    "json",
    "xml",
    "yaml",
    "yml",
    "sh",
    "php",
    "go",
    "rb",
    "swift",
    "kt",
    "dart",
  ],
  text: ["txt", "md", "log"],
};

const recieveDragNDropFile = (event: Event<payload>) => {
  console.log("event :", event);

  const payload = event.payload;

  console.log("file path:", payload.paths);
  console.log("file pos:", payload.position);

  if (!payload.paths || payload.paths.length === 0) return;

  payload.paths.forEach(async (filePath) => {
    if ((await saveFile(filePath)) === true) {
      // add file to nodes store
      console.log("+===============================");
      console.log(filePath.split(".").splice(-1)[0].toLowerCase());

      const fileExt = filePath.split(".").splice(-1)[0].toLowerCase();

      let fileType = "unknown";
      for (const [category, extensions] of Object.entries(fileCategories)) {
        if (extensions.includes(fileExt)) {
          fileType = category;
          break;
        }
      }
      console.log("file type:", fileType);

      switch (fileType) {
        //todo: add the item to the nodes store depending on the fileType
        case "image":
          break;
        case "video":
          break;
        case "music":
          break;
        case "office":
          break;
        case "code":
          break;
        case "text":
          break;

        //todo: when the file is unhancled it should be deleted
        default:
          console.warn(`file type ${fileExt} is unknown and cannot be handled`);
          break;
      }
    } else {
      console.error("failed to save file");
      //send error message notification
    }
  });
};

export { addSelected, debounce, saveChanges, recieveDragNDropFile };
