import { setStore, store } from "@/shared/store";
import { createEffect } from "solid-js";

createEffect(() => {
  console.log(store.selectedNodes);
  if (store.selectedNodes.size === 0) {
    setStore("activeSidebar", "nodes");
  } else {
    setStore("activeSidebar", "nodeStyles");
  }
});

export default () => {
  return (
    <div class="h-full overflow-hidden w-[65px] p-4 bg-card ">
      <div
        class="flex group/hov flex-col space-y-4 overflow-x-visible relative transition duration-200 ease-out hover:translate-x-2 cursor-pointer "
        onClick={() => setStore("showColorMenu", !store.showColorMenu)}
      >
        {/* colors menu toggle */}
        <div>
          <div class="icon rounded flex flex-col justify-center items-center z-10 bg-accent aspect-square group-hover/hov:bg-red-500">
            <div class="flex flex-col size-full p-2">
              <div class="bg-[#EC4899] border-b-0 h-1/6 w-full "></div>
              <div class="bg-[#8B5CF6] h-5/6 w-full "></div>
            </div>
          </div>
          <p class="text-sm text-center">colors</p>
        </div>
      </div>
    </div>
  );
};
