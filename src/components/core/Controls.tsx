import { saveChanges } from "@/shared/utils";
import { setStore, store } from "../../shared/store";

export default () => {
  const classes =
    "cursor-pointer border border-border bg-card hover:bg-primary px-4 py-2";

  function Zoom(zoom: number) {
    let scale = store.viewport.scale;

    if (zoom > 0) {
      if (scale <= 0.7) return;
      scale -= 0.1;
    } else {
      if (scale >= 1.5) return;
      scale += 0.1;
    }
    setStore("viewport", {
      scale: scale,
    });

    saveChanges();
  }

  return (
    <div
      id="controls"
      class="flex flex-row items-center justify-center absolute left-2.5 bottom-2.5 z-50"
    >
      <div onClick={() => Zoom(1)} class={classes + " rounded-l-md"}>
        +
      </div>
      <div class={classes}>{Math.round(store.viewport.scale * 100)}%</div>
      <div onClick={() => Zoom(-1)} class={classes + " rounded-r-md"}>
        -
      </div>
    </div>
  );
};
