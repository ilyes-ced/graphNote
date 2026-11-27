import { ElectronAPI } from "@electron-toolkit/preload"

declare global {
	interface Window {
		electron: ElectronAPI
		api: {
			getNodes: () => Promise<any>
			getEdges: () => Promise<any>
			getSettings: () => Promise<any>
			saveNodes: (nodes: any) => Promise<any>
			saveEdges: (edges: any) => Promise<any>
			saveSettings: (settings: any) => Promise<any>
			readGraph: () => Promise<any>
			writeFile: (data: { name: string; data: Uint8Array; fileType: string }) => Promise<any>
			copyFile: (data: { src: string }) => Promise<any>
			downloadUrlImage: (data: { url: string }) => Promise<any>
			copyFileUnique: (data: { path: string }) => Promise<{ res: boolean; text: string }>
			readImage: (filePath: string) => Promise<Buffer>
			scrapeUrl: (data: { url: string; cache: boolean }) => Promise<any>
			backUpSave: () => Promise<any>
			cacheUrl: (url: string) => Promise<string>
			cacheYoutubeVid: (url: string) => Promise<any>
			deleteCachedYoutubeVid: (url: string) => Promise<any>
			checkCacheYoutubeVidExists: (url: string) => Promise<any>
			openFileDefault: (path: string) => Promise<any>
			onYoutubeDownloadProgress: (callback: any) => Promise<any>
			onYoutubeDownloadComplete: (callback: any) => Promise<any>
			getLocalVideo: (vidName: any) => Promise<any>
			getSizes: () => Promise<any>
			selectFile: () => Promise<any>
			deleteUnusedFiles: () => Promise<any>
		}
	}
}