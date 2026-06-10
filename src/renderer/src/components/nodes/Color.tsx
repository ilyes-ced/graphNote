import { Show } from "solid-js"
import { Color } from "../../types"
import Editor from "./Editor"

type ColorProps = Color & {
	is_child?: boolean
	nested?: number
}

export default (node: ColorProps) => {
	function getContrastText(bg: string) {
		const hex = bg.replace("#", "")

		const r = parseInt(hex.substring(0, 2), 16)
		const g = parseInt(hex.substring(2, 4), 16)
		const b = parseInt(hex.substring(4, 6), 16)

		// Perceived brightness
		const brightness = (r * 299 + g * 587 + b * 114) / 1000

		return brightness > 128 ? "text-black" : "text-white"
	}

	return (
		<div>
			<div
				class="aspect-5/4 w-full p-5 text-2xl font-extrabold cursor-pointer"
				style={{ background: node.colorValue, color: getContrastText(node.colorValue) === "text-black" ? "#000" : "#fff" }}
			>
				{node.colorValue.toUpperCase()}
			</div>

			<Show when={node.showDescription}>
				<div class="p-5">
					<Editor id={node.id} desc={node.description ?? ""} />
				</div>
			</Show>
		</div>
	)
}
