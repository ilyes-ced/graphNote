import { createSignal, For, from } from "solid-js";
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
import { reorderTasks, updateTask } from "@/shared/update";
import { debounce } from "@/shared/utils";
import { IconMenu2 } from "@tabler/icons-solidjs";
import EditableTitle from "./EditableTitle";

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
  handleKeyDown: Function;
  handlePaste: Function;
};

type TaskItemProps = TaskWithId & {
  nodeId: string;
  index: number;
  handleKeyDown: Function;
  handlePaste: Function;
};

const generateId = (() => {
  let counter = 0;
  return () => `task-id-${counter++}`;
})();

const updateTaskDebounce = debounce(
  (nodeId: string, index: number, value: string | boolean) => {
    updateTask(nodeId, value, index);
  },
  300
);

const handleTaskChange = (
  nodeId: string,
  index: number,
  value: string | boolean
) => {
  updateTaskDebounce(nodeId, index, value);
};

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

      let itemsAfter = 0;
      let count = 1;
      while (true) {
        if (fromIndex + count > items().length - 1) break;
        if (items()[fromIndex + count].nestLevel === 0) break;
        count++;
        itemsAfter++;
      }

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        const updated = [...items()];
        const moved = updated.splice(fromIndex, 1 + itemsAfter);
        console.log(moved);
        for (let index = 0; index < moved.length; index++) {
          updated.splice(toIndex + index, 0, moved[index]);
        }
        setItems(updated);
      }
    }

    const newArray = items().map(({ _id, ...keepAttrs }) => keepAttrs);
    reorderTasks(node.id, newArray);

    setActiveId(null);
  };
  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    const target = e.currentTarget as HTMLElement;
    const text = target.textContent?.trim() ?? "";

    const selection = window.getSelection();
    const range =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const caretOffset = range ? range.startOffset : 0;

    if (["Tab", "Backspace", "Enter", "ArrowUp", "ArrowDown"].includes(e.key)) {
      if (e.key === "Enter") {
        e.preventDefault();
        setItems((prev) => {
          const updated = [...prev];
          const current = prev[index];
          const newTask: TaskWithId = {
            _id: generateId(),
            text: "",
            check: false,
            nestLevel: current.nestLevel,
          };
          updated.splice(index + 1, 0, newTask);
          return updated;
        });

        const newArray = items().map(({ _id, ...keepAttrs }) => keepAttrs);
        reorderTasks(node.id, newArray);

        queueMicrotask(() => {
          const editableElements = document.querySelectorAll(".taskitem-text");
          const newTarget = editableElements[index + 1] as HTMLElement;
          if (newTarget) newTarget.focus();
        });
        return;
      }

      if (e.key === "Backspace") {
        const currentText = target.textContent?.trim() ?? "";

        if (currentText === "" && items()[index].nestLevel > 0) {
          setItems((prev) =>
            prev.map((task, i) =>
              i === index
                ? { ...task, text: currentText, nestLevel: task.nestLevel - 1 }
                : task
            )
          );

          const newArray = items().map(({ _id, ...keepAttrs }) => keepAttrs);
          reorderTasks(node.id, newArray);

          queueMicrotask(() => {
            const editableElements =
              document.querySelectorAll(".taskitem-text");
            const newTarget = editableElements[index] as HTMLElement;
            if (newTarget) {
              newTarget.focus();
              const sel = window.getSelection();
              const range = document.createRange();
              range.selectNodeContents(newTarget);
              range.collapse(false);
              sel?.removeAllRanges();
              sel?.addRange(range);
            }
          });
          return;
        }

        if (currentText === "" && items()[index].nestLevel === 0) {
          setItems((prev) => {
            const updated = [...prev];
            updated.splice(index, 1);
            return updated;
          });

          const newArray = items().map(({ _id, ...keepAttrs }) => keepAttrs);
          reorderTasks(node.id, newArray);

          queueMicrotask(() => {
            const editableElements =
              document.querySelectorAll(".taskitem-text");
            const newTarget =
              (editableElements[index - 1] as HTMLElement) ||
              editableElements[0];
            if (newTarget) {
              newTarget.focus();
              const sel = window.getSelection();
              const range = document.createRange();
              range.selectNodeContents(newTarget);
              range.collapse(false);
              sel?.removeAllRanges();
              sel?.addRange(range);
            }
          });
          return;
        }

        const range =
          selection && selection.rangeCount > 0
            ? selection.getRangeAt(0)
            : null;
        if (range?.startOffset === 0 && currentText !== "") {
          return;
        }
      }

      if (e.key === "Tab") {
        e.preventDefault();

        const currentText = target.textContent || "";
        setItems((prev) =>
          prev.map((task, i) =>
            i === index
              ? { ...task, text: currentText, nestLevel: task.nestLevel + 1 }
              : task
          )
        );

        const newArray = items().map(({ _id, ...keepAttrs }) => keepAttrs);
        reorderTasks(node.id, newArray);

        queueMicrotask(() => {
          const editableElements = document.querySelectorAll(".taskitem-text");
          const newTarget = editableElements[index] as HTMLElement;
          if (newTarget) {
            newTarget.focus();
            const sel = window.getSelection();
            const range = document.createRange();
            range.setStart(newTarget.firstChild || newTarget, caretOffset);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        });
        return;
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();

        const editableElements = Array.from(
          document.querySelectorAll<HTMLElement>(".taskitem-text")
        );

        const currentIndex = index;
        let newIndex = currentIndex;

        if (e.key === "ArrowUp" && currentIndex > 0) {
          newIndex = currentIndex - 1;
        } else if (
          e.key === "ArrowDown" &&
          currentIndex < editableElements.length - 1
        ) {
          newIndex = currentIndex + 1;
        }

        const newTarget = editableElements[newIndex];
        if (newTarget) {
          newTarget.focus();
          const sel = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(newTarget);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
        return;
      }
    }
  };

  const handlePaste = (e: ClipboardEvent, index: number) => {
    e.preventDefault();

    const clipboardData = e.clipboardData.getData("text");
    const lines = clipboardData.split(/\r?\n/).filter(Boolean);

    if (lines.length === 0) return;

    setItems((prev) => {
      const updated = [...prev];

      // Update current task with first line
      updated[index] = {
        ...updated[index],
        text: lines[0],
      };

      // Insert new lines as new tasks after current
      const newTasks: TaskWithId[] = lines.slice(1).map((line) => ({
        _id: generateId(),
        text: line,
        check: false,
        nestLevel: updated[index].nestLevel, // preserve nest level
      }));

      updated.splice(index + 1, 0, ...newTasks);

      return updated;
    });

    const newArray = items().map(({ _id, ...keepAttrs }) => keepAttrs);
    reorderTasks(node.id, newArray);

    queueMicrotask(() => {
      // Focus last pasted task
      const editableElements =
        document.querySelectorAll<HTMLElement>(".taskitem-text");
      const newTarget = editableElements[index + lines.length - 1];
      if (newTarget) {
        newTarget.focus();
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(newTarget);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    });
  };

  return (
    <div class="p-5">
      <div class="text-2xl font-bold mb-4">Task List</div>
      <div class="text-2xl font-bold mb-4">
        <EditableTitle nodeId={node.id} title={node.title || "Title?"} />
      </div>

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
                  handleKeyDown={handleKeyDown}
                  handlePaste={handlePaste}
                />
              )}
            </For>
          </div>
        </SortableProvider>

        <DragOverlay>
          <div class="sortable hidden bg-red-700 text-white p-4 rounded shadow z-50">
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
      <TaskItem
        {...props.task}
        index={props.index}
        nodeId={props.nodeId}
        handleKeyDown={props.handleKeyDown}
        handlePaste={props.handlePaste}
      />
      <IconMenu2 class="tasklist_handle size-4 cursor-pointer mt-1 transition-opacity duration-200 ease-out opacity-0 group-hover/taskitem:opacity-100 " />
    </div>
  );
};

// === Task UI ===
const TaskItem = (props: TaskItemProps) => {
  return (
    <div
      class="w-full"
      style={{
        "margin-left": `${props.nestLevel * 18}px`,
      }}
    >
      <div class="flex items-start justify-between w-full">
        <div class="flex items-center space-x-2 w-full items-start">
          <Checkbox {...props} />
          <span
            class="taskitem-text cursor-text text-foreground outline-0 overflow-hidden text-ellipsis text-pretty wrap-break-word leading-4 w-full"
            contentEditable={true}
            onKeyDown={(e) => props.handleKeyDown(e, props.index)}
            onInput={(e) => {
              handleTaskChange(
                props.nodeId,
                props.index,
                e.currentTarget.textContent || ""
              );
            }}
            onPaste={(e) => props.handlePaste(e, props.index)}
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
