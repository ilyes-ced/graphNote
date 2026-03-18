import { onCleanup } from "solid-js";
import { store, setStore } from "./store";
import { NodeType, type NodeUnion } from "../types";
import { addSelected, saveChanges } from "./utils";
import moveNode from "./moveNode";
import {
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
  let element: HTMLElement | null = null;
  let startX = 0;
  let startY = 0;
  let initialMouseX = 0;
  let initialMouseY = 0;
  let currentX = 0;
  let currentY = 0;
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
    element = e.currentTarget as HTMLElement;
    console.info("moving:", element);

    if (store.showColorMenu) setStore("showColorMenu", false);
    //? at leastit helps with removing the ghost when dragging an image
    //? other thatn that im not sure
    if (node.type === NodeType.Image) e.preventDefault();

    // dont accept middle mouse click, as well as ctrl click
    if (e.button !== 0 || e.ctrlKey) return;
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
      console.log(x, y)
      // todo: needs fixing
      currentX = Math.max(0, x > 0 ? x : 0);
      currentY = Math.max(0, y > 0 ? y : 0);

      // fast DOM update
      if (element) {
        element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    } else {
      updateChildPosition(node.id, x, y);
    }


    //! could cause some performance issues if there is alot of column nodes on the canvas
    //* introducting debounce can reduce the number of calls and improve performance
    targets.forEach((target) => {
      const isInside = isOverlapping(e.clientX, e.clientY, target);
      const sameType = target.classList.contains(node.type.toLowerCase());
      if (isInside && !sameType) {
        console.log("adding teh child_container_hover to ", target.id)
        target.classList.add("child_container_hover");
      } else {
        console.info("removing the child_container_hover from", target.id)
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
      if ((e.target as HTMLElement).closest(ignoredSelectors)) return;
      if (store.selectedNodes.size === 0) {
        const newSet = new Set([node.id]);
        setStore("selectedNodes", newSet);
      } else {
        if (e.shiftKey) {
          addSelected(e, node.id);
        } else {
          const newSet = new Set([node.id]);
          setStore("selectedNodes", newSet);
        }
      }
      return;
    }

    //? for transfering children to other nodes
    let movedToOtherNode = false;
    const targets = document.querySelectorAll(
      `.column:not(#${node.id}), .board:not(#${node.id})` // exclud the dragged column from the search for overlapp (when dragging a column it leads to running the overlap logic on its self)
    );
    // todo: stop foreeach when finished
    targets.forEach((target) => {
      //! fix this e. error
      const isInside = isOverlapping(e.clientX, e.clientY, target);
      target.classList.remove("child_container_hover");

      if (is_child) {
        if (isInside) {
          moveNode(node.id, target.id, true);
          movedToOtherNode = true;
        }
      } else {
        if (isInside) {
          moveNode(node.id, target.id);
          movedToOtherNode = true;
        }
      }
    });

    //? moved inside this canvas
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
        const [gx, gy] = store.snapGrid ? store.snapGrid : [1, 1];
        const scale = store.viewport?.scale ?? 1;
        let x = (e.clientX - store.viewport.x) / scale - startX;
        let y = (e.clientY - store.viewport.y) / scale - startY;
        currentX = Math.max(0, x);
        currentY = Math.max(0, y);
        const snappedX = Math.round((currentX ?? 0) / gx) * gx;
        const snappedY = Math.round((currentY ?? 0) / gy) * gy;
        console.info(snappedX, snappedY);
        updatePosition(node.id, snappedX, snappedY);
      }
    }

    //? extending viewport when needed
    const movedNode = document.getElementById(node.id);
    const rect = movedNode?.getBoundingClientRect();
    const scale = store.viewport.scale || 1;
    if (rect) {
      const width = rect.width / scale;
      const height = rect.height / scale;

      const rightEdge = node.x + width + 50;
      const bottomEdge = node.y + height + 50;

      if (rightEdge > store.viewport.width) {
        const newWidth = Math.round((rightEdge + 200) / 10) * 10;
        setStore("viewport", {
          width: Math.max(newWidth, store.viewport.width),
        });
      }

      if (bottomEdge > store.viewport.height) {
        const newHeight = Math.round((bottomEdge + 200) / 10) * 10;
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
