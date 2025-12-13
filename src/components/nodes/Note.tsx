import { Note } from "../../types";
import { changeToUrlNode, updateNote, updateZIndex } from "@/shared/update";
import { debounce } from "@/shared/utils";

import StarterKit from "@tiptap/starter-kit";
import { createTiptapEditor } from "solid-tiptap";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";

import { setStore } from "../../shared/store";
import { createSignal, untrack } from "solid-js";

type NoteProps = Note & {
  is_child?: boolean;
};

function getClosestTags(node: Node | null): string[] {
  const tags: string[] = [];

  while (node && node.nodeType === 1) {
    const tag = (node as HTMLElement).tagName.toLowerCase();
    if (tag === "div") break;
    tags.push(tag);
    node = node.parentNode;
  }

  return tags;
}
function getActiveTagsAtCursor(): string[] {
  const selection = window.getSelection();
  if (!selection || !selection.focusNode) return [];

  const node = selection.focusNode;

  const element =
    node.nodeType === 3 ? node.parentElement : (node as HTMLElement);

  return getClosestTags(element);
}

export default (node: NoteProps) => {
  const [editable, setEditable] = createSignal(false);
  let editorRef!: HTMLDivElement;

  const updateText = debounce((newValue: string) => {
    console.log("Debounced update:", newValue);
    updateNote(node.id, newValue);
  }, 300);

  const editor = createTiptapEditor(() => ({
    element: editorRef!,
    editable: editable(),
    onFocus({ editor }) {
      if (!editable()) return;
      updateZIndex(node.id);
      setStore("noteEditor", editor);
      setStore("activeSidebar", "noteStyles");
    },
    onBlur({ event }) {
      // Ignore blur caused by clicking inside Tiptap’s UI (menus, buttons)
      if (event?.relatedTarget instanceof HTMLElement) {
        const el = event.relatedTarget;
        if (editorRef.contains(el)) return;
      }

      // Disable editing again
      setEditable(false);
    },

    onSelectionUpdate() {
      setStore("activeTags", getActiveTagsAtCursor());
    },
    onUpdate({ editor }) {
      if (!editable()) return;
      //? there is a short loss of focus when pressing a style for the text to update and for the cursor to focus again so we need this timeout to make sure we get the active tags after the cursor is focused back
      setTimeout(() => {
        setStore("activeTags", getActiveTagsAtCursor());
      }, 0);

      const text = editor.getText().trim();
      const urlRegex = /^(https?:\/\/[^\s]+)$/;
      if (urlRegex.test(text)) {
        console.log("here we change this this note node to a url node");
        changeToUrlNode(node.id, text);
      } else {
        updateText(JSON.stringify(editor.getJSON()));
      }
    },
    extensions: [
      StarterKit,
      // Strike,
      // Underline,
      // Paragraph,
      // Text,
      // Blockquote,
      Highlight,
      Typography,
      TextStyle,
      // Heading.configure({
      //   levels: [1, 2, 3, 4, 5, 6],
      // }),
      // BulletList,
      // OrderedList,
      // ListItem,
      TextAlign,
    ],
    //? take the value from the store but make it none reactive because we than edit it manually and the same changes are saved to file, the reason for unbinding the reactivity is because when we are focused and make changes those same changes that are written are saved to file/store and are refreshed as if they are new values (bad behaviour)
    content: JSON.parse(untrack(() => node.text)),
  }));

  const activateEditor = () => {
    if (editable()) return;

    setEditable(true);
    editor()?.setEditable(true);
    editor()?.commands.focus("end");
  };

  return (
    <div class="p-5" ondblclick={activateEditor}>
      {/*JSON.stringify(store.activeTags)*/}

      <div id={editable() ? "editor" : ""} ref={editorRef}></div>
    </div>
  );
};
