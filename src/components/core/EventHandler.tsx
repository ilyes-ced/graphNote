import { onMount, onCleanup } from "solid-js";
import { listen } from "@tauri-apps/api/event";
import { setStore, store } from "../../shared/store";
import { payload } from "@/types";
import { recieveDragNDropFile } from "@/shared/utils";
import { readImage, readText } from "@tauri-apps/plugin-clipboard-manager";

import {
  addNode,
  findNodeById,
  generateNewId,
  incremenSelectedNodesPositions,
  removeNodeById,
} from "@/shared/update";

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
            store.selectedNodes.forEach((selectedNode) => {
              let node = findNodeById(selectedNode);
              if (node) setStore("copiedNodes", (nodes) => [...nodes, node]);
            });

            break;
          case "v": // paste
            // paste the selected nodes as is but change Ids
            // also increment x and y by a little in case of paste in the same position
            console.log("||||||||||||||||||||||||||||||||");
            const content = await readText();
            console.log(content);
            console.log("||||||||||||||||||||||||||||||||");
            const img = await readImage();
            console.log(img);
            console.log("||||||||||||||||||||||||||||||||");
            // TODO: read the content of the clipboard
            //store.copiedNodes.forEach((copiedNode) => {
            //  addNode({
            //    ...copiedNode,
            //    id: generateNewId(),
            //    x: copiedNode.x + 30,
            //    y: copiedNode.y + 30,
            //  });
            //});
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
