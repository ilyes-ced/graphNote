import { setStore, store } from "./store"

export interface Command {
	undo(): void
	redo(): void
}

export function actionsMiddleware<T extends (...args: any[]) => Command>(fn: T): T {
	return ((...args: Parameters<T>) => {
		const command = fn(...args)
		if (!command?.undo || !command?.redo) return command

		const pointer = store.historyPointer + 1
		const newHistory = store.actionsHistory.slice(0, pointer)
		newHistory.push(command)

		setStore("actionsHistory", newHistory)
		setStore("historyPointer", pointer)

		return command
	}) as T
}

export function undo() {
	if (store.historyPointer < 0) return // nothing to undo

	const command = store.actionsHistory[store.historyPointer]
	command.undo()

	setStore("historyPointer", store.historyPointer - 1)
}

export function redo() {
	const pointer = store.historyPointer + 1
	if (pointer >= store.actionsHistory.length) return // nothing to redo

	const command = store.actionsHistory[pointer]
	command.redo()

	setStore("historyPointer", pointer)
}
