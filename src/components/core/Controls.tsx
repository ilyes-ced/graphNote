import { store } from "../store";

export default () => {
  return (
    <div id="controls">
      <div>+</div>
      <div>{Math.round(store.viewport.scale * 100)}%</div>
      <div>-</div>
    </div>
  );
};
