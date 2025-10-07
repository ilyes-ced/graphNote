import { createEffect, createSignal, onMount } from "solid-js";
import { Note } from "../../types";
import { updateNote } from "@/shared/update";
import { addSelected, debounce } from "@/shared/utils";

import StarterKit from "@tiptap/starter-kit";
import {
  createEditorTransaction,
  createTiptapEditor,
  useEditorIsActive,
} from "solid-tiptap";
import Blockquote from "@tiptap/extension-blockquote";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";

import {
  IconBold,
  IconEdit,
  IconItalic,
  IconStrikethrough,
} from "@tabler/icons-solidjs";
import { setStore, store } from "../../shared/store";

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
      setStore("noteEditor", editor);
      setStore("activeSidebar", "noteStyles");
    },
    onSelectionUpdate() {
      setStore("activeTags", getActiveTagsAtCursor());
    },
    onBlur() {
      // there is
      // setStore("activeSidebar", "nodes");
    },
    onUpdate({ editor }) {
      //? there is a short loss of focus when pressing a style for the text to update and for the cursor to focus again so we need this timeout to make sure we get the active tags after the cursor is focused back
      setTimeout(() => {
        setStore("activeTags", getActiveTagsAtCursor());
      }, 0);
      updateText(JSON.stringify(editor.getJSON()));
    },
    extensions: [
      StarterKit,
      Strike,
      Underline,
      Paragraph,
      Text,
      Blockquote,
      Highlight,
      Typography,
      TextStyle,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      BulletList,
      OrderedList,
      ListItem,
      TextAlign,
    ],
    content: JSON.parse(node.text),
  }));

  return (
    <div class="p-5 ">
      {/*JSON.stringify(store.activeTags)*/}

      <div
        class="focus:outline-none focus:ring-0 focus:border-none"
        id="editor"
        ref={editorRef}
      ></div>
    </div>
  );
};
