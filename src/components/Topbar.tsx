import { createSignal, For } from "solid-js";
import { Button } from "./ui/button";
import { setStore, store } from "./store";
import {
  IconChevronsRight,
  IconMoonFilled,
  IconSettings,
} from "@tabler/icons-solidjs";

export default () => {
  const breadcrumbsClick = (index: number, id: string) => {
    console.log("+++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++++++++++++");
    console.log(store.activeBoards);
    setStore("activeBoards", (items) => items.slice(0, index + 1));
    console.log(store.activeBoards);
  };

  return (
    <div
      id="topbar"
      class="h-[50px] border-b border-border flex flex-row justify-between items-center bg-card px-8"
    >
      <div
        id="breadcrumb"
        class="bg-card flex flex-row space-y-4 overflow-x-visible "
      >
        <div class="flex flex-row">
          <For each={store.activeBoards}>
            {(breadcrumb, index) => {
              return (
                <>
                  <div
                    class="p-[5px] border-2 border-border rounded-[5px] transition duration-100 ease-out"
                    classList={{
                      breadcrumb_path: true,
                      "hover:bg-primary": !(
                        index() ===
                        store.activeBoards.length - 1
                      ),
                      "border-primary":
                        index() === store.activeBoards.length - 1,
                    }}
                    onClick={() =>
                      !(index() === store.activeBoards.length - 1)
                        ? breadcrumbsClick(index(), breadcrumb.id)
                        : undefined
                    }
                    style={{
                      cursor: !(index() === store.activeBoards.length - 1)
                        ? "pointer"
                        : "default",
                    }}
                  >
                    [logo]{breadcrumb.name}
                  </div>
                  {!(index() === store.activeBoards.length - 1) && (
                    <span class="self-center mx-1 my-0 ">
                      <IconChevronsRight />
                    </span>
                  )}
                </>
              );
            }}
          </For>
        </div>
      </div>

      <div class="flex justify-center items-center space-x-4">
        <Button variant={"secondary"}>
          <IconSettings />
        </Button>

        <Button variant={"secondary"}>
          <IconMoonFilled />
        </Button>
      </div>
    </div>
  );
};
<div class="absolute h-full w-30 p-3">
  <div class="border border-border p-2 rounded-md h-full bg-card  flex flex-col space-y-4 overflow-x-visible "></div>
</div>;
