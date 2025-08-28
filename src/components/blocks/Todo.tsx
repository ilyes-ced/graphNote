import { For, Show } from "solid-js";
import "../../css/Todo.css";
import { Todo as TodoType } from "../../types";

type TodoProps = TodoType & {
  check_task?: (block_id: string, task_index: number) => void;
};

export default (block: TodoProps) => {
  return (
    <div
      class="todo"
      id={block.id}
      style={{
        width: block.width + "px",
        background: block.color,
        position: "absolute",
        transform: `translateX(${block.x}px) translateY(${block.y}px)`,
      }}
    >
      <Show when={block.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: block.top_strip_color }}
        ></div>
      </Show>

      <ul id="myUL">
        <For each={block.tasks} fallback={<div>Loading...</div>}>
          {(item, index) => (
            <div
              class="checkbox-div"
              onClick={() => {
                console.log("launching click: ", block.id, " ", index());

                block.check_task?.(block.id, index());
              }}
            >
              <input
                onClick={(e) => console.log("e.currentTarget")}
                type="checkbox"
                name={"task_" + index}
                checked={item.check ? true : false}
              />
              <label class="cbx" for={"task_" + index}></label>
              <label class="lbl" for={"task_" + index}>
                {item.text}
              </label>
            </div>
          )}
        </For>
      </ul>
    </div>
  );
};
