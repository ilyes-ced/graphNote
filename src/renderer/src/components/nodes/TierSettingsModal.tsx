import { createSignal, onCleanup, onMount, Show } from "solid-js"
import { Portal } from "solid-js/web"
import { Tier } from "../../types"

const SWATCHES = ["#ff7f7f", "#ffbf7f", "#ffdf7f", "#ffff7f", "#bfff7f", "#7fff7f", "#7fbfff", "#bf7fff"]

export default function TierSettingsModal(props: {
    tier: Tier
    canDelete: boolean
    onRename: (name: string) => void
    onColor: (color: string) => void
    onAddAbove: () => void
    onAddBelow: () => void
    onClear: () => void
    onDelete: () => void
    onClose: () => void
}) {
    const [confirmDelete, setConfirmDelete] = createSignal(false)

    onMount(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && props.onClose()
        window.addEventListener("keydown", onKey)
        onCleanup(() => window.removeEventListener("keydown", onKey))
    })

    const btn = "px-3 py-2 bg-white/10 hover:bg-white/20 text-sm"

    return (
        <Portal>
            <div
                class="fixed inset-0 z-100000 flex items-center justify-center bg-black/60"
                onClick={props.onClose}
            >
                <div
                    class="w-96 max-w-[90vw] flex flex-col gap-4 bg-neutral-900 p-5 text-white shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 class="text-lg font-bold">Row settings</h2>

                    {/* name: committed on blur / Enter */}
                    <label class="flex flex-col gap-1 text-sm">
                        Name
                        <input
                            class="bg-white/10 px-2 py-1"
                            value={props.tier.tier}
                            onChange={(e) => props.onRename(e.currentTarget.value)}
                            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                        />
                    </label>

                    {/* color: native change event fires when the picker closes, not on every drag */}
                    <div class="flex flex-col gap-2 text-sm">
                        Color
                        <div class="flex items-center gap-2">
                            <input
                                type="color"
                                value={props.tier.color}
                                onChange={(e) => props.onColor(e.currentTarget.value)}
                                class="h-8 w-12 cursor-pointer bg-transparent"
                            />
                            <div class="flex flex-wrap gap-1">
                                {SWATCHES.map((c) => (
                                    <button
                                        class="size-6 border border-white/30"
                                        style={{ background: c }}
                                        onClick={() => props.onColor(c)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                        <button class={btn} onClick={props.onAddAbove}>Add row above</button>
                        <button class={btn} onClick={props.onAddBelow}>Add row below</button>
                    </div>

                    <div class="flex flex-col gap-2">
                        <button
                            class={btn}
                            disabled={!props.tier.imgPaths?.length}
                            onClick={props.onClear}
                        >
                            Clear images ({props.tier.imgPaths?.length ?? 0})
                        </button>

                        <Show when={props.canDelete}>
                            <button
                                class="px-3 py-2 text-sm bg-red-900/60 hover:bg-red-800"
                                onClick={() => (confirmDelete() ? props.onDelete() : setConfirmDelete(true))}
                            >
                                {confirmDelete() ? "Click again to confirm delete" : "Delete row"}
                            </button>
                        </Show>
                    </div>

                    <button class={btn} onClick={props.onClose}>Done</button>
                </div>
            </div>
        </Portal>
    )
}