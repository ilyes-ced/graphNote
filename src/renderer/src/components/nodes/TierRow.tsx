// TierRow.tsx
import { createSignal, For } from "solid-js"
import { IoSettingsSharp } from "solid-icons/io"
import { FaSolidChevronDown, FaSolidChevronUp } from "solid-icons/fa"

type Tier = { tier: string; color: string; items?: string[] }

export default function TierRow(props: {
    tier: Tier
    index: number
    onDropFiles: (files: File[]) => void
    onMoveUp: () => void
    onMoveDown: () => void
    onSettings: () => void
}) {
    const [isOver, setIsOver] = createSignal(false)
    let depth = 0

    const hasImage = (e: DragEvent) =>
        [...(e.dataTransfer?.items ?? [])].some(i => i.type.startsWith("image/"))

    return (
        <div class="flex flex-row">
            <div
                class="min-h-20 w-40 shrink-0 flex items-center justify-center"
                style={{ background: props.tier.color }}
            >
                {props.tier.tier}
            </div>

            <div
                class="tierlist_row w-full flex items-center justify-between border-2 border-transparent"
                classList={{ "!border-white/40 !bg-white/10": isOver() }}
                style={{ background: props.index % 2 === 0 ? "#111111" : "#080808" }}
                onDragEnter={(e) => {
                    e.preventDefault()
                    if (!hasImage(e)) return
                    depth++
                    setIsOver(true)
                }}
                onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer!.dropEffect = "copy"
                }}
                onDragLeave={() => {
                    if (depth > 0 && --depth === 0) setIsOver(false)
                }}
                onDrop={(e) => {
                    e.preventDefault()
                    depth = 0
                    setIsOver(false)
                    const files = [...(e.dataTransfer?.files ?? [])].filter(f =>
                        f.type.startsWith("image/")
                    )
                    if (files.length) props.onDropFiles(files)
                }}
            >
                <div class="flex flex-row flex-wrap gap-1 p-1">
                    <For each={props.tier.items ?? []}>
                        {(src) => <img src={src} class="h-18 w-18 object-cover" draggable={false} />}
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