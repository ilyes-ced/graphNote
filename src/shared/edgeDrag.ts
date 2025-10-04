import { onCleanup } from "solid-js";
import { store, setStore } from "./store";
import { type NodeUnion } from "../types";

export function useDraggable(edge: NodeUnion, ignoredClasses?: string[]) {
  const startDrag = (e: PointerEvent) => {};

  const onMove = (e: PointerEvent) => {};

  const onUp = (e: PointerEvent) => {};

  onCleanup(() => {
    console.warn("this is cleanup", edge.id);
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
