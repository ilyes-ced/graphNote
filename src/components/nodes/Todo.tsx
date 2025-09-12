import { createSignal, For, Show } from "solid-js";
import { Todo as TodoType } from "../../types";
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

      <div class="space-y-4">
        <For each={node.tasks} fallback={<div>Loading...</div>}>
          {(task, index) => (
            <>
              <Checkbox
                class="flex items-start space-x-2"
                style={{ "margin-left": `${node.nested || 0 * 10}px` }}
              >
                <CheckboxControl />
                <div class="grid gap-1.5 leading-none">
                  <CheckboxLabel class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Accept terms and conditions
                  </CheckboxLabel>
                </div>
              </Checkbox>
              <Show when={task.children?.length > 0}>
                 <Todo {task.children} is_child={true} />
              </Show>
            </>
          )}
        </For>
      </div>
    </div>
  );
};
