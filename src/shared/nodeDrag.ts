import { onCleanup } from "solid-js";
import { store, setStore } from "../components/store";
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

export function useDraggable(node: NodeUnion, is_child: boolean = false) {
  let startX = 0;
  let startY = 0;
  let initialMouseX = 0;
  let initialMouseY = 0;
  let targets = document.querySelectorAll(".column, .board");
  const threshold = 1;

  const startDrag = (e: PointerEvent) => {
    //? at leastit helps with removing the ghost when dragging an image
    //? other thatn that im not sure
    e.preventDefault();

    // dont accept middle mouse click
    console.log("dragging", node.id, is_child);
    if (e.button !== 0) return;
    // if it is not a child ignore elemnts with these classNames
    if (!is_child)
      if ((e.target as HTMLElement).closest(".child_node, .resize_handle"))
        return;

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
    //* introducting debound can reduce the number of calls and improve performance
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
      if ((e.target as HTMLElement).closest(".taskitem")) return;
      addSelected(e, node.id);
      return;
    }

    //? for transfering children to other nodes
    /////////////////////////////////////////////////////////
    console.log("dropping a node", node.id, is_child);

    const targets = document.querySelectorAll(
      `.column:not(#${node.id}), .board` // exclud the dragged column from the search for overlapp (when dragging a column it leads to running the overlap logic on its self)
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
          moveNode(node.id, target.id, true);
          // return;
        }
      } else {
        if (isInside) {
          moveNode(node.id, target.id);
          movedToOtherNode = true;
          // return;
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
            // setStore(
            //   "nodes",
            //   (n) => n.id === node.id,
            //   (node) => ({
            //     ...node,
            //     x: snappedX,
            //     y: snappedY,
            //   })
            // );
            updatePosition(node.id, snappedX, snappedY);
            saveChanges();
          });
        } else {
          //! untested
          requestAnimationFrame(() => {
            const nodeInStore = findNodeById(node.id);
            // setStore(
            //   "nodes",
            //   (n) => n.id === node.id,
            //   (node) => ({
            //     ...node,
            //     x: nodeInStore?.x ?? 0,
            //     y: nodeInStore?.y ?? 0,
            //   })
            // );
            //todo: fix later
            updatePosition(node.id, nodeInStore?.x ?? 0, nodeInStore?.y ?? 0);
            saveChanges();
          });
        }
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

/**
 *
 * addSelected(e, node.id);
 *
 */
