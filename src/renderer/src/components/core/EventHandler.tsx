import { onMount, onCleanup, Show, createSignal } from "solid-js";
import { setStore, store } from "../../shared/store";
import { NodeType, NodeUnion } from "../../types";
import { getBoardBgColor, getBoardGridColor, recieveDragNDropFile } from "../../shared/utils";


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
  const IMA_URL_REGEX =
    /(https?:\/\/[^\s"'<>]+?\.(?:png|jpg|jpeg|gif|webp|svg|bmp|avif|tiff))(?:\?[^\s"'<>]*)?/i;

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

  // https image URLs
  const imgUrlMatch = text.match(IMA_URL_REGEX);
  console.log("https url", imgUrlMatch);
  if (imgUrlMatch) {
    return { type: "url", value: imgUrlMatch[1] };
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
  getActiveBoardId,
  incrementSelectedNodesPositions,
  newImageNode,
  removeNodeById,
  updateBoardStyles,
} from "../../shared/update";
import { redo, undo } from "../../shared/actions";
import { IconCaretRightFilled, IconGrid4x4, IconGridDots, IconUpload } from "@tabler/icons-solidjs";
import iro from "@jaames/iro";

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
  // todo: fix for electron
  //listen("tauri://drag-enter", (event) => {});
  //listen("tauri://drag-leave", (event) => {});




  onMount(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // You can add logic here like:
      if (e.ctrlKey) {
        switch (e.key) {
          case "c": // copy
            if (!isTextLikeElementFocused()) {
              if (store.selectedNodes.size > 0) {
                console.info("copying nodes here");
                var copiedNodes: NodesCopyPaste = {
                  //? this special string is to to make sure we are pasting our nodes, itrs like a secret key very unlikly for the user to use
                  id: "special_graphNote_JSON_format_058192",
                  nodes: [],
                };
                store.selectedNodes.forEach((selectedNode) => {
                  let node = findNodeById(selectedNode);
                  if (node) {
                    copiedNodes.nodes.push(node);
                  }
                });
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
                      const res = await window.api.writeFile({ name: Image.split("/").pop() ?? "image.png", data: new TextEncoder().encode(imgRef.value), type: "image" })
                      if (res.path) {
                        //TODO: fix x,y to be as the mouse
                        newImageNode(res.path, 0, 0);
                      } else {
                        console.error("failed to save file:", res.path);
                      }
                    } else if (imgRef.type === "url") {
                      //TODO: download image to our save folder and create the image node
                      //await downloadImage(imgRef.value);
                      const res = await window.api.downloadImgUrl(imgRef.value)
                      console.log(res)
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
                      const res = await window.api.writeFile({ name: imgNameGen(type), data: uint8Array, type: "image" })
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
          case "a": // saelect all
            setStore("selectedNodes", new Set(store.nodes[getActiveBoardId()].map(node => node.id)))
            break;

          default:
            break;
        }
      } else {
        switch (e.key) {
          case "Escape":
            //? deselect nodes
            setStore("selectedNodes", new Set());
            //? close modals
            setStore("pdfFile", null);
            setStore("settingsModal", false);
            break;
          case "Delete":
            store.selectedNodes.forEach((selectedNode) => {
              removeNodeById(selectedNode);
            });
            setStore("selectedNodes", new Set())
            break;

          // move selected nodes
          case "ArrowUp":
            incrementSelectedNodesPositions(0, e.shiftKey ? -50 : -10);
            break;
          case "ArrowDown":
            incrementSelectedNodesPositions(0, e.shiftKey ? 50 : 10);
            break;
          case "ArrowLeft":
            incrementSelectedNodesPositions(e.shiftKey ? -50 : -10, 0);
            break;
          case "ArrowRight":
            incrementSelectedNodesPositions(e.shiftKey ? 50 : 10, 0);
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






    // @ts-ignore
    colorPickerBg = new iro.ColorPicker(pickerBgRef, {
      color: store.userConfig.homeBoardStyle.bgColor ?? "#ff5593",
      layout: [
        {
          component: iro.ui.Box,
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'hue',
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'alpha'
          }
        },
      ]
    });
    // @ts-ignore
    colorPickerGrid = new iro.ColorPicker(pickerGridRef, {
      color: store.userConfig.homeBoardStyle.gridColor ?? "#ff5593",
      layout: [
        {
          component: iro.ui.Box,
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'hue',
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'alpha'
          }
        },
      ]
    });

    colorPickerBg.on('color:change', function (color: any) {
      if (getActiveBoardId() == "home") {
        setStore("userConfig", "homeBoardStyle", "bgImagePath", "")
        setStore("userConfig", "homeBoardStyle", "bgColor", color.rgbaString)
      } else {
        updateBoardStyles(findNodeById(getActiveBoardId())?.id, "", "image")
        updateBoardStyles(findNodeById(getActiveBoardId())?.id, color.rgbaString, "bg")
      }
    });
    colorPickerGrid.on('color:change', function (color: any) {
      if (getActiveBoardId() == "home") {
        setStore("userConfig", "homeBoardStyle", "gridColor", color.rgbaString)
      } else {
        updateBoardStyles(findNodeById(getActiveBoardId())?.id, color.rgbaString, "grid")
      }
    });
  });


  const pickFile = async () => {
    const path = await window.api.selectFile();



    if (getActiveBoardId() == "home") {
      setStore("userConfig", "homeBoardStyle", "bgImagePath", path)
    } else {
      updateBoardStyles(findNodeById(getActiveBoardId())?.id, path, "image")
    }

    console.log(path);
    console.log(path);
    console.log(path);
    console.log(path);
    console.log(path);
    console.log(path);
  };


  let x: number = 0
  let y: number = 0
  const [bgPicker, setBgPicker] = createSignal(false);
  const [gridPicker, setGridPicker] = createSignal(false);
  const [modalPos, setModalPos] = createSignal({ x: 0, y: 0 });
  let pickerBgRef!: HTMLDivElement
  let pickerGridRef!: HTMLDivElement
  let colorPickerBg: any
  let colorPickerGrid: any


  return (
    <div
      id="eventhandler"
      onContextMenu={(e) => {
        e.preventDefault(); // prevent browser context menu
        console.log("this is opening the context menu");
        console.log(e.target);
        x = e.clientX
        y = e.clientY
        console.log(x, y)
        if (store.contextMenuModal) {
          setStore("selectedNodes", new Set())
        }
        setStore("contextMenuModal", !store.contextMenuModal)
      }}
    >


      <div
        class="z-10000 absolute top-0 left-0 size-full" onClick={() => { console.log("*888888888888"); setBgPicker(false) }}
        style={{
          opacity: bgPicker() ? "1" : "0",
          "pointer-events": bgPicker() ? "auto" : "none",
        }}
      >
        <div onClick={(e) => e.stopPropagation()} class="bg-background absolute size-fit border-2 border-primary animate-[modalIn_0.25s_ease]"
          style={{
            top: `${modalPos().y}px`,
            left: `${modalPos().x}px`
          }}
        >
          <div class="p-2" ref={pickerBgRef}>
          </div>
        </div>
      </div>

      <div
        class="z-10000 absolute top-0 left-0 size-full" onClick={() => setGridPicker(false)}
        style={{
          opacity: gridPicker() ? "1" : "0",
          "pointer-events": gridPicker() ? "auto" : "none",
        }}
      >
        <div onClick={(e) => e.stopPropagation()} class="bg-background absolute size-fit border-2 border-primary animate-[modalIn_0.25s_ease]"
          style={{
            top: `${modalPos().y}px`,
            left: `${modalPos().x}px`
          }}
        >
          <div class="p-2" ref={pickerGridRef}></div>
        </div>
      </div >



      <Show when={store.contextMenuModal}>
        <div
          id="contextMenu"
          class="absolute z-50 w-60 select-none"
          style={{
            top: `${(y ?? 0) - 50}px`,
            left: `${(x ?? 0) - 65}px`,
          }}
        >
          <div class="border border-border bg-card p-2 shadow-xl">

            {/* Normal item */}
            <button
              class="w-full px-3 py-2 text-left hover:bg-background transition-colors"
            >
              Test
            </button>

            {/* Divider */}
            <div class="border-b-2 border-border my-2" />

            {/* Submenu wrapper */}
            <div class="relative group">
              <button
                class="flex w-full items-center justify-between px-3 py-2 hover:bg-background transition-colors"
              >
                <span>Board styles</span>
                <IconCaretRightFilled class="text-sm opacity-70" />
              </button>

              {/* Submenu */}
              <div
                class="
            invisible absolute left-full top-0 ml-2
            w-100 border border-border bg-card p-2 shadow-xl
            opacity-0 transition-all duration-150
            group-hover:visible group-hover:opacity-100
          "
              >
                <button class="w-full px-3 py-2 text-left hover:bg-background flex items-stretch gap-3 cursor-pointer"
                  onclick={(e) => {
                    setStore("contextMenuModal", false)
                    console.log({ x, y })
                    console.log({ x, y })
                    setModalPos({ x, y })
                    setBgPicker(true)
                  }}
                >
                  <div
                    class="aspect-video w-10"
                    style={{ background: getBoardBgColor() }}
                  />

                  <div class="flex items-center">
                    Set Board Background Color
                  </div>
                </button>


                <button class="w-full px-3 py-2 text-left hover:bg-background flex items-stretch gap-3 cursor-pointer"
                  onclick={(e) => {
                    setStore("contextMenuModal", false)
                    setModalPos({ x: e.target.getBoundingClientRect().top, y: e.target.getBoundingClientRect().right })
                    setGridPicker(true)
                  }}
                >
                  <div
                    class="aspect-video w-10"
                    style={{ background: getBoardGridColor() }}
                  />

                  <div class="flex items-center">
                    Set Board Grid Color
                  </div>
                </button>


                <button class="w-full px-3 py-2 text-left hover:bg-background flex items-stretch gap-3 cursor-pointer"
                  onclick={() => {
                    setStore("contextMenuModal", false)
                    pickFile()
                  }}
                >
                  <div class="aspect-video w-10 flex justify-center">
                    <IconUpload />
                  </div>

                  <div class="flex items-center">
                    Set Board Background Image
                  </div>
                </button>

                <div class="border-b-2 border-border my-2"></div>

                <button class="w-full px-3 py-2 text-left hover:bg-background flex items-stretch gap-3 cursor-pointer"
                  style={{
                    background: store.userConfig.gridStyle == "grid" ? "var(--color-primary)" : ""
                  }}
                  onclick={() => {
                    setStore("userConfig", "gridStyle", "grid")
                  }}
                >
                  <div class="aspect-video w-10 flex justify-center">
                    <IconGrid4x4 />
                  </div>

                  <div class="flex items-center">
                    Set Board Grid to Grid
                  </div>
                </button>

                <button class="w-full px-3 py-2 text-left hover:bg-background flex items-stretch gap-3 cursor-pointer"
                  style={{
                    background: store.userConfig.gridStyle == "dots" ? "var(--color-primary)" : ""
                  }}
                  onclick={() => {
                    setStore("userConfig", "gridStyle", "dots")
                  }}
                >
                  <div class="aspect-video w-10 flex justify-center">
                    <IconGridDots />
                  </div>

                  <div class="flex items-center">
                    Set Board Grid to dots
                  </div>
                </button>
              </div>
            </div>
            {globalOptions()}
            {extraOptions()}
          </div>
        </div>
      </Show >
      {props.children}
    </div >
  );
};

const globalOptions = () => {
  return <div class="w-full">
    <div class="border-b-2 border-border my-2"></div>
    {Option("options for all noddes")}
    {Option("options for all noddes")}
    {Option("options for all noddes")}
  </div>
}


const extraOptions = () => {
  const selected = store.selectedNodes
  const selectedNodes = store.nodes[getActiveBoardId()].filter(user => selected.has(user.id));
  if (selectedNodes.length > 0) {
    if (selectedNodes.every((node) => node.type === selectedNodes[0].type)) {
      return <div>
        <div class="border-b-2 border-border my-2"></div>
        {Option(`options for ${selectedNodes[0].type} nodes`)}
      </div>

      //? this node type options
      console.log(selectedNodes[0])
      console.log(selectedNodes[0].type)
      switch (selectedNodes[0].type) {
        case "Note":
          break;
        case "Comment":
          break;
        case "Todo":
          break;
        case "Table":
          break;
        case "Url":
          break;
        case "Activity":
          break;
        case "Arrow":
          break;
        case "Board":
          break;
        case "Column":
          break;
        case "Color":
          break;
        case "Image":
          break;

        default:
          return <div>options for that type of node</div>
      }
    } else {
      //? all node types options
      return <div>
        <div class="border-b-2 border-border my-2"></div>
        {Option(`options for all noddes`)}
      </div>
    }
  }
}

const Option = (text: string) => {
  return (
    <button class="w-full px-3 py-2 text-left hover:bg-background flex items-stretch gap-3 cursor-pointer"
      onclick={() => { }}
    >
      <div class="flex items-center">
        {text}
      </div>
    </button>
  )
}
