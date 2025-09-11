import { For } from "solid-js";
import { FaSolidAnglesRight } from "solid-icons/fa";
import { Button } from "./ui/button";
import { WiMoonAltFirstQuarter } from "solid-icons/wi";
import { VsSettingsGear } from "solid-icons/vs";

export default () => {
  let example_path = [
    {
      name: "home",
      logo_path: "logo_name.png",
    },
    {
      name: "sub workspace",
      logo_path: "logo_name.png",
    },
    {
      name: "sub sub workspace",
      logo_path: "logo_name.png",
    },
  ];

  const changePath = (e: MouseEvent) => {
    console.log(e);
  };

  return (
    <div
      id="topbar"
      class="w-full h-[50px] p-2.5 border-b border-border flex flex-row items-center justify-between"
    >
      <div id="breadcrumb" class="flex flex-row">
        <For each={example_path}>
          {(path, index) => {
            const i = index(); // Get reactive index
            const isLast = i === example_path.length - 1;

            return (
              <>
                <div
                  class="p-[5px] border-2 border-border rounded-[5px] transition duration-100 ease-out"
                  classList={{
                    breadcrumb_path: true,
                    "hover:bg-primary": !isLast,
                    "border-primary": isLast,
                  }}
                  onClick={!isLast ? changePath : undefined}
                  style={{
                    cursor: !isLast ? "pointer" : "default",
                  }}
                >
                  [logo]{path.name}
                </div>
                {!isLast && (
                  <span class="self-center mx-1 my-0 ">
                    <FaSolidAnglesRight size={20} />{" "}
                  </span>
                )}
              </>
            );
          }}
        </For>
      </div>

      <div></div>
      <div class="flex justify-center items-center space-x-4">
        <Button variant={"secondary"}>
          <VsSettingsGear />
        </Button>

        <Button variant={"secondary"}>
          <WiMoonAltFirstQuarter />
        </Button>
      </div>
    </div>
  );
};
