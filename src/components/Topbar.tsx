import { For } from "solid-js";

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
    <div id="topbar">
      <div id="breadcrumb">
        <For each={example_path}>
          {(path, index) => {
            const i = index(); // Get reactive index
            const isLast = i === example_path.length - 1;

            return (
              <>
                <div
                  classList={{
                    breadcrumb_path: true,
                    active_breadcrumb_path: !isLast,
                  }}
                  onClick={!isLast ? changePath : undefined}
                  style={{
                    cursor: !isLast ? "pointer" : "default",
                  }}
                >
                  [logo]{path.name}
                </div>
                {!isLast && <span class="spacer"> / </span>}
              </>
            );
          }}
        </For>
      </div>

      <div></div>
      <div>settings + misc</div>
    </div>
  );
};
