import { onCleanup } from "solid-js";
import { store, setStore } from "../components/store";
import type { NodeUnion } from "../types";
import { writeJSON } from "./save";
import { addSelected } from "./utils";

export function useDraggable(node: NodeUnion) {
  let startX = 0;
  let startY = 0;
  let initialMouseX = 0;
  let initialMouseY = 0;
  const threshold = 5;

  const startDrag = (e: PointerEvent) => {
    // dont accept middle mouse click
    if (e.which === 2) return;
    // ignore the drag event for pressable items like checkboxes

    console.info("started dragging:", node.id);
    e.preventDefault();

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
    const scale = store.viewport?.scale ?? 1;
    let x = (e.clientX - store.viewport.x) / scale - startX;
    let y = (e.clientY - store.viewport.y) / scale - startY;

    if (!store.nodes.find((n) => n.id === node.id)) return;

    // todo: change tyhis to happen on drag end with animation

    // doesnt work perfectly but i guess it works
    if (x > 0) setStore("nodes", (n: NodeUnion) => n.id === node.id, "x", x);
    if (y > 0) setStore("nodes", (n: NodeUnion) => n.id === node.id, "y", y);
  };

  const onUp = (e?: PointerEvent) => {
    setStore("dragging", null);

    if (store.snapGrid) {
      const [gx, gy] = store.snapGrid;
      setStore("nodes", (prev) =>
        prev.map((storeNode) => {
          if (storeNode.id === node.id) {
            console.log("old values:", node.x, node.y);
            console.log(
              "new rounded values:",
              Math.round(node.x / gx) * gx,
              Math.round(node.y / gy) * gy
            );
            return {
              ...storeNode,
              x: Math.round(node.x / gx) * gx,
              y: Math.round(node.y / gy) * gy,
            };
          }
          return storeNode;
        })
      );
    }

    setTimeout(() => {
      setStore("nodes", (current: NodeUnion[]) => {
        writeJSON(current);
        return current;
      });
    }, 0);

    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);

    const deltaX = Math.abs((e?.clientX ?? 0) - initialMouseX);
    const deltaY = Math.abs((e?.clientY ?? 0) - initialMouseY);

    const didMove = deltaX > threshold || deltaY > threshold;

    if (!didMove && e) {
      if ((e.target as HTMLElement).closest(".taskitem")) return;
      addSelected(e, node.id);
    }
  };

  onCleanup(() => {
    onUp();
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
