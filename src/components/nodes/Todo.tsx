import { Component, For, Show } from "solid-js";
import { Task, Todo as TodoType } from "../../types";
import { store } from "../store";
import { useDraggable } from "@/shared/nodeDrag";
import { VsThreeBars } from "solid-icons/vs";

type TodoProps = TodoType & {
  is_child?: boolean;
  nested?: number;
};

export default (node: TodoProps) => {
  const { startDrag } = useDraggable(node, node.is_child, {
    classes: ["taskitem", "taskitem-text"],
  });

  const handleTextChange = () => {
    // update text on tasks
  };
  const handleCheck = () => {
    // update checked tasks
  };

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
        background: node.color ? node.color : "",
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
      <div class="flex items-start justify-between">
        <div class="inline-flex items-start">
          <label class="flex items-center cursor-pointer relative pt-[2px]">
            <input
              type="checkbox"
              checked
              class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
              id="check7"
            />
            <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="1"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </label>{" "}
          <span
            class="taskitem-text cursor-text text-foreground outline-0 overflow-hidden text-ellipsis whitespace-nowrap ml-2"
            contentEditable={true}
          >
            {props.text}
          </span>
        </div>

        <VsThreeBars class="order_tasklist h-full cursor-pointer pt-[3px]" />
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
