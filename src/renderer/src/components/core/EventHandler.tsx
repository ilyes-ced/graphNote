import { onMount, onCleanup } from "solid-js";
import { setStore, store } from "../../shared/store";
import { NodeUnion } from "../../types";
import { recieveDragNDropFile } from "../../shared/utils";

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

function imgNameGen(type: string): string {
  const extension = type.split("/")[1]; // png, jpeg, etc
  const filename = `pasted-image-${Date.now()}.${extension}`;
  return filename
}

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
  console.log("url", imgMatch);

  if (imgMatch) {
    return { type: "url", value: imgMatch[1] };
  }

  // Local file path
  const localMatch = text.match(LOCAL_PATH_REGEX);
  console.log("localMatch", localMatch);

  if (localMatch) {
    return { type: "local", value: localMatch[1] };
  }

  return null;
}

import {
  addNode,
  findNodeById,
  generateNewId,
  incrementSelectedNodesPositions,
  newImageNode,
  removeNodeById,
} from "../../shared/update";
import saveFile from "../../shared/saveFile";
import { redo, undo } from "../../shared/actions";

export default (props: any) => {
  //TODO replace this tauri logic with normal web stuff
  // listen<payload>("tauri://drag-drop", (event) => {
  //   // get mouse coords here
  //   console.log(event);
  //   recieveDragNDropFile(event);
  // });


  document.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  document.addEventListener("drop", async (event: DragEvent) => {
    event.preventDefault();
    if (!event.dataTransfer) return;

    const files = Array.from(event.dataTransfer.files);

    let filesData: {
      name: string,
      data: Uint8Array
    }[] = [];
    for (const file of files) {
      const buffer = await file.arrayBuffer();

      console.log("name:", file.name);
      console.log("size:", file.size);
      console.log("bytes:", buffer.byteLength);

      filesData.push({
        name: file.name,
        // not sure if Uint8Array or Buffer is best for performance
        data: new Uint8Array(buffer)
      })
    }
    // send the data to the backend to save it
    recieveDragNDropFile({
      files: filesData,
      position: { x: event.x, y: event.y },
    });
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
            //? make sure no text input is selected before copying nodes data
            if (!isTextLikeElementFocused()) {
              if (store.selectedNodes.size > 0) {
                console.info("copying nodes here");
                var copiedNodes: NodesCopyPaste = {
                  //? this special string is to to make sure we are pasting our nodes, itrs like a secret key very unlikly for the user to use
                  id: "special_graphNote_JSON_format_058192",
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
                //? write the data to clipboard
                navigator.clipboard.writeText(JSON.stringify(copiedNodes));
              }
            }

            break;
          case "v": // paste
            //? read from clipboard
            // const content = await readText();
            const content = await navigator.clipboard.readText();
            console.log("copied content");
            console.log(content);
            try {
              try {
                const parsedNodes: NodesCopyPaste = JSON.parse(content);
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
                  //? here is for those when you copy an image a link is copied instead of the actual binary data
                  //? here means the pasted was not nodes, and scince we know its pasted into text inputs because of !isTextLikeElementFocused(), its either an iamge or nothing we should care about
                  console.log(
                    "+=============================================== here means the pasted was not nodes"
                  );
                  console.log(content)
                  console.log()
                  content.split("\n").forEach(async Image => {
                    console.log(Image)
                    const imgRef = extractImageReference(Image);
                    console.log("imgRef");
                    console.log(imgRef);
                    if (!imgRef) throw new Error("not a valid img url");
                    console.log("imgRef");


                    if (imgRef.type === "local") {
                      // image file path name not binary data
                      console.log(imgRef.value)
                      console.log(new TextEncoder().encode(imgRef.value))
                      console.log(new TextEncoder().encode(imgRef.value).length)
                      //copy using tauri copyfile
                      console.log(Image.split("/").pop() ?? "image.png")
                      const res = await window.api.writeFile({ text: Image.split("/").pop() ?? "image.png", data: new TextEncoder().encode(imgRef.value) })
                      if (res.path) {
                        //TODO: fix x,y to be as the mouse
                        newImageNode(res.path, 0, 0);
                      } else {
                        console.error("failed to save file:", res.path);
                      }
                    } else if (imgRef.type === "url") {
                      //TODO: download image to our save folder and create the image node
                      //await downloadImage(imgRef.value);
                    }
                  });
                }
              }
            } catch (e) {
              console.warn("the pasted was not a text", e);
            }

            try {
              console.log("fwoiejfpowiejf")
              const possibleBinImgsData = await navigator.clipboard.read();
              for (const item of possibleBinImgsData) {
                for (const type of item.types) {
                  if (type.startsWith("image/")) {
                    const blob = await item.getType(type);

                    const arrayBuffer = await blob.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);

                    console.log("Image binary size:", uint8Array.length);
                    // give name to image
                    // here send request to save image
                    try {
                      const res = await window.api.writeFile({ text: imgNameGen(type), data: uint8Array })
                      //TODO: fix x,y to be as the mouse
                      if (res.path) {
                        //TODO: fix x,y to be as the mouse
                        newImageNode(res.path, 0, 0);
                      } else {
                        console.error("failed to save file:", res.path);
                      }
                      // create the node here
                    } catch (error) {
                      console.warn("failed to save the binary copied image", error);
                    }
                  }
                }
              }
              console.log(possibleBinImgsData);
              console.log(possibleBinImgsData.length);
              //todo: create new image node on mouse cursor pos
              // make use of those in utils.ts
            } catch (e) {
              console.warn("the pasted was not an image", e);
            }


            break;
          case "z": // undo
            undo()
            break;
          case "y": // redo
            redo()
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
            incrementSelectedNodesPositions(0, -10);
            break;
          case "ArrowDown":
            incrementSelectedNodesPositions(0, 10);
            break;
          case "ArrowLeft":
            incrementSelectedNodesPositions(-10, 0);
            break;
          case "ArrowRight":
            incrementSelectedNodesPositions(10, 0);
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
