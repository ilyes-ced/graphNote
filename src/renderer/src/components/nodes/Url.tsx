import { Match, Show, Switch, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Url } from "../../types";
import { IconLink, IconPlayerPlayFilled } from "@tabler/icons-solidjs";
import { updateURL } from "../../shared/update";
import { store } from "../../shared/store";
import Editor from "./Editor";
import '@videojs/html/video/player';
import '@videojs/html/video/minimal-skin';


type UrlProps = Url & {
  is_child?: boolean;
};

type MetaData = {
  title: string;
  description: string;
  image: ArrayBuffer;
  favicon: ArrayBuffer;
};

//TODO: add cashing system
//TODO: store them Documents/graphnote/cache and search there first if it doesnt exist do scrape_url
export default (node: UrlProps) => {
  let videoRef!: any
  let player: { ready: (arg0: () => void) => void; dispose: () => void; };

  const [localVid, setLocalVid] = createSignal<string | null>(null);
  const [downloading, Downloading] = createSignal(false);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [srcImage, setSrcImage] = createSignal<string>("");
  const [srcFav, setSrcFav] = createSignal<string>("");

  const [metaData, setMetaData] = createSignal<MetaData>({
    title: "placeholder",
    description: "placeholder",
    image: new ArrayBuffer(0),
    favicon: new ArrayBuffer(0),
  });

  const setImageFromArrayBuffer = (buffer: ArrayBuffer, type: "image" | "favicon") => {
    console.log(buffer)
    const blob = new Blob([buffer], { type: "image/png" }); // or jpeg/webp
    const url = URL.createObjectURL(blob);
    if (type === "image") {
      setSrcImage(url);
    } else if (type === "favicon") {
      setSrcFav(url)
    }
    onCleanup(() => URL.revokeObjectURL(url));
  };

  function matchYoutubeUrl(url: string): boolean {
    const pattern =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
  }

  const getMetaData = async (url: string): Promise<MetaData | null> => {
    try {
      const message = await window.api.scrapeUrl({ url: url, cache: store.userConfig.cacheUrlData });
      window.api.onYoutubeDownloadProgress((data: any) => {
        console.log("data.progress LLLLLLLLLLLLLLLLLLLLLLLLLLL")
        console.log(data)
        console.log(data.progress)
        console.log("data.progress LLLLLLLLLLLLLLLLLLLLLLLLLLL")
      })

      window.api.onYoutubeDownloadComplete(async (data: any) => {
        console.log("download finishes here")
        console.log(data)
        getVidPath(data.vidId)
      })
      return message;
    } catch (error) {
      console.error("Error scraping metadata:", error);
      return null;
    }
  };

  const getVidPath = async (vidId: string) => {
    // console.log(":KKKKKKKKKKKKKKKKKKKKKKKKK")
    // var vidPath = await window.api.getLocalVideo(vidId);
    // console.info(vidPath)
    // setLocalVid(vidPath)
  }


  const fetchMetaData = () => {
    // Defer to next microtask to avoid blocking render
    queueMicrotask(() => {
      getMetaData(node.url).then((res) => {
        if (res) {
          console.log(res)
          setMetaData(res);
          setImageFromArrayBuffer(res.image, "image");
          setImageFromArrayBuffer(res.favicon, "favicon");
        }
      });
    });
  }

  onMount(async () => {
    fetchMetaData()
    setImageFromArrayBuffer(metaData().image, "image")
    setImageFromArrayBuffer(metaData().favicon, "favicon")
    if (store.userConfig.youtubeVidCache && matchYoutubeUrl(node.url)) {
      console.info("sending the to the youtubeVidCache function")
      console.time("ipc-cache");
      var cacheRes = await window.api.cacheYoutubeVid(node.url);
      console.timeEnd("ipc-cache"); 2
      console.info("ffffffffffffffffffffffffffffffffffffffffff")
      console.info(cacheRes)
      if (cacheRes.message == "file is already downloaded") {
        console.log(cacheRes.fileName)
        const videoFile = await window.api.getLocalVideo(cacheRes.fileName);
        console.log(videoFile)
        console.log("getVideoFiles")
        console.log("getVideoFiles")
        console.log("getVideoFiles")
        console.log("getVideoFiles")

        setLocalVid(videoFile)
      }
    }


  });


  createEffect(() => {
    const src = localVid();

    if (!src || !videoRef) return;

    videoRef.load();
  });

  const transformUrl = (e: any) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    try {
      new URL(value);
      //? disable inout on seccfull URL to avoid it double firing once we press enter than unfocus the input 
      input.disabled = true;
      updateURL(node.id, value)
      fetchMetaData()
    } catch {
      console.log("invalid url format")
      input.value = ""
      input.placeholder = "invalid URL, try again"
    }
  }
  function getYouTubeVideoId(url: string) {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }



  onCleanup(() => {
    if (player) {
      player.dispose();
    }
  });
  //? "wait_load" class name is needed for elements that take time to load the assets like url images
  return (
    <div class="space-y-2">



      {localVid()}
      <Switch fallback={
        <div class="relative flex items-center justify-center">
          <div class="bg-blue-900">fallbak</div>
          {
            matchYoutubeUrl(node.url) && <div class="size-10 rounded-full bg-black border-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center" onClick={() => setIsPlaying(true)}>
              <IconPlayerPlayFilled />
            </div>}
          <img
            class="wait_load url_thumbnail pointer-events-none"
            src={srcImage()}
            loading="eager"
            alt=""
          />
        </div>
      }>
        <Match when={node.url === ""}>
          <div class="bg-blue-900">empty url</div>
          <div class="flex items-center space-x-2 px-5" >
            <IconLink />
            <input type="text" placeholder="input your URL here" class="url_input p-5 size-full outline-0 border"
              onBlur={transformUrl}
              onKeyDown={(e) => {
                if (e.key === "Enter") transformUrl(e);
              }} />
          </div>
        </Match>
        <Match when={store.userConfig.youtubeVidCache && matchYoutubeUrl(node.url) && localVid() != null}>
          <div class="bg-blue-900">play local video</div>
          <p class="bg-red-400">here we add our custom streaming vid player: {localVid()}</p>
          <video src={localVid() ?? ""} ref={videoRef} id="videoPlayer" controls></video>
        </Match>
        <Match when={!store.userConfig.youtubeVidCache && matchYoutubeUrl(node.url) && isPlaying()}>
          <div class="bg-blue-900">play youtube video</div>
          <div style={{
            position: 'relative',
            width: '100%',
            "padding-bottom": '56.25%' /* 16:9 aspect ratio = 9 / 16 * 100 */
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(node.url)}?autoplay=1`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>

        </Match>
      </Switch>


      <Show when={node.url != ""}>
        <div class="text_container p-4 space-y-2 overflow-hidden text-ellipsis">
          <div class="url_container flex flex-row items-center space-x-2">
            <img
              class="url_thumbnail size-4"
              src={srcFav()}
              loading="lazy"
              alt="favicon"
            />
            <div>
              <a class="url text-xs font-bold text-foreground" href={node.url}>
                {node.url}
              </a>
            </div>
          </div>

          <div>
            <a class="underline text-primary font-extrabold" href={node.url}>
              {metaData().title}
            </a>
          </div>

          <div class="url_description text-xs">{metaData().description}</div>
        </div>

        <div class="p-5">
          <Editor id={node.id} desc={node.description} />
        </div>
      </Show >

    </div>
  )
}
