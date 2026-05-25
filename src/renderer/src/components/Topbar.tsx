import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { Button } from "./ui/button";
import { setStore, store } from "../shared/store";
import {
  IconChevronsRight,
  IconDatabaseFilled,
  IconMoonFilled,
  IconSettings,
  IconUpload,
} from "@tabler/icons-solidjs";
import { findNodeById, getActiveBoardId, updateBoardStyles } from "../shared/update";
import iro from "@jaames/iro";

export default () => {
  const [bgPicker, setBgPicker] = createSignal(false);
  const [gridPicker, setGridPicker] = createSignal(false);
  const [modalPos, setModalPos] = createSignal({ x: 0, y: 0 });

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



  let pickerBgRef!: HTMLDivElement
  let pickerGridRef!: HTMLDivElement
  let colorPickerBg: any
  let colorPickerGrid: any


  onMount(async () => {
    const sizes = await window.api.getSizes()
    console.log("GGGGGGGGGGFFFFFFFFFFFFFFFFFFFFFFF")
    console.log(sizes)
    setDataSize(sizes)

    // @ts-ignore
    colorPickerBg = new iro.ColorPicker(pickerBgRef, {
      color: store.userConfig.homeBoardStyle.bgColor ?? "#ff5593",
      layout: [
        {
          component: iro.ui.Box,
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'hue',
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'alpha'
          }
        },
      ]
    });
    // @ts-ignore
    colorPickerGrid = new iro.ColorPicker(pickerGridRef, {
      color: store.userConfig.homeBoardStyle.gridColor ?? "#ff5593",
      layout: [
        {
          component: iro.ui.Box,
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'hue',
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'alpha'
          }
        },
      ]
    });

    colorPickerBg.on('color:change', function (color: any) {
      if (getActiveBoardId() == "home") {
        setStore("userConfig", "homeBoardStyle", "bgImagePath", "")
        setStore("userConfig", "homeBoardStyle", "bgColor", color.rgbaString)
      } else {
        updateBoardStyles(findNodeById(getActiveBoardId()), "", "image")
        updateBoardStyles(findNodeById(getActiveBoardId()), color.rgbaString, "bg")
      }
    });
    colorPickerGrid.on('color:change', function (color: any) {
      if (getActiveBoardId() == "home") {
        setStore("userConfig", "homeBoardStyle", "gridColor", color.rgbaString)
      } else {
        updateBoardStyles(findNodeById(getActiveBoardId()), color.rgbaString, "grid")
      }
    });
  })

  createEffect(async () => {
    if (store.userConfig.homeBoardStyle.bgImagePath == "") {
      const bgColor = store.userConfig.homeBoardStyle.bgColor ?? "#ff5593"
      if (colorPickerBg) {
        colorPickerBg.color.rgbaString = bgColor
      }
    }
  })

  createEffect(async () => {
    const gridColor = store.userConfig.homeBoardStyle.gridColor ?? "#ff5593"
    if (colorPickerGrid) {
      colorPickerGrid.color.rgbaString = gridColor
    }
  })


  return (
    <div
      id="topbar"
      class="h-[50px] border-b border-border flex flex-row justify-between items-center bg-card px-2"
    >


      <div
        class="z-10000 absolute top-0 left-0 size-full" onClick={() => { console.log("*888888888888"); setBgPicker(false) }}
        style={{
          opacity: bgPicker() ? "1" : "0",
          "pointer-events": bgPicker() ? "auto" : "none",
        }}
      >
        <div onClick={(e) => e.stopPropagation()} class="bg-background absolute size-fit border-2 border-primary animate-[modalIn_0.25s_ease]"
          style={{
            top: `${modalPos().y + 65}px`,
            left: `${modalPos().x}px`
          }}
        >
          <div class="p-2" ref={pickerBgRef}></div>
        </div>
      </div>

      <div
        class="z-10000 absolute top-0 left-0 size-full" onClick={() => setGridPicker(false)}
        style={{
          opacity: gridPicker() ? "1" : "0",
          "pointer-events": gridPicker() ? "auto" : "none",
        }}
      >
        <div onClick={(e) => e.stopPropagation()} class="bg-background absolute size-fit border-2 border-primary animate-[modalIn_0.25s_ease]"
          style={{
            top: `${modalPos().y + 65}px`,
            left: `${modalPos().x}px`
          }}
        >
          <div class="p-2" ref={pickerGridRef}></div>
        </div>
      </div >




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
          class="border border-border hover:border-foreground/70 cursor-pointer bg-accent flex items-center justify-center h-full aspect-video picker-wrapper"
          style={{ background: store.userConfig.homeBoardStyle.gridColor != "" ? store.userConfig.homeBoardStyle.gridColor : "var(--color-background)" }}
          onclick={(e) => {
            setModalPos({ x: e.target.getBoundingClientRect().left, y: e.target.getBoundingClientRect().top })
            setGridPicker(true)
          }}
        >
        </div>

        <div>Board Bg Color:</div>
        <div
          class="border border-border hover:border-foreground/70 cursor-pointer bg-accent flex items-center justify-center h-full aspect-video picker-wrapper"
          style={{ background: store.userConfig.homeBoardStyle.bgColor != "" ? store.userConfig.homeBoardStyle.bgColor : "var(--color-background)" }}
          onclick={(e) => {
            setModalPos({ x: e.target.getBoundingClientRect().left, y: e.target.getBoundingClientRect().top })
            setBgPicker(true)
          }}
        >
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
