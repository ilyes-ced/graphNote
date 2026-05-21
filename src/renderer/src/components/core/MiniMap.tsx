import { createSignal, onMount } from "solid-js";
import { store } from "../../shared/store";

export default (props: { wrapperRef: any }) => {
  const aspectRatio = () =>
    `${store.viewport.width} / ${store.viewport.height}`;

  const posX = () =>
    Math.round(((-store.viewport.x / store.viewport.width) / store.viewport.scale) * 100);

  const posY = () =>
    Math.round(((-store.viewport.y / store.viewport.height) / store.viewport.scale) * 100);

  const width = () =>
    Math.round(Math.round(((wrapperSize().width / store.viewport.width) / store.viewport.scale) * 100) / 5) * 5;

  const height = () =>
    Math.round(Math.round(((wrapperSize().height / store.viewport.height) / store.viewport.scale) * 100) / 5) * 5;

  const [wrapperSize, setWrapperSize] = createSignal({
    width: 0,
    height: 0,
  });

  onMount(() => {
    const el = props.wrapperRef()?.();
    console.log(el)
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      setWrapperSize({
        width: rect.width,
        height: rect.height,
      });
    });

    observer.observe(el);
  });

  return (
    <div
      id="minimap"
      class="absolute bottom-3.25 right-3.5 w-67.5 border border-primary p-2.5 z-1000"
      style={{ "aspect-ratio": aspectRatio() }}
    >

      <div class="relative size-full border border-border bg-card z-1000" >
        <div
          class="bg-primary/20 border border-primary"
          style={{
            position: "absolute",
            left: `${posX()}%`,
            top: `${posY()}%`,
            width: `${width()}%`,
            height: `${height()}%`,
          }}
        >
          {posX()}//

          {posY()}//

          {width()}//

          {height()}//

        </div>
      </div>
    </div>
  );
};

/*

#minimap {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 240px;
  height: 135px;
}
#minimap > * {
  border-radius: 10px;
  border: 1px solid #88888820;
  background-color: #88888810;
  z-index: 1000;
}
*/
