import { Show, For, Match, Switch, createSignal } from "solid-js";
import { NodeType, Column } from "../../types";
import Svg from "./Svg";
import Note from "./Note";
import Todo from "./Todo";
import Url from "./Url";
import Board from "./Board";
import Table from "./Table";
import { setStore, store } from "../../shared/store";
import Image from "../nodes/Image";
import NodeWrapper from "../core/NodeWrapper";
import Color from "../nodes/Color";
import Activity from "../nodes/Activity";
import { updateColumnTitle } from "@/shared/update";
import { debounce } from "@/shared/utils";
import Document from "../nodes/Document";

export default (node: Column) => {
  const [editable, setEditable] = createSignal<boolean>(false);

  let editableDiv!: HTMLDivElement;

  const updateTitle = debounce((newValue: string) => {
    console.log("Debounced update:", newValue);
    updateColumnTitle(node.id, newValue);
  }, 3000);

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
    <div class="content flex flex-col p-2">
      <div
        class="collapse_icon self-end w-6 h-6 collapse_icon cursor-pointer flex justify-center items-center hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/collapse:opacity-100 
           pointer-events-none group-hover/collapse:pointer-events-auto 
           transition-all duration-200 ease-in-out"
      >
        <Svg width={16} height={16} classes="" icon_name={"collapse"} />
      </div>
      <div
        ref={editableDiv}
        class="title text-xl font-extrabold mb-2 text-center focus:outline-0"
        classList={{ titleHandle: editable() }}
        contentEditable={editable()}
        onClick={() => {
          setEditable(true);
          setStore("selectedNodes", new Set());
        }}
        style={{
          cursor: editable() ? "text" : "",
        }}
        onBlur={() => setEditable(false)}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      >
        {node.title}
      </div>
      <div class="subtitle mb-4 text-center">subtitle</div>
      <div
        class="children_container flex flex-col"
        style={{ position: "relative" }}
      >
        <Show
          when={store.nodes[node.id] && store.nodes[node.id].length > 0}
          fallback={
            <div class="empty_children_containe h-[65px] w-full bg-gray-950"></div>
          }
        >
          <For each={store.nodes[node.id]}>
            {(child_node, index) => (
              <>
                {child_node.type === NodeType.Board ? (
                  <Board {...child_node} is_child={true} />
                ) : (
                  <NodeWrapper node={child_node} isChildNode={true}>
                    <Switch fallback={<div>Not Found</div>}>
                      <Match when={child_node.type === NodeType.Note}>
                        <Note {...child_node} />
                      </Match>
                      <Match when={child_node.type === NodeType.Todo}>
                        <Todo {...child_node} />
                      </Match>
                      <Match when={child_node.type === NodeType.Url}>
                        <Url {...child_node} />
                      </Match>
                      <Match when={child_node.type === NodeType.Table}>
                        <Table {...child_node} />
                      </Match>
                      <Match when={child_node.type === NodeType.Image}>
                        <Image {...child_node} />
                      </Match>
                      <Match when={child_node.type === NodeType.Color}>
                        <Color {...child_node} />
                      </Match>
                      <Match when={child_node.type === NodeType.Activity}>
                        <Activity {...child_node} />
                      </Match>
                      <Match when={child_node.type === NodeType.Document}>
                        <Document {...child_node} />
                      </Match>
                    </Switch>
                  </NodeWrapper>
                )}

                <Show when={index() < store.nodes[node.id].length - 1}>
                  <div class="column_spacer pt-2 bg-transparent"></div>
                </Show>
              </>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};
