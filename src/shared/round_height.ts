export function heightSnap(el: HTMLDivElement) {
  const round_up = (value: number) => Math.ceil(value / 10) * 10;

  const enforceHeight = () => {
    const currentHeight = el.offsetHeight;
    const rounded = round_up(currentHeight);
    if (currentHeight !== rounded) {
      el.style.height = `${rounded}px`;
    }
  };

  const observer = new ResizeObserver(enforceHeight);
  observer.observe(el);

  // Initial enforcement
  enforceHeight();

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
