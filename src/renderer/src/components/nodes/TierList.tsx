import { For, Show } from "solid-js"
import { TierList } from "../../types"
import Editor from "./Editor"
import EditableTitle from "./EditableTitle"

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


            <div class="divide-2 divide-amber-800">

                <For each={node.data}>
                    {(tier, index) => (
                        <div class="flex flex-row">
                            <div class="p-10" style={{ background: tier.color }}>
                                {tier.tier}
                            </div>
                            <div class="w-full" style={{ background: index() % 2 === 0 ? "#111111" : "#080808" }}>
                            </div>
                        </div>
                    )}
                </For >
            </div >


            <Show when={node.showDescription}>
                <Editor id={node.id} desc={node.description ?? ""} />
            </Show>
        </div >
    )
}
