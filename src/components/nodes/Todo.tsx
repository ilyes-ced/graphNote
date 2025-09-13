import { Component, createSignal, For, Show } from "solid-js";
import { Task, Todo as TodoType } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";
import {
  Checkbox,
  CheckboxControl,
  CheckboxDescription,
  CheckboxErrorMessage,
  CheckboxLabel,
} from "../ui/checkbox";

type TodoProps = TodoType & {
  is_child?: boolean;
  nested?: number;
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
        "child_node w-full": node.is_child,
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
        {(task, index) => <TaskItem {...task} />}
      </For>
    </div>
  );
};

const TaskItem: Component<Task> = (props) => {
  //text: string, task: boolean, children: Task[]

  return (
    <div>
      <Checkbox class="flex items-start space-x-2 py-2">
        <CheckboxControl />
        <div class="grid gap-1.5 leading-none">
          <CheckboxLabel class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {props.text}
          </CheckboxLabel>
        </div>
      </Checkbox>
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
