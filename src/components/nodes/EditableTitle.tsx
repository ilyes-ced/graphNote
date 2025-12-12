import { createSignal } from "solid-js";
import { setStore } from "../../shared/store";
import { updateNodeTitle } from "@/shared/update";
import { debounce } from "@/shared/utils";

export default (props: { nodeId: string; title: string }) => {
  const [editable, setEditable] = createSignal<boolean>(false);

  let editableDiv!: HTMLDivElement;

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
        // focus on the click locatiomn
        setTimeout(() => editableDiv.focus(), 0);
      }}
      style={{
        cursor: editable() ? "text" : "",
      }}
      onBlur={() => setEditable(false)}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
    >
      {props.title}
    </div>
  );
};
