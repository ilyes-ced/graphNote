import { store } from '../../shared/store'
import { unsetStripColor, updateNodeColor } from '../../shared/update'
import { createSignal, For } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { DefaultColorPicker } from '@thednp/solid-color-picker'
import '@thednp/solid-color-picker/style.css'
import { oklchToRgb } from '../../shared/utils'
import { ColorType } from '../../types'

// first color is default
const bgColorList: ColorType[] = [
	getComputedStyle(document.documentElement).getPropertyValue('--color-card').trim() as ColorType,
	'#f54a00',
	'#fd9a00',
	'#00bc7d',
	'#1447e6',
	'#ad46ff',
	'#ff2056',

	'#bbbec3',
	'#62dbc8',
	'#7cd651',
	'#d58558',
	'#ffd14d',
	'#ff8d48',
	'#ff5757',
	'#ff6ed4',
	'#ad6fff',
	'#4ebafd',
	'#5882f8',

	'#0dd1a7',
	'#818e99',
	'#566468',
	'#a46265',
	'#72272b',
	'#d17524',
	'#d5b05c',
	'#d2c7c5'
]

const textColorList: ColorType[] = [
	getComputedStyle(document.documentElement).getPropertyValue('--color-foreground').trim() as ColorType,
	'#f54a00',
	'#fd9a00',
	'#00bc7d',
	'#1447e6',
	'#ad46ff',
	'#ff2056',

	'#72272b',
	'#204260',
	'#566468',
	'#4d191c',
	'#132839',
	'#04483a',
	'#265073',
	'#7d4046',
	'#8000ff',
	'#26004d'
]

type comboType = { bg: ColorType; fg: ColorType }
const textBgComboColorList: comboType[] = [
	{
		bg: getComputedStyle(document.documentElement).getPropertyValue('--color-card').trim() as ColorType,
		fg: getComputedStyle(document.documentElement).getPropertyValue('--color-foreground').trim() as ColorType
	},
	{
		bg: '#fd9a00',
		fg: '#ad46ff'
	},
	{
		bg: '#f54a00',
		fg: '#ad46ff'
	},
	{
		bg: '#0dd1a7',
		fg: '#72272b'
	},

	{
		bg: '#d5b05c',
		fg: '#72272b'
	},

	{
		bg: '#0dd1a7',
		fg: '#204260'
	},

	{
		bg: '#818e99',
		fg: '#132839'
	},

	{
		bg: '#9ef9e5',
		fg: '#566468'
	},

	{
		bg: '#df9fa2',
		fg: '#4d191c'
	},

	{
		bg: '#d17524',
		fg: '#132839'
	},

	{
		bg: '#d5b05c',
		fg: '#04483a'
	},

	{
		bg: '#d2c7c5',
		fg: '#265073'
	},

	{
		bg: '#f4cc38',
		fg: '#7d4046'
	},

	{
		bg: '#00ff00',
		fg: '#8000ff'
	},

	{
		bg: '#e44e20',
		fg: '#26004d'
	}
]

export default () => {
	const [bgOrStrip, setBgOrStrip] = createSignal<0 | 1>(0)
	const colorSelections = [<BgColors />, <StripColors />]

	const groupClasses =
		'flex items-center justify-center w-1/2 p-2 aspect-2/1 cursor-pointer transition-colors duration-200 ease-in-out hover:bg-primary'
	return (
		<div
			class={`z-50 transition-all duration-200 ease-in-out absolute top-4 left-4 [box-shadow:5px_5px_var(--color-primary)]
          ${store.showColorMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
		>
			<div id="colorSelectMenu" class="border border-border p-4 w-fit bg-card space-y-4">
				{/* bg or strip selection */}
				<div class="flex space-x-4">
					<div
						class={groupClasses}
						classList={{
							'bg-primary': bgOrStrip() === 0
						}}
						onClick={() => setBgOrStrip(0)}
					>
						bg
					</div>
					<div
						class={groupClasses}
						classList={{
							'bg-primary': bgOrStrip() === 1
						}}
						onClick={() => setBgOrStrip(1)}
					>
						strip
					</div>
				</div>

				<Dynamic component={colorSelections[bgOrStrip()]} />
			</div>
		</div>
	)
}

const changeBg = (bg: ColorType | 'none') => {
	store.selectedNodes.forEach((nodeId) => {
		updateNodeColor(nodeId, 'bg', bg)
	})
}
const changeFg = (fg: ColorType | 'none') => {
	store.selectedNodes.forEach((nodeId) => {
		updateNodeColor(nodeId, 'fg', fg)
	})
}
const changeBgFg = (combo: comboType) => {
	store.selectedNodes.forEach((nodeId) => {
		updateNodeColor(nodeId, 'bg', combo.bg)
		updateNodeColor(nodeId, 'fg', combo.fg)
	})
}
const changeTopStrip = (color: ColorType | 'none') => {
	store.selectedNodes.forEach((nodeId) => {
		updateNodeColor(nodeId, 'strip', color)
	})
}

const BgColors = () => {
	return (
		<div class="space-y-2">
			{/* bg color selection */}
			<div class="grid grid-cols-5 gap-2">
				<For each={bgColorList}>
					{(bgColor) => (
						<div
							class="border border-border hover:border-foreground/70 cursor-pointer w-10 aspect-3/2 p-2"
							style={{ background: bgColor }}
							onClick={() => changeBg(bgColor)}
						></div>
					)}
				</For>
			</div>
			<DefaultColorPicker value={oklchToRgb(bgColorList[0])} onChange={(color) => changeBg(color as ColorType)} />

			<div class="my-4 w-full border-t border-border"></div>
			{/* text color selection */}
			<div class="grid grid-cols-5 gap-2">
				<For each={textColorList}>
					{(textColor) => (
						<div
							class="border border-border hover:border-foreground/70 cursor-pointer bg-accent w-10 aspect-3/2 flex items-center justify-center"
							style={{ color: textColor }}
							onClick={() => changeFg(textColor)}
						>
							A
						</div>
					)}
				</For>
			</div>
			<DefaultColorPicker value={oklchToRgb(textColorList[0])} onChange={(color) => changeFg(color as ColorType)} />

			<div class="w-full border-t border-border"></div>
			{/* text/bg color combo selection */}
			<div class="grid grid-cols-5 gap-2">
				<For each={textBgComboColorList}>
					{(combo) => (
						<div
							class="border border-border hover:border-foreground/70 cursor-pointer w-10 aspect-3/2 flex items-center justify-center"
							style={{ color: combo.fg, background: combo.bg }}
							onClick={() => changeBgFg(combo)}
						>
							A
						</div>
					)}
				</For>
			</div>
		</div>
	)
}

const StripColors = () => {
	return (
		<div class="space-y-2">
			{/* bg color selection */}
			<div class="grid grid-cols-5 gap-2">
				<div
					class="relative border border-border hover:border-foreground/70 cursor-pointer w-10 aspect-[3/2] bg-transparent"
					onClick={() => unsetStripColor()}
				>
					<div class="absolute top-1/2 left-1/2 w-[120%] h-[2px] bg-destructive rotate-30 -translate-x-1/2 -translate-y-1/2"></div>
				</div>
				<For each={bgColorList}>
					{(stripColor) => (
						<div
							class="border border-transparent hover:border-foreground/70 cursor-pointer w-10 aspect-3/2 p-2"
							style={{ background: stripColor }}
							onClick={() => changeTopStrip(stripColor)}
						></div>
					)}
				</For>
			</div>
			<DefaultColorPicker value="rgb(25,25,25)" onChange={(color) => console.log(color)} />
		</div>
	)
}
