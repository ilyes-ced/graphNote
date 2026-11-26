import type { BrowserWindow } from "electron"

import { registerFilesIpc } from "./ipc/files"
import { registerUrlIpc } from "./ipc/url"
import { registerNodesIpc } from "./ipc/nodes"
import { registerYoutubeIpc } from "./ipc/youtube"

export function registerAllIpc(win: BrowserWindow) {
	registerFilesIpc(); registerNodesIpc(); registerYoutubeIpc(win); registerUrlIpc()
}