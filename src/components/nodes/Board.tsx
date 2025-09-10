import { createSignal } from "solid-js";
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

  const iconType = (icon_path: string): "svg" | "img" => {
    console.log(icon_path);
    console.log();

    switch (icon_path.split(".").slice(-1)[0]) {
      case "svg":
        return "svg";
      case "png":
        return "img";
      case "jpg":
        return "img";
      case "jpeg":
        return "img";

      default:
        return "img";
    }
  };

  //Todo: remove this later it causes it to be undraggable in the ref={}
  return (
    <div
      ref={node.is_child ? undefined : setDraggableRef}
      class="board"
      classList={{
        child_node: node.is_child,
        node: !node.is_child,
      }}
      id={node.id}
      style={{
        background: node.is_child ? "#00000050" : "#00000000",
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
          "border-radius": node.is_child ? "10px" : "15px",
        }}
      >
        {node.icon_path}
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
        <div
          classList={{
            board_content: !node.is_child,
            board_content_child: node.is_child,
          }}
        >
          content
        </div>
      </div>
    </div>
  );
};

/*

.board {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.board.child_node {
  flex-direction: row;
  justify-content: start;
  padding: 5px;
  padding-left: 10px;
}

.board_icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.board_text {
  margin-top: 10px;
  margin-bottom: 5px;
}
.board_text_child {
  align-self: flex-start;
  margin-bottom: 5px;
}

.board_content {
  color: grey;
}
.board_content_child {
  color: grey;
  align-self: flex-start;
}

.text_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

*/
