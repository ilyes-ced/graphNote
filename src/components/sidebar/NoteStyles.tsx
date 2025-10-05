import { store } from "@/shared/store";
import { Editor } from "@tiptap/core";
import { For } from "solid-js";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBlockquote,
  IconBold,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconItalic,
  IconList,
  IconListNumbers,
  IconPilcrow,
  IconSpacingVertical,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-solidjs";

const stylesIcons = [
  { name: "bold", icon: IconBold },
  { name: "italic", icon: IconItalic },
  { name: "underline", icon: IconUnderline },
  { name: "strike", icon: IconStrikethrough },
  { name: "paragraph", icon: IconPilcrow },
  { name: "header 1", icon: IconH1, attrs: { level: 1 } },
  { name: "header 2", icon: IconH2, attrs: { level: 2 } },
  { name: "header 3", icon: IconH3, attrs: { level: 3 } },
  { name: "header 4", icon: IconH4, attrs: { level: 4 } },
  { name: "header 5", icon: IconH5, attrs: { level: 5 } },
  { name: "header 6", icon: IconH6, attrs: { level: 6 } },
  { name: "list", icon: IconList },
  { name: "numberedList", icon: IconListNumbers },
  { name: "codeBlock", icon: IconCode },
  { name: "blockQuote", icon: IconBlockquote },
  { name: "verticalRule", icon: IconSpacingVertical },

  { name: "left", icon: IconSpacingVertical },
  { name: "center", icon: IconSpacingVertical },
  { name: "right", icon: IconSpacingVertical },
  { name: "justify", icon: IconSpacingVertical },
];

export default () => {
  return (
    <div class="h-full overflow-hidden w-[65px] p-4 bg-card">
      <div class="flex flex-col space-y-4 overflow-x-visible relative">
        <div class="h-full overflow-auto space-y-2">
          <For each={stylesIcons} fallback={<div>Loading...</div>}>
            {(icon) => (
              <div>
                <button
                  class="icon rounded cursor-pointer flex flex-col justify-center items-center z-10 bg-accent aspect-square hover:bg-primary"
                  classList={{
                    "bg-primary": store.noteEditor
                      ? isStyleActive(store.noteEditor, icon.name)
                      : false,
                  }}
                  onClick={() => {
                    console.log("Clicked italic in sidebar");
                    const editor = store.noteEditor;
                    if (editor) {
                      //editor.chain().focus().toggleItalic().run();
                      toggle(editor, icon.name);
                    } else {
                      console.warn("Editor is not yet ready");
                    }
                  }}
                >
                  <div class="flex flex-col size-full p-2">
                    <icon.icon />
                  </div>
                </button>
                <p class="text-sm text-center overflow-visible">{icon.name}</p>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

const toggle = (editor: Editor, togglable: string) => {
  switch (togglable) {
    case "bold":
      editor.chain().focus().toggleBold().run();
      break;
    case "italic":
      editor.chain().focus().toggleItalic().run();
      break;
    case "underline":
      editor.chain().focus().toggleUnderline().run();
      break;
    case "strike":
      editor.chain().focus().toggleStrike().run();
      break;
    case "paragraph":
      editor.chain().focus().setParagraph().run();
      break;
    case "header 1":
      editor.chain().focus().toggleHeading({ level: 1 }).run();
      break;
    case "header 2":
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      break;
    case "header 3":
      editor.chain().focus().toggleHeading({ level: 3 }).run();
      break;
    case "header 4":
      editor.chain().focus().toggleHeading({ level: 4 }).run();
      break;
    case "header 5":
      editor.chain().focus().toggleHeading({ level: 5 }).run();
      break;
    case "header 6":
      editor.chain().focus().toggleHeading({ level: 6 }).run();
      break;
    case "list":
      editor.chain().focus().toggleBulletList().run();
      break;
    case "numberedList":
      editor.chain().focus().toggleOrderedList().run();
      break;
    case "codeBlock":
      editor.chain().focus().toggleCodeBlock().run();
      break;
    case "blockQuote":
      editor.chain().focus().toggleBlockquote().run();
      break;
    case "verticalRule":
      editor.chain().focus().setHorizontalRule().run();
      break;
    case "undo":
      editor.chain().focus().undo().run();
      break;
    case "redo":
      editor.chain().focus().redo().run();
      break;
    default:
      console.warn("Unhandled action:", togglable);
  }
};

const isStyleActive = (editor: Editor, togglable: string): boolean => {
  switch (togglable) {
    case "bold":
      return editor.isActive("bold");
    case "italic":
      return editor.isActive("italic");
    case "underline":
      return editor.isActive("underline");
    case "strike":
      return editor.isActive("strike");
    case "paragraph":
      return editor.isActive("paragraph");
    case "header 1":
      return editor.isActive("heading", { level: 1 });
    case "header 2":
      return editor.isActive("heading", { level: 2 });
    case "header 3":
      return editor.isActive("heading", { level: 3 });
    case "header 4":
      return editor.isActive("heading", { level: 4 });
    case "header 5":
      return editor.isActive("heading", { level: 5 });
    case "header 6":
      return editor.isActive("heading", { level: 6 });
    case "list":
      return false;
    case "numberedList":
      return false;
    case "codeBlock":
      return false;
    case "blockQuote":
      return false;
    case "verticalRule":
      return false;
    case "undo":
      return false;
    case "redo":
      return false;
    default:
      console.warn("Unhandled action:", togglable);
      return false;
  }
};
