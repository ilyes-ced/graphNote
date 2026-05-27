import { onMount, onCleanup } from "solid-js"
import * as PIXI from "pixi.js"

export default function Canvas() {
	let container!: HTMLDivElement

	let app: PIXI.Application

	onMount(async () => {
		app = new PIXI.Application()

		await app.init({
			resizeTo: container,
			background: "#1e1e1e",
			antialias: true
		})

		container.appendChild(app.canvas)

		// TEST NODE
		const card = new PIXI.Graphics()

		card.roundRect(0, 0, 200, 120, 16)
		card.fill("#2d2d2d")

		card.x = 300
		card.y = 200

		app.stage.addChild(card)
	})

	onCleanup(() => {
		app.destroy(true)
	})

	return (
		<div
			ref={container}
			style={{
				width: "100%",
				height: "100%"
			}}
		/>
	)
}
