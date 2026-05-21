import { store, setStore } from "../../shared/store";

export default (props: any) => {
  let zoomable!: HTMLDivElement;


  const ZOOM_LEVELS = [
    0.5,
    0.67,
    0.75,
    0.8,
    0.9,
    1,
    1.1,
    1.25,
    1.5,
    1.75,
    2,
    2.5,
    3,
  ];

  const handleWheel = async (e: WheelEvent) => {
    if (!e.ctrlKey) return;

    e.preventDefault();

    const rect = zoomable.getBoundingClientRect();

    // mouse in screen space
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const prevScale = store.viewport.scale;


    const currentIndex = ZOOM_LEVELS.reduce((closest, z, i) => {
      return Math.abs(z - store.viewport.scale) <
        Math.abs(ZOOM_LEVELS[closest] - store.viewport.scale)
        ? i
        : closest;
    }, 0);

    let zoomIndex = currentIndex + (e.deltaY > 0 ? -1 : 1);

    zoomIndex = Math.max(
      0,
      Math.min(ZOOM_LEVELS.length - 1, zoomIndex)
    );

    const newScale = ZOOM_LEVELS[zoomIndex];



    const vp = store.viewport;

    // 🔥 world coordinate under mouse BEFORE zoom
    const worldX = (mouseX - vp.x) / prevScale;
    const worldY = (mouseY - vp.y) / prevScale;

    // 🔥 new translation so cursor stays fixed
    const newX = mouseX - worldX * newScale;
    const newY = mouseY - worldY * newScale;

    setStore("viewport", {
      scale: newScale,
      x: newX <= 0 ? Math.round(newX) : 0,
      y: newY <= 0 ? Math.round(newY) : 0,
    });


    //? helps with when you zoom back out it makes the text not pixelized
    const el = document.getElementById("viewport-content");
    if (el) {
      el.style.display = "none";
      el.offsetHeight; // force reflow
      el.style.display = "";
    }


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
