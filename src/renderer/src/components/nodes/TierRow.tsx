import { createEffect, createSignal, For, onCleanup, Show } from "solid-js"
import { IoSettingsSharp } from "solid-icons/io"
import { FaSolidChevronDown, FaSolidChevronUp } from "solid-icons/fa"
import { Tier } from "../../types"
import { readImage } from "../../shared/utils"
import { IMG_MIME, DragPayload } from "../../shared/tierImages"

export default function TierRow(props: {
    id: string
    nodeId: string
    tier: Tier
    index: number
    selected: number[]                                  // selected image indices in this tier
    onSelect: (imgIndex: number, additive: boolean) => void
    onClearSelection: () => void
    onMoveImages: (payload: DragPayload, insertAt: number) => void
    onDropFiles: (files: File[]) => void
    onMoveUp: () => void
    onMoveDown: () => void
    onSettings: () => void
}) {
    const [isOver, setIsOver] = createSignal(false)
    let depth = 0
    let imgBox!: HTMLDivElement

    const isInternal = (e: DragEvent) => !!e.dataTransfer?.types.includes(IMG_MIME)

    const accepts = (e: DragEvent) =>
        isInternal(e) ||
        [...(e.dataTransfer?.items ?? [])].some((i) => i.type.startsWith("image/"))

    // which slot the cursor is over; handles wrapped rows too
    const dropIndex = (e: DragEvent) => {
        const kids = [...imgBox.children] as HTMLElement[]
        for (let i = 0; i < kids.length; i++) {
            const r = kids[i].getBoundingClientRect()
            if (e.clientY < r.top || (e.clientY <= r.bottom && e.clientX < r.left + r.width / 2)) {
                return i
            }
        }
        return kids.length
    }

    return (
        <div class="flex flex-row">
            <div
                class="min-h-20 w-40 shrink-0 flex items-center justify-center text-background"
                style={{ background: props.tier.color }}
            >
                {props.tier.tier}
            </div>

            <div
                id={props.id}
                class="tierlist_row w-full flex items-center justify-between border-2 border-transparent"
                classList={{ "!border-white/40 !bg-white/10": isOver() }}
                style={{ background: props.index % 2 === 0 ? "#111111" : "#080808" }}
                onClick={() => props.onClearSelection()}
                onDragEnter={(e) => {
                    e.preventDefault()
                    if (!accepts(e)) return
                    depth++
                    setIsOver(true)
                }}
                onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer!.dropEffect = isInternal(e) ? "move" : "copy"
                }}
                onDragLeave={() => {
                    if (depth > 0 && --depth === 0) setIsOver(false)
                }}
                onDrop={(e) => {
                    e.preventDefault()
                    depth = 0
                    setIsOver(false)

                    const raw = e.dataTransfer?.getData(IMG_MIME)
                    if (raw) {
                        props.onMoveImages(JSON.parse(raw) as DragPayload, dropIndex(e))
                        return
                    }

                    const files = [...(e.dataTransfer?.files ?? [])].filter((f) =>
                        f.type.startsWith("image/")
                    )
                    if (files.length) props.onDropFiles(files)
                }}
            >
                <div ref={imgBox} class="flex flex-row flex-wrap gap-1 p-1">
                    <For each={props.tier.imgPaths ?? []}>
                        {(path, i) => (
                            <div
                                draggable={true}
                                class="cursor-grab"
                                classList={{ "outline outline-2 outline-sky-400": props.selected.includes(i()) }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    props.onSelect(i(), e.ctrlKey || e.metaKey || e.shiftKey)
                                }}
                                onDragStart={(e) => {
                                    // dragging a selected image drags the whole selection
                                    const indices = props.selected.includes(i()) ? props.selected : [i()]
                                    const payload: DragPayload = {
                                        nodeId: props.nodeId,
                                        fromTier: props.index,
                                        indices,
                                    }
                                    e.dataTransfer!.setData(IMG_MIME, JSON.stringify(payload))
                                    e.dataTransfer!.effectAllowed = "move"
                                }}
                            >
                                <TierImage path={path} />
                            </div>
                        )}
                    </For>
                </div>

                <div class="flex flex-row items-center h-20 aspect-square shrink-0">
                    <div class="w-1/2 h-1/2">
                        <IoSettingsSharp
                            onClick={props.onSettings}
                            class="tier_list_settings cursor-pointer size-full border border-transparent hover:bg-white/10"
                        />
                    </div>
                    <div class="flex flex-col h-full w-1/2">
                        <FaSolidChevronUp
                            onClick={props.onMoveUp}
                            class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10"
                        />
                        <FaSolidChevronDown
                            onClick={props.onMoveDown}
                            class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

// TierImage: unchanged



function TierImage(props: { path: string }) {
    const [src, setSrc] = createSignal("")

    createEffect(() => {
        const path = props.path          // tracked, reloads if the path changes
        let cancelled = false

            ; (async () => {
                try {
                    const data = await readImage(path)
                    if (!cancelled) setSrc(data)
                } catch {
                    if (!cancelled) setSrc(await readImage("image/placeholder.png"))
                }
            })()

        onCleanup(() => (cancelled = true))
    })

    return (
        <Show when={src()}>
            <img src={src()} class="tierRowImage w-40 object-cover" draggable={false} />
        </Show>
    )
}