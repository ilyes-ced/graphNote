import { store } from "../store";

export default () => {
  const classes =
    "cursor-pointer border border-border bg-card hover:bg-primary px-4 py-2";

  return (
    <div
      id="controls"
      class="flex flex-row items-center justify-center absolute left-2.5 bottom-2.5 z-50"
    >
      <div class={classes + " rounded-l-md"}>+</div>
      <div class={classes}>{Math.round(store.viewport.scale * 100)}%</div>
      <div class={classes + " rounded-r-md"}>-</div>
    </div>
  );
};
