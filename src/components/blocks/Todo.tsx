import { createSignal, For, Show } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { BlockUnion, Todo as TodoType } from "../../types";
import { useDraggableBlock } from "../../shared/useDraggableBlock";
import "../../css/Todo.css";
import { updateTasks } from "../../shared/update";

type TodoProps = TodoType & {
  is_child?: boolean;
  setBlocks: SetStoreFunction<BlockUnion[]>;
};

export default (block: TodoProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );
  useDraggableBlock(draggableRef, block, block.setBlocks);

  return (
    <div
      ref={setDraggableRef}
      class={block.is_child ? "todo child_block" : "todo block"}
      id={block.id}
      style={{
        width: block.is_child ? "100%" : block.width + "px",
        background: block.color ? block.color : "var(--default-bg-color)", // doesnt work the var()

        // position: block.is_child ? "static" : "absolute",
        // top: `${block.x}px`,
        // left: `${block.y}px`,
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

              updateTasks?.(block.id, index(), block.setBlocks);
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
