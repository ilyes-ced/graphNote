export function getExtensionFromContentType(contentType: string | null): string {
    if (!contentType) return ".jpg" // fallback

    const map: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/gif": ".gif",
        "image/bmp": ".bmp",
        "image/svg+xml": ".svg"
    }

    return map[contentType.split(";")[0]] || ".jpg"
}