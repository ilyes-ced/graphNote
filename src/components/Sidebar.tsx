import { createSignal, For, onCleanup, onMount } from "solid-js";
import Svg from "./nodes/Svg";

export default function SidebarFloating() {
  let icons = [
    // basic blocks
    { name: "note", width: 32, height: 24 },
    { name: "todo", width: 32, height: 24 },
    { name: "comment", width: 32, height: 24 },
    { name: "table", width: 32, height: 24 },
    { name: "url", width: 32, height: 24 },

    // layout blocks
    { name: "arrow", width: 32, height: 32 },
    { name: "board", width: 32, height: 32 },
    { name: "column", width: 32, height: 32 },

    // text
    { name: "code", width: 24, height: 24 },
    { name: "document", width: 26, height: 32 },
    { name: "upload", width: 32, height: 32 },

    // artistic maybe
    { name: "drawing", width: 32, height: 32 },
    { name: "sketch", width: 32, height: 24 },
    { name: "color", width: 28, height: 32 },
    { name: "image", width: 32, height: 32 },
  ];

  const [isDragging, setIsDragging] = createSignal(false);
  let lastMouse = { x: 0, y: 0 };

  const handleMouseUp = (e: MouseEvent) => {
    console.log("stoped dragging");
    setIsDragging(false);
  };
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    lastMouse = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging()) {
      console.log("dragging sidebar");
    }
  };

  onMount(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    onCleanup(() => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    });
  });

  return (
    <div class="border-r border-border h-full overflow-hidden w-[65px] p-4 bg-card ">
      <div class="flex flex-col space-y-4 overflow-x-visible relative">
        <For each={icons} fallback={<div>Loading...</div>}>
          {(icon) => (
            <div
              onmousedown={handleMouseDown}
              class="icon rounded-md cursor-pointer flex flex-col justify-center items-center transition duration-200 ease-out hover:translate-x-2 z-10"
            >
              <Svg
                width={icon.width}
                height={icon.height}
                classes=""
                icon_name={icon.name}
              />
              <div class=""></div>

              <span class="text-sm">{icon.name}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
