import { onCleanup } from "solid-js";
import { BlockUnion } from "../types";
import { SetStoreFunction } from "solid-js/store";
import { writeJSON } from "./save";

export function useDraggable(
  id: string,
  blocks: BlockUnion[],
  setBlocks: SetStoreFunction<BlockUnion[]>,
  options?: { scale?: () => number }
) {
  return (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;

    const block = blocks.find((b) => b.id === id);
    if (!block) return;

    const initialX = block.x;
    const initialY = block.y;

    const scale = options?.scale?.() ?? 1;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dy = (moveEvent.clientX - startX) / scale;
      const dx = (moveEvent.clientY - startY) / scale;

      setBlocks((b) => b.id === id, "x", initialX + dx);
      setBlocks((b) => b.id === id, "y", initialY + dy);

      console.log("new coords");
      console.log(initialX + dx);
      console.log(initialY + dy);

      // here upodate its position

      //? update the blocks object and save
      const index = blocks.findIndex((block) => block.id === id);
      if (index === -1) return;

      setBlocks(index, {
        x: initialX + dx,
        y: initialY + dy,
      });

      // todo: fix me
      writeJSON(blocks);
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // onCleanup(() => {
    //   window.removeEventListener("pointermove", onPointerMove);
    //   window.removeEventListener("pointerup", onPointerUp);
    // });
  };
}

function roundToNearest5(num) {
  return Math.round(num / 5) * 5;
}
