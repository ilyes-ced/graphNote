import { For, createSignal, onMount } from "solid-js";
import { Button } from "./ui/button";
import { setStore, store } from "../shared/store";
import {
  IconChevronsRight,
  IconDatabaseFilled,
  IconMoonFilled,
  IconSettings,
  IconUpload,
} from "@tabler/icons-solidjs";
import { DefaultColorPicker } from "@thednp/solid-color-picker";
import { findNodeById, getActiveBoardId, updateBoardStyles } from "../shared/update";

export default () => {
  const [dataSize, setDataSize] = createSignal({
    totalSize: 0,
    imageSize: 0,
    youtubeCacheSize: 0,
    urlMetadataSize: 0,
  });

  const pickFile = async () => {
    const path = await window.api.selectFile();



    if (getActiveBoardId() == "home") {
      setStore("userConfig", "homeBoardStyle", "bgImagePath", path)
    } else {
      updateBoardStyles(findNodeById(getActiveBoardId()), path, "image")
    }

    console.log(path);
    console.log(path);
    console.log(path);
    console.log(path);
    console.log(path);
    console.log(path);
  };


  const breadcrumbsClick = (index: number) => {
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


  onMount(async () => {
    const sizes = await window.api.getSizes()
    console.log("GGGGGGGGGGFFFFFFFFFFFFFFFFFFFFFFF")
    console.log(sizes)
    setDataSize(sizes)
  })



  return (
    <div
      id="topbar"
      class="h-[50px] border-b border-border flex flex-row justify-between items-center bg-card px-2"
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
                    class="p-[5px] border-2 border-border transition duration-100 ease-out"
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
                        ? breadcrumbsClick(index())
                        : undefined
                    }
                    style={{
                      cursor: !(index() === store.activeBoards.length - 1)
                        ? "pointer"
                        : "default",
                    }}
                  >
                    [logo]{breadcrumb.title}
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

      <div class="flex justify-center items-center space-x-4 h-full p-2">
        <div>Board Grid Color:</div>
        <div
          class="border border-border hover:border-foreground/70 cursor-pointer bg-accent flex items-center justify-center h-full aspect-video picker-wrapper "
        >
          <DefaultColorPicker
            value={store.userConfig.homeBoardStyle.gridColor != "" ? store.userConfig.homeBoardStyle.gridColor : "#059124"}
            onChange={(color) => {
              document.documentElement.style.setProperty('--dot-color', color);
              document.documentElement.style.setProperty('--grid-color', color);
              if (getActiveBoardId() == "home") {
                setStore("userConfig", "homeBoardStyle", "gridColor", color)
              } else {
                updateBoardStyles(findNodeById(getActiveBoardId()), color, "grid")
              }
            }}
          />
        </div>

        <div>Board Bg Color:</div>
        <div
          class="border border-border hover:border-foreground/70 cursor-pointer bg-accent flex items-center justify-center h-full aspect-video picker-wrapper "
        >
          <DefaultColorPicker
            value={store.userConfig.homeBoardStyle.bgColor != "" ? store.userConfig.homeBoardStyle.bgColor : "#952034"}
            onChange={(color) => {
              if (getActiveBoardId() == "home") {
                setStore("userConfig", "homeBoardStyle", "bgImagePath", "")
                setStore("userConfig", "homeBoardStyle", "bgColor", color)
              } else {
                updateBoardStyles(findNodeById(getActiveBoardId()), "", "image")
                updateBoardStyles(findNodeById(getActiveBoardId()), color, "bg")
              }
            }}
          />
        </div>

        <div>Board Bg Image:</div>
        <div
          onClick={pickFile}
          class="border border-border hover:border-foreground/70 cursor-pointer bg-accent flex items-center justify-center h-full aspect-video picker-wrapper"
        >
          <div>
            <IconUpload class="size-1/2" size={24} />
          </div>
        </div>
      </div>



      <div class="flex justify-center items-center space-x-4">
        <Button variant={"secondary"} onClick={() => setStore("showStorageMenu", !store.showStorageMenu)}>
          <IconDatabaseFilled />
        </Button>

        <Button variant={"secondary"} onClick={() => setStore("settingsModal", !store.settingsModal)}>
          <IconSettings />
        </Button>

        <Button variant={"secondary"}>
          <IconMoonFilled />
        </Button>
      </div>




      <div
        class={` z-50 transition-all duration-200 ease-in-out absolute top-[60px] right-[22px] [box-shadow:5px_5px_var(--color-primary)]
          ${store.showStorageMenu
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        <div
          class="border border-border p-4 w-fit bg-card space-y-4"
        >

          <div>Total storage occupied:{" "}
            <span class="font-extrabold text-primary">{Math.round(dataSize().totalSize / 1000 / 1000)}MB</span>{" "}/{" "}<span class="font-extrabold text-primary">{Math.round(dataSize().totalSize / 1024 / 1024)}MiB</span>
          </div>
          <div>Images storage occupied:{" "}
            <span class="font-extrabold text-primary">{Math.round(dataSize().imageSize / 1000 / 1000)}MB</span>{" "}/{" "}<span class="font-extrabold text-primary">{Math.round(dataSize().imageSize / 1024 / 1024)}MiB</span>
          </div>
          <div>Youtube videos storage occupied:{" "}
            <span class="font-extrabold text-primary">{Math.round(dataSize().youtubeCacheSize / 1000 / 1000)}MB</span>{" "}/{" "}<span class="font-extrabold text-primary">{Math.round(dataSize().youtubeCacheSize / 1024 / 1024)}MiB</span>
          </div>
          <div>Urls metadata storage occupied:{" "}
            <span class="font-extrabold text-primary">{Math.round(dataSize().urlMetadataSize / 1000 / 1000)}MB</span>{" "}/{" "}<span class="font-extrabold text-primary">{Math.round(dataSize().urlMetadataSize / 1024 / 1024)}MiB</span>
          </div>
        </div>
      </div>

    </div >
  );
};
<div class="absolute h-full w-30 p-3">
  <div class="border border-border p-2 h-full bg-card  flex flex-col space-y-4 overflow-x-visible "></div>
</div>;
