import { store, setStore } from "../store";
import Pan from "./Pan";

export default (props: any) => {
  const handleWheel = async (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY > 0) {
        if (store.viewport.scale >= 0.7)
          setStore("viewport", "scale", (s) => s - 0.1);
      } else {
        if (store.viewport.scale <= 1.5)
          setStore("viewport", "scale", (s) => s + 0.1);
      }
    }
  };

  return (
    <div id="zoom" onwheel={handleWheel}>
      {props.children}
    </div>
  );
};
