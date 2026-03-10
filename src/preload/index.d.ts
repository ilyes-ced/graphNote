import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getNodes: () => Promise<any>;
      saveNodes: (nodes: any) => Promise<any>;
      saveEdges: (edges: any) => Promise<any>;
      readGraph: () => Promise<any>;
      readFile: (data: { folderPath: string; filePath: string }) => Promise<string | null>;
      writeFile: (data: { filePath: string; text: string }) => Promise<any>;
      getAvailableFilePath: (data: { path: string }) => Promise<{ success: boolean; path: string }>;
      copyFileUnique: (data: { path: string }) => Promise<{ res: boolean; text: string }>;
      readImage: (filePath: string) => Promise<Buffer>;
    };
  }
}
