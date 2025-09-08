import { createSignal, Show } from "solid-js";
import "../../css/Note.css";
import { Note } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";

type NoteProps = Note & {
  is_child?: boolean; // add it here
};

export default (node: NoteProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );
  if (!node.is_child) {
    useDraggableNode(draggableRef, node);
  }
  return (
    <div
      ref={node.is_child ? undefined : setDraggableRef}
      class={node.is_child ? "note child_node" : "note node"}
      id={node.id}
      style={{
        width: node.is_child ? "100%" : node.width + "px",
        background: node.color ? node.color : "var(--default-bg-color)", // doesnt work the var()
        "z-index": node.zIndex,
      }}
    >
      <Show when={node.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: node.top_strip_color }}
        ></div>
      </Show>

      <div class="note_text">{node.text}</div>
    </div>
  );
};
