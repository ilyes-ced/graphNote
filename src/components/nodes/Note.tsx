import { createSignal, Show } from "solid-js";
import { Note } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";
import { updateNote } from "@/shared/update";

type NoteProps = Note & {
  is_child?: boolean;
};

export default (node: NoteProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );
  useDraggableNode(draggableRef, node, node.is_child);
  let editableDiv: HTMLDivElement | undefined;
  function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }
  const updateText = debounce((newValue: string) => {
    console.log("Debounced update:", newValue);
    // could be nested too
    // update in the update.ts shared file
    updateNote(node.id, newValue, node.is_child);
  }, 3000);

  const handleInput = (e: InputEvent) => {
    const newText = editableDiv?.innerText || "";
    updateText(newText);
  };

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

      <div class="p-5">
        {" "}
        <span
          ref={editableDiv}
          contenteditable
          onInput={handleInput}
          class="note_text flex flex-col cursor-text focus:outline-0"
        >
          {node.text}
        </span>
      </div>
    </div>
  );
};
/*
     <span
          ref={editableDiv}
          contenteditable
          onInput={handleInput}
          class="note_text flex flex-col cursor-text focus:outline-0"
        >
          {node.text}
        </span>
 */
