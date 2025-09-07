import { createSignal, Show } from "solid-js";
import "../../css/Note.css";
import { BlockUnion, Note } from "../../types";
import { SetStoreFunction } from "solid-js/store";
import { useDraggableBlock } from "../../shared/useDraggableBlock";

type NoteProps = Note & {
  is_child?: boolean; // add it here
};

export default (block: NoteProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );
  if (!block.is_child) {
    useDraggableBlock(draggableRef, block);
  }
  return (
    <div
      ref={block.is_child ? undefined : setDraggableRef}
      class={block.is_child ? "note child_block" : "note block"}
      id={block.id}
      style={{
        width: block.is_child ? "100%" : block.width + "px",
        background: block.color ? block.color : "var(--default-bg-color)", // doesnt work the var()
      }}
    >
      <Show when={block.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: block.top_strip_color }}
        ></div>
      </Show>

      <div class="note_text">{block.text}</div>
    </div>
  );
};
