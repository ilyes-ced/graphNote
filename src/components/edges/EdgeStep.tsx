import { createSignal, onMount, onCleanup } from "solid-js";
import { store } from "../store";
import { findNodeById } from "@/shared/update";
import { Edge } from "@/types";

export default function StepEdgeArrow(props: Edge) {
  const [start, setStart] = createSignal({ x: 0, y: 0 });
  const [end, setEnd] = createSignal({ x: 0, y: 0 });

  const updatePositions = () => {
    const srcNode = findNodeById(props.srcNodeId);
    const distNode = findNodeById(props.distNodeId);

    if (!srcNode || !distNode) return;

    const startPos = {
      x: srcNode.x + (srcNode.width ?? 300) / 2,
      y: srcNode.y,
    };
    const endPos = {
      x: distNode.x + (distNode.width ?? 300) / 2,
      y: distNode.y,
    };

    setStart(startPos);
    setEnd(endPos);
  };

  onMount(() => {
    updatePositions();
    const interval = setInterval(updatePositions, 100);
    onCleanup(() => clearInterval(interval));
  });

  // 🧠 Step path logic (horizontal-first)
  const d = () => {
    const s = start();
    const e = end();
    const midX = (s.x + e.x) / 2;

    return `M ${s.x} ${s.y} L ${midX} ${s.y} L ${midX} ${e.y} L ${e.x} ${e.y}`;
  };

  return (
    <svg class="size-full pointer-events-none absolute top-0 left-0">
      {/* Step Line */}
      <path
        d={d()}
        stroke={props.color ?? "blue"}
        fill="none"
        stroke-width={props.stroke ?? 2}
      />

      {/* Optional: Endpoints */}
      <circle cx={start().x} cy={start().y} r="4" fill="black" />
      <circle cx={end().x} cy={end().y} r="4" fill="black" />
    </svg>
  );
}
