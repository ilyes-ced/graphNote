import { onMount, createSignal, Show, createEffect } from "solid-js"
import { Image } from "../../types"
import Editor from "./Editor"
import { readImage } from "../../shared/utils"
import { MdFillCloud_upload } from 'solid-icons/md'
import { updateImgPath } from "../../shared/update"

type ImageProps = Image & {
	is_child?: boolean
}

export default (node: ImageProps) => {
	const [imgSrc, setImgSrc] = createSignal("")

	const loadImage = async () => {
		try {
			setImgSrc(await readImage(node.path))
		} catch (err) {
			setImgSrc(await readImage("image/placeholder.png"))
		}
	}
	onMount(async () => {
		await loadImage()
	})



	const pickFile = async () => {
		const path = await window.api.selectFile()
		//TODO: here update the image path
		updateImgPath(node.id, path)

		loadImage()
	}

	return (
		<div>
			<Show when={node.path === ""}>
				<div onClick={() => { console.log("JJJJJJJJJJJJJJJJJJJJ"); pickFile() }} class="w-full aspect-video flex items-center justify-center cursor-pointer">
					<MdFillCloud_upload class="size-1/3" />
				</div>
			</Show>


			<img class="pointer-events-none" style={{ width: "100%" }} src={imgSrc()} alt={node.path} />
			<Show when={node.showDescription && node.path !== ""}>
				<Editor id={node.id} desc={node.description ?? ""} />
			</Show>
		</div>
	)
}
