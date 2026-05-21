import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getNodes: () => Promise<any>;
      getEdges: () => Promise<any>;
      saveNodes: (nodes: any) => Promise<any>;
      saveEdges: (edges: any) => Promise<any>;
      readGraph: () => Promise<any>;
      readFile: (data: { folderPath: string; filePath: string }) => Promise<{ text: string }>;
      writeFile: (data: { text: string, data: Uint8Array }) => Promise<{ success: boolean; path: string }>;
      getAvailableFilePath: (data: { path: string }) => Promise<{ success: boolean; path: string }>;
      copyFileUnique: (data: { path: string }) => Promise<{ res: boolean; text: string }>;
      readImage: (string) => Promise<Buffer>;
      writeNodeFile: (string) => Promise<any>;
      scrapeUrl: (data: { url: string, cache: boolean }) => Promise<any>;
      backUpSave: () => Promise<any>;
      downloadImgUrl: (string) => Promise<any>;
      cacheUrl: (url: string) => Promise<string>
      cacheYoutubeVid: (url: string) => Promise<string>
    };
  }
}