# dev

```
GDK_BACKEND=x11 WEBKIT_DISABLE_COMPOSITING_MODE=1 pnpm tauri dev
```

# building

```
NO_STRIP=true pnpm tauri build --verbose
```

# running

```
GDK_BACKEND=x11 WEBKIT_DISABLE_COMPOSITING_MODE=1 ./src-tauri/target/release/bundle/appimage/graphnote_0.1.0_amd64.AppImage
```

# Road to production ready

- [x] make Todo widget more usable
  - [x] reorder items
  - [x] enter to create new item
  - [x] backspace to delete item
  - [x] tab to add indent to item
  - [x] multi line paste create an item for each line
- [ ] polish the drag and drop from the sidebar
- [x] fix the viewport:
  - [x] scroll right and bottom
  - [x] placing item outside tyo the right or left extends the canvas
- [ ] fix the selection on NoteType

# Polishing

- [ ] stop the selection on Notes when draging items
- [ ] color selector sometimes changes automatically
- [ ] fix: when scalled down and moving an item outside canvas, when it extends it also moves idk why
- [ ] paste nodes: pasted the current state of the nodes not the state at the time of the copy
