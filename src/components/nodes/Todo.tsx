import { Component, createSignal, For, JSX, onCleanup, Show } from "solid-js";
import { Task, Todo as TodoType } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";
import { Checkbox, CheckboxControl, CheckboxLabel } from "../ui/checkbox";
import { addSelected } from "@/shared/utils";
import { setStore, store } from "../store";
import { useDraggable } from "@/shared/nodeDrag";

type TodoProps = TodoType & {
  is_child?: boolean;
  nested?: number;
};

export default (node: TodoProps) => {
  const { startDrag } = useDraggable(node, node.is_child);

  return (
    <div
      onPointerDown={startDrag}
      class="todo p-5"
      classList={{
        "child_node w-full": node.is_child,
        node: !node.is_child,
        selected_node: store.selectedNodes.has(node.id),
      }}
      id={node.id}
      style={{
        width: node.is_child ? "100%" : node.width + "px",
        background: node.color ? node.color : "var(--default-bg-color)",
        "z-index": node.zIndex,
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
      }}
    >
      <Show when={node.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: node.top_strip_color }}
        ></div>
      </Show>

      <For each={node.tasks} fallback={<div>Loading...</div>}>
        {(task, index) => <TaskItem {...task} nodeId={node.id} />}
      </For>
    </div>
  );
};

const TaskItem: Component<Task> = (props: any, nodeId: string) => {
  //text: string, task: boolean, children: Task[]
  // taskitem classname prevents the checkbox box from being used as drag handle so the click event on the checkbox can trigger
  return (
    <div>
      <div class="flex items-center">
        <label class="taskitem inline-flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" class="peer hidden" />
          <div class="w-5 h-5 rounded border border-gray-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 relative">
            <svg
              class="absolute inset-0 w-full h-full text-white scale-75 opacity-0 peer-checked:opacity-100"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="text-gray-700">Label</span>
        </label>
      </div>

      <Show when={props.children?.length > 0}>
        <For each={props.children} fallback={<div>Loading...</div>}>
          {(childTask, index) => (
            <div class="ml-4">
              <TaskItem {...childTask} />
            </div>
          )}
        </For>
      </Show>
    </div>
  );
};
