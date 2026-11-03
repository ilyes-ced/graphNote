import { JSX, Match, Show, Switch, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js"
import { Url } from "../../types"
import { AiOutlineDownload, AiOutlineLink } from "solid-icons/ai"
import { FaSolidPlay, FaSolidTrashAlt } from "solid-icons/fa"
import { TbOutlineResize } from "solid-icons/tb"
import { updateNodeDesc, updateURL } from "../../shared/update"
import { store } from "../../shared/store"
import Editor from "./Editor"
import "@videojs/html/video/player"
import "@videojs/html/video/skin"

type UrlProps = Url & {
	is_child?: boolean
}

type MetaData = {
	title: string
	description: string
	image: ArrayBuffer
	favicon: ArrayBuffer
}

const YOUTUBE_PATTERN = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/.+$/
const YOUTUBE_ID_PATTERN = /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/

const EMPTY_META: MetaData = {
	title: "",
	description: "",
	image: new ArrayBuffer(0),
	favicon: new ArrayBuffer(0)
}

const isYouTubeUrl = (url: string) => YOUTUBE_PATTERN.test(url)

const getYouTubeVideoId = (url: string) => url.match(YOUTUBE_ID_PATTERN)?.[1] ?? null

const isValidWebUrl = (value: string) => {
	try {
		const { protocol } = new URL(value)
		return protocol === "http:" || protocol === "https:"
	} catch {
		return false
	}
}

//? Builds the TipTap/ProseMirror doc JSON. JSON.stringify escapes quotes/newlines in the text for us.
const descriptionToDoc = (text: string) =>
	JSON.stringify({
		type: "doc",
		content: [{ type: "paragraph", content: text ? [{ type: "text", text }] : [] }]
	})

//? One shared button so the three action buttons don't each repeat the same border/shadow styles
const ActionButton = (props: {
	onClick: () => void
	highlighted?: boolean
	textColor?: string
	children: JSX.Element
}) => (
	<div
		onClick={props.onClick}
		class="cursor-pointer p-2 url_buttons"
		classList={{ "bg-primary/50 hover:bg-primary transition-colors": props.highlighted }}
		style={{
			border: "1px solid var(--color-primary)",
			color: props.textColor,
			"box-shadow": `0 0 12px ${props.textColor}22`
		}}
	>
		{props.children}
	</div>
)

//TODO: add caching system
//TODO: store them Documents/graphnote/cache and search there first if it doesnt exist do scrape_url
export default (node: UrlProps) => {
	let videoRef: HTMLVideoElement | undefined

	const [localVid, setLocalVid] = createSignal<string | null>(null)
	const [downloadProgress, setDownloadProgress] = createSignal(0)
	const [isPlaying, setIsPlaying] = createSignal(false)
	const [srcImage, setSrcImage] = createSignal("")
	const [srcFav, setSrcFav] = createSignal("")
	const [expand, setExpand] = createSignal(false) //TODO: nothing reads this yet, the resize button only toggles it
	const [ytVidDownloaded, setYtVidDownloaded] = createSignal(false)
	const [metaData, setMetaData] = createSignal<MetaData>(EMPTY_META)

	//? Synchronous + memoized. The old version was async, so it returned a (always truthy) Promise.
	const isYouTube = createMemo(() => isYouTubeUrl(node.url))

	// ---------- object URL handling ----------
	//? Track every blob URL we create so we can revoke the old one on replace and all of them on unmount
	const objectUrls = new Set<string>()
	onCleanup(() => {
		objectUrls.forEach(URL.revokeObjectURL)
		objectUrls.clear()
	})

	const setImageFromArrayBuffer = (buffer: ArrayBuffer, type: "image" | "favicon") => {
		if (!buffer || buffer.byteLength === 0) return
		const setter = type === "image" ? setSrcImage : setSrcFav
		const previous = type === "image" ? srcImage() : srcFav()
		if (previous) {
			URL.revokeObjectURL(previous)
			objectUrls.delete(previous)
		}
		const url = URL.createObjectURL(new Blob([buffer], { type: "image/png" })) // or jpeg/webp
		objectUrls.add(url)
		setter(url)
	}

	// ---------- local video / youtube cache ----------
	const loadLocalVideo = async (fileName: string) => {
		const videoFile = await window.api.getLocalVideo(fileName)
		setLocalVid(videoFile)
		setYtVidDownloaded(true)
	}

	//? Looks for an already-downloaded copy without downloading anything
	const syncCachedVideo = async () => {
		const res = await window.api.checkCacheYoutubeVidExists(node.url)
		setYtVidDownloaded(!!res.success)
		if (res.success) await loadLocalVideo(res.fileName)
	}

	const downloadVideo = async () => {
		const res = await window.api.cacheYoutubeVid(node.url)
		if (res.message === "file is already downloaded") await loadLocalVideo(res.fileName)
	}

	const deleteVideo = async () => {
		await window.api.deleteCachedYoutubeVid(node.url)
		setLocalVid(null)
		setYtVidDownloaded(false)
	}

	// ---------- metadata ----------
	const fetchMetaData = async (firstTime?: boolean) => {
		try {
			const res: MetaData | null = await window.api.scrapeUrl({
				url: node.url,
				cache: store.userConfig.cacheUrlData
			})
			if (!res) return
			setMetaData(res)
			setImageFromArrayBuffer(res.image, "image")
			setImageFromArrayBuffer(res.favicon, "favicon")
			if (firstTime || !node.description) {
				//? was node.description before, i.e. it wrote the old (empty) value back instead of the scraped one
				updateNodeDesc(node.id, descriptionToDoc(res.description))
			}
		} catch (error) {
			console.error("Error scraping metadata:", error)
		}
	}

	// ---------- mount ----------
	onMount(() => {
		//? Listeners are registered once here instead of on every scrape (they used to stack up)
		if (isYouTube()) {
			let last = 0
			let resetTimer: ReturnType<typeof setTimeout> | undefined

			const offProgress = window.api.onYoutubeDownloadProgress((data: any) => {
				//? progress restarts at 0 for the second pass (e.g. audio), so map the two passes to 0-50 and 50-100
				setDownloadProgress(Math.round(data.progress < last ? 50 + data.progress / 2 : data.progress / 2))
				last = data.progress
			})

			const offComplete = window.api.onYoutubeDownloadComplete(async () => {
				setDownloadProgress(100)
				clearTimeout(resetTimer)
				resetTimer = setTimeout(() => setDownloadProgress(0), 3000)
				await syncCachedVideo() // resolves the old "change from youtube vid to local vid" TODO
			})

			//? Only works if your preload returns an unsubscribe function; harmless otherwise
			onCleanup(() => {
				clearTimeout(resetTimer)
				if (typeof offProgress === "function") offProgress()
				if (typeof offComplete === "function") offComplete()
			})
		}

		if (node.url) fetchMetaData()

		if (isYouTube()) {
			if (store.userConfig.youtubeVidCache) downloadVideo()
			else syncCachedVideo()
		}
	})

	createEffect(() => {
		if (localVid() && videoRef) videoRef.load()
	})

	// ---------- url input ----------
	const transformUrl = (e: Event) => {
		const input = e.target as HTMLInputElement
		const value = input.value.trim()
		if (input.disabled) return // blur fires right after Enter, don't process twice

		if (isValidWebUrl(value)) {
			input.disabled = true
			updateURL(node.id, value)
			fetchMetaData(true)
		} else {
			input.value = ""
			input.placeholder = "invalid URL, try again"
		}
	}

	const play = () => setIsPlaying(true)

	//? "wait_load" class name is needed for elements that take time to load the assets like url images
	return (
		<div class="space-y-2">
			<Switch
				fallback={
					<div class="relative flex items-center justify-center">
						<Show when={isYouTube()}>
							<div class="absolute bottom-2 right-2 flex gap-1 z-50 opacity-0 group-hover/extend:opacity-100 pointer-events-none group-hover/extend:pointer-events-auto transition-all duration-200">
								<ActionButton onClick={deleteVideo} highlighted={ytVidDownloaded()} textColor={node.textColor}>
									<FaSolidTrashAlt size={16} />
								</ActionButton>
								<ActionButton onClick={() => setExpand(!expand())} highlighted textColor={node.textColor}>
									<TbOutlineResize size={16} />
								</ActionButton>
								<ActionButton onClick={downloadVideo} highlighted={!ytVidDownloaded()} textColor={node.textColor}>
									<AiOutlineDownload size={16} />
								</ActionButton>
							</div>

							<div
								class="size-10 rounded-full bg-black border-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center youtube_play_button"
								onClick={play}
							>
								<FaSolidPlay />
							</div>
						</Show>

						<Show when={srcImage()}>
							<img class="wait_load url_thumbnail pointer-events-none" src={srcImage()} loading="eager" alt="" />
						</Show>

						<Show when={downloadProgress() > 0}>
							<div class="z-50 absolute left-1/2 -translate-x-1/2 bottom-2 w-1/2 flex flex-col items-center space-y-1">
								<div class="font-extrabold" style={{ color: node.color, background: node.textColor }}>
									{downloadProgress()}% <Show when={downloadProgress() === 100}>Download Complete!</Show>
								</div>
								<div class="w-full h-2 overflow-hidden" style={{ background: node.color }}>
									<div
										class="h-full transition-all duration-300"
										style={{ width: `${downloadProgress()}%`, background: node.textColor }}
									/>
								</div>
							</div>
						</Show>
					</div>
				}
			>
				<Match when={node.url === ""}>
					<div class="flex items-center space-x-2 px-5">
						<AiOutlineLink />
						<input
							type="text"
							placeholder="input your URL here"
							class="url_input p-5 size-full outline-0"
							onBlur={transformUrl}
							onKeyDown={(e) => {
								if (e.key === "Enter") transformUrl(e)
							}}
						/>
					</div>
				</Match>

				<Match when={isYouTube() && isPlaying() && localVid() != null}>
					<video-player
						style={{
							"--media-border-radius": "0rem",
							"--media-color-primary": node.textColor ?? "var(--color-primary)"
						}}
					>
						<video-skin>
							{/* autoplay replaces the old videoRef.play() call, which ran before this element existed */}
							<video src={localVid() ?? ""} ref={videoRef} id="videoPlayer" autoplay></video>
						</video-skin>
					</video-player>
				</Match>

				<Match when={isYouTube() && isPlaying()}>
					<div style={{ position: "relative", width: "100%", "padding-bottom": "56.25%" /* 16:9 */ }}>
						<iframe
							src={`https://www.youtube.com/embed/${getYouTubeVideoId(node.url)}?autoplay=1`}
							style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
					</div>
				</Match>
			</Switch>

			<Show when={node.url !== ""}>
				<div class="text_container p-4 space-y-2 overflow-hidden text-ellipsis m-0">
					<div class="url_container flex flex-row items-center space-x-2">
						<Show when={srcFav()}>
							<img class="url_thumbnail size-4" src={srcFav()} loading="lazy" alt="favicon" />
						</Show>
						<div class="truncate">
							<a class="url text-xs font-bold text-foreground truncate" href={node.url}>
								{node.url}
							</a>
						</div>
					</div>

					<div>
						<a class="underline text-primary font-extrabold" href={node.url}>
							{metaData().title || node.url}
						</a>
					</div>

					<Show when={node.showDescription}>
						<Editor id={node.id} desc={node.description} />
					</Show>
				</div>
			</Show>
		</div>
	)
}