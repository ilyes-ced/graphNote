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
        content: JSON.parse(untrack(() => props.desc)),
    }));


    onCleanup(() => {
        editor()?.destroy();
    });


    return (
        <div id="secondaryEditor" class="" ref={editorRef}></div>
    );
};
