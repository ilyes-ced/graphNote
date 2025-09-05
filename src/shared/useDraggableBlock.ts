import {
  axis,
  bounds,
  BoundsFrom,
  ControlFrom,
  controls,
  events,
  grid,
  position,
  useDraggable,
} from "@neodrag/solid";
import { SetStoreFunction } from "solid-js/store";
import { BlockUnion } from "../types";
import { writeJSON } from "../components/save";

function customBounds(): [[x1: number, y1: number], [x2: number, y2: number]] {
  // get the parent boundries and adjust them with the scaling

  const parent = document.getElementById("main");

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const radius = 200;

  console.log(parent);
  console.log(parent?.offsetTop);
  console.log(parent?.offsetLeft);
  console.log(parent?.offsetHeight);
  console.log(parent?.offsetWidth);

  console.log("===========");

  console.log(parent?.clientTop);
  console.log(parent?.clientLeft);
  console.log(parent?.clientWidth);
  console.log(parent?.clientHeight);

  console.log(
    [centerX - radius, centerY - radius],
    [centerX + radius, centerY + radius]
  );

  return [
    [parent?.clientTop || 0, parent?.clientWidth || 0],
    [parent?.clientLeft || 0, parent?.clientHeight || 0],
  ];
}

export function useDraggableBlock(
  ref: () => HTMLElement | null,
  block: { id: string; x: number; y: number },
  setBlocks: SetStoreFunction<BlockUnion[]>
) {
  useDraggable(ref, [
    axis(null),
    //bounds(customBounds),
    grid([10, 10]),
    position({ default: { x: block.x, y: block.y } }),
    controls({
      block: ControlFrom.selector(".child_block"),
    }),
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
