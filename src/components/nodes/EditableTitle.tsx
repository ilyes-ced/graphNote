import { createSignal, untrack } from "solid-js";
import { setStore } from "../../shared/store";
import { updateNodeTitle } from "@/shared/update";
import { debounce } from "@/shared/utils";

export default (props: { nodeId: string; title: string }) => {
  const [editable, setEditable] = createSignal<boolean>(false);

  let editableDiv!: HTMLDivElement;

  const placeCaretAtEnd = (el: HTMLElement) => {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(el);
    range.collapse(false); // false = end

    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const updateTitle = debounce((newValue: string) => {
    console.log("Debounced update:", newValue);
    updateNodeTitle(props.nodeId, newValue);
  }, 300);

  const handleInput = () => {
    const newText = editableDiv?.innerText || "";
    updateTitle(newText);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents new line
    }
  };

  return (
    <div
      class="outline-0"
      ref={editableDiv}
      classList={{ titleHandle: editable() }}
      contentEditable={editable()}
      onDblClick={() => {
        setEditable(true);
        setStore("selectedNodes", new Set());

        setTimeout(() => {
          editableDiv.focus();
          placeCaretAtEnd(editableDiv);
        }, 0);
      }}
      style={{
        cursor: editable() ? "text" : "",
      }}
      onBlur={() => setEditable(false)}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
    >
      {untrack(() => props.title)}
    </div>
  );
};
