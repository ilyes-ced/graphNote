import { updateNodeDesc, updateZIndex } from "../../shared/update";
import { debounce } from "../../shared/utils";
import StarterKit from "@tiptap/starter-kit";
import { createTiptapEditor } from "solid-tiptap";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { onCleanup, untrack } from "solid-js";


export default (props: { id: string, desc: string }) => {
    let editorRef!: HTMLDivElement;
    const updateText = debounce((newValue: string) => {
        updateNodeDesc(props.id, newValue);
    }, 300);

    const editor = createTiptapEditor(() => ({
        element: editorRef!,
        editable: true,
        onFocus() {
            updateZIndex(props.id);
        },
        // onBlur({ event }) { },
        onSelectionUpdate() {
        },
        onUpdate({ editor }) {
            updateText(JSON.stringify(editor.getJSON()));
        },
        extensions: [
            StarterKit,
            Highlight,
            Typography,
            TextStyle,
            TextAlign,
        ],
        //? take the value from the store but make it none reactive because we than edit it manually and the same changes are saved to file, the reason for unbinding the reactivity is because when we are focused and make changes those same changes that are written are saved to file/store and are refreshed as if they are new values (bad behaviour)
        content: JSON.parse(untrack(() => props.desc)),
        //? but we need tracked for the undo/redo functionality (the undo/redo func was changed so i dont think is needed anymore)
        // content: JSON.parse(node.text),

    }));





    return (
        <div id="secondaryEditor" class="p-2 border" ref={editorRef}></div>
    );
};
