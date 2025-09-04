import { Show } from "solid-js";
import "../../css/Note.css";
import { Note } from "../../types";

type NoteProps = Note & {
  is_child?: boolean; // add it here
};

export default (block: NoteProps) => {
  console.log("from inside the note nested : ", block.is_child);

  return (
    <div
      class={block.is_child ? "note child_block" : "note block"}
      id={block.id}
      style={{
        width: block.is_child ? "100%" : block.width + "px",
        background: block.color ? block.color : "var(--default-bg-color)", // doesnt work the var()
        position: block.is_child ? "static" : "absolute",

        top: `${block.x}px`,
        left: `${block.y}px`,
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
