import { For, Show } from "solid-js";
import { store } from "../store";
import { useDraggable } from "@/shared/nodeDrag";
import { Color } from "../../types";

type ColorProps = Color & {
  is_child?: boolean;
  nested?: number;
};

export default (node: ColorProps) => {
  const { startDrag } = useDraggable(node, node.is_child);

  return (
    <div
      onPointerDown={startDrag}
      class="color"
      classList={{
        "child_node w-full": node.is_child,
        node: !node.is_child,
        selected_node: store.selectedNodes.has(node.id),
      }}
      id={node.id}
      style={{
        width: node.is_child ? "100%" : node.width / 2 + "px",
        background: node.color ? node.color : "",
        "z-index": node.zIndex,
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
      }}
    >
      <div
        class="aspect-5/4 w-full p-5"
        style={{ background: node.colorValue }}
      >
        {node.colorValue}
        hex value here
      </div>
      <div class="p-5 text-xs">
        by default is color name here, editable \{node.text}
      </div>
    </div>
  );
};
