import express from "express"
import type { Server } from "node:http"
import { Paths } from "../config/paths"

let server: Server | null = null

export function startMediaServer() {
    if (server) return
    const app = express()
    app.use("/videos", express.static(Paths.youtubeCache))
    server = app.listen(3232, "127.0.0.1")
}

export function stopMediaServer() { server?.close(); server = null }