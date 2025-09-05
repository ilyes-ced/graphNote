import {
  axis,
  bounds,
  BoundsFrom,
  events,
  grid,
  position,
  useDraggable,
} from "@neodrag/solid";
import { SetStoreFunction } from "solid-js/store";
import { BlockUnion } from "../types";
import { writeJSON } from "../components/save";

export function useDraggableBlock(
  ref: () => HTMLElement | null,
  block: { id: string; x: number; y: number },
  setBlocks: SetStoreFunction<BlockUnion[]>
) {
  useDraggable(ref, [
    axis(null),
    bounds(BoundsFrom.parent()),
    grid([10, 10]),
    position({ default: { x: block.x, y: block.y } }),
    events({
      onDragEnd: (data) => {
        setBlocks((b) => b.id === block.id, "x", data.offset.x);
        setBlocks((b) => b.id === block.id, "y", data.offset.y);

        // Get the updated version AFTER setBlocks and write it
        setTimeout(() => {
          // Capture latest snapshot
          setBlocks((current) => {
            writeJSON(current);
            return current;
          });
        }, 0);
      },
    }),
  ]);
}
