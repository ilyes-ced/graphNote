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
import { NodeType } from "../types";

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

function isOverlapping(mouseX: number, mouseY: number, targetEl: Element) {
  const rect = targetEl.getBoundingClientRect();

  return (
    mouseX >= rect.left &&
    mouseX <= rect.right &&
    mouseY >= rect.top &&
    mouseY <= rect.bottom
  );
}

function childNode(nodeId: string, parentId: string) {
  let nodeToMove = store.nodes.find((node) => node.id === nodeId);
  if (!nodeToMove) {
    console.warn("Node to move not found:", nodeId);
    return;
  }
  if (nodeToMove.type === NodeType.Column) {
    console.warn("Node to move cannot be nested because its a column:", nodeId);
    return;
  }

  setStore("nodes", (nodes) => nodes.filter((node) => node.id !== nodeId));

  setStore("nodes", (nodes) =>
    nodes.map((node) => {
      if (node.id === parentId && node.type === NodeType.Column) {
        const existingChildren = node.children ?? [];
        return {
          ...node,
          children: [
            ...existingChildren,
            {
              ...nodeToMove,
              // removing x and y
              x: undefined,
              y: undefined,
              index: existingChildren.length,
            },
          ],
        };
      }
      return node;
    })
  );
}

function useDraggableNode(
  ref: () => HTMLElement | null,
  node: { id: string; x: number; y: number },
  is_child?: boolean
) {
  useDraggable(ref, [
    axis(null),
    // still glitchy
    bounds(BoundsFrom.parent()),
    // remove later and snap manually, with animation
    grid([10, 10]),
    //* set if is a child node
    threshold(is_child ? { distance: 10 } : { distance: 0 }),
    position({ default: { x: node.x || 0, y: node.y || 0 } }),
    controls({
      block: ControlFrom.selector(".child_node"),
    }),
    events({
      onDragStart: (data) => {
        console.log("dragging:", data);
        //? increased the z-index, to +1 of the highest
        const max_z_ndex = Math.max(...store.nodes.map((node) => node.zIndex));
        setStore("nodes", (b) => b.id === node.id, "zIndex", max_z_ndex + 1);

        setStore("dragging", node.id);
      },

      onDrag: (data) => {
        const mouseX = data.event.clientX;
        const mouseY = data.event.clientY;

        //todo: here should add the class to its child container not its self
        const targets = document.querySelectorAll(".column");
        //! can be imporeved, should not be decided every drag move but on start and end
        const isColumn =
          store.nodes.find((node) => node.id === data.rootNode.id)?.type ===
          NodeType.Column;

        //! could cause some performance issues if there is alot of column nodes on the canvas
        //? introducting debound can reduce the number of calls and improve performance
        targets.forEach((target) => {
          const isInside = isOverlapping(mouseX, mouseY, target);
          if (isInside && !isColumn) {
            target.classList.add("child_container_hover");
          } else {
            target.classList.remove("child_container_hover");
          }
        });
      },

      onDragEnd: (data) => {
        // todo: here check if its overlapping, UPDATE THE CHILD NODE  and remove hovered coontainer classs
        const mouseX = data.event.clientX;
        const mouseY = data.event.clientY;
        //! thers also rootNode that im not sure what the difference between them is

        const targets = document.querySelectorAll(".column");
        console.log(targets);
        targets.forEach((target) => {
          const isInside = isOverlapping(mouseX, mouseY, target);
          target.classList.remove("child_container_hover");
          if (isInside) {
            const node_id = data.currentNode.id;
            const parent_id = target.id;
            childNode(node_id, parent_id);

            // here update the nodes in the store
          }
        });

        setStore("dragging", null);

        setStore("nodes", (b) => b.id === node.id, "x", data.offset.x);
        setStore("nodes", (b) => b.id === node.id, "y", data.offset.y);

        setTimeout(() => {
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
