import Svg from "../nodes/Svg"
import { FaSolidArrowLeftLong, FaSolidArrowRightLong } from "solid-icons/fa"
import { CgBorderStyleDashed } from "solid-icons/cg"
import { BsBorderWidth } from "solid-icons/bs"
import { For, JSX, Match, Show, Switch, createEffect, createMemo, createSignal } from "solid-js"
import { store } from "../../shared/store"
import { findEdgeById, updateEdge } from "../../shared/update"

type StyleKind = "Color" | "Start" | "End" | "Label" | "Style" | "Stroke"

export default () => {
    let root!: HTMLDivElement
    const [style, setStyle] = createSignal<StyleKind | null>(null)
    const [top, setTop] = createSignal(0)

    const color = () =>
        store.selectedEdge ? findEdgeById(store.selectedEdge)?.color ?? "#444444" : "#EC4899"

    const pick = (k: StyleKind) => (e: MouseEvent) => {
        const b = (e.currentTarget as HTMLElement).getBoundingClientRect()
        setTop(b.top - root.getBoundingClientRect().top)
        setStyle(style() === k ? null : k)
    }

    // close when the selection changes
    createEffect(() => {
        store.selectedEdge
        setStyle(null)
    })

    return (
        <div id="edges_styles" class="p-2 relative pointer-events-auto" ref={root}>
            <div class="overflow-hidden w-[65px] p-4 bg-background border-2 border-primary">
                <ToolButton label="Color" onClick={pick("Color")} bg={color()}>
                    <Svg width={32} height={32} classes="" icon_name="arrow" />
                </ToolButton>
                <ToolButton label="Start" onClick={pick("Start")}><FaSolidArrowLeftLong /></ToolButton>
                <ToolButton label="End" onClick={pick("End")}><FaSolidArrowRightLong /></ToolButton>
                <ToolButton label="Label" onClick={pick("Label")}>T</ToolButton>
                <ToolButton label="Style" onClick={pick("Style")}><CgBorderStyleDashed /></ToolButton>
                <ToolButton label="Stroke" onClick={pick("Stroke")}><BsBorderWidth /></ToolButton>
            </div>

            {/* outside the overflow-hidden box, always rendered */}
            <StylesModal style={style()} top={top()} />
        </div>
    )
}

function ToolButton(props: {
    label: string
    onClick: (e: MouseEvent) => void
    bg?: string
    children: JSX.Element
}) {
    return (
        <div
            class="flex group/hov flex-col space-y-4 overflow-x-visible relative transition duration-200 ease-out hover:translate-x-2 cursor-pointer"
            onClick={props.onClick}
        >
            <div>
                <div class="icon flex flex-col justify-center items-center z-10 bg-accent aspect-square group-hover/hov:bg-red-500 pointer-events-auto">
                    <div class="flex flex-col size-full p-2" style={props.bg ? { background: props.bg } : undefined}>
                        {!props.bg && <div class="border-b-0 h-1/6 w-full" />}
                        <div class="h-5/6 w-full flex items-center justify-center">{props.children}</div>
                    </div>
                </div>
                <p class="text-sm text-center">{props.label}</p>
            </div>
        </div>
    )
}


const COLORS = ["#EC4899", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#444444", "#FFFFFF"]
const HEADS = ["none", "arrow", "open", "diamond", "circle", "bar"]
const LINE_STYLES = ["solid", "dashed", "dotted"]
const STROKES = [1, 2, 3, 4, 6, 8]

/* head previews: tip at (0,0) pointing +x */
const PREVIEW: Record<string, string> = {
    arrow: "M0 0L-9 -3.6L-9 3.6Z",
    diamond: "M0 0L-4.5 -4.5L-9 0L-4.5 4.5Z",
    circle: "M0 0A4.5 4.5 0 1 0 -9 0A4.5 4.5 0 1 0 0 0Z",
    open: "M-9 -4.5L0 0L-9 4.5",
    bar: "M0 -5.5L0 5.5",
}
const OUTLINED = new Set(["open", "bar"])



const StylesModal = (props: { style: null | StyleKind; top: number }) => {
    const edge = createMemo(() => (store.selectedEdge ? findEdgeById(store.selectedEdge) : undefined))
    const patch = (p: Parameters<typeof updateEdge>[1]) => {
        const e = edge()
        if (e) updateEdge(e.id, p)
    }

    // keep the last value so the content doesn't vanish during the fade-out
    const [last, setLast] = createSignal<StyleKind>("Color")
    createEffect(() => props.style && setLast(props.style))
    const open = () => props.style !== null && !!edge()

    function IconOption(props: { active: boolean; title: string; onClick: () => void; children: any }) {
        return (
            <button
                title={props.title}
                class="size-9 flex items-center justify-center border-2 hover:bg-accent"
                classList={{ "border-primary bg-accent": props.active, "border-border": !props.active }}
                onClick={props.onClick}
            >
                {props.children}
            </button>
        )
    }

    function HeadIcon(props: { kind: string; start: boolean }) {
        return (
            <svg width="26" height="14" viewBox="0 0 26 14" class="overflow-visible">
                <line x1="2" y1="7" x2="24" y2="7" stroke="currentColor" stroke-width="2" />
                <Show when={PREVIEW[props.kind]}>
                    <path
                        d={PREVIEW[props.kind]}
                        transform={props.start ? "translate(2 7) rotate(180)" : "translate(24 7)"}
                        fill={OUTLINED.has(props.kind) ? "none" : "currentColor"}
                        stroke={OUTLINED.has(props.kind) ? "currentColor" : "none"}
                        stroke-width="2"
                        stroke-linejoin="round"
                    />
                </Show>
            </svg>
        )
    }
    return (
        <div
            class={`z-[10000] transition-all duration-200 ease-in-out absolute left-full ml-1 [box-shadow:5px_5px_var(--color-primary)]
          ${open() ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
            style={{ top: `${props.top}px` }}
        >
            <div id="colorSelectMenu" class="border-2 border-border p-3 w-fit bg-background space-y-3">
                <Switch>
                    <Match when={last() === "Color"}>
                        <div class="grid grid-cols-4 gap-2 w-30">
                            <For each={COLORS}>
                                {(c) => (
                                    <button
                                        class="size-6 border-2"
                                        classList={{
                                            "border-primary": edge()?.color === c,
                                            "border-border": edge()?.color !== c,
                                        }}
                                        style={{ background: c }}
                                        onClick={() => patch({ color: c })}
                                    />
                                )}
                            </For>
                        </div>
                        <input
                            type="color"
                            value={edge()?.color?.startsWith("#") ? edge()!.color! : "#444444"}
                            onInput={(e) => patch({ color: e.currentTarget.value })}
                        />
                    </Match>

                    <Match when={last() === "Start"}>
                        <div class="flex gap-1">
                            <For each={HEADS}>
                                {(h) => (
                                    <IconOption title={h} active={(edge()?.srcArrowHead ?? "none") === h}
                                        onClick={() => patch({ srcArrowHead: h })}>
                                        <HeadIcon kind={h} start />
                                    </IconOption>
                                )}
                            </For>
                        </div>
                    </Match>

                    <Match when={last() === "End"}>
                        <div class="flex gap-1">
                            <For each={HEADS}>
                                {(h) => (
                                    <IconOption title={h} active={(edge()?.DistArrowHead ?? "arrow") === h}
                                        onClick={() => patch({ DistArrowHead: h })}>
                                        <HeadIcon kind={h} start={false} />
                                    </IconOption>
                                )}
                            </For>
                        </div>
                    </Match>


                    <Match when={last() === "Label"}>
                        <input
                            class="border border-border bg-background px-2 py-1 text-sm w-40"
                            placeholder="Label…"
                            value={edge()?.label ?? ""}
                            onInput={(e) => patch({ label: e.currentTarget.value || undefined })}
                        />
                    </Match>

                    <Match when={last() === "Style"}>
                        <div class="flex gap-1">
                            <For each={LINE_STYLES}>
                                {(s) => (
                                    <IconOption title={s} active={(edge()?.style ?? "solid") === s}
                                        onClick={() => patch({ style: s })}>
                                        <svg width="26" height="8" class="overflow-visible">
                                            <line x1="1" y1="4" x2="25" y2="4" stroke="currentColor" stroke-width="2.5"
                                                stroke-dasharray={s === "dashed" ? "6 4" : s === "dotted" ? "0 5" : undefined}
                                                stroke-linecap={s === "dotted" ? "round" : "butt"} />
                                        </svg>
                                    </IconOption>
                                )}
                            </For>
                        </div>
                    </Match>

                    <Match when={last() === "Stroke"}>
                        <div class="flex gap-1">
                            <For each={STROKES}>
                                {(w) => (
                                    <IconOption title={`${w}px`} active={(edge()?.stroke ?? 2) === w}
                                        onClick={() => patch({ stroke: w })}>
                                        <svg width="26" height="10" class="overflow-visible">
                                            <line x1="1" y1="5" x2="25" y2="5" stroke="currentColor" stroke-width={w} />
                                        </svg>
                                    </IconOption>
                                )}
                            </For>
                        </div>
                    </Match>
                </Switch>
            </div>
        </div>
    )
}