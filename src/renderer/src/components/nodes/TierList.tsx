import { createSignal, For, onCleanup, onMount, Show } from "solid-js"
import { TierList, Tier } from "../../types"
import Editor from "./Editor"
import EditableTitle from "./EditableTitle"
import TierRow from "./TierRow"
import { DragPayload, moveImgs, removeImgs } from "../../shared/tierImages"
import { clone, setTiers } from "../../shared/update"
import TierSettingsModal from "./TierSettingsModal"

type TierListProps = TierList & {
    is_child?: boolean
    nested?: number
}

export default (node: TierListProps) => {
    const [sel, setSel] = createSignal<{ tier: number; idx: number[] } | null>(null)

    const addImages = (nodeId: string, index: number, files: File[]) => {
        console.log(nodeId, index, files)
    }

    const commit = (lists: string[][]) =>
        commitTiers(snapshot().map((t, i) => ({ ...t, imgPaths: lists[i] })))

    const select = (tier: number, i: number, additive: boolean) => {
        const cur = sel()
        if (additive && cur?.tier === tier) {
            setSel({
                tier,
                idx: cur.idx.includes(i) ? cur.idx.filter((x) => x !== i) : [...cur.idx, i],
            })
        } else {
            setSel({ tier, idx: [i] })
        }
    }

    const moveImages = (toTier: number, p: DragPayload, insertAt: number) => {
        if (p.nodeId !== node.id) return   // cross-list drops not handled
        commit(moveImgs(node.tiers, p.fromTier, p.indices, toTier, insertAt))
        setSel(null)
    }

    const deleteSelected = () => {
        const s = sel()
        if (!s || !s.idx.length) return
        commit(removeImgs(node.tiers, s.tier, s.idx))
        setSel(null)
    }

    onMount(() => {
        const onKey = (e: KeyboardEvent) => {
            if (settingsIdx() !== null) return
            // don't hijack typing in inputs or the rich text editor
            if ((e.target as HTMLElement).closest("input, textarea, [contenteditable='true']")) return
            if (e.key === "Delete" || e.key === "Backspace") deleteSelected()
            if (e.key === "Escape") setSel(null)
        }
        window.addEventListener("keydown", onKey)
        onCleanup(() => window.removeEventListener("keydown", onKey))
    })


    const [settingsIdx, setSettingsIdx] = createSignal<number | null>(null)

    const snapshot = () => clone(node.tiers) as Tier[]

    // single entry point for every tier change; returns undo/redo for your history system
    const commitTiers = (next: Tier[]) => {
        const prev = snapshot()
        setTiers(node.id, next)
        setSel(null)                       // image indices may no longer be valid
        return {
            undo: () => setTiers(node.id, clone(prev)),
            redo: () => setTiers(node.id, clone(next)),
        }
    }

    const moveTier = (_nodeId: string, i: number, dir: -1 | 1) => {
        const j = i + dir
        if (j < 0 || j >= node.tiers.length) return
        const next = snapshot()
            ;[next[i], next[j]] = [next[j], next[i]]
        return commitTiers(next)
    }

    const openTierSettings = (_nodeId: string, i: number) => setSettingsIdx(i)

    const editTier = (i: number, patch: Partial<Tier>) =>
        commitTiers(snapshot().map((t, k) => (k === i ? { ...t, ...patch } : t)))

    const addTier = (at: number) => {
        const next = snapshot()
        const id = Math.max(0, ...next.map((t) => t.id)) + 1
        next.splice(at, 0, { id, tier: "New", color: "#808080", imgPaths: [] })
        commitTiers(next)
        setSettingsIdx(null)
    }

    const deleteTier = (i: number) => {
        if (node.tiers.length <= 1) return
        const next = snapshot()
        next.splice(i, 1)
        commitTiers(next)
        setSettingsIdx(null)
    }

    return (
        <div class="flex flex-col">
            <Show when={node.showTitle}>
                <div class="p-2 text-2xl font-bold">
                    <EditableTitle nodeId={node.id} title={node.title || ""} />
                </div>
            </Show>

            <div class="divide-y-2 divide-amber-800">
                <For each={node.tiers}>
                    {(tier, index) => (
                        <div>
                            <TierRow
                                id={`${node.id}-${tier.id}`}
                                nodeId={node.id}
                                tier={tier}
                                index={index()}
                                selected={sel()?.tier === index() ? sel()!.idx : []}
                                onSelect={(i, additive) => select(index(), i, additive)}
                                onClearSelection={() => setSel(null)}
                                onMoveImages={(p, at) => moveImages(index(), p, at)}
                                onDropFiles={(files) => addImages(node.id, index(), files)}
                                onMoveUp={() => moveTier(node.id, index(), -1)}
                                onMoveDown={() => moveTier(node.id, index(), 1)}
                                onSettings={() => openTierSettings(node.id, index())}
                            />
                        </div>
                    )}
                </For>
            </div>

            <Show when={node.showDescription}>
                <Editor
                    id={node.id}
                    desc={node.description ?? '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null}}]}'}
                />
            </Show>


            <Show when={settingsIdx() !== null && node.tiers[settingsIdx()!]}>
                <TierSettingsModal
                    tier={node.tiers[settingsIdx()!]}
                    canDelete={node.tiers.length > 1}
                    onRename={(name) => editTier(settingsIdx()!, { tier: name })}
                    onColor={(color) => editTier(settingsIdx()!, { color })}
                    onAddAbove={() => addTier(settingsIdx()!)}
                    onAddBelow={() => addTier(settingsIdx()! + 1)}
                    onClear={() => editTier(settingsIdx()!, { imgPaths: [] })}
                    onDelete={() => deleteTier(settingsIdx()!)}
                    onClose={() => setSettingsIdx(null)}
                />
            </Show>
        </div>
    )
}