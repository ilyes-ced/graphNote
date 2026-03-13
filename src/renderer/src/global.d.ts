export { };

declare global {
  interface Window {
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
      scrapeUrl: (string) => Promise<any>;
      backUpSave: () => Promise<any>;
    };
  }
}