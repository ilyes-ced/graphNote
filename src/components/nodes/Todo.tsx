import { createSignal, For } from "solid-js";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  createSortable,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { useDragDropContext } from "@thisbeyond/solid-dnd";
import { Task, Todo as TodoType } from "../../types";
import { updateTask } from "@/shared/update";
import { debounce } from "@/shared/utils";
import { IconMenu2 } from "@tabler/icons-solidjs";

// === Types ===
type TodoProps = TodoType & {
  is_child?: boolean;
  nested?: number;
};

type TaskWithId = Task & { _id: string };

type SortableItemProps = {
  task: TaskWithId;
  id: string;
  nodeId: string;
  index: number;
};

type TaskItemProps = TaskWithId & {
  nodeId: string;
  index: number;
};

// === Utils ===
const generateId = (() => {
  let counter = 0;
  return () => `task-id-${counter++}`;
})();

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

const handleKeyDown = (e: KeyboardEvent, index: number) => {
  if (e.key === "Tab") {
    console.log(index);
    e.preventDefault();
    //TODO increase tab
  } else if (e.key === "Backspace") {
    //TODO delete if empty
  }
};

// === Main Component ===
export default (node: TodoProps) => {
  // Wrap tasks with local _id
  const wrapTasksWithIds = (tasks: Task[]): TaskWithId[] =>
    tasks.map((task) => ({ ...task, _id: generateId() }));

  const [items, setItems] = createSignal<TaskWithId[]>(
    wrapTasksWithIds(node.tasks)
  );
  const [activeId, setActiveId] = createSignal<string | null>(null);

  const ids = () => items().map((task) => task._id);

  const onDragStart = ({ draggable }) => {
    setActiveId(draggable.id);
  };

  const onDragEnd = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const fromIndex = ids().indexOf(draggable.id);
      const toIndex = ids().indexOf(droppable.id);

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        const updated = [...items()];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        setItems(updated);
      }
    }

    setActiveId(null);
  };

  return (
    <div class="p-5">
      <div class="text-2xl font-bold mb-4">Task List</div>

      <DragDropProvider
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        collisionDetector={closestCenter}
      >
        <DragDropSensors />

        <SortableProvider ids={ids()}>
          <div class="flex flex-col gap-2">
            <For each={items()}>
              {(task, i) => (
                <SortableItem
                  task={task}
                  id={task._id}
                  nodeId={node.id}
                  index={i()}
                />
              )}
            </For>
          </div>
        </SortableProvider>

        <DragOverlay>
          <div class="sortable bg-red-700 text-white p-4 rounded shadow z-50">
            {activeId()}/tt
          </div>
        </DragOverlay>
      </DragDropProvider>
    </div>
  );
};

// === Sortable Wrapper ===
const SortableItem = (props: SortableItemProps) => {
  const sortable = createSortable(props.id);
  const [state] = useDragDropContext();

  return (
    <div
      use:sortable
      class="sortable group/taskitem flex justify-between"
      classList={{
        "opacity-25": sortable.isActiveDraggable,
        "transition-transform": !!state.active.draggable,
      }}
    >
      <TaskItem {...props.task} index={props.index} nodeId={props.nodeId} />
      <IconMenu2 class="tasklist_handle size-4 cursor-pointer mt-1 transition-opacity duration-200 ease-out opacity-0 group-hover/taskitem:opacity-100 " />
    </div>
  );
};

// === Task UI ===
const TaskItem = (props: TaskItemProps) => {
  return (
    <div
      style={{
        "margin-left": `${props.nestLevel * 18}px`,
      }}
    >
      <div class="flex items-start justify-between">
        <div class="inline-flex items-center space-x-2">
          <Checkbox {...props} />
          <span
            class="taskitem-text cursor-text text-foreground outline-0 overflow-hidden text-ellipsis whitespace-nowrap"
            contentEditable={true}
            onKeyDown={(e) => handleKeyDown(e, props.index)}
            onInput={(e) => {
              handleTaskChange(
                props.nodeId,
                props.index,
                e.currentTarget.textContent || ""
              );
            }}
          >
            {props.text}
          </span>
        </div>
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
        onInput={() =>
          handleTaskChange(props.nodeId, props.index, !props.check)
        }
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
