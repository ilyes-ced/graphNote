import { JSX, Show, createSignal, onCleanup, onMount } from "solid-js";
import { NodeType, NodeUnion } from "../../types";
import { useDraggable } from "../../shared/nodeDrag";
import { useResize } from "../../shared/useResize";
import { getActiveBoardId, updateNodeWidth } from "../../shared/update";
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
            "sortable",
          ],
        };
      case NodeType.Table:
        return { tags: ["input"], classes: ["columnSelection"] };

      case NodeType.Activity:
        return {
          classes: ["activityCell", "ch-subdomain-bg", "activityChangers"],
        };
      case NodeType.Url:
        return { tags: ["video"], classes: ["url_input"] };

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

export default (node: nodeProps) => {
  const [padding, setPadding] = createSignal(0)
  const { startDrag } = useDraggable(
    node.node,
    node.isChildNode,
    ignoredClasses(node.node.type)
  );

  //? if node is color than its half the width because it looks niced small
  const initWidth =
    node.node.type === NodeType.Color
      ? 150
      : store.nodes[getActiveBoardId()].find((n) => n.id === node.node.id)
        ?.width ?? undefined;

  const { width, startResize } = useResize(initWidth, (newWidth: number) => {
    updateNodeWidth(node.node.id, newWidth);
  });

  //TODO: fix each node type classname, and the ignored classes in the drag
  let el!: HTMLDivElement;
  //? this obsever is only here to detect when the height change on the nodes start of life to make it multiples of 10 in height, after its updated the first time its immediatly remvoed as its not needed
  let observer: ResizeObserver;
  onMount(async () => {
    observer = new ResizeObserver(entries => {
      const height = entries[0].contentRect.height;
      const [_, gy] = store.snapGrid ? store.snapGrid : [1, 1];
      const newH = Math.ceil((height ?? 0) / gy) * gy
      setPadding(newH - height)
      //? should remove it but, its needed for delayed nodes like URL and IMAGES, and resize
      //observer.disconnect();
    });
    observer.observe(el);
  });
  onCleanup(() => {
    observer.disconnect();
  })


  return (
    <div
      onPointerDown={startDrag}
      class={`${node.node.type.toLowerCase()}`}
      classList={{
        child_node: node.isChildNode,
        "node group/resize": !node.isChildNode,
        selected_node: store.selectedNodes.has(node.node.id),
        "group/collapse ": node.node.type === NodeType.Column,
        "flex flex-col justify-center items-center":
          node.node.type === NodeType.Board,
        "flex flex-row justify-start p-2 pl-2.5":
          node.node.type === NodeType.Board && node.isChildNode,
      }}
      id={node.node.id}
      style={{
        width: node.isChildNode
          ? "100%"
          : width()
            ? `${width()}px`
            : "fit-content",
        background: node.node.color, //? if this doesnt exist, .node in App.css will take care of it
        "z-index": node.node.zIndex,
        transform: `translate3d(${node.node.x}px, ${node.node.y}px, 0)`,
        color: node.node.textColor ?? "var(--color-foreground)",
      }}
    >
      {/* width() */}
      {/* node.isChildNode ? "100%" : width() ? `${width()}px` : "fit-content" */}
      <Show when={node.node.top_strip_color}>
        <div
          class="top_strip absolute top-0 left-0 h-1 w-full"
          style={{ background: node.node.top_strip_color }}
        ></div>
      </Show>
      <div class="child_div" ref={el}>
        {/* padding(): this padding is maybe best given to the child to decide its position based on the node for better appearance and more consistency */}
        {/* give to child: {padding()} */}
        {node.children}
      </div>
      <Show when={!node.isChildNode}>
        <ResizeHandle startResizeFunction={startResize} />
      </Show>
    </div>
  );
};
