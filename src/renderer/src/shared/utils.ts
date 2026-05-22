import { setStore, store } from "./store";
import { saveEdgesJSON, saveNodesJSON } from "./save";
import { Payload } from "../types";
import saveFile from "./saveFile";
import { newDocumentNode, newImageNode } from "./update";

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
  document: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "pdf"],
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

const recieveDragNDropFile = (payload: Payload) => {
  console.log("payload :", payload);


  console.log("file path:", payload.files.length);
  console.log("file pos:", payload.position);

  if (!payload.files || payload.files.length === 0) return;

  payload.files.forEach(async (fileData, index) => {
    const result = await saveFile(fileData);
    if (result.res) {
      // add file to nodes store
      console.log("+===============================");
      console.log(fileData.name.split(".").splice(-1)[0].toLowerCase());

      const fileExt = fileData.name.split(".").splice(-1)[0].toLowerCase();

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
          const imgPos = payload.position;
          newImageNode(
            result.text,
            imgPos.x + index * 30,
            imgPos.y + index * 30
          );
          break;
        case "video":
          break;
        case "music":
          break;
        case "document":
          const docPos = payload.position;
          newDocumentNode(
            result.text,
            docPos.x + index * 30,
            docPos.y + index * 30,
            "widget"
          );
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
      console.error("failed to save file:", result.text);
      //send error message notification
    }
  });
};



const updateArrowsPositions = () => {



  //? to keep update thier positions during the animation
  //! probably bad for perforamce
  const interval = setInterval(() => {
    store.arrowLines.forEach((v, k) => {
      v.forEach(line => {
        line.position()
      });
    })
  }, 1);
  setTimeout(() => {
    clearInterval(interval);
  }, 250);

};


function oklchToRgb(oklchStr: string): string {
  const match = oklchStr.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/i);

  if (!match) throw new Error("Invalid OKLCH format");

  let l = parseFloat(match[1]);
  let c = parseFloat(match[2]);
  let h = parseFloat(match[3]);

  const hr = (h * Math.PI) / 180;

  // OKLCH → OKLab
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  // OKLab → LMS
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const lmsL = l_ * l_ * l_;
  const lmsM = m_ * m_ * m_;
  const lmsS = s_ * s_ * s_;

  // LMS → linear RGB
  let r = 4.0767416621 * lmsL - 3.3077115913 * lmsM + 0.2309699292 * lmsS;
  let g = -1.2684380046 * lmsL + 2.6097574011 * lmsM - 0.3413193965 * lmsS;
  let b2 = -0.0041960863 * lmsL - 0.7034186147 * lmsM + 1.7076147010 * lmsS;

  // linear → sRGB
  const toSRGB = (x) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;

  r = Math.round(Math.min(1, Math.max(0, toSRGB(r))) * 255);
  g = Math.round(Math.min(1, Math.max(0, toSRGB(g))) * 255);
  b2 = Math.round(Math.min(1, Math.max(0, toSRGB(b2))) * 255);

  return `rgb(${r},${g},${b2})`;
}

export { addSelected, debounce, saveChanges, recieveDragNDropFile, updateArrowsPositions, oklchToRgb };


