import { Show, For, Match, Switch, createSignal } from "solid-js";
import "../../css/Column.css";
import { NodeType, NodeUnion, Column } from "../../types";
import Svg from "./Svg";
import Note from "./Note";
import Todo from "./Todo";
import { SetStoreFunction } from "solid-js/store";
import { useDraggableNode } from "../../shared/useDraggableNode";

type ColumnProps = Column & {
  check_task?: (node_id: string, task_index: number) => void;
  setnodes: SetStoreFunction<NodeUnion[]>;
};
export default (node: ColumnProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );
  useDraggableNode(draggableRef, node);

  return (
    <div
      ref={setDraggableRef}
      class="column node"
      id={node.id}
      style={{
        width: node.width + "px",
        background: node.color, //? if this doesnt exist, .node in App.css will take care of it
        "z-index": node.zIndex,
      }}
    >
      <Show when={node.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: node.top_strip_color }}
        ></div>
      </Show>

      <div class="content">
        <div class="collapse_icon">
          <Svg width={16} height={16} classes="" icon_name={"collapse"} />
        </div>
        <div class="title">{node.title}</div>
        <div class="subtitle">subtitle</div>

        <div class="children_container">
          <Show
            when={node.children && node.children.length > 0}
            fallback={<div class="empty_children_container"></div>}
          >
            <For each={node.children}>
              {(child_node, index) => (
                <>
                  <Switch fallback={<div>Not Found</div>}>
                    <Match when={child_node.type === NodeType.Note}>
                      <Note {...child_node} is_child={true} />
                    </Match>
                    <Match when={child_node.type === NodeType.Todo}>
                      <Todo {...child_node} is_child={true} />
                    </Match>
                  </Switch>

                  <Show when={index() < node.children.length - 1}>
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
