import { updateURL } from "./update"

export function isValidUrl(value: string): boolean {
    try {
        new URL(value)
        return true
    } catch {
        return false
    }
}

// returns true if the url was valid and saved
export function setNodeUrl(id: string, value: string): boolean {
    if (!isValidUrl(value)) return false
    updateURL(id, value)
    return true
}