import { Editor } from "@tiptap/core";
import { createContext } from "solid-js";

export const EditorContext = createContext<Editor | undefined>(undefined);
