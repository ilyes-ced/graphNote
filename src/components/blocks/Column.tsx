import { Show, For, Match, Switch, createSignal } from "solid-js";
import "../../css/Column.css";
import { Block_type, BlockUnion, Column } from "../../types";
import Svg from "./Svg";
import Note from "./Note";
import Todo from "./Todo";
import { SetStoreFunction } from "solid-js/store";
import { useDraggableBlock } from "../../shared/useDraggableBlock";

type ColumnProps = Column & {
  check_task?: (block_id: string, task_index: number) => void;
  setBlocks: SetStoreFunction<BlockUnion[]>;
};
export default (block: ColumnProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );
  useDraggableBlock(draggableRef, block, block.setBlocks);

  return (
    <div
      ref={setDraggableRef}
      class="column block"
      id={block.id}
      style={{
        width: block.width + "px",
        background: block.color, //? if this doesnt exist, .block in App.css will take care of it
      }}
    >
      <Show when={block.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: block.top_strip_color }}
        ></div>
      </Show>

      <div class="content">
        <div class="collapse_icon">
          <Svg width={16} height={16} classes="" icon_name={"collapse"} />
        </div>
        <div class="title">{block.title}</div>
        <div class="subtitle">subtitle</div>

        <div class="children_container">
          <Show
            when={block.children && block.children.length > 0}
            fallback={<div class="empty_children_container"></div>}
          >
            <For each={block.children}>
              {(child_block, index) => (
                <>
                  <Switch fallback={<div>Not Found</div>}>
                    <Match when={child_block.type === Block_type.Note}>
                      <Note {...child_block} is_child={true} />
                    </Match>
                    <Match when={child_block.type === Block_type.Todo}>
                      <Todo {...child_block} is_child={true} />
                    </Match>
                  </Switch>

                  <Show when={index() < block.children.length - 1}>
                    <div class="column_spacer"></div>
                  </Show>
                </>
              )}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
};
