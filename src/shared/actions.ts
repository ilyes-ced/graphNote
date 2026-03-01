import { ColorType, NodeUnion, Task } from "@/types"

interface updateNote {
    id: string,
    oldValue: string,
    newValue: string,
}
interface updateZIndex {
    id: string,
    oldZIndex: number,
    newZIndex: number,
}
interface updatePosition {
    id: string,
    oldXY: { x: number, y: number }
    newXY: { x: number, y: number }
}
interface incrementSelectedNodesPositions {
    id: string,
    oldXY: { x: number, y: number }
    newXY: { x: number, y: number }
}
interface updateChildPosition {
    // could be taking the child node outside i dont rememeber
    id: string,
    oldXY: { x: number, y: number }
    newXY: { x: number, y: number }
}
// not really sure what does this one even do
interface addNode {
    id: string,
    node: NodeUnion
}
interface updateNodeWidth {
    id: string,
    oldWidth: number,
    newWidth: number,
}
interface newNode {
    id: string,
    node: NodeUnion,
    x: number,
    y: number,
}
interface updateTask {
    id: string,
    value: string | boolean,
    taskIndex: number
}
interface updateNodeColor {
    id: string,
    type: "bg" | "fg" | "strip",
    olcColor: ColorType,
    newColor: ColorType,
}
// dont think we should include this one
// interface changeToUrlNode {
//     id: string,
// }
interface unsetStripColor {
    id: string,
}
interface updateNodeTitle {
    id: string,
    oldTitle: string,
    newTitle: string,
}
interface newImageNode {
    id: string,
    oldXY: { x: number, y: number }
    newXY: { x: number, y: number }
}
interface updateActivityCounter {
    id: string,
    date: string,
    oldValue: number,
    newValue: number
}
interface reorderTasks {
    id: string,
    oldTasks: Task[],
    newTasks: Task[],
}
interface newDocumentNode {
    id: string,
    x: number,
    y: number,
    docType: string
}


export type actions = updateNote
    | updateZIndex
    | updatePosition
    | incrementSelectedNodesPositions
    | updateChildPosition
    | addNode
    | updateNodeWidth
    | newNode
    | updateTask
    | updateNodeColor
    // | changeToUrlNode
    | unsetStripColor
    | updateNodeTitle
    | newImageNode
    | updateActivityCounter
    | reorderTasks
    | newDocumentNode


// actionsMiddleware.ts

export function actionsMiddleware<T extends (...args: any[]) => any>(fn: T): T {
    return ((...args: Parameters<T>): ReturnType<T> => {
        // ✅ Do something before
        console.log(`[Actions Middleware] Running ${fn.name} with args:`, args);

        // You can add more logic here, e.g., validation, logging, etc.
        // Example: throw error if first arg is null
        // if (args[0] == null) throw new Error("First argument cannot be null");

        // ✅ Call the original function
        const result = fn(...args);

        // ✅ Do something after
        console.log(`[Middleware] ${fn.name} returned:`, result);

        return result;
    }) as T;
}


// 
// export function undo()
// export function redo()
// 