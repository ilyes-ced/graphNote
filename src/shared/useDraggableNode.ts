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
import { writeJSON } from "./save";
import { store, setStore } from "../components/store";

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

function useDraggableNode(
  ref: () => HTMLElement | null,
  block: { id: string; x: number; y: number }
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
      onDrag: (data) => {
        // check pan
        console.log(data.offset.x);
        console.log(data.offset.y);
      },
      onDragEnd: (data) => {
        setStore("nodes", (b) => b.id === block.id, "x", data.offset.x);
        setStore("nodes", (b) => b.id === block.id, "y", data.offset.y);

        // Get the updated version AFTER setStore ,and write it
        setTimeout(() => {
          // Capture latest snapshot
          setStore("nodes", (current) => {
            writeJSON(current);
            return current;
          });
        }, 0);
      },
    }),
  ]);
}

function useDraggableCanvas(ref: () => HTMLElement | null) {
  useDraggable(ref, [
    axis(null),
    grid([1, 1]),
    position({ default: { x: store.viewport.x, y: store.viewport.y } }),
    events({
      onDrag: (data) => {
        setStore("viewport", "x", data.offset.x);
        setStore("viewport", "y", data.offset.y);
      },

      onDragEnd: (data) => {
        // console.log("BEFORE updating");
        // console.log(store.viewport);
        // console.log(data);
        // setStore("viewport", "x", data.offset.x);
        // setStore("viewport", "y", data.offset.y);
        // console.log("AFTER updating");
        // console.log(store.viewport);

        // Get the updated version AFTER setStore ,and write it
        setTimeout(() => {
          // Capture latest snapshot
          setStore("nodes", (current) => {
            writeJSON(current);
            return current;
          });
        }, 0);
      },
    }),
  ]);
}

export { useDraggableNode, useDraggableCanvas };
