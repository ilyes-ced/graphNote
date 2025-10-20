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
  let editorRef!: HTMLDivElement;

  const updateText = debounce((newValue: string) => {
    console.log("Debounced update:", newValue);
    updateNote(node.id, newValue);
  }, 3000);

  const editor = createTiptapEditor(() => ({
    element: editorRef!,
    onFocus({ editor }) {
      updateZIndex(node.id);
      setStore("noteEditor", editor);
      setStore("activeSidebar", "noteStyles");
    },
    onSelectionUpdate() {
      setStore("activeTags", getActiveTagsAtCursor());
    },
    onUpdate({ editor }) {
      //? there is a short loss of focus when pressing a style for the text to update and for the cursor to focus again so we need this timeout to make sure we get the active tags after the cursor is focused back
      setTimeout(() => {
        setStore("activeTags", getActiveTagsAtCursor());
      }, 0);

      console.log(editor.getJSON());
      const text = editor.getText().trim();
      console.log(text);
      const urlRegex = /^(https?:\/\/[^\s]+)$/;
      console.log(urlRegex.test(text));

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
    content: JSON.parse(node.text),
  }));

  return (
    <div class="p-5">
      {/*JSON.stringify(store.activeTags)*/}

      <div id="editor" ref={editorRef}></div>
    </div>
  );
};
