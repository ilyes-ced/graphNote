import { createSignal } from "solid-js";
import { setStore, store } from "../store";

export default (props: any) => {
  const [isDragging, setIsDragging] = createSignal(false);
  let lastMouse = { x: 0, y: 0 };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.which === 2 || e.ctrlKey) {
      // Middle click, or control
      e.preventDefault();
      setIsDragging(true);
      lastMouse = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging()) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;

      // limiting the movement to the size of the viewport, not sure if i really should
      if (store.viewport.x + dx <= 0) {
        setStore("viewport", "x", (prev) => prev + dx);
      } else {
        setStore("viewport", "x", 0);
      }
      if (store.viewport.y + dy <= 0) {
        setStore("viewport", "y", (prev) => prev + dy);
      } else {
        setStore("viewport", "y", 0);
      }
      lastMouse = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    setIsDragging(false);
  };

  return (
    <div
      onmousedown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      id="pan"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        cursor: "grab",
      }}
    >
      {store.viewport.x}/{store.viewport.y}
      {props.children}
    </div>
  );
};
