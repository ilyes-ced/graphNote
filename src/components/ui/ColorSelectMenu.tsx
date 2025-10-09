import { store } from "@/shared/store";
import { unsetStripColor, updateNodeColor } from "@/shared/update";
import { ColorType } from "@/types";
import { createSignal, For } from "solid-js";
import { Dynamic } from "solid-js/web";

// first color is default

const bgColorList: ColorType[] = [
  getComputedStyle(document.documentElement)
    .getPropertyValue("--color-card")
    .trim() as ColorType,
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

const textColorList: ColorType[] = [
  getComputedStyle(document.documentElement)
    .getPropertyValue("--color-foreground")
    .trim() as ColorType,
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

type comboType = { bg: ColorType; fg: ColorType };
const textBgComboColorList: comboType[] = [
  {
    bg: getComputedStyle(document.documentElement)
      .getPropertyValue("--color-card")
      .trim() as ColorType,
    fg: getComputedStyle(document.documentElement)
      .getPropertyValue("--color-foreground")
      .trim() as ColorType,
  },
  {
    bg: "#F59E0B",
    fg: "#8B5CF6",
  },
  {
    bg: "#EF4444",
    fg: "#8B5CF6",
  },
];

export default () => {
  const [bgOrStrip, setBgOrStrip] = createSignal<0 | 1>(0);
  const colorSelections = [<BgColors />, <StripColors />];

  const groupClasses =
    "flex items-center justify-center w-1/2 p-2 aspect-2/1 rounded cursor-pointer transition-colors duration-200 ease-in-out hover:bg-primary";
  return (
    <div
      class={`z-50 transition-all duration-200 ease-in-out absolute top-4 left-4 [box-shadow:5px_5px_var(--color-primary)]
          ${
            store.showColorMenu
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
    >
      <div
        id="colorSelectMenu"
        class="border border-border p-4 w-fit bg-card space-y-4"
      >
        {/* bg or strip selection */}
        <div class="flex space-x-4">
          <div
            class={groupClasses}
            classList={{
              "bg-primary": bgOrStrip() === 0,
            }}
            onClick={() => setBgOrStrip(0)}
          >
            bg
          </div>
          <div
            class={groupClasses}
            classList={{
              "bg-primary": bgOrStrip() === 1,
            }}
            onClick={() => setBgOrStrip(1)}
          >
            strip
          </div>
        </div>

        <Dynamic component={colorSelections[bgOrStrip()]} />
      </div>
    </div>
  );
};

const changeBg = (bg: ColorType | "none") => {
  store.selectedNodes.forEach((nodeId) => {
    updateNodeColor(nodeId, "bg", bg);
  });
};
const changeFg = (fg: ColorType | "none") => {
  store.selectedNodes.forEach((nodeId) => {
    updateNodeColor(nodeId, "fg", fg);
  });
};
const changeBgFg = (combo: comboType) => {
  store.selectedNodes.forEach((nodeId) => {
    updateNodeColor(nodeId, "bg", combo.bg);
    updateNodeColor(nodeId, "fg", combo.fg);
  });
};
const changeTopStrip = (color: ColorType | "none") => {
  store.selectedNodes.forEach((nodeId) => {
    updateNodeColor(nodeId, "strip", color);
  });
};

const BgColors = () => {
  return (
    <div class="space-y-2">
      {/* bg color selection */}
      <div class="grid grid-cols-5 gap-2">
        <For each={bgColorList}>
          {(bgColor) => (
            <div
              class="border border-border hover:border-foreground/70 cursor-pointer w-10 aspect-3/2 p-2"
              style={{ background: bgColor }}
              onClick={() => changeBg(bgColor)}
            ></div>
          )}
        </For>
      </div>
      <div class="w-full border-t border-border"></div>
      {/* text color selection */}
      <div class="grid grid-cols-5 gap-2">
        <For each={textColorList}>
          {(textColor) => (
            <div
              class="border border-border hover:border-foreground/70 cursor-pointer bg-accent w-10 aspect-3/2 flex items-center justify-center"
              style={{ color: textColor }}
              onClick={() => changeFg(textColor)}
            >
              A
            </div>
          )}
        </For>
      </div>
      <div class="w-full border-t border-border"></div>
      {/* text/bg color combo selection */}
      <div class="grid grid-cols-5 gap-2">
        <For each={textBgComboColorList}>
          {(combo) => (
            <div
              class="border border-border hover:border-foreground/70 cursor-pointer w-10 aspect-3/2 flex items-center justify-center"
              style={{ color: combo.fg, background: combo.bg }}
              onClick={() => changeBgFg(combo)}
            >
              A
            </div>
          )}
        </For>{" "}
      </div>
      <button class="w-full px-2 py-1 border border-border bg-accent hover:bg-primary cursor-pointer transition-all duration-200 ease-in-out">
        Add custom color
      </button>
    </div>
  );
};

const StripColors = () => {
  return (
    <div class="space-y-2">
      {/* bg color selection */}
      <div class="grid grid-cols-5 gap-2">
        <div
          class="relative border border-border hover:border-foreground/70 cursor-pointer w-10 aspect-[3/2] bg-transparent"
          onClick={() => unsetStripColor()}
        >
          <div class="absolute top-1/2 left-1/2 w-[120%] h-[2px] bg-destructive rotate-30 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <For each={bgColorList}>
          {(stripColor) => (
            <div
              class="border border-transparent hover:border-foreground/70 cursor-pointer w-10 aspect-3/2 p-2"
              style={{ background: stripColor }}
              onClick={() => changeTopStrip(stripColor)}
            ></div>
          )}
        </For>
      </div>

      <button class="w-full px-2 py-1 border border-border bg-accent hover:bg-primary cursor-pointer transition-all duration-200 ease-in-out">
        Add custom color
      </button>
    </div>
  );
};
