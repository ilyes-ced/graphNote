import { createEffect, createSignal } from "solid-js";
import { Note } from "../../types";
import { updateNote } from "@/shared/update";
import { addSelected, debounce } from "@/shared/utils";
import { BiSolidEditAlt } from "solid-icons/bi";

type NoteProps = Note & {
  is_child?: boolean;
};

export default (node: NoteProps) => {
  const [editable, setEditable] = createSignal(false);

  let editableDiv!: HTMLDivElement;

  const updateText = debounce((newValue: string) => {
    console.log("Debounced update:", newValue);
    // could be nested too
    // update in the update.ts shared file
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
    <div class="p-5 relative group">
      <div
        class="cursor-pointer absolute right-0 top-0 aspect-square p-1 hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover:opacity-100 
           pointer-events-none group-hover:pointer-events-auto 
           transition-all duration-200 ease-in-out"
      >
        <BiSolidEditAlt color="#ffffff" size={16} />
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
  );
};
