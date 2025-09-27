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

      // todo: limit the movement on the other side as well, do the same thing on the scroll too
      // limiting the movement to the size of the viewport, not sure if i really should
      if (store.viewport.x + dx <= 500) {
        setStore("viewport", "x", (prev) => prev + dx);
      } else {
        setStore("viewport", "x", 500);
      }
      if (store.viewport.y + dy <= 500) {
        setStore("viewport", "y", (prev) => prev + dy);
      } else {
        setStore("viewport", "y", 500);
      }
      lastMouse = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    setIsDragging(false);
  };

  const handleWheel = (e: WheelEvent) => {
    //TODO: make the scroll speed user defined maybe
    if (!e.ctrlKey) {
      //* scroll speed
      const sp = 70;

      const axis = e.shiftKey ? "x" : "y";
      const direction =
        axis === "y" ? (e.deltaY > 0 ? sp : -sp) : e.deltaX > 0 ? sp : -sp;

      setStore("viewport", axis, (prev) => {
        const newValue = prev - direction;
        return newValue <= 0 ? newValue : 0;
      });
    }
  };

  return (
    <div
      onmousedown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      id="pan"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      {store.viewport.x}/{store.viewport.y}
      {props.children}
    </div>
  );
};
