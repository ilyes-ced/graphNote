import { Component, createSignal, For, onCleanup, Show } from "solid-js";
import { Task, Todo as TodoType } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";
import { Checkbox, CheckboxControl, CheckboxLabel } from "../ui/checkbox";
import { addSelected } from "@/shared/utils";
import { setStore, store } from "../store";

type TodoProps = TodoType & {
  is_child?: boolean;
  nested?: number;
};

export default (node: TodoProps) => {
  let startX = 0;
  let startY = 0;

  const startDrag = (e: any) => {
    console.log("starting drag on custom");
    e.preventDefault();
    startX = e.clientX - node.x;
    startY = e.clientY - node.y;

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const onMove = (e: { clientX: number; clientY: number }) => {
    const x = e.clientX - startX;
    const y = e.clientY - startY;

    // setStore("nodes", node.id, "x", x);
    node.x = x;
    // setStore("nodes", node.id, "y", y);
    node.y = y;
  };

  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  onCleanup(() => {
    onUp(); // cleanup if unmounted mid-drag
  });

  return (
    <div
      onPointerDown={startDrag}
      onClick={(e) => addSelected(e, node.id)}
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
        {(task, index) => <TaskItem {...task} />}
      </For>
    </div>
  );
};

const TaskItem: Component<Task> = (props) => {
  //text: string, task: boolean, children: Task[]
  // taskitem classname prevents the checkbox box from being used as drag handle so the click event on the checkbox can trigger
  return (
    <div>
      <Checkbox class="flex items-start space-x-2 py-2">
        <CheckboxControl
          class="taskitem"
          onClick={(e) => {
            // tasklist check update here
            addSelected(e, node.id);
          }}
        />
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
