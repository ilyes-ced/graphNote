import { Component, For } from "solid-js";
import { Task, Todo as TodoType } from "../../types";
import { updateTask } from "@/shared/update";
import { debounce } from "@/shared/utils";
import { IconMenu2 } from "@tabler/icons-solidjs";

type TodoProps = TodoType & {
  is_child?: boolean;
  nested?: number;
};

const updateTaskDebounce = debounce(
  (nodeId: string, index: number, value: string | boolean) => {
    updateTask(nodeId, value, index);
  },
  3000
);

const handleTaskChange = (
  nodeId: string,
  index: number,
  value: string | boolean
) => {
  updateTaskDebounce(nodeId, index, value);
};

export default (node: TodoProps) => {
  return (
    <div class="p-5">
      <h1>title</h1>

      <For each={node.tasks} fallback={<div>Loading...</div>}>
        {(task, index) => (
          <TaskItem {...task} nodeId={node.id} index={index()} />
        )}
      </For>
    </div>
  );
};

type TaskItemProps = Task & {
  nodeId: string;
  index: number;
};
const TaskItem: Component<Task> = (props: TaskItemProps) => {
  //text: string, task: boolean, children: Task[]
  // taskitem classname prevents the checkbox box from being used as drag handle so the click event on the checkbox can trigger
  return (
    <div style={{ "margin-left": `${props.nestLevel * 18}px` }}>
      <div class="flex items-start justify-between">
        <div class="inline-flex items-start">
          <label class="checkbox-check flex items-center cursor-pointer relative pt-[2px]">
            <input
              type="checkbox"
              checked={props.check}
              onInput={() => {
                handleTaskChange(props.nodeId, props.index, !props.check);
              }}
              class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border-2 border-foreground checked:bg-primary/80 checked:border-primary"
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
          </label>
          <span
            class="taskitem-text cursor-text text-foreground outline-0 overflow-hidden text-ellipsis whitespace-nowrap ml-2"
            contentEditable={true}
            onInput={(e) => {
              handleTaskChange(
                props.nodeId,
                props.index,
                e.currentTarget.textContent
              );
            }}
          >
            {props.text}
          </span>
        </div>

        <IconMenu2 class="order_tasklist h-full cursor-pointer pt-[3px]" />
      </div>
    </div>
  );
};
