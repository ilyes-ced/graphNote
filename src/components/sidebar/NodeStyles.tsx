import { setStore, store } from "@/shared/store";
import { findNodeById } from "@/shared/update";
import { createEffect, createSignal } from "solid-js";

createEffect(() => {
  console.log(store.selectedNodes);
  if (store.selectedNodes.size === 0) {
    setStore("activeSidebar", "nodes");
  } else {
    setStore("activeSidebar", "nodeStyles");
  }
});

export default () => {
  const [color1, setColor1] = createSignal("#EC4899");
  const [color2, setColor2] = createSignal("#8B5CF6");
  const [color3, setColor3] = createSignal("#8B5CF6");

  const setColors = () => {
    const nodeId = store.selectedNodes.values().next().value;
    if (nodeId) {
      const node = findNodeById(nodeId);
      setColor1(node?.color ?? "#444444");
      setColor2(node?.top_strip_color ?? "#333333");
      setColor3(
        node?.textColor ??
          getComputedStyle(document.documentElement)
            .getPropertyValue("--color-foreground")
            .trim()
      );
    }
  };

  createEffect(() => {
    if (store.selectedNodes.size === 1) {
      setColors();
    } else if (store.selectedNodes.size > 1) {
      setColors();
    } else {
    }
  });

  return (
    <div class="h-full overflow-hidden w-[65px] p-4 bg-card ">
      <div
        class="flex group/hov flex-col space-y-4 overflow-x-visible relative transition duration-200 ease-out hover:translate-x-2 cursor-pointer "
        onClick={() => setStore("showColorMenu", !store.showColorMenu)}
      >
        {/* colors menu toggle */}
        <div>
          <div class="icon flex flex-col justify-center items-center z-10 bg-accent aspect-square group-hover/hov:bg-red-500">
            <div class="flex flex-col size-full p-2">
              <div
                class="border-b-0 h-1/6 w-full"
                style={{ background: color2() }}
              ></div>
              <div
                class="h-5/6 w-full flex items-center justify-center"
                style={{
                  background: color1(),
                  color: color3() ?? "var(--color-foreground)",
                }}
              >
                A
              </div>
            </div>
          </div>
          <p class="text-sm text-center">colors</p>
        </div>
      </div>
    </div>
  );
};
