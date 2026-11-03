import { For, Show } from "solid-js"
import { TierList } from "../../types"
import Editor from "./Editor"
import EditableTitle from "./EditableTitle"
import { FaSolidChevronDown, FaSolidChevronUp } from 'solid-icons/fa'
import { IoSettingsSharp } from 'solid-icons/io'
import TierRow from "./TierRow"

type TierListProps = TierList & {
    is_child?: boolean
    nested?: number
}

export default (node: TierListProps) => {

    return (
        <div class="flex flex-col">
            <Show when={node.showTitle}>
                <div class="text-2xl font-bold mb-4">
                    <EditableTitle nodeId={node.id} title={node.title || ""} />
                </div>
            </Show>

            <div class="divide-y-2 divide-amber-800">
                <For each={node.data}>
                    {(tier, index) => (
                        <TierRow
                            tier={tier}
                            index={index()}
                            onDropFiles={(files) => addImages(node.id, index(), files)}
                            onMoveUp={() => moveTier(node.id, index(), -1)}
                            onMoveDown={() => moveTier(node.id, index(), 1)}
                            onSettings={() => openTierSettings(node.id, index())}
                        />
                    )}
                </For>
            </div>


            <Show when={node.showDescription}>
                <Editor id={node.id} desc={node.description ?? '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null}}]}'} />
            </Show>
        </div >
    )
}
