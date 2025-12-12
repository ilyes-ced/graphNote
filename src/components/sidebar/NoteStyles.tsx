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
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustified,
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

  { name: "alignLeft", icon: IconAlignLeft },
  { name: "alignCenter", icon: IconAlignCenter },
  { name: "alignRight", icon: IconAlignRight },
  { name: "alignJustify", icon: IconAlignJustified },
];

export default () => {
  return (
    <div class="h-full overflow-hidden w-[65px] py-4 flex justify-center bg-card">
      <div class="flex flex-col space-y-4 relative">
        <div class="h-full overflow-hidden space-y-2">
          <For each={stylesIcons} fallback={<div>Loading...</div>}>
            {(icon) => (
              <div>
                <button
                  class="icon cursor-pointer flex flex-col justify-center items-center z-10 bg-accent aspect-square  hover:bg-muted-foreground transition-colors duration-150 ease-in-out"
                  classList={{
                    "bg-primary": store.noteEditor
                      ? isStyleActive(store.noteEditor, icon.name)
                      : false,
                  }}
                  onClick={() => {
                    const editor = store.noteEditor;
                    if (editor) toggle(editor, icon.name);
                  }}
                >
                  <div class="flex flex-col size-full p-2">
                    <icon.icon />
                  </div>
                </button>
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
    case "alignLeft":
      editor.chain().focus().setTextAlign("left").run();
      break;
    case "alignCenter":
      editor.chain().focus().setTextAlign("center").run();
      break;
    case "alignRight":
      editor.chain().focus().setTextAlign("right").run();
      break;
    case "alignJustify":
      editor.chain().focus().setTextAlign("justify").run();
      break;
    default:
      console.warn("Unhandled action:", togglable);
  }
};

const isStyleActive = (editor: Editor, togglable: string): boolean => {
  switch (togglable) {
    case "bold":
      return (
        store.activeTags.includes("strong") || store.activeTags.includes("b")
      );
    case "italic":
      return store.activeTags.includes("em") || store.activeTags.includes("i");
    case "underline":
      return store.activeTags.includes("u");
    case "strike":
      return store.activeTags.includes("s") || store.activeTags.includes("del");
    case "paragraph":
      return store.activeTags.includes("p");
    case "header 1":
      return store.activeTags.includes("h1");
    case "header 2":
      return store.activeTags.includes("h2");
    case "header 3":
      return store.activeTags.includes("h3");
    case "header 4":
      return store.activeTags.includes("h4");
    case "header 5":
      return store.activeTags.includes("h5");
    case "header 6":
      return store.activeTags.includes("h6");
    case "list":
      return store.activeTags.includes("ul");
    case "numberedList":
      return store.activeTags.includes("ol");
    case "codeBlock":
      return store.activeTags.includes("pre");
    case "blockQuote":
      return store.activeTags.includes("blockquote");
    case "verticalRule":
      return store.activeTags.includes("hr");

    case "alignLeft":
      return false;
    case "alignCenter":
      return false;
    case "alignRight":
      return false;
    case "alignJustify":
      return false;
    default:
      console.warn("Unhandled action:", togglable);
      return false;
  }
};
