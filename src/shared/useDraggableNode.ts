import {
  axis,
  bounds,
  BoundsFrom,
  ControlFrom,
  controls,
  events,
  grid,
  position,
  threshold,
  useDraggable,
} from "@neodrag/solid";
import { writeJSON } from "./save";
import { store, setStore } from "../components/store";

function customBounds(): [[x1: number, y1: number], [x2: number, y2: number]] {
  // get the parent boundries and adjust them with the scaling

  const parent = document.getElementById("viewport-content");

  const scale = store.viewport.scale || 1;
  const panX = store.viewport.x;
  const panY = store.viewport.y;

  const rect = parent.getBoundingClientRect();

  const width = rect.width / scale;
  const height = rect.height / scale;

  console.log([
    [-panX / scale, -panY / scale],
    [width, height],
  ]);

  return [
    [-panX / scale, -panY / scale],
    [width, height],
  ];
}

function useDraggableNode(
  ref: () => HTMLElement | null,
  node: { id: string; x: number; y: number }
) {
  useDraggable(ref, [
    axis(null),
    // still glitchy
    bounds(BoundsFrom.parent()),
    grid([10, 10]),
    // threshold({ distance: 50 }),
    position({ default: { x: node.x, y: node.y } }),
    controls({
      block: ControlFrom.selector(".child_block"),
    }),
    events({
      onDragStart: (data) => {
        //? increased the z-index, to +1 of the highest
        const max_z_ndex = Math.max(...store.nodes.map((o) => o.zIndex));
        setStore("nodes", (b) => b.id === node.id, "zIndex", max_z_ndex + 2);

        setStore("dragging", node.id);
      },

      // todo: on drag if position of x or y is 0 lock the cooresponding border
      // todo: when either is
      onDrag: (data) => {
        const elem = document.elementFromPoint(data.offset.x, data.offset.y);
        if (elem && elem.closest(".empty_children_container")) {
          console.log("emtpy chioldren ", true);
        } else {
          console.log("emtpy chioldren ", false);
        }
      },
      onDragEnd: (data) => {
        setStore("dragging", null);

        setStore("nodes", (b) => b.id === node.id, "x", data.offset.x);
        setStore("nodes", (b) => b.id === node.id, "y", data.offset.y);

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
    grid([10, 10]),
    position({ default: { x: 0, y: 0 } }),
    events({
      onDrag: (data) => {},

      onDragEnd: (data) => {
        setStore("viewport", "x", data.offset.x);
        setStore("viewport", "y", data.offset.y);

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
