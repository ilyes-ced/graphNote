import { store, setStore } from "../store";
import Pan from "./Pan";

export default (props: any) => {
  let zoomable: HTMLDivElement;

  const handleWheel = async (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();

      let newScale = store.viewport.scale;

      if (e.deltaY > 0) {
        if (newScale <= 0.7) return;
        newScale -= 0.1;
      } else {
        if (newScale >= 1.5) return;
        newScale += 0.1;
      }

      //  if (!zoomable) return;
      //  const rect = zoomable.getBoundingClientRect();
      //
      //  // Mouse position relative to the canvas container
      //  const offsetX = e.clientX - rect.left;
      //  const offsetY = e.clientY - rect.top;
      //
      //  // Convert to world/canvas coordinates
      //  const canvasX = (offsetX - store.viewport.x) / store.viewport.scale;
      //  const canvasY = (offsetY - store.viewport.y) / store.viewport.scale;
      //
      //  const newX = offsetX - canvasX * newScale;
      //  const newY = offsetY - canvasY * newScale;

      setStore("viewport", {
        scale: newScale,
        //x: newX,
        //y: newY,
      });
    }
  };

  return (
    <div ref={zoomable} id="zoom" onwheel={handleWheel}>
      {props.children}
    </div>
  );
};
