import { createSignal, createEffect } from "solid-js";
import { Edge } from "../../types";
import { edgePoint, getPorts, sidePoint, watchElementPosition } from "./utils";


export default function StepEdgeArrow(edge: Edge) {
  const srcPos = watchElementPosition(edge.srcNodeId);
  const distPos = watchElementPosition(edge.distNodeId);

  const [start, setStart] = createSignal({ x: 0, y: 0 });
  const [end, setEnd] = createSignal({ x: 0, y: 0 });
  const [arrowEnd, setArrowEnd] = createSignal({ x: 0, y: 0 });



  createEffect(() => {
    const s = srcPos();
    const d = distPos();

    if (!s || !d) return;

    const ports = getPorts(s, d);

    const startPoint = sidePoint(s, ports.src);
    const endPoint = sidePoint(d, ports.dst);

    setStart(startPoint);
    setArrowEnd(endPoint);

    //setArrowEnd(edgePoint(d, startCenter));
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
          id={`arrowhead_${edge.id}`}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polyline
            points="0,1 7,4 0,7"
            fill="none"
            stroke={edge.color ?? "blue"}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </marker>
      </defs>
      <path
        d={d()}
        stroke={edge.color ?? "blue"}
        fill="none"
        stroke-width={edge.stroke ?? 2}
        pointer-events="stroke"
        marker-end={`url(#arrowhead_${edge.id})`} // attach the arrowhead
        onClick={() => console.log("Arrow clicked!")}
      />

      {/* Optional endpoints */}
      <circle cx={start().x} cy={start().y} r="4" fill="black" />
      <circle cx={end().x} cy={end().y} r="4" fill="black" />
    </svg>
  );
}