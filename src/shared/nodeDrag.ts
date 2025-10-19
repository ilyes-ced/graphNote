import { onCleanup } from "solid-js";
import { store, setStore } from "./store";
import { NodeType, type NodeUnion } from "../types";
import { addSelected, saveChanges } from "./utils";
import moveNode from "./moveNode";
import {
  findNodeById,
  isColumn,
  updateChildPosition,
  updatePosition,
  updateZIndex,
} from "./update";

function isOverlapping(mouseX: number, mouseY: number, targetEl: Element) {
  const rect = targetEl.getBoundingClientRect();

  return (
    mouseX >= rect.left &&
    mouseX <= rect.right &&
    mouseY >= rect.top &&
    mouseY <= rect.bottom
  );
}

export function useDraggable(
  node: NodeUnion,
  is_child: boolean = false,
  ignoredElements?: { tags?: string[]; classes?: string[]; ids?: string[] }
) {
  let startX = 0;
  let startY = 0;
  let initialMouseX = 0;
  let initialMouseY = 0;
  let targets = document.querySelectorAll(".column, .board");
  const threshold = 1;
  const ignoredSelectors =
    (ignoredElements?.classes?.length || 0) > 0 ||
    (ignoredElements?.ids?.length || 0) > 0 ||
    (ignoredElements?.tags?.length || 0) > 0
      ? [
          ".child_node",
          ...(ignoredElements?.classes || []).map((cls) => `.${cls}`),
          ...(ignoredElements?.ids || []).map((id) => `#${id}`),
          ...(ignoredElements?.tags || []),
        ].join(", ")
      : ".child_node";

  const startDrag = (e: PointerEvent) => {
    if (store.showColorMenu) setStore("showColorMenu", false);
    //? at leastit helps with removing the ghost when dragging an image
    //? other thatn that im not sure
    if (node.type === NodeType.Image) e.preventDefault();

    // dont accept middle mouse click
    console.log("dragging", node.id, is_child);
    if (e.button !== 0) return;
    // if it is not a child ignore elemnts with these classNames

    //? maybe should handle it in its file
    //if ((e.target as HTMLElement).closest(".tasklist_handle")) {
    //  // todo: reorder task items
    //  return;
    //}

    if (!is_child)
      if ((e.target as HTMLElement).closest(ignoredSelectors)) return;

    //? update here because new colmns could appear later
    targets = document.querySelectorAll(".column, .board");

    console.info("started dragging:", node.id);
    //? increased the z-index, to +1 of the highest

    updateZIndex(node.id);
    setStore("dragging", node.id);

    const scale = store.viewport?.scale ?? 1;
    startX = (e.clientX - store.viewport.x) / scale - node.x;
    startY = (e.clientY - store.viewport.y) / scale - node.y;

    initialMouseX = e.clientX;
    initialMouseY = e.clientY;

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const onMove = (e: PointerEvent) => {
    console.info("moving:", node.id);
    const scale = store.viewport?.scale ?? 1;
    let x = (e.clientX - store.viewport.x) / scale - startX;
    let y = (e.clientY - store.viewport.y) / scale - startY;

    // if (!store.nodes.find((n) => n.id === node.id)) return;

    //TODO: updating store on every move might be bad for performance
    //TODO: make it change the translate values of the HTMLdiv and on drag end update the store positions
    if (!is_child) {
      updatePosition(node.id, x, y);
    } else {
      updateChildPosition(node.id, x, y);
    }

    const nodeIsColumn = isColumn(node.id);

    //! could cause some performance issues if there is alot of column nodes on the canvas
    //* introducting debounce can reduce the number of calls and improve performance
    targets.forEach((target) => {
      const isInside = isOverlapping(e.clientX, e.clientY, target);
      if (isInside && !nodeIsColumn) {
        target.classList.add("child_container_hover");
      } else {
        target.classList.remove("child_container_hover");
      }
    });
  };

  const onUp = (e: PointerEvent) => {
    setStore("dragging", null);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);

    //? check if node was not moved, if not select it
    const deltaX = Math.abs((e?.clientX ?? 0) - initialMouseX);
    const deltaY = Math.abs((e?.clientY ?? 0) - initialMouseY);
    const didMove = deltaX > threshold || deltaY > threshold;
    if (!didMove && e) {
      console.log("=================================================");
      console.log("did not move so single click");
      console.log("=================================================");
      if ((e.target as HTMLElement).closest(ignoredSelectors)) return;
      addSelected(e, node.id);
      return;
    }

    //? for transfering children to other nodes
    /////////////////////////////////////////////////////////
    console.log("dropping a node", node.id, is_child);

    const targets = document.querySelectorAll(
      `.column:not(#${node.id}), .board:not(#${node.id})` // exclud the dragged column from the search for overlapp (when dragging a column it leads to running the overlap logic on its self)
    );
    let movedToOtherNode = false;
    // todo: stop foreeach when finished
    targets.forEach((target) => {
      //! fix this e. error
      const isInside = isOverlapping(e.clientX, e.clientY, target);
      target.classList.remove("child_container_hover");

      if (is_child) {
        if (isInside) {
          movedToOtherNode = true;
          console.error("this is the end herer");
          moveNode(node.id, target.id, true);
        }
      } else {
        if (isInside) {
          moveNode(node.id, target.id);
          movedToOtherNode = true;
        }
      }
    });

    if (!movedToOtherNode) {
      if (is_child) {
        const targets = document.querySelectorAll(`#${node.id}`);
        console.info(targets[0].getBoundingClientRect());
        moveNode(node.id, "None", true, true, {
          x: Math.round(targets[0].getBoundingClientRect().x / 10) * 10,
          y: Math.round(targets[0].getBoundingClientRect().y / 10) * 10,
        });
        //TODO: snap to grid
      } else {
        //? snap to grid if it is defined
        if (store.snapGrid) {
          const [gx, gy] = store.snapGrid;
          const nodeInStore = findNodeById(node.id);
          // if (!nodeInStore) return;
          const snappedX = Math.round((nodeInStore?.x ?? 0) / gx) * gx;
          const snappedY = Math.round((nodeInStore?.y ?? 0) / gy) * gy;
          // Skip if already snapped
          // if (nodeInStore?.x === snappedX && nodeInStore.y === snappedY) return;
          // Defer snapping to next frame to allow transition animation
          console.info(snappedX, snappedY);
          requestAnimationFrame(() => {
            updatePosition(node.id, snappedX, snappedY);
            saveChanges();
          });
        } else {
          //! untested
          requestAnimationFrame(() => {
            const nodeInStore = findNodeById(node.id);
            //todo: fix later
            updatePosition(node.id, nodeInStore?.x ?? 0, nodeInStore?.y ?? 0);
            saveChanges();
          });
        }
      }
    }

    //? extending viewport when needed
    const movedNode = document.getElementById(node.id);
    const rect = movedNode?.getBoundingClientRect();
    const scale = store.viewport.scale || 1;
    if (rect) {
      const width = rect.width / scale;
      const height = rect.height / scale;

      const rightEdge = node.x + width;
      const bottomEdge = node.y + height;

      if (rightEdge > store.viewport.width) {
        const newWidth = Math.round((rightEdge + 50) / 10) * 10;
        setStore("viewport", {
          width: Math.max(newWidth, store.viewport.width),
        });
      }

      if (bottomEdge > store.viewport.height) {
        const newHeight = Math.round((bottomEdge + 50) / 10) * 10;
        setStore("viewport", {
          height: Math.max(newHeight, store.viewport.height),
        });
      }
    }

    saveChanges();
  };

  onCleanup(() => {
    console.warn("this is cleanup", node.id);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  });

  return {
    startDrag,
  };
}
