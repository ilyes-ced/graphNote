import { createSignal, onCleanup } from "solid-js";

export function useResize(
  initialWidth: number = 300,
  onResizeEnd?: (width: number) => void
) {
  const [width, setWidth] = createSignal(initialWidth);

  const startResize = (e: PointerEvent) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = width();

    const onMove = (e: PointerEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      setWidth(Math.max(300, newWidth));
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);

      if (onResizeEnd) {
        // round up to 10
        setWidth(Math.round(width() / 10) * 10);
        onResizeEnd(width());
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  onCleanup(() => {
    window.removeEventListener("pointermove", startResize);
    window.removeEventListener("pointerup", startResize);
  });

  return {
    width,
    setWidth,
    startResize,
  };
}
