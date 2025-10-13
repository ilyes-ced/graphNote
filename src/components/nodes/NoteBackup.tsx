import { createEffect, createSignal, Show } from "solid-js";
import { Note } from "../../types";
import { updateNote } from "@/shared/update";
import { addSelected, debounce } from "@/shared/utils";
import { store } from "../../shared/store";
import { useDraggable } from "@/shared/nodeDrag";
import { IconEdit } from "@tabler/icons-solidjs";

type NoteProps = Note & {
  is_child?: boolean;
};

export default (node: NoteProps) => {
  const { startDrag } = useDraggable(node, node.is_child);
  const [editable, setEditable] = createSignal(false);

  let editableDiv!: HTMLDivElement;

  const updateText = debounce((newValue: string) => {
    console.log("Debounced update:", newValue);
    updateNote(node.id, newValue);
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
      onPointerDown={startDrag}
      class="note"
      classList={{
        child_node: node.is_child,
        node: !node.is_child,
        selected_node: store.selectedNodes.has(node.id),
      }}
      id={node.id}
      style={{
        width: node.is_child ? "100%" : node.width + "px",
        background: node.color ? node.color : "",
        "z-index": node.zIndex,
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
      }}
    >
      <Show when={node.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: node.top_strip_color }}
        ></div>
      </Show>

      <div class="p-5 relative">
        <div class="bg-red-400  absolute right-0 top-0 aspect-square">
          <IconEdit />
        </div>

        <span
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onDblClick={(e) => {
            setEditable(true);
            addSelected(e, node.id);
          }}
          onBlur={() => setEditable(false)}
          ref={editableDiv}
          contenteditable={editable()}
          classList={{ "cursor-text active_note_text": editable() }}
          class="note_text flex flex-col focus:outline-0 whitespace-pre-wrap"
        >
          {node.text}
        </span>
      </div>
    </div>
  );
};
