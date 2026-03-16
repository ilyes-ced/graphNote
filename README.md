
# Polishing

- [x] stop the selection on Notes when dragging items (no longer an issue in electron)
- [x] fix: when scalled down and moving an item outside canvas, when it extends it also moves idk why
- [x] paste nodes: pasted the current state of the nodes not the state at the time of the copy

# optimization

- [ ] cache url scrapping (backend)
- [ ] cache scrapping images (frontend) (investigation needed on the performance first)
- [x] stop writing to file when moving nodes
- [x] test animejs and neodrag again their animations were smoother (the issue was tauri not which DnD library was used, in electron all DnD libraries are the same smoothness, even my custom implementation)

- [ ] remove all unneeded imports and functions and comments 
- [ ] refactor the backend code to be more readable and coherent



# fixes

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
    - [x] updatePosition (when letting go 2 different positions are recorded) 
    - [x] addNode (when putting child in coolumn and doing undo, it goes out of parent but not back to canvas, also the opposit doesnt work)
    - [x] updateTask (does nothing)
    - [ ] reorderTasks (does nothing)
    - [ ] editable Title (on column and TODO), works on COlumn but not on TODO
  - [ ] not done yet:
    - [x] newNode
    - [x] newImageNode  
    - [ ] newDocumentNode 
    - [ ] child nodes moves 
- [ ] make child nodes selectable
- [ ] Board node becomes invisible when dragged (started when moving to electron)
- [x] color selector sometimes changes automatically (rbg(25, 25, 25)) (doesnt seem to remain a problem in electron) (seems to only happen when a node is selected and code is edited and saved)
- [x] youtube videos not working ==> download them with yt-dlp and display them as video (they work on electron as embedded)
- [ ] taskLists when writing in one of them they always start writing in another one, the same between them all (started when switching to electron)
- [x] reset viewport data on board change (reset x,y , not zoom)
- [ ] maybe dont delete (from memory/store) other used boards when changing (because when going back it causes a refresh (bad UX))
- [x] copy pasting nodes when focused on text pastes both on text and on nodes
- [ ] improve image loading performance
- [x] make the height multiples of 10
  - [ ] still not perfect, things look slightly offcenter, and Image nodes have a small border at the bottom
  - [ ] the padding is on top and left, when writing or changing the content the node content keeps jumping up and down 
- [ ] when a board or column is deleted, in nodes.json delete their object
- [ ] when note is selected and focused arrows to change cursor position move the node as well 
- [ ] when deleting nodes, if they have resources (images, files . . .) delete them
- [ ] when deleting nodes the styles sidebar should be hidden
- [ ] when adding new images, increase thier z index
- [x] Url node: when url is blank allow user to write it down
- [ ] cant place nodes on the corner
- [ ] edges node move detection createEffect keeps firing over and over endlessly without anything being done
- [ ] when pasting url in a new note node, some issues happen when it transforms
- [ ] for URL youtube Videos, make it download the video and use a custom video player
  - [ ] give the user the option to use embedded youtube video or locally download the videos 
- [x] when starting the scale with less than 1 we find the viewport does not extend all the way as intended


# extra features
- [ ] add ability to pin certain nodes
- [ ] search: search the entire json file and when a match is found get that node's id and hightlight it in the canvas
- [ ] add the user settings to allow the user to choose wether to cache/download:
  - [ ] Urls thunmbnails
  - [ ] Videos
- [ ] css bg color is brighter and paler than it should be 
- [ ] opening URLs: dont open the url in the electron app send it to the default browser
- [ ] right click menu
- [ ] daily tasks node



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
