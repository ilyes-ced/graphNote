import { ColorType } from "@/types";
import { For } from "solid-js";

export default () => {
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

  const groupClasses =
    "flex items-center justify-center w-1/2 p-2 aspect-square";

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

      {/* bg color selection */}
      <div class="grid grid-cols-5 gap-2">
        <For each={bgColorList}>
          {(bgColor) => (
            <div
              class="cursor-pointer size-2 p-2"
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
              class="cursor-pointer bg-accent size-4 text-xs text-center"
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
              class="cursor-pointer bg-accent size-4 text-xs text-center"
              style={{ color: combo.text, background: combo.bg }}
            >
              A
            </div>
          )}
        </For>{" "}
      </div>

      <button class="w-full px-2 py-1 border cursor-pointer">
        Add custom color
      </button>
    </div>
  );
};
