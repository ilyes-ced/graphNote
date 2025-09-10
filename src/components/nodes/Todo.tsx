import { createSignal, For, Show } from "solid-js";
import { Todo as TodoType } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";

type TodoProps = TodoType & {
  is_child?: boolean;
};

export default (node: TodoProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );

  useDraggableNode(draggableRef, node, node.is_child);

  return (
    <div
      ref={setDraggableRef}
      class="todo p-5"
      classList={{
        child_node: node.is_child,
        node: !node.is_child,
      }}
      id={node.id}
      style={{
        width: node.is_child ? "100%" : node.width + "px",
        background: node.color ? node.color : "var(--default-bg-color)",
        "z-index": node.zIndex,
      }}
    >
      <Show when={node.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: node.top_strip_color }}
        ></div>
      </Show>

      <For each={node.tasks} fallback={<div>Loading...</div>}>
        {(item, index) => (
          <div
            class="checkbox-div"
            onClick={() => {
              console.log("launching click: ", node.id, " ", index());
              // todo: update tasks here
            }}
          >
            <label class="checkbox">
              <input
                class="checkbox__trigger visuallyhidden"
                type="checkbox"
                checked={item.check ? true : false}
              />
              <span class="checkbox__symbol">
                <svg
                  aria-hidden="true"
                  class="icon-checkbox"
                  width="28px"
                  height="28px"
                  viewBox="0 0 28 28"
                >
                  <path d="M4 14l8 7L24 7"></path>
                </svg>
              </span>
              <p class="checkbox__textwrapper">{item.text}</p>
            </label>
          </div>
        )}
      </For>
    </div>
  );
};
