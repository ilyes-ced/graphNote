import { For, Show } from "solid-js";
import "../../css/Todo.css";
import { Todo as TodoType } from "../../types";

type TodoProps = TodoType & {
  check_task?: (block_id: string, task_index: number) => void;
  is_child?: boolean;
};

export default (block: TodoProps) => {
  console.log("from inside the todo nested : ", block.is_child);
  return (
    <div
      class={block.is_child ? "todo child_block" : "todo block"}
      id={block.id}
      style={{
        width: block.is_child ? "100%" : block.width + "px",
        background: block.color ? block.color : "var(--default-bg-color)", // doesnt work the var()
        position: block.is_child ? "static" : "absolute",
        top: `${block.x}px`,
        left: `${block.y}px`,
      }}
    >
      <Show when={block.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: block.top_strip_color }}
        ></div>
      </Show>

      <For each={block.tasks} fallback={<div>Loading...</div>}>
        {(item, index) => (
          <div
            class="checkbox-div"
            onClick={() => {
              console.log("launching click: ", block.id, " ", index());

              block.check_task?.(block.id, index());
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
