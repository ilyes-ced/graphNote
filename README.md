# Road to production ready

- [x] make Todo widget more usable
  - [x] reorder items
  - [x] enter to create new item
  - [x] backspace to delete item
  - [x] tab to add indent to item
  - [x] multi line paste create an item for each line
- [ ] polish the drag and drop from the sidebar (fix exact position)
- [x] fix the viewport:
  - [x] scroll right and bottom
  - [x] placing item outside to the right or left extends the canvas
- [x] fix the selection on NoteType
- [x] scroll becomes finniky when zoom is used, change zoom target to an outside element
- [x] fix copy paste (copying other components should copy thier data structure and on paste check if its correct and create the corrosponding nodes, other wise if its text create a note, if its a url create a Url node)
  - [ ] finish the image copy pasting
    - [x] binary data iamges
    - [x] local image paths
    - [ ] images URLs
    - [ ] add and test other file types too
- [ ] redo + undo (or git versioning system/actions systems where each action is recorded: adding a node, editing a node, deleting a node . . . . .)
  - [ ] fix:
    - [ ] updatePosition (when letting go 2 different positions are recorded) 
    - [ ] addNode (when putting child in coolumn and doing undo, it goes out of parent but not back to canvas, also the opposit doesnt work)
    - [ ] updateTask (does nothing)
    - [ ] reorderTasks (does nothing)
  - [ ] not done yet:
    - [ ] newNode
    - [ ] newImageNode  
    - [ ] newDocumentNode 
- [ ] make child nodes selectable

```
// ------------------ DOCUMENT / IMAGE ------------------
const newNode = (node: NodeUnion) => {
  const activeBoardId = store.activeBoards.at(-1)?.id;
  if (!activeBoardId) return;

  const prevNodes = store.nodes[activeBoardId] ?? [];
  setStore("nodes", activeBoardId, [...prevNodes, node]);
  saveChanges();

  return {
    undo() {
      setStore("nodes", activeBoardId, prevNodes);
      saveChanges();
    },
    redo() {
      setStore("nodes", activeBoardId, [...prevNodes, node]);
      saveChanges();
    },
  };
};

const newImageNode = (img: string, x: number, y: number) => {
  const node = {
    id: `node_${Date.now()}`,
    type: NodeType.Image,
    path: img,
    x, y, width: 300, index: 0, title: "Untitled", description: "",
  } as NodeUnion;

  return newNode(node);
};

const newDocumentNode = (path: string, x: number, y: number, docType: string) => {
  const node = {
    id: `node_${Date.now()}`,
    type: NodeType.Document,
    path, docType,
    x, y, width: 300, index: 0, description: "test",
  } as NodeUnion;

  return newNode(node);
};
```



# Polishing

- [x] stop the selection on Notes when dragging items (no longer an issue in electron)
- [x] fix: when scalled down and moving an item outside canvas, when it extends it also moves idk why
- [ ] paste nodes: pasted the current state of the nodes not the state at the time of the copy

# optimization

- [ ] cache url scrapping (backend)
- [ ] cache scrapping images (frontend) (investigation needed on the performance first)
- [x] stop writing to file when moving nodes
- [x] test animejs and neodrag again their animations were smoother (the issue was tauri not which DnD library was used, in electron all DnD libraries are the same smoothness, even my custom implementation)

# fixes

- [x] color selector sometimes changes automatically (rbg(25, 25, 25)) (doesnt seem to remain a problem in electron) (seems to only happen when a node is selected and code is edited and saved)
- [ ] youtube videos not working ==> download them with yt-dlp and display them as video
- [ ] reset viewport data on board change
- [ ] maybe dont delete (from memory/store) other used boards when changing (because when going back it causes a refresh (bad UX))
- [ ] copy pasting nodes when focused on text pastes both on text and on nodes
- [ ] improve image loading performance
- [x] make the height multiples of 10
  - [ ] still not perfect, things look slightly offcenter, and Image nodes have a small border at the bottom
- [ ] when a board or column is deleted, in nodes.json delete their object
- [ ] when note is selected and focused arrows to change cursor position move the node as well 
- [ ] when deleting nodes, if they have resources (images, files . . .) delete them
- [ ] when deleting nodes the styles sidebar should be hidden
- [ ] when adding new images, increase thier z index
- [x] Url node: when url is blank allow user to write it down
- [ ] cant place nodes on the corner
- [ ] edges node move detection createEffect keeps firing over and over endlessly without anything being done
- [ ] when pasting url in a new note node, some issues happen when it transforms
# extra features
- [ ] add ability to pin certain nodes
- [ ] search: search the entire json file and when a match is found get that node's id and hightlight it in the canvas
- [ ] add the user settings to allow the user to choose wether to cache/download:
  - [ ] Urls thunmbnails
  - [ ] Videos



# encryption
leave the encryption feature to last because once its implemented we cant manipulate the data as we want






-----------------------------
-----------------------------
-----------------------------
-----------------------------
-----------------------------
-----------------------------
-----------------------------
-----------------------------
-----------------------------

# Old tauri specific

# fix for the error: "unknown path" error for ~/Documents

sudo pacman -S xdg-user-dirs

xdg-user-dirs-update




# dev
```
GDK_BACKEND=x11 WEBKIT_DISABLE_COMPOSITING_MODE=1 pnpm tauri dev
```

# building
```
GDK_BACKEND=x11 WEBKIT_DISABLE_COMPOSITING_MODE=1 NO_STRIP=true pnpm tauri build
```
# running
GDK_BACKEND=x11 WEBKIT_DISABLE_COMPOSITING_MODE=1 ./src-tauri/target/release/bundle/appimage/graphnote_0.1.0_amd64.AppImage
