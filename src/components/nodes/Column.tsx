import { Show, For, Match, Switch, createSignal } from "solid-js";
import { NodeType, NodeUnion, Column } from "../../types";
import Svg from "./Svg";
import Note from "./Note";
import Todo from "./Todo";
import { SetStoreFunction } from "solid-js/store";
import { useDraggableNode } from "../../shared/useDraggableNode";
import Url from "./Url";
import Board from "./Board";
import Table from "./Table";
import { setStore, store } from "../store";
import { addSelected } from "@/shared/utils";

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
      onClick={(e) => addSelected(e, node.id)}
      ref={setDraggableRef}
      class="column node text-center"
      classList={{ selected_node: store.selectedNodes.has(node.id) }}
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
      <div class="content flex flex-col p-[5px]">
        <div class="collapse_icon self-end w-6 h-6 collapse_icon hover:bg-amber-400 hover:border hover:border-green-500 hover:cursor-pointer flex justify-center items-center">
          <Svg width={16} height={16} classes="" icon_name={"collapse"} />
        </div>
        <div class="title text-base font-extrabold mb-2">{node.title}</div>
        <div class="subtitle mb-4">subtitle</div>

        <div
          class="children_container flex flex-col"
          style={{ position: "relative" }}
        >
          <Show
            when={node.children && node.children.length > 0}
            fallback={
              <div class="empty_children_containe h-[65px] w-full bg-gray-950"></div>
            }
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
                    <Match when={child_node.type === NodeType.Url}>
                      <Url {...child_node} is_child={true} />
                    </Match>
                    <Match when={child_node.type === NodeType.Board}>
                      <Board {...child_node} is_child={true} />
                    </Match>
                    <Match when={child_node.type === NodeType.Table}>
                      <Table {...child_node} is_child={true} />
                    </Match>
                  </Switch>

                  <Show when={index() < node.children.length - 1}>
                    <div class="column_spacer pt-[5px] bg-transparent"></div>
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
