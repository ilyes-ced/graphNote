import { Show } from 'solid-js'
import { Color } from '../../types'
import Editor from './Editor'

type ColorProps = Color & {
	is_child?: boolean
	nested?: number
}

export default (node: ColorProps) => {
	return (
		<div>
			<div class="aspect-5/4 w-full p-5" style={{ background: node.colorValue }}>
				{node.colorValue}
			</div>

			<Show when={node.showDescription}>
				<div class="p-5">
					<Editor id={node.id} desc={node.description ?? ''} />
				</div>
			</Show>
		</div>
	)
}
