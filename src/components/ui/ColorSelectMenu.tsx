import { ColorType } from "@/types";
import { For } from "solid-js";

// first color is default
const bgColorList: ColorType[] = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];
const textColorList: ColorType[] = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];
const textBgComboColorList: { text: ColorType; bg: ColorType }[] = [
  {
    text: "#8B5CF6",
    bg: "#F59E0B",
  },
  {
    text: "#8B5CF6",
    bg: "#EF4444",
  },
];

export default () => {
  const groupClasses =
    "flex items-center justify-center w-1/2 p-2 aspect-square cursor-pointer";

  return (
    <div
      id="colorSelectMenu"
      class="border border-border p-4 w-fit bg-card space-y-4"
    >
      {/* bg or strip selection */}
      <div class=" flex">
        <div class={groupClasses}>bg</div>
        <div class={groupClasses}>strip</div>
      </div>

      <BgColors />
    </div>
  );
};

const BgColors = () => {
  return (
    <>
      {/* bg color selection */}
      <div class="grid grid-cols-5 gap-2">
        <For each={bgColorList}>
          {(bgColor) => (
            <div
              class="border border-transparent hover:border-foreground/70 cursor-pointer size-2 p-2"
              style={{ background: bgColor }}
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
              class="border border-transparent hover:border-foreground/70 cursor-pointer bg-accent size-4 text-xs text-center"
              style={{ color: textColor }}
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
              class="border border-transparent hover:border-foreground/70 cursor-pointer bg-accent size-4 text-xs text-center"
              style={{ color: combo.text, background: combo.bg }}
            >
              A
            </div>
          )}
        </For>{" "}
      </div>
      <button class="w-full px-2 py-1 border border-border bg-accent hover:bg-primary cursor-pointer transition-all duration-200 ease-in-out">
        Add custom color
      </button>
    </>
  );
};
