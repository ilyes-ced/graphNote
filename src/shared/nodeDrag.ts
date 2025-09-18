import { onCleanup } from "solid-js";
import { store, setStore } from "../components/store";
import { NodeType, type NodeUnion } from "../types";
import { writeJSON } from "./save";
import { addSelected } from "./utils";
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

export function useDraggable(node: NodeUnion, is_child: boolean = false) {
  let startX = 0;
  let startY = 0;
  let initialMouseX = 0;
  let initialMouseY = 0;
  let targets = document.querySelectorAll(".column");
  const threshold = 1;

  const startDrag = (e: PointerEvent) => {
    // dont accept middle mouse click
    console.log("dragging", node.id, is_child);
    if (e.which === 2) return;
    if (!is_child)
      if ((e.target as HTMLElement).closest(".child_node, .resize_handle"))
        return;

    //? update here because new colmns could appear later
    targets = document.querySelectorAll(".column");

    console.info("started dragging:", node.id);
    //? increased the z-index, to +1 of the highest
    const max_z_ndex = Math.max(
      ...store.nodes.map((node) => node.zIndex || 1) // || 1 just to shutup the error
    );
    setStore("nodes", (b) => b.id === node.id, "zIndex", max_z_ndex + 1);
    setStore("dragging", node.id);

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
    console.info("moving:", node.id);
    const scale = store.viewport?.scale ?? 1;
    let x = (e.clientX - store.viewport.x) / scale - startX;
    let y = (e.clientY - store.viewport.y) / scale - startY;

    // if (!store.nodes.find((n) => n.id === node.id)) return;

    if (!is_child) {
      if (x > 0) setStore("nodes", (n: NodeUnion) => n.id === node.id, "x", x);
      if (y > 0) setStore("nodes", (n: NodeUnion) => n.id === node.id, "y", y);
    } else {
      // update inside the parent
      //  setStore(
      //    "nodes",
      //    (n) => n.type === NodeType.Column, // only look inside columns
      //    "children",
      //    (c) => c.id === node.id, // find the child node
      //    "x",
      //    x
      //  );
      //  setStore(
      //    "nodes",
      //    (n) => n.type === NodeType.Column, // only look inside columns
      //    "children",
      //    (c) => c.id === node.id, // find the child node
      //    "y",
      //    y
      //  );

      //! trying to combine them doesnt work
      //! setStore( "nodes", (node) => node.type === NodeType.Column, "children", (child) => child.id === node.id, (child) => { child.x = x; child.y = y; } );
      setStore(
        "nodes",
        (node) => node.type === NodeType.Column,
        "children",
        (child) => child.id === node.id,
        "x",
        x
      );
      setStore(
        "nodes",
        (node) => node.type === NodeType.Column,
        "children",
        (child) => child.id === node.id,
        "y",
        y
      );
    }

    const isColumn =
      store.nodes.find((storeNode) => storeNode.id === node.id)?.type ===
      NodeType.Column;

    //! could cause some performance issues if there is alot of column nodes on the canvas
    //* introducting debound can reduce the number of calls and improve performance
    targets.forEach((target) => {
      const isInside = isOverlapping(e.clientX, e.clientY, target);
      if (isInside && !isColumn) {
        target.classList.add("child_container_hover");
      } else {
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
      console.log("=================================================");
      console.log("did not move so single click");
      console.log("=================================================");
      if ((e.target as HTMLElement).closest(".taskitem")) return;
      addSelected(e, node.id);
      return;
    }

    //? for transfering children to other nodes
    /////////////////////////////////////////////////////////
    console.log("dropping a node", node.id, is_child);

    const targets = document.querySelectorAll(
      `.column:not(#${node.id})` // exclud the dragged column from the search for overlapp (when dragging a column it leads to running the overlap logic on its self)
    );
    let moved = false;
    targets.forEach((target) => {
      //! fix this e. error
      const isInside = isOverlapping(e.clientX, e.clientY, target);
      target.classList.remove("child_container_hover");

      if (is_child) {
        if (isInside) {
          console.log("dropping a node", node.id, "in parent node:", target.id);
          moved = true;
          const node_id = node.id;
          const target_id = target.id;
          moveNode(node_id, target_id, true);
          // return;
        }
      } else {
        if (isInside) {
          const node_id = node.id;
          const target_id = target.id;
          moveNode(node_id, target_id);
          moved = true;
          // return;
        }
      }
    });
    if (!moved) {
      const node_id = node.id;
      if (is_child) {
        const targets = document.querySelectorAll(`#${node.id}`);
        console.info(targets[0].getBoundingClientRect());
        moveNode(node_id, "None", true, true, {
          x: Math.round(targets[0].getBoundingClientRect().x / 10) * 10,
          y: Math.round(targets[0].getBoundingClientRect().y / 10) * 10,
        });
      }
    }
    /////////////////////////////////////////////////////////
    // if not child node snap it to grid,
    // TODO: also we need to snap to grid when child is dropped to canvas
    else {
      //? snap to grid if it is defined
      if (store.snapGrid) {
        const [gx, gy] = store.snapGrid;
        const nodeInStore = store.nodes.find((n) => n.id === node.id);
        // if (!nodeInStore) return;
        const snappedX = Math.round(nodeInStore?.x ?? 0 / gx) * gx;
        const snappedY = Math.round(nodeInStore?.y ?? 0 / gy) * gy;
        // Skip if already snapped
        // if (nodeInStore?.x === snappedX && nodeInStore.y === snappedY) return;
        // Defer snapping to next frame to allow transition animation
        console.info(snappedX, snappedY);
        requestAnimationFrame(() => {
          setStore("nodes", (n) => n.id === node.id, "x", snappedX);
          setStore("nodes", (n) => n.id === node.id, "y", snappedY);
        });
      }
    }

    //? save the changes to file
    setTimeout(() => {
      setStore("nodes", (current: NodeUnion[]) => {
        writeJSON(current);
        return current;
      });
    }, 0);
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

/**
 *
 * addSelected(e, node.id);
 *
 */
