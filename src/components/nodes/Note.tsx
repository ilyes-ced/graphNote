import { createEffect, createSignal, onMount } from "solid-js";
import { Note } from "../../types";
import { updateNote } from "@/shared/update";
import { addSelected, debounce } from "@/shared/utils";
import { BiSolidEditAlt } from "solid-icons/bi";
import Quill from "quill";
import {
  IconBold,
  IconEdit,
  IconItalic,
  IconStrikethrough,
} from "@tabler/icons-solidjs";

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

  let quill: Quill;

  onMount(() => {
    quill = new Quill("#editor", {
      modules: {
        // causes errors
        // syntax: true,
        toolbar: false,
      },
      placeholder: "Compose an epic...",
      // doesnt work without it even tho i want it removed
      theme: undefined,
    });
  });

  return (
    <div class="p-5 relative group">
      <div class="cursor-pointer absolute right-0 top-0 aspect-square p-1 hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 ease-in-out">
        <IconEdit color="#ffffff" size={16} />
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

      <div id="toolbar" class="h-fit">
        <button
          class="border rounded p-2"
          onClick={() => {
            console.log(quill);
            quill.format("color", "red");
            console.log("quill000000");
          }}
        >
          <IconBold color="#459236" size={16} />
        </button>
        <button
          class="border rounded p-2"
          onClick={() => {
            console.log(quill);
            quill.formatText(0, 5, {
              bold: true,
              color: "rgb(0, 0, 255)",
            });
            console.log("quill111111");
          }}
        >
          <IconItalic color="#459236" size={16} />
        </button>
        <button
          class="border rounded p-2"
          onClick={() => {
            console.log(quill);
            quill.format("color", "red");
            console.log("quill222222");
          }}
        >
          <IconStrikethrough color="#459236" size={16} />
        </button>
      </div>

      <div class="border" id="editor"></div>
    </div>
  );
};
