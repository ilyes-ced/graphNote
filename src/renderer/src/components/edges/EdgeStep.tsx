import { createSignal, createEffect } from "solid-js";
import { Edge } from "../../types";
import { getPorts, portVector, sidePoint, watchElementPosition } from "./utils";


export default function StepEdgeArrow(edge: Edge) {
  const srcPos = watchElementPosition(edge.srcNodeId);
  const distPos = watchElementPosition(edge.distNodeId);

  const [start, setStart] = createSignal({ x: 0, y: 0 });
  const [end, setEnd] = createSignal({ x: 0, y: 0 });
  const [arrowEnd, setArrowEnd] = createSignal({ x: 0, y: 0 });

  type Side = "top" | "bottom" | "left" | "right";
  const [srcSide, setSrcSide] = createSignal<Side>("right");
  const [dstSide, setDstSide] = createSignal<Side>("left");

  createEffect(() => {
    const s = srcPos();
    const d = distPos();

    if (!s || !d) return;
    const ports = getPorts(s, d);

    setSrcSide(ports.src);
    setDstSide(ports.dst);

    const startPoint = sidePoint(s, ports.src);
    const endPoint = sidePoint(d, ports.dst);

    setStart(startPoint);
    setArrowEnd(endPoint);
  });

  const d = () => {
    const s = start();
    const e = arrowEnd();

    const sSide = srcSide();
    const eSide = dstSide();

    if (!s || !e) return "";

    const gap = 30;

    const sv = portVector(sSide, gap);
    const ev = portVector(eSide, gap);

    const p1 = { x: s.x + sv.x, y: s.y + sv.y };
    const p4 = { x: e.x + ev.x, y: e.y + ev.y };

    const midX = (p1.x + p4.x) / 2;
    const midY = (p1.y + p4.y) / 2;

    return `
    M ${s.x} ${s.y}
    L ${p1.x} ${p1.y}
    L ${midX} ${p1.y}
    L ${midX} ${p4.y}
    L ${p4.x} ${p4.y}
    L ${e.x} ${e.y}
  `;
  };

  return (
    <svg class="size-full pointer-events-none absolute top-0 left-0 z-10000000">
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
        marker-end={`url(#arrowhead_${edge.id})`}
        onClick={() => console.log("Arrow clicked!")}
      />

      {/* Optional endpoints */}
      <circle cx={start().x} cy={start().y} r="4" fill="black" />
      <circle cx={end().x} cy={end().y} r="4" fill="black" />
    </svg>
  );
}

