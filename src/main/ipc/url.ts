import { ipcMain } from "electron";
import { downloadImage } from "../utils/images";

export function registerUrlIpc() {
    ipcMain.handle("downloadUrlImage", async (_, { url }) => ({
        success: true, path: await downloadImage(url),
    }))
}
