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
      class="h-[50px] border-b border-border flex flex-row justify-between items-center bg-card px-8"
    >
      <div
        id="breadcrumb"
        class="bg-card flex flex-row space-y-4 overflow-x-visible "
      >
        <div class="flex flex-row">
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
      </div>

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
<div class="absolute h-full w-30 p-3">
  <div class="border border-border p-2 rounded-md h-full bg-card  flex flex-col space-y-4 overflow-x-visible "></div>
</div>;
