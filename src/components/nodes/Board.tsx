import { createSignal } from "solid-js";
import "../../css/Board.css";
import { Board } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";

type BoardProps = Board & {
  is_child?: boolean;
};

export default (node: BoardProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );

  useDraggableNode(draggableRef, node, node.is_child);

  const iconType = (icon: string): boolean => {
    console.log(icon);
    console.log(icon.split(".")[-1]);

    return true;
  };

  //Todo: remove this later it causes it to be undraggable in the ref={}
  return (
    <div
      ref={node.is_child ? undefined : setDraggableRef}
      class={node.is_child ? "board child_node" : "board node"}
      id={node.id}
      style={{
        background: "transparent",
        width: node.is_child ? "100%" : "60px",
        "z-index": node.zIndex,
        "border-radius": node.is_child ? "" : "15px",
      }}
    >
      <div
        class="board_icon"
        style={{
          background: node.color ? node.color : "var(--default-bg-color)",
          width: node.is_child ? "50px" : "60px",
          height: node.is_child ? "50px" : "60px",
          "margin-right": node.is_child ? "10px" : "",
          "border-radius": node.is_child ? "" : "15px",
        }}
      >
        {iconType(node.icon)}
        {node.icon}
      </div>
      <div class="text_container">
        <div
          classList={{
            board_text: !node.is_child,
            board_text_child: node.is_child,
          }}
        >
          {node.name}
        </div>
        <div class="board_content">content</div>
      </div>
    </div>
  );
};
