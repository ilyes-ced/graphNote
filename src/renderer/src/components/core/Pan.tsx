import { createSignal, onCleanup, onMount } from "solid-js";
import { setStore, store } from "../../shared/store";

export default (props: any) => {
  const [isDragging, setIsDragging] = createSignal(false);
  let lastMouse = { x: 0, y: 0 };

  function getBounds() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const scaledW = store.viewport.width * store.viewport.scale;
    const scaledH = store.viewport.height * store.viewport.scale;

    // If canvas is smaller than viewport → center it
    const minX = Math.min(0, vw - scaledW);
    const minY = Math.min(0, vh - scaledH);
    const maxX = 0;
    const maxY = 0;

    return { minX, maxX, minY, maxY };
  }

  function clampViewport(x: number, y: number) {
    const { minX, maxX, minY, maxY } = getBounds();

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  }

  function moveViewport(dx: number, dy: number) {
    const next = clampViewport(
      store.viewport.x + dx,
      store.viewport.y + dy
    );

    setStore("viewport", "x", next.x);
    setStore("viewport", "y", next.y);
  }

  const handlePointerDown = (e: PointerEvent) => {
    // Middle mouse OR ctrl + left
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      lastMouse = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging()) return;

    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;

    moveViewport(dx, dy);

    lastMouse = { x: e.clientX, y: e.clientY };
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return;

    e.preventDefault();

    const speed = 100;
    const dx = e.shiftKey ? -Math.sign(e.deltaX) * speed : 0;
    const dy = !e.shiftKey ? -Math.sign(e.deltaY) * speed : 0;

    moveViewport(dx, dy);
  };

  onMount(() => {
    window.addEventListener("blur", stopDragging);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    onCleanup(() => {
      window.removeEventListener("blur", stopDragging);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    });
  });

  return (
    <div
      id="pan"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onWheel={handleWheel}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      {store.viewport.x}/{store.viewport.y}
      {props.children}
    </div>
  );
};
