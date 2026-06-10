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
			readFile: (data: { folderPath: string; filePath: string }) => Promise<string | null>
			writeFile: (data: { name: string; data: Uint8Array; type: string }) => Promise<any>
			getAvailableFilePath: (data: { path: string }) => Promise<{ success: boolean; path: string }>
			copyFileUnique: (data: { path: string }) => Promise<{ res: boolean; text: string }>
			readImage: (filePath: string) => Promise<Buffer>
			writeNodeFile: (data: { name: string; data: Uint8Array; type: string }) => Promise<any>
			scrapeUrl: (data: { url: string; cache: boolean }) => Promise<any>
			backUpSave: () => Promise<any>
			downloadImgUrl: (imgUrl: string) => Promise<any>
			cacheUrl: (url: string) => Promise<string>
			cacheYoutubeVid: (url: string) => Promise<any>
			deletecacheedYoutubeVid: (url: string) => Promise<any>
			checkCacheYoutubeVidExists: (url: string) => Promise<any>
			onYoutubeDownloadProgress: (callback: any) => Promise<any>
			onYoutubeDownloadComplete: (callback: any) => Promise<any>
			getLocalVideo: (vidName: any) => Promise<any>
			getSizes: () => Promise<any>
			selectFile: () => Promise<any>
		}
	}
}
