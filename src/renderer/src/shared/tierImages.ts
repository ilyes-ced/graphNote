import { Tier } from "../types"

export const IMG_MIME = "application/x-tier-img"

export type DragPayload = {
    nodeId: string
    fromTier: number
    indices: number[]
}

const copyLists = (tiers: Tier[]) => tiers.map((t) => [...(t.imgPaths ?? [])])

/** Move images (by index) from one tier to a position in another (or the same) tier. */
export function moveImgs(
    tiers: Tier[],
    fromTier: number,
    indices: number[],
    toTier: number,
    insertAt: number
): string[][] {
    const lists = copyLists(tiers)
    const sorted = [...new Set(indices)].sort((a, b) => a - b)
    const moved = sorted.map((i) => lists[fromTier][i])

    // removing items before the insert point shifts it left (same tier only)
    const shift = fromTier === toTier ? sorted.filter((i) => i < insertAt).length : 0

    lists[fromTier] = lists[fromTier].filter((_, i) => !sorted.includes(i))
    lists[toTier].splice(insertAt - shift, 0, ...moved)
    return lists
}

export function removeImgs(tiers: Tier[], tier: number, indices: number[]): string[][] {
    const lists = copyLists(tiers)
    lists[tier] = lists[tier].filter((_, i) => !indices.includes(i))
    return lists
}