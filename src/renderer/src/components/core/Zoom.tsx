import { store, setStore } from "../../shared/store";
import { updateArrowsPositions } from "../../shared/utils";

export default (props: any) => {
  let zoomable!: HTMLDivElement;

  const handleWheel = async (e: WheelEvent) => {
    if (!e.ctrlKey) return;

    e.preventDefault();

    const rect = zoomable.getBoundingClientRect();

    // mouse in screen space
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const prevScale = store.viewport.scale;


    //! still might need to make it fit to a one digit zoom instead of like 0.70000000000001
    const MIN = 7;   // 0.7
    const MAX = 30;  // 3.0

    let zoomIndex = Math.round(store.viewport.scale * 10);

    zoomIndex += e.deltaY > 0 ? -1 : 1;

    zoomIndex = Math.min(MAX, Math.max(MIN, zoomIndex));

    const newScale = zoomIndex / 10;

    const vp = store.viewport;

    // 🔥 world coordinate under mouse BEFORE zoom
    const worldX = (mouseX - vp.x) / prevScale;
    const worldY = (mouseY - vp.y) / prevScale;

    // 🔥 new translation so cursor stays fixed
    const newX = mouseX - worldX * newScale;
    const newY = mouseY - worldY * newScale;

    setStore("viewport", {
      scale: newScale,
      x: newX <= 0 ? newX : 0,
      y: newY <= 0 ? newY : 0,
    });

    updateArrowsPositions();


    //? make the canvas take all screen space when zooming
    //! still not good enough, overcompenstaes
    const div = document.getElementById("viewport-content")?.getBoundingClientRect()
    setStore("viewport", {
      width: Math.max(store.viewport.width, (div?.width ?? 0) / newScale),
      height: Math.max(store.viewport.height, (div?.height ?? 0) / newScale),
    });

  };

  return (
    <div ref={zoomable} id="zoom" onwheel={handleWheel}>
      {props.children}
    </div>
  );
};
