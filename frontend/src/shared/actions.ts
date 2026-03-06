// import { ColorType, NodeUnion, Task } from "@/types"
// import { setStore, store } from "./store"
// import { findNodeById } from "./update"
// import { produce } from "solid-js/store"
// 
// interface updateNote {
//     id: string,
//     oldValue: string,
//     newValue: string,
// }
// interface updateZIndex {
//     id: string,
//     oldZIndex: number,
//     newZIndex: number,
// }
// interface updatePosition {
//     id: string,
//     oldXY: { x: number, y: number }
//     newXY: { x: number, y: number }
// }
// interface incrementSelectedNodesPositions {
//     id: string,
//     oldXY: { x: number, y: number }
//     newXY: { x: number, y: number }
// }
// interface updateChildPosition {
//     // could be taking the child node outside i dont rememeber
//     id: string,
//     oldXY: { x: number, y: number }
//     newXY: { x: number, y: number }
// }
// // not really sure what does this one even do
// interface addNode {
//     id: string,
//     node: NodeUnion,
//     targetNodeId?: string
// }
// interface updateNodeWidth {
//     id: string,
//     oldWidth: number,
//     newWidth: number,
// }
// interface newNode {
//     id: string,
//     node: NodeUnion,
//     x: number,
//     y: number,
// }
// interface updateTask {
//     id: string,
//     value: string | boolean,
//     taskIndex: number
// }
// interface updateNodeColor {
//     id: string,
//     type: "bg" | "fg" | "strip",
//     olcColor: ColorType,
//     newColor: ColorType,
// }
// // dont think we should include this one
// // interface changeToUrlNode {
// //     id: string,
// // }
// interface unsetStripColor {
//     id: string,
// }
// interface updateNodeTitle {
//     id: string,
//     oldTitle: string,
//     newTitle: string,
// }
// interface newImageNode {
//     id: string,
//     oldXY: { x: number, y: number }
//     newXY: { x: number, y: number }
// }
// interface updateActivityCounter {
//     id: string,
//     date: string,
//     oldValue: number,
//     newValue: number
// }
// interface reorderTasks {
//     id: string,
//     oldTasks: Task[],
//     newTasks: Task[],
// }
// interface newDocumentNode {
//     id: string,
//     x: number,
//     y: number,
//     docType: string
// }
// 
// 
// export type Actions = updateNote
//     | updateZIndex
//     | updatePosition
//     | incrementSelectedNodesPositions
//     | updateChildPosition
//     | addNode
//     | updateNodeWidth
//     | newNode
//     | updateTask
//     | updateNodeColor
//     // | changeToUrlNode
//     | unsetStripColor
//     | updateNodeTitle
//     | newImageNode
//     | updateActivityCounter
//     | reorderTasks
//     | newDocumentNode
// 
// 
// // actionsMiddleware.ts
// 
// export function actionsMiddleware<T extends (...args: any[]) => any>(fn: T): T {
//     return ((...args: Parameters<T>): ReturnType<T> => {
//         console.log(`[Actions Middleware] Running ${fn.name} with args:`, args);
// 
//         // here run the action
// 
// 
//         switch (fn.name) {
//             case "updateNote":
//                 const [id, newValue] = args;
//                 console.log({
//                     id: id,
//                     oldValue: findNodeById(id)?.text,// "idk how to even get the old text",
//                     newValue: newValue,
//                 })
// 
//                 setStore("actionsHistory", store.actionsHistory.length, {
//                     id: id,
//                     oldValue: findNodeById(id)?.text,// "idk how to even get the old text",
//                     newValue: newValue,
//                 });
//                 break
//             case "updateZIndex":
//                 store.actionsHistory.push()
//                 break
//             case "updatePosition":
//                 store.actionsHistory.push()
//                 // maybe introduce a debounce before registering the action here
//                 break
//             case "incrementSelectedNodesPositions":
//                 store.actionsHistory.push()
//                 break
//             case "updateChildPosition":
//                 store.actionsHistory.push()
//                 break
//             case "addNode":
//                 store.actionsHistory.push()
//                 break
//             case "updateNodeWidth":
//                 store.actionsHistory.push()
//                 break
//             case "newNode":
//                 store.actionsHistory.push()
//                 break
//             case "updateTask":
//                 store.actionsHistory.push()
//                 break
//             case "updateNodeColor":
//                 store.actionsHistory.push()
//                 break
//             case "changeToUrlNode":
//                 store.actionsHistory.push()
//                 break
//             case "unsetStripColor":
//                 store.actionsHistory.push()
//                 break
//             case "updateNodeTitle":
//                 store.actionsHistory.push()
//                 break
//             case "newImageNode":
//                 store.actionsHistory.push()
//                 break
//             case "updateActivityCounter":
//                 store.actionsHistory.push()
//                 break
//             case "reorderTasks":
//                 store.actionsHistory.push()
//                 break
//             case "newDocumentNode":
//                 store.actionsHistory.push()
//                 break
//             default:
//                 break;
//         }
// 
//         // ✅ Call the original function
//         const result = fn(...args);
// 
//         // ✅ Do something after
//         console.log(`[Middleware] ${fn.name} returned:`, result);
// 
//         return result;
//     }) as T;
// }
// 
// 
// export function undo() {
//     // get last item
//     if (store.actionHistory.length > 0) {
//         const action = store.actionsHistory[store.actionsHistory.length - 1]
//         console.info("here we do the undo action")
//         console.log(action)
//     }
// }
// 
// 
// export function redo() {
//     console.info("here we do the redo action")
// }

import { setStore, store } from "./store";



// export function actionsMiddleware2<T extends (...args: any[]) => any>(fn: T): T {
//     return ((...args: Parameters<T>) => {
// 
//         const command = fn(...args);
// 
//         if (command?.undo && command?.redo) {
//             setStore("actionsHistory", store.actionsHistory.length, command);
//         }
// 
//         return command;
//     }) as T;
// }


export interface Command {
    undo(): void;
    redo(): void;
}

export function actionsMiddleware<T extends (...args: any[]) => Command>(fn: T): T {
    return ((...args: Parameters<T>) => {
        const command = fn(...args);
        if (!command?.undo || !command?.redo) return command;

        const pointer = store.historyPointer + 1;
        const newHistory = store.actionsHistory.slice(0, pointer);
        newHistory.push(command);

        setStore("actionsHistory", newHistory);
        setStore("historyPointer", pointer);

        return command;
    }) as T;
}

export function undo() {
    if (store.historyPointer < 0) return; // nothing to undo

    const command = store.actionsHistory[store.historyPointer];
    command.undo();

    setStore("historyPointer", store.historyPointer - 1);
}

export function redo() {
    const pointer = store.historyPointer + 1;
    if (pointer >= store.actionsHistory.length) return; // nothing to redo

    const command = store.actionsHistory[pointer];
    command.redo();

    setStore("historyPointer", pointer);
}