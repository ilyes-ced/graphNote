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
  - [x] placing item outside tyo the right or left extends the canvas
- [ ] fix the selection on NoteType
- [x] scroll becomes finniky when zoom is used, change zoom target to an outside element
- [x] fix copy paste (copying other components should copy thier data structure and on paste check if its correct and create the corrosponding nodes, other wise if its text create a note, if its a url create a Url node)
  - [ ] finish the image copy pasting
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

- [ ] stop the selection on Notes when draging items
- [ ] color selector sometimes changes automatically (rbg(25, 25, 25))
- [x] fix: when scalled down and moving an item outside canvas, when it extends it also moves idk why
- [ ] paste nodes: pasted the current state of the nodes not the state at the time of the copy

# optimization

- [x] cache url scrapping (backend)
- [ ] cache scrapping images (frontend) (investigation needed on the performance first)
- [x] stop writing to file when moving nodes
- [ ] test animejs and neodrag again thier animations were smoother
- [ ]

# fixes

- [ ] youtube videos not working ==> download them with yt-dlp and display them as video
- [ ] reset viewport data on board change
- [ ] maybe dont delete (from memory/store) other used boards when changing (because when going back it causes a refresh (bad UX))
- [ ] copy pasting nodes when focused on text pastes both on text and on nodes
- [ ] improve image loading performance
- [ ] make the height multiples of 10
- [ ] when a board or column is deleted, in nodes.json delete their object
- [ ] when note is selected and focused arrows to change cursor position move the node as well 
- [ ] when deleting nodes, if they have resources (images, files . . .) delete them
- [ ] when deleting nodes the styles sidebar should be hidden
- [ ] when adding new images, increase thier z index

# extra features
- [ ] add ability to pin certain nodes
- [ ] search: search the entire json file and when a match is found get that node's id and hightlight it in the canvas




# fix for the error: "unknown path" error for ~/Documents

sudo pacman -S xdg-user-dirs

xdg-user-dirs-update