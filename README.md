# dev

```
GDK_BACKEND=x11 WEBKIT_DISABLE_COMPOSITING_MODE=1 pnpm tauri dev
```

# building

```
GDK_BACKEND=x11 WEBKIT_DISABLE_COMPOSITING_MODE=1 NO_STRIP=true pnpm tauri build
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
- [ ] polish the drag and drop from the sidebar (fix exact position)
- [x] fix the viewport:
  - [x] scroll right and bottom
  - [x] placing item outside tyo the right or left extends the canvas
- [ ] fix the selection on NoteType
- [ ] scroll becomes finniky when zoom is used, change zoom target to an outside element
- [ ] fix copy paste (copying other components should copy thier data structure and on paste check if its correct and create the corrosponding nodes, other wise if its text create a note, if its a url create a Url node)
- [ ] redo + undo (or git versioning system)
- [ ] make child nodes selectable

# Polishing

- [ ] stop the selection on Notes when draging items
- [ ] color selector sometimes changes automatically (rbg(25, 25, 25))
- [ ] fix: when scalled down and moving an item outside canvas, when it extends it also moves idk why
- [ ] paste nodes: pasted the current state of the nodes not the state at the time of the copy

# optimization

- [x] cache url scrapping (backend)
- [ ] cache scrapping images (frontend)
- [ ] stop writing to file when moving nodes
- [ ]

# fixes

- [ ] youtube videos not working ==> download them with yt-dlp and display them as video
- [ ] reset viewport data on board change
- [ ] maybe dont delete other used boards when changing (because when going back it causes a refresh (bad UX))
- [ ] copy pasting nodes when focused on text pastes both on text and on nodes
