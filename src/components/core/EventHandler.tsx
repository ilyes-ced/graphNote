import { onMount, onCleanup } from "solid-js";
import { listen } from "@tauri-apps/api/event";
import { setStore, store } from "../../shared/store";
import { NodeUnion, payload } from "@/types";
import { recieveDragNDropFile } from "@/shared/utils";
import {
  readImage,
  readText,
  writeText,
} from "@tauri-apps/plugin-clipboard-manager";

type NodesCopyPaste = {
  id: string;
  nodes: NodeUnion[];
};
function isTypeNodesCopyPaste(value: unknown): value is NodesCopyPaste {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).id === "string" &&
    Array.isArray((value as any).nodes)
  );
}

// const textIsSelected = (): boolean => {
//   const selection = window.getSelection();
//   const textIsSelected = selection !== null && selection.toString().length > 0;
//   console.info("text is selected:", textIsSelected);
//   return textIsSelected;
// };

function isTextLikeElementFocused(): boolean {
  let el = document.activeElement as Element | null;
  if (!el) return false;
  while (el) {
    if (el instanceof HTMLInputElement) return !el.readOnly && !el.disabled;
    if (el instanceof HTMLTextAreaElement) return !el.readOnly && !el.disabled;

    if (
      el instanceof HTMLElement &&
      (el.isContentEditable || el.getAttribute("contenteditable") === "true")
    ) {
      return true;
    }

    el = el.parentElement;
  }
  return false;
}

type ImageReference =
  | { type: "url"; value: string }
  | { type: "local"; value: string }
  | null;

function extractImageReference(text: string): ImageReference {
  //? might need more in the future not sure if there are more formats
  const IMG_TAG_REGEX = /<img\s+[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/i;
  const LOCAL_PATH_REGEX =
    /^(\/(?:[^\/]+\/)*[^\/]+\.(png|jpg|jpeg|gif|webp|bmp|svg))$/i;

  text = text.trim();
  console.log(text);

  // <img src="...">
  const imgMatch = text.match(IMG_TAG_REGEX);
  if (imgMatch) {
    return { type: "url", value: imgMatch[1] };
  }

  // Local file path
  const localMatch = text.match(LOCAL_PATH_REGEX);
  console.log(localMatch);

  if (localMatch) {
    return { type: "local", value: localMatch[1] };
  }

  return null;
}

import {
  addNode,
  findNodeById,
  generateNewId,
  incremenSelectedNodesPositions,
  newImageNode,
  removeNodeById,
} from "@/shared/update";
import saveFile from "@/shared/saveFile";

export default (props: any) => {
  listen<payload>("tauri://drag-drop", (event) => {
    // get mouse coords here
    console.log(event);
    recieveDragNDropFile(event);
  });

  // todo: use later to add some styles
  //listen("tauri://drag-enter", (event) => {});
  //listen("tauri://drag-leave", (event) => {});

  onMount(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // You can add logic here like:
      if (e.ctrlKey) {
        switch (e.key) {
          case "c": // copy
            // TODO: read the content of the clipboard

            if (!isTextLikeElementFocused()) {
              if (store.selectedNodes.size > 0) {
                console.info("copying nodes here");
                var copiedNodes: NodesCopyPaste = {
                  id: "special graphNote JSON format 058192",
                  nodes: [],
                };
                store.selectedNodes.forEach((selectedNode) => {
                  console.info(selectedNode);
                  console.info(findNodeById(selectedNode));
                  //TODO: dont save to copied nodes, save as json structure and on paste read the data if its json our format data we create those nodes, maybe add special key at the start to make sure not all json is transformed to nodes
                  let node = findNodeById(selectedNode);
                  if (node) {
                    copiedNodes.nodes.push(node);
                  }
                  // if (node)
                  //   setStore("copiedNodes", (nodes) => [...nodes, node]);
                });
                await writeText(JSON.stringify(copiedNodes));
              }
            }

            break;
          case "v": // paste
            try {
              const content = await readText();
              console.log(content);
              try {
                const parsedNodes: NodesCopyPaste = JSON.parse(content);
                //! maybe add this not sure?
                // if (parsedNodes === "our special test") {}
                //? creating the pasted nodes
                console.log(isTypeNodesCopyPaste(parsedNodes));
                parsedNodes.nodes.forEach((copiedNode) => {
                  addNode({
                    ...copiedNode,
                    id: generateNewId(),
                    x: copiedNode.x + 30,
                    y: copiedNode.y + 30,
                  });
                });
              } catch (e) {
                // nothing todo here (normal text was copied)
                // check if any text is selecte, if not check if its an image
                if (!isTextLikeElementFocused()) {
                  console.log(
                    "+=============================================== here we add the image"
                  );
                  const imgRef = extractImageReference(content);
                  console.log("imgRef");
                  console.log(imgRef);
                  if (!imgRef) return;
                  console.log("imgRef");

                  if (imgRef.type === "local") {
                    //copy using tauri copyfile
                    const result = await saveFile(imgRef.value);
                    if (result.res) {
                      //TODO: fix x,y to be as the mouse
                      newImageNode(result.text, 0, 0);
                    } else {
                      console.error("failed to save file:", result.text);
                    }
                  } else if (imgRef.type === "url") {
                    //TODO: download image to our save folder and create the image node
                    //await downloadImage(imgRef.value);
                  }
                }
              }
            } catch (e) {
              console.warn("the pasted was not a text", e);
            }

            try {
              const img = await readImage();
              console.log(img);

              //todo: create new image node on mouse cursor pos
              // make use of those in utils.ts
            } catch (e) {
              console.warn("the pasted was not an image", e);
            }

            break;
          case "z": // undo
            break;
          case "y": // redo
            break;
          case "f": // search
            break;

          default:
            break;
        }
      } else {
        switch (e.key) {
          case "Escape":
            setStore("selectedNodes", new Set());
            break;
          case "Delete":
            store.selectedNodes.forEach((selectedNode) => {
              removeNodeById(selectedNode);
            });
            break;

          // move selected nodes
          case "ArrowUp":
            incremenSelectedNodesPositions(0, -10);
            break;
          case "ArrowDown":
            incremenSelectedNodesPositions(0, 10);
            break;
          case "ArrowLeft":
            incremenSelectedNodesPositions(-10, 0);
            break;
          case "ArrowRight":
            incremenSelectedNodesPositions(10, 0);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <div
      id="eventhandler"
      onContextMenu={(e) => {
        // e.preventDefault(); // prevent browser context menu
        // console.log("this is opening the context menu");
      }}
    >
      {props.children}
    </div>
  );
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
