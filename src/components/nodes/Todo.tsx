import { createSignal, For, onMount } from "solid-js";
import { Task, Todo as TodoType } from "../../types";
import { updateTask } from "@/shared/update";
import { debounce } from "@/shared/utils";
import { IconMenu2 } from "@tabler/icons-solidjs";

type TodoProps = TodoType & {
  is_child?: boolean;
  nested?: number;
};

let todoRef!: HTMLDivElement;

const updateTaskDebounce = debounce(
  (nodeId: string, index: number, value: string | boolean) => {
    updateTask(nodeId, value, index);
  },
  3000
);

// isDragging, x, y

const pointerDownHandle = (e: PointerEvent, nodeId: string, index: number) => {
  const rect = todoRef.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  setMovingIndex(index);
  setDragging((prev) =>
    prev.map((item, i) =>
      i === index ? { ...item, ...{ drag: true, x: x, y: y } } : item
    )
  );

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
};

const onMove = (e: PointerEvent) => {
  const rect = todoRef.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  setDragging((prev) =>
    prev.map((item, i) =>
      i === movingIndex() ? { ...item, ...{ x: x, y: y } } : item
    )
  );
};

const onUp = (e: PointerEvent) => {
  setDragging((prev) =>
    prev.map((item, i) =>
      i === movingIndex() ? { ...item, ...{ drag: false, x: 0, y: 0 } } : item
    )
  );
  window.removeEventListener("pointermove", onMove);
  window.removeEventListener("pointerup", onUp);
};

const handleTaskChange = (
  nodeId: string,
  index: number,
  value: string | boolean
) => {
  updateTaskDebounce(nodeId, index, value);
};

const [dragging, setDragging] = createSignal<
  {
    drag: boolean;
    x: number;
    y: number;
  }[]
>([]);
const [movingIndex, setMovingIndex] = createSignal<number>();

export default (node: TodoProps) => {
  onMount(() => {
    console.log(
      Array.from({ length: node.tasks.length }, () => ({
        drag: false,
        x: 0,
        y: 0,
      }))
    );
    setDragging(
      Array.from({ length: node.tasks.length }, () => ({
        drag: false,
        x: 0,
        y: 0,
      }))
    );
  });

  return (
    <div ref={todoRef} class="p-5 relative">
      {JSON.stringify(dragging())}
      <div class="text-2xl font-bold">title</div>

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

const TaskItem = (props: TaskItemProps) => {
  //text: string, task: boolean, children: Task[]
  // taskitem classname prevents the checkbox box from being used as drag handle so the click event on the checkbox can trigger
  return (
    <div
      id={`task_${props.nodeId}_${props.index}`}
      style={{
        "margin-left": `${props.nestLevel * 18}px`,
        position: dragging()[props.index]?.drag ? "absolute" : "static",
        top: `${dragging()[props.index]?.y}px`,
        left: `${dragging()[props.index]?.x}px`,
      }}
    >
      <div class="flex items-start justify-between  group/taskitem">
        <div class="inline-flex items-center space-x-2">
          <Checkbox {...props} />
          <span
            class="taskitem-text cursor-text text-foreground outline-0 overflow-hidden text-ellipsis whitespace-nowrap"
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

        <IconMenu2
          onPointerDown={(e) => {
            pointerDownHandle(e, props.nodeId, props.index);
          }}
          class="tasklist_handle size-4 cursor-pointer mt-1 transition-opacity duration-200 ease-out opacity-0 group-hover/taskitem:opacity-100"
        />
      </div>
    </div>
  );
};

const Checkbox = (props: TaskItemProps) => {
  return (
    <label class="checkbox-check flex items-center cursor-pointer relative">
      <input
        type="checkbox"
        checked={props.check}
        onInput={() => {
          handleTaskChange(props.nodeId, props.index, !props.check);
        }}
        class="peer size-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-foreground checked:bg-primary/80 checked:border-primary"
      />
      <span class="absolute text-white opacity-0 peer-checked:opacity-100 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-3/4"
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
  );
};
