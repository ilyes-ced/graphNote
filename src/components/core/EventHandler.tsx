import saveFile from "@/shared/saveFile";
import { listen } from "@tauri-apps/api/event";
import { setStore } from "../store";

interface payload {
  paths: string[];
  position: { x: number; y: number };
  id: number;
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

export default (props: any) => {
  listen<payload>("tauri://drag-drop", (event) => {
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
            console.warn(
              `file type ${fileExt} is unknown and cannot be handled`
            );
            break;
        }
      } else {
        //send error message notification
      }
    });
  });

  listen("tauri://drag-enter", (event) => {});
  listen("tauri://drag-leave", (event) => {});

  return <div id="eventhandler">{props.children}</div>;
};

/*

events to handle
  Del: delete
  Ctrl copy
  Ctrl paste

  arrow keys to move selected nodes

  Ctrl z undo
  Ctrl y redo

  


*/
