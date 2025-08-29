import { Show } from "solid-js";
import "../../css/Note.css";
import { Note } from "../../types";

export default (block: Note) => {
  return (
    <div
      class="note block"
      id={block.id}
      style={{
        width: block.width + "px",
        background: block.color ? block.color : "var(--default-bg-color)",
        position: "absolute",
        transform: `translateX(${block.x}px) translateY(${block.y}px)`,
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
