import { createEffect, createSignal, Show } from "solid-js";
import { Note } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";
import { updateNote } from "@/shared/update";
import { addSelected } from "@/shared/utils";
import { store } from "../store";

type NoteProps = Note & {
  is_child?: boolean;
};

export default (node: NoteProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );
  const [editable, setEditable] = createSignal(false);

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

  createEffect(() => {
    if (editable()) {
      editableDiv.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editableDiv);
      range.collapse(false); // Collapse to the end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const selection = window.getSelection();
      if (!selection?.rangeCount) return;

      const range = selection.getRangeAt(0);
      const tabNode = document.createTextNode("    "); // 4 spaces tab // maybe make it user defined later

      range.insertNode(tabNode);

      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);

      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  return (
    <div
      onclick={(e) => addSelected(e, node.id)}
      onClick={(e) => {
        e.stopPropagation();
        console.log("======================== note main div clicked");
      }}
      onDblClick={(e) => {
        e.stopPropagation();
        console.log("======================== note main div onDblClick");
      }}
      ref={setDraggableRef}
      class="note"
      classList={{
        child_node: node.is_child,
        node: !node.is_child,
        selected_node: store.selectedNodes.has(node.id),
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
          onClick={() => {
            console.log("======================== note clicked");
          }}
          onKeyDown={handleKeyDown}
          onDblClick={(e) => {
            console.log("======================== double clicked");
            setEditable(true);
            addSelected(e, node.id);
          }}
          onBlur={() => setEditable(false)}
          ref={editableDiv}
          contenteditable={editable()}
          classList={{ "cursor-text active_note_text": editable() }}
          onInput={handleInput}
          class="note_text flex flex-col focus:outline-0 whitespace-pre-wrap"
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
