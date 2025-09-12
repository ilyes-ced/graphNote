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
      ref={setDraggableRef}
      class="board flex flex-col justify-center items-center"
      classList={{
        child_node: node.is_child,
        node: !node.is_child,
        "flex flex-row justify-start p-2 pl-2.5": node.is_child,
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
        class="board_icon flex flex-col justify-center items-center"
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
      <div class="text_container flex flex-col justify-center items-center">
        <div
          classList={{
            "board_text mt-2.5 mb-1.5 text-nowrap": !node.is_child,
            "board_text_child self-start mb-1.5": node.is_child,
          }}
        >
          {node.name}
        </div>
        <div
          classList={{
            "board_content text-grey": !node.is_child,
            "board_content_child text-grey self-start": node.is_child,
          }}
        >
          content
        </div>
      </div>
    </div>
  );
};
