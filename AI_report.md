Now I have a thorough understanding of the codebase. Let me compile my findings into a comprehensive report.

---

## Codebase Review: Bug Fixes & Suggestions

I read through the entire codebase (~50 files across Electron main, preload, and Solid.js renderer). Here are the bugs and improvements I found, organized by severity.

---

### 🔴 Critical Bugs

#### 1. Missing Edge Components — `Edges.tsx` will crash at runtime
**File:** `src/renderer/src/components/core/Edges.tsx` (lines 4-6, 22-30)

`Edges.tsx` imports `EdgeStep`, `EdgeBezier`, `EdgeStraight` from `../edges/`, but those files **do not exist**. There is no `src/renderer/src/components/edges/` directory at all. Rendering edges will throw a module resolution error.

**Fix:** Either create the edge component files, or remove the edge rendering until they exist.

#### 2. Memory Leak: `updateArrowsPositions()` creates accumulating `setInterval`s
**File:** `src/renderer/src/shared/utils.ts` (lines 128-141)

`updateArrowsPositions()` starts a `setInterval` every 250ms but **never clears it**. `Wrapper.tsx` calls `updateArrowsPositions()` inside a `createEffect` that runs on every store change, so intervals stack up indefinitely — a growing memory/CPU leak.

**Fix:** Track the interval ID and clear it before starting a new one, or use `onCleanup`.

#### 3. Memory Leak: YouTube download event listeners never removed
**File:** `src/renderer/src/components/nodes/Url.tsx` (lines 73-82)

`getMetaData()` calls `window.api.onYoutubeDownloadProgress()` and `onYoutubeDownloadComplete()` each time it runs, registering new listeners without ever removing them. Repeatedly opening a URL node accumulates duplicate listeners.

**Fix:** Store the unsubscribe callbacks (or use `ipcRenderer.off`) in `onCleanup`.

#### 4. Duplicate drag-and-drop listeners
**Files:** `src/renderer/src/components/core/EventHandler.tsx` AND `src/renderer/src/components/core/newFile.tsx`

Both files add `document.addEventListener("dragover", ...)` and `document.addEventListener("drop", ...)`. Files dropped onto the app are processed **twice**, potentially creating duplicate nodes.

**Fix:** Consolidate into one file and remove the duplicate listeners.

#### 5. `tsconfig.node.json` is missing
**File:** `tsconfig.json` line 31 references `"./tsconfig.node.json"` which **does not exist**. `tsc --noEmit -p tsconfig.node.json` will fail.

**Fix:** Create `tsconfig.node.json` or remove the reference from `tsconfig.json`.

#### 6. URL regex is broken — URL auto-conversion never triggers
**File:** `src/renderer/src/components/nodes/Note.tsx` line 37

```js
const urlRegex = /^(https?:\\/\\/[^\\s]+)$/
```

In a regex literal, `\\/` matches a **literal backslash followed by `/`** (i.e., `https:\/\/`), not a normal `https://`. So `changeToUrlNode()` never fires for real URLs.

**Fix:** Change to `/^(https?:\/\/[^\s]+)$/`

#### 7. Debug text leaking into the UI
**File:** `src/renderer/src/components/core/NodeWrapper.tsx` line 134

```jsx
<div class="absolute z-1000">{padding()}ll{node.node.x}-{node.node.y}</div>
```

This renders raw debug text ("llX-Y") on top of every node in production.

**Fix:** Remove that div.

#### 8. Duplicate `case NodeType.Table` in switch (dead code)
**File:** `src/renderer/src/components/core/NodeWrapper.tsx` lines 36 and 53

The `ignoredClasses()` function has two `case NodeType.Table:` branches. The second one is unreachable.

**Fix:** Remove the duplicate.

---

### 🟠 High Severity Bugs

#### 9. Null safety: `store.nodes[getActiveBoardId()]` can be undefined
**Files:** `src/renderer/src/components/sidebar/NodeStyles.tsx` (line 45), `Sidebar.tsx`, `ViewPort.tsx` (line 138)

Code accesses `store.nodes[boardId].filter(...)` or `.forEach(...)` without checking if the board ID exists in `store.nodes`. If a board node is deleted but still in `activeBoards`, this throws `Cannot read properties of undefined`.

**Fix:** Add `?? []` or null checks before iterating.

#### 10. Board color transparency hack breaks non-hex colors
**File:** `src/renderer/src/components/nodes/Board.tsx` line 70

```tsx
background: node.color ? `${node.color}20` : "color-mix(...)"
```

Appending `"20"` to a color string only produces valid CSS for **hex** colors (e.g. `#FF000020`). For `rgb()`, `hsl()`, `oklch()`, or CSS variables like `var(--color-primary)`, this produces invalid CSS.

**Fix:** Use `colorWithPreservedAlpha()` from `colorUtils.ts` or convert properly.

#### 11. Viewport double-click creates nodes at wrong position when panned
**File:** `src/renderer/src/components/core/ViewPort.tsx` lines 96-99

Uses raw `e.clientX / scale` without accounting for `store.viewport.x`/`y` pan offset (the code even has a comment acknowledging this bug on line 95). New nodes appear in the wrong place after panning.

**Fix:** Subtract `store.viewport.x` and `store.viewport.y` before dividing by scale.

#### 12. Table cell edits are not persisted
**File:** `src/renderer/src/components/nodes/Table.tsx` lines 116-128

Table `<td>` elements are `contentEditable` but have **no `onInput` handler**. Changes are lost on re-render.

**Fix:** Add an `onInput` handler that calls an update function (similar to `Todo.tsx`).

#### 13. Todo task IDs collide across different Todo nodes
**File:** `src/renderer/src/components/nodes/Todo.tsx` line 34

```js
const generateId = (() => { let counter = 0; return () => `task-id-${counter++}` })()
```

This is module-level, so two different Todo nodes both get tasks with IDs like `task-id-0`, `task-id-1`. The `@thisbeyond/solid-dnd` library uses these IDs, so cross-node drags can corrupt state.

**Fix:** Include `node.id` in the generated ID, e.g. `task-${node.id}-${counter++}`.

#### 14. ColorSelectMenu strip color picker does nothing
**File:** `src/renderer/src/components/ui/ColorSelectMenu.tsx` line 275

```tsx
<DefaultColorPicker value="rgb(25,25,25)" onChange={(color) => console.log(color)} />
```

The strip color picker only logs to console and never applies the color.

**Fix:** Wire `onChange` to `changeTopStrip(color)`.

#### 15. Image component has no fallback if placeholder is missing
**File:** `src/renderer/src/components/nodes/Image.tsx` lines 13-18

If `readImage(node.path)` fails, it tries `readImage("image/placeholder.png")` — but if *that* also fails, the error is unhandled and the image stays blank with no UI indication.

**Fix:** Add a second `.catch` with a final fallback (empty string or colored placeholder).

---

### 🟡 Medium Severity / Code Quality

#### 16. `String` instead of `string` in Map type
**File:** `src/renderer/src/shared/store.tsx` line 77

```ts
arrowLines: Map<String, any[]>
```

`String` (capital S) is the wrapper object, not the primitive `string`. Works in practice but is unconventional and can cause subtle Map key issues.

**Fix:** Change to `Map<string, any[]>`.

#### 17. Inconsistent `window.api` type declarations
**Files:** `src/renderer/src/global.d.ts` vs `src/preload/index.d.ts`

Both declare `window.api` with slightly different signatures (e.g. `readImage` return type `Buffer` vs `Promise<Buffer>`). They can drift out of sync.

**Fix:** Consolidate into a single `.d.ts` file.

#### 18. `zIndex` globally reassigned on load (breaks per-parent ordering)
**File:** `src/renderer/src/shared/save.ts` lines 37-46

`parseNodesData()` flattens **all** nodes across all parents, sorts them globally by `zIndex`, then reassigns `zIndex = 0, 1, 2...` sequentially. This destroys per-parent z-ordering semantics.

**Fix:** Process each parent's nodes independently.

#### 19. `readGraph()` has no error handling for non-JSON responses
**File:** `src/renderer/src/shared/save.ts` line 23

```ts
const data = await res.json()
```

If the IPC handler returns an error or non-JSON, this throws uncaught.

**Fix:** Wrap in try/catch and return null on failure.

#### 20. Redundant code in `Board.tsx` `handleDoubleClick`
**File:** `src/renderer/src/components/nodes/Board.tsx` lines 36-53

The viewport is reset twice (lines 36-42 and 50-53) with nearly identical code.

**Fix:** Consolidate into one call.

#### 21. `ChildNode` interface duplicates `id` and `type`
**File:** `src/renderer/src/types.ts` lines 56-61

`ChildNode` extends `BaseNode` (which already has `id` and `type`) but re-declares them. Harmless but redundant.

---

### 🟢 Suggestions / Improvements

| # | Area | Suggestion |
|---|------|------------|
| A | `save.ts` | Add **debouncing** to disk writes (already noted as TODO on line 5). Currently every store change triggers a write via `setTimeout(..., 0)`. |
| B | `store.tsx` | Add an `onCleanup` / `onUnmount` to stop the settings save effect that runs on every `userConfig` change (line 15-29 writes to disk constantly). |
| C | `NodeWrapper.tsx` | Add `onCleanup` for the `ResizeObserver` (already done on line 98-102, good). |
| D | `ViewPort.tsx` | The selection rectangle (lines 174-188) uses `getBoundingClientRect()` on nodes which may not exist yet, causing `undefined` height. Add fallback. |
| E | `EventHandler.tsx` | Paste handler reads clipboard without checking if a text input is focused — can accidentally paste nodes while typing in an editor. Reuse `isTextInputFocused()`. |
| F | `Url.tsx` | `node.url` is captured non-reactively in `getMetaData()`; if the URL changes, stale data is shown. Use a `createEffect` keyed on `node.url`. |
| G | `Color.tsx` | `getContrastText()` only handles hex colors (`#RRGGBB`). Fails for `rgb()`/`hsl()`/CSS variables. |
| H | `Editor.tsx` & `Note.tsx` | Both duplicate the same Tiptap editor setup (~40 lines each). Extract into a shared `createNoteEditor()` helper. |
| I | `Wrapper.tsx` | `LeaderLine` is used via `@ts-ignore` global. Add a proper ambient type declaration. |
| J | `nodes.json` | This is a hardcoded seed file in the project root; the app actually reads from `~/Documents/GraphNote/nodes.json`. This is confusing for contributors. Add a README note. |

---

### Recommended Fix Order

1. **Create missing edge components** (or stub them out) — app may crash
2. **Fix `updateArrowsPositions()` interval leak** — memory grows unbounded
3. **Fix duplicate drag-drop listeners** — duplicate nodes on file drop
4. **Fix URL regex** — URL-to-UrlNode conversion broken
5. **Remove debug text from NodeWrapper** — UI pollution
6. **Add null checks for `store.nodes[boardId]`** — crash on deleted boards
7. **Create `tsconfig.node.json`** — typecheck script broken
8. **Fix Board color transparency** — invalid CSS for non-hex colors

Would you like me to implement any of these fixes? I can start with the most critical ones (missing edge components, memory leaks, and the URL regex bug).