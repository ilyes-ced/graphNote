import { createSignal, Show } from "solid-js";
import { Note } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";

type NoteProps = Note & {
  is_child?: boolean;
};

export default (node: NoteProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );
  useDraggableNode(draggableRef, node, node.is_child);

  //Todo: remove this later it causes it to be undraggable in the ref={}
  return (
    <div
      ref={setDraggableRef}
      class="note"
      classList={{
        child_node: node.is_child,
        node: !node.is_child,
      }}
      id={node.id}
      style={{
        width: node.is_child ? "100%" : node.width + "px",
        background: node.color ? node.color : "var(--default-bg-color)",
        "z-index": node.zIndex,
      }}
    >
      <Show when={node.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: node.top_strip_color }}
        ></div>
      </Show>

      <div class="note_text flex flex-col p-5">
        {node.text} padding doesnt work idk why
      </div>
    </div>
  );
};
