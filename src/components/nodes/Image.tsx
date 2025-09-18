import { createSignal, onCleanup, Show } from "solid-js";
import { Image, NodeUnion } from "../../types";
import { setStore, store } from "../store";
import { useDraggable } from "@/shared/nodeDrag";
import { makeResizeObserver } from "@solid-primitives/resize-observer";
import { writeJSON } from "@/shared/save";

type ImageProps = Image & {
  is_child?: boolean;
};

export default (node: ImageProps) => {
  const { startDrag } = useDraggable(node, node.is_child);
  const [hover, setHover] = createSignal(false);

  const [width, setWidth] = createSignal(
    store.nodes.find((n) => n.id === node.id)?.width ?? 300
  );
  //const [height, setHeight] = createSignal();

  let boxRef!: HTMLDivElement;

  const startResize = (e: PointerEvent) => {
    console.info("starting resize");
    e.preventDefault();

    const startX = e.clientX;
    // const startY = e.clientY;
    const startWidth = width();
    // const startHeight = height();

    const onMove = (e: PointerEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      // const newHeight = startHeight + (e.clientY - startY);

      setWidth(Math.max(50, newWidth)); // Minimum width
      // setHeight(Math.max(50, newHeight)); // Minimum height
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);

      setStore("nodes", (n) => n.id === node.id, "width", width());
      setTimeout(() => {
        setStore("nodes", (current: NodeUnion[]) => {
          writeJSON(current);
          return current;
        });
      }, 0);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  onCleanup(() => {
    window.removeEventListener("pointermove", startResize);
    window.removeEventListener("pointerup", startResize);
  });

  return (
    <div
      ref={boxRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPointerDown={startDrag}
      class="image resize"
      classList={{
        child_node: node.is_child,
        node: !node.is_child,
        selected_node: store.selectedNodes.has(node.id),
      }}
      id={node.id}
      style={{
        width: node.is_child ? "100%" : width() + "px",
        background: node.color ? node.color : "var(--default-bg-color)",
        "z-index": node.zIndex,
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
      }}
    >
      <Show when={node.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: node.top_strip_color }}
        ></div>
      </Show>
      <img
        style={{ width: "100%" }}
        src={node.path || "placeholder.png"}
        alt="test image name"
      />
      {width()}
      <Show when={hover() && !node.is_child}>
        <div
          onPointerDown={startResize}
          class="cursor-nwse-resize resize_handle size-4 bg-red-300 absolute right-0 bottom-0"
        ></div>
      </Show>
    </div>
  );
};
