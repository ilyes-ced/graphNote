import { createSignal, createEffect } from "solid-js";
import { Edge } from "../../types";
import { edgePoint, watchElementPosition } from "./utils";


export default function StepEdgeArrow(props: Edge) {
  const srcPos = watchElementPosition(props.srcNodeId);
  const distPos = watchElementPosition(props.distNodeId);

  const [start, setStart] = createSignal({ x: 0, y: 0 });
  const [end, setEnd] = createSignal({ x: 0, y: 0 });
  const [arrowEnd, setArrowEnd] = createSignal({ x: 0, y: 0 });



  createEffect(() => {
    const s = srcPos();
    const d = distPos();

    if (!s || !d) return;

    const startCenter = { x: s.x + s.width / 2, y: s.y + s.height / 2 };
    const endCenter = { x: d.x + d.width / 2, y: d.y + d.height / 2 };

    setStart(startCenter);
    setEnd(endCenter);

    setArrowEnd(edgePoint(d, startCenter));
  });

  const d = () => {
    const s = start();
    const e = arrowEnd();
    if (!s || !e) return "";
    return `M ${s.x} ${s.y} L ${e.x} ${e.y}`;
  };

  return (
    <svg class="size-full pointer-events-none absolute top-0 left-0">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={props.color ?? "blue"} />
        </marker>
      </defs>
      <path
        d={d()}
        stroke={props.color ?? "blue"}
        fill="none"
        stroke-width={props.stroke ?? 2}
        pointer-events="stroke"
        marker-end="url(#arrowhead)" // attach the arrowhead
        onClick={() => console.log("Arrow clicked!")}
      />

      {/* Optional endpoints */}
      <circle cx={start().x} cy={start().y} r="4" fill="black" />
      <circle cx={end().x} cy={end().y} r="4" fill="black" />
    </svg>
  );
}