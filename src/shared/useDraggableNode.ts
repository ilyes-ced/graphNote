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
import { writeJSON } from "../components/save";
import { store, setStore } from "../components/store";
import { NodeType } from "../types";
import moveNode from "./moveNode";

function isOverlapping(mouseX: number, mouseY: number, targetEl: Element) {
  const rect = targetEl.getBoundingClientRect();

  return (
    mouseX >= rect.left &&
    mouseX <= rect.right &&
    mouseY >= rect.top &&
    mouseY <= rect.bottom
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
    is_child ? bounds() : bounds(BoundsFrom.parent()),
    // remove later and snap manually, with animation
    grid([10, 10]),
    //* set if is a child node
    threshold(is_child ? { distance: 70 } : { distance: 5 }),
    position({ default: { x: node.x || 0, y: node.y || 0 } }),
    controls({
      block: ControlFrom.selector(".child_node, .active_note_text, .taskitem"),
    }),
    events({
      onDragStart: (data) => {
        console.log("sarted dragging:", data);
        //? increased the z-index, to +1 of the highest
        const max_z_ndex = Math.max(
          ...store.nodes.map((node) => node.zIndex || 1) // || 1 just to shutup the error
        );
        setStore("nodes", (b) => b.id === node.id, "zIndex", max_z_ndex + 1);
        setStore("dragging", node.id);
      },

      onDrag: (data) => {
        console.log("dragging", data);
        const mouseX = data.event.clientX;
        const mouseY = data.event.clientY;

        const targets = document.querySelectorAll(".column");
        //! can be imporeved, should not be decided every drag move but on start and end
        //! thers also rootNode that im not sure what the difference between them is
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
        console.log("darg ended", data.rootNode.id);

        const mouseX = data.event.clientX;
        const mouseY = data.event.clientY;

        const targets = document.querySelectorAll(
          `.column:not(#${data.rootNode.id})` // exclud the dragged column from the search for overlapp (when dragging a column it leads to running the overlap logic on its self)
        );
        let moved = false;
        targets.forEach((target) => {
          const isInside = isOverlapping(mouseX, mouseY, target);
          target.classList.remove("child_container_hover");

          //if child
          //    if inside tranfer it to the new column
          //    else make a normal node
          if (is_child) {
            if (isInside) {
              moved = true;
              const node_id = data.currentNode.id;
              const target_id = target.id;
              moveNode(node_id, target_id, true);
              return;
            }
          } else {
            if (isInside) {
              const node_id = data.currentNode.id;
              const target_id = target.id;
              moveNode(node_id, target_id);
              moved = true;
              // when overlap is detected, stop searching for overlap
              return;
            }
          }
        });
        if (!moved) {
          const node_id = data.currentNode.id;
          if (is_child) {
            const targets = document.querySelectorAll(
              `#${data.rootNode.id}` // exclud the dragged column from the search for overlapp (when dragging a column it leads to running the overlap logic on its self)
            );
            console.info(targets[0].getBoundingClientRect());
            moveNode(node_id, "None", true, true, {
              x: Math.round(targets[0].getBoundingClientRect().x / 10) * 10,
              y: Math.round(targets[0].getBoundingClientRect().y / 10) * 10,
            });
          }
        }

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
