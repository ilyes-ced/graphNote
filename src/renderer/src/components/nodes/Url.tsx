import { Match, Show, Switch, createEffect, createSignal, onCleanup, onMount } from "solid-js"
import { Url } from "../../types"
import { IconLink, IconPlayerPlayFilled, IconResize } from "@tabler/icons-solidjs"
import { updateNodeDesc, updateURL } from "../../shared/update"
import { store } from "../../shared/store"
import Editor from "./Editor"
import "@videojs/html/video/player"
import "@videojs/html/video/skin"
import { Portal } from "solid-js/web"

type UrlProps = Url & {
	is_child?: boolean
}

type MetaData = {
	title: string
	description: string
	image: ArrayBuffer
	favicon: ArrayBuffer
}

//TODO: add cashing system
//TODO: store them Documents/graphnote/cache and search there first if it doesnt exist do scrape_url
export default (node: UrlProps) => {
	let videoRef!: any

	const [localVid, setLocalVid] = createSignal<string | null>(null)
	const [downloading, Downloading] = createSignal(false)
	const [isPlaying, setIsPlaying] = createSignal(false)
	const [srcImage, setSrcImage] = createSignal<string>("")
	const [srcFav, setSrcFav] = createSignal<string>("")
	const [expand, setExpand] = createSignal(false)

	const [metaData, setMetaData] = createSignal<MetaData>({
		title: "placeholder",
		description: "placeholder",
		image: new ArrayBuffer(0),
		favicon: new ArrayBuffer(0)
	})

	const setImageFromArrayBuffer = (buffer: ArrayBuffer, type: "image" | "favicon") => {
		console.log(buffer)
		const blob = new Blob([buffer], { type: "image/png" }) // or jpeg/webp
		const url = URL.createObjectURL(blob)
		if (type === "image") {
			setSrcImage(url)
		} else if (type === "favicon") {
			setSrcFav(url)
		}
		onCleanup(() => URL.revokeObjectURL(url))
	}

	function matchYoutubeUrl(url: string): boolean {
		const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/.+$/
		return pattern.test(url)
	}

	const getMetaData = async (url: string): Promise<MetaData | null> => {
		try {
			const message = await window.api.scrapeUrl({ url: url, cache: store.userConfig.cacheUrlData })
			window.api.onYoutubeDownloadProgress((data: any) => {
				console.log("data.progress LLLLLLLLLLLLLLLLLLLLLLLLLLL")
				console.log(data)
				console.log(data.progress)
				console.log("data.progress LLLLLLLLLLLLLLLLLLLLLLLLLLL")
			})

			window.api.onYoutubeDownloadComplete(async (data: any) => {
				getVidPath(data.vidId)
			})
			return message
		} catch (error) {
			console.error("Error scraping metadata:", error)
			return null
		}
	}

	const getVidPath = async (vidId: string) => {
		// console.log(":KKKKKKKKKKKKKKKKKKKKKKKKK")
		// var vidPath = await window.api.getLocalVideo(vidId);
		// console.info(vidPath)
		// setLocalVid(vidPath)
	}

	const fetchMetaData = (firstTime?: boolean) => {
		// Defer to next microtask to avoid blocking render
		queueMicrotask(() => {
			getMetaData(node.url).then((res) => {
				if (res) {
					console.log(res)
					setMetaData(res)
					setImageFromArrayBuffer(res.image, "image")
					setImageFromArrayBuffer(res.favicon, "favicon")
					if (firstTime || !node.description) {
						console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLL")
						console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLL")
						console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLL")
						console.log(node.id, res.description)
						updateNodeDesc(
							node.id,
							`{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"${node.description}\"}]}]}`
						)
					}
				}
			})
		})
	}

	onMount(async () => {
		fetchMetaData()
		// setImageFromArrayBuffer(metaData().image, "image")
		// setImageFromArrayBuffer(metaData().favicon, "favicon")
		if (store.userConfig.youtubeVidCache && matchYoutubeUrl(node.url)) {
			var cacheRes = await window.api.cacheYoutubeVid(node.url)
			if (cacheRes.message == "file is already downloaded") {
				const videoFile = await window.api.getLocalVideo(cacheRes.fileName)
				setLocalVid(videoFile)
			}
		}
	})

	createEffect(() => {
		const src = localVid()

		if (!src || !videoRef) return

		videoRef.load()
	})

	const transformUrl = (e: any) => {
		const input = e.target as HTMLInputElement
		const value = input.value
		try {
			new URL(value)
			//? disable inout on seccfull URL to avoid it double firing once we press enter than unfocus the input
			input.disabled = true
			updateURL(node.id, value)
			fetchMetaData(true)
		} catch {
			console.log("invalid url format")
			input.value = ""
			input.placeholder = "invalid URL, try again"
		}
	}
	function getYouTubeVideoId(url: string) {
		const regex = /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
		const match = url.match(regex)
		return match ? match[1] : null
	}

	//? "wait_load" class name is needed for elements that take time to load the assets like url images
	return (
		<div class="space-y-2">
			<div
				onClick={() => setExpand(!expand())}
				class="z-50 extend_toggle cursor-pointer absolute top-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/extend:opacity-100 pointer-events-none group-hover/extend:pointer-events-auto transition-all duration-200 ease-in-out"
			>
				<IconResize size={16} />
			</div>

			<Switch
				fallback={
					<div class="relative flex items-center justify-center">
						{matchYoutubeUrl(node.url) && (
							<div
								class="size-10 rounded-full bg-black border-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center"
								onClick={() => {
									setIsPlaying(true)
									videoRef.play()
								}}
							>
								<IconPlayerPlayFilled />
							</div>
						)}
						<img class="wait_load url_thumbnail pointer-events-none" src={srcImage()} loading="eager" alt="" />
					</div>
				}
			>
				<Match when={node.url === ""}>
					<div class="flex items-center space-x-2 px-5">
						<IconLink />
						<input
							type="text"
							placeholder="input your URL here"
							class="url_input p-5 size-full outline-0 border"
							onBlur={transformUrl}
							onKeyDown={(e) => {
								if (e.key === "Enter") transformUrl(e)
							}}
						/>
					</div>
				</Match>
				<Match when={store.userConfig.youtubeVidCache && matchYoutubeUrl(node.url) && localVid() != null && isPlaying()}>
					<video-player
						style={{
							"--media-border-radius": "0rem",
							"--media-color-primary": node.textColor ?? "var(--color-primary)"
						}}
					>
						<video-skin>
							<video src={localVid() ?? ""} ref={videoRef} id="videoPlayer"></video>
						</video-skin>
					</video-player>
				</Match>
				<Match when={!store.userConfig.youtubeVidCache && matchYoutubeUrl(node.url) && isPlaying()}>
					<div
						style={{
							position: "relative",
							width: "100%",
							"padding-bottom": "56.25%" /* 16:9 aspect ratio = 9 / 16 * 100 */
						}}
					>
						<iframe
							src={`https://www.youtube.com/embed/${getYouTubeVideoId(node.url)}?autoplay=1`}
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%"
							}}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
					</div>
				</Match>
			</Switch>

			<Show when={node.url != ""}>
				<div class="text_container p-4 space-y-2 overflow-hidden text-ellipsis m-0">
					<div class="url_container flex flex-row items-center space-x-2">
						<img class="url_thumbnail size-4" src={srcFav()} loading="lazy" alt="favicon" />
						<div class="truncate">
							<a class="url text-xs font-bold text-foreground truncate" href={node.url}>
								{node.url}
							</a>
						</div>
					</div>

					<div>
						<a class="underline text-primary font-extrabold" href={node.url}>
							{metaData().title}
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
