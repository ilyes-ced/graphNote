import { createSignal, onCleanup, Show } from "solid-js";
import { Image } from "../../types";
import { setStore, store } from "../store";
import { useDraggable } from "@/shared/nodeDrag";
import { saveChanges } from "@/shared/utils";
import { getActiveBoardId, updateImageWidth } from "@/shared/update";
import { IoResize } from "solid-icons/io";

type ImageProps = Image & {
  is_child?: boolean;
};

export default (node: ImageProps) => {
  const { startDrag } = useDraggable(node, node.is_child, {
    classes: ["resize_handle"],
  });

  const [width, setWidth] = createSignal(
    store.nodes[getActiveBoardId()].find((n) => n.id === node.id)?.width ?? 300
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

      updateImageWidth(node.id, width());
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
      onPointerDown={startDrag}
      class="image resize group/resize"
      classList={{
        child_node: node.is_child,
        node: !node.is_child,
        selected_node: store.selectedNodes.has(node.id),
      }}
      id={node.id}
      style={{
        width: node.is_child ? "100%" : width() + "px",
        background: node.color ? node.color : "",
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
      <div
        onPointerDown={startResize}
        class="resize_handle cursor-pointer absolute bottom-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/resize:opacity-100 
                   pointer-events-none group-hover/resize:pointer-events-auto 
                   transition-all duration-200 ease-in-out"
      >
        <IoResize color="#000000" size={24} class="rotate-90 " stroke="4" />
      </div>
    </div>
  );
};
