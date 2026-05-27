import { onMount, createSignal, Show } from 'solid-js'
import { Image } from '../../types'
import Editor from './Editor'
import { readImage } from '../../shared/utils'

type ImageProps = Image & {
	is_child?: boolean
}

export default (node: ImageProps) => {
	const [imgSrc, setImgSrc] = createSignal('')

	onMount(async () => {
		try {
			setImgSrc(await readImage(node.path))
		} catch (err) {
			setImgSrc(await readImage('image/placeholder.png'))
		}
	})

	return (
		<div>
			<img style={{ width: '100%' }} src={imgSrc()} alt={node.path} />

			<Show when={node.showDescription}>
				<div class="p-5">
					<Editor id={node.id} desc={node.description ?? ''} />
				</div>
			</Show>
		</div>
	)
}
