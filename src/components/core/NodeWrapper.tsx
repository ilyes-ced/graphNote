import { JSX, Show } from "solid-js";
import { NodeType, NodeUnion } from "../../types";
import { useDraggable } from "@/shared/nodeDrag";
import { useResize } from "@/shared/useResize";
import { getActiveBoardId, updateNodeWidth } from "@/shared/update";
import ResizeHandle from "../nodes/resizeHandle";
import { store } from "../../shared/store";

interface nodeProps {
  node: NodeUnion;
  children: JSX.Element;
  isChildNode?: boolean;
}

const ignoredClasses = (
  nodeType: NodeType
): {
  tags?: string[];
  classes?: string[];
  ids?: string[];
} => {
  const baseResult: {
    tags?: string[];
    classes?: string[];
    ids?: string[];
  } = (() => {
    switch (nodeType) {
      case NodeType.Column:
        return { classes: ["collapse_icon", "titleHandle"] };
      case NodeType.Note:
        return { tags: ["button"], ids: ["editor"] };
      case NodeType.Todo:
        return {
          classes: [
            "taskitem",
            "taskitem-text",
            "checkbox-check",
            "tasklist_handle",
          ],
        };
      case NodeType.Table:
        return { tags: ["input"], classes: ["columnSelection"] };

      default:
        return {};
    }
  })();

  // Ensure "resize_handle" is always present
  return {
    ...baseResult,
    classes: Array.from(
      new Set([...(baseResult.classes ?? []), "resize_handle"])
    ),
  };
};

export default (props: nodeProps) => {
  const { startDrag } = useDraggable(
    props.node,
    props.isChildNode,
    ignoredClasses(props.node.type)
  );

  //? if node is color than its half the width because it looks niced small
  const initWidth =
    props.node.type === NodeType.Color
      ? 150
      : store.nodes[getActiveBoardId()].find((n) => n.id === props.node.id)
          ?.width ?? undefined;

  const { width, startResize } = useResize(initWidth, (newWidth: number) => {
    updateNodeWidth(props.node.id, newWidth);
  });

  //TODO: fix each node type classname, and the ignored classes in the drag

  return (
    <div
      onPointerDown={startDrag}
      class={`${props.node.type.toLowerCase()}`}
      classList={{
        child_node: props.isChildNode,
        "node group/resize": !props.isChildNode,
        selected_node: store.selectedNodes.has(props.node.id),
        "group/collapse ": props.node.type === NodeType.Column,
        "flex flex-col justify-center items-center":
          props.node.type === NodeType.Board,
        "flex flex-row justify-start p-2 pl-2.5":
          props.node.type === NodeType.Board && props.isChildNode,
      }}
      id={props.node.id}
      style={{
        width: props.isChildNode
          ? "100%"
          : width()
          ? `${width()}px`
          : "fit-content",
        background: props.node.color, //? if this doesnt exist, .node in App.css will take care of it
        "z-index": props.node.zIndex,
        transform: `translate3d(${props.node.x}px, ${props.node.y}px, 0)`,
        color: props.node.textColor ?? "var(--color-foreground)",
      }}
    >
      {width()}
      {props.isChildNode ? "100%" : width() ? `${width()}px` : "fit-content"}
      <Show when={props.node.top_strip_color}>
        <div
          class="top_strip absolute top-0 left-0"
          style={{ background: props.node.top_strip_color }}
        ></div>
      </Show>
      {props.children}
      <Show when={!props.isChildNode}>
        <ResizeHandle startResizeFunction={startResize} />
      </Show>
    </div>
  );
};
