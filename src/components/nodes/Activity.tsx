import { createEffect, createSignal, For, Show } from "solid-js";
import { store } from "../store";
import { useDraggable } from "@/shared/nodeDrag";
import { Activity } from "@/types";

type ActivityProps = Activity & {
  is_child?: boolean;
};

//TODO: to add stuff
//  sperating months
//  showing a graph
//  adding the numbers inside the box
//  year selection
//  chaning the color
//  add graphs for it
//  on hover show date and number
//  https://www.william-troup.com/heat-js/

export default (node: ActivityProps) => {
  const { startDrag } = useDraggable(node, node.is_child);

  const firstDay = "Sunday";
  const today = new Date();
  console.log(today);
  console.log(today.getDay);

  return (
    <div
      onPointerDown={startDrag}
      class="activity"
      classList={{
        child_node: node.is_child,
        node: !node.is_child,
        selected_node: store.selectedNodes.has(node.id),
      }}
      id={node.id}
      style={{
        width: node.is_child ? "100%" : "",
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

      <div class="p-5 space-y-4">
        {/* title */}
        <div class="flex">
          <div class="border rounded size-14 flex justify-center items-center">
            logo
          </div>
          <div class="flex-1 px-4">
            <div class="text-xl font-bold text-foreground">title</div>
            <div class="text-muted-foreground">desc</div>
          </div>
          <div class="border rounded size-14 flex justify-center items-center">
            logo
          </div>
        </div>

        <div class="flex flex-row space-x-[2px]">
          <For each={Array.from(Array(52).keys())}>
            {(week) => (
              <div class="flex flex-col space-y-[2px]">
                <For each={Array.from(Array(7).keys())}>
                  {(day) => (
                    <div class="border border-border rounded size-4"></div>
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
