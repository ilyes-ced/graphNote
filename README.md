
# Polishing

- [x] stop the selection on Notes when dragging items (no longer an issue in electron)
- [x] fix: when scalled down and moving an item outside canvas, when it extends it also moves idk why
- [x] paste nodes: pasted the current state of the nodes not the state at the time of the copy
- [ ] add animations to all actions
- [ ] make adding nodes to column control the position of the insert
- [ ] reimplement leaderLine to suit our uses, like making it one of the items on the canvas so we dont need to update it when we move or zoom the canvas

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
- [x] polish the drag and drop from the sidebar (fix exact position)
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
    - [x] addNode (when putting child in coolumn and doing undo, it goes out of parent but not back to canvas, also the opposite doesnt work)
    - [x] updateTask (does nothing)
    - [ ] reorderTasks (does nothing)
    - [ ] editable Title (on column and TODO), works on COlumn but not on TODO
  - [ ] not done yet:
    - [x] newNode
    - [x] newImageNode  
    - [ ] newDocumentNode 
    - [ ] child nodes moves 
    - [ ] changing Note to Url
- [ ] make child nodes selectable
- [x] Board node becomes invisible when dragged (started when moving to electron)
- [x] Column node doesnt become invisible when dragging board node
- [x] color selector sometimes changes automatically (rbg(25, 25, 25)) (doesnt seem to remain a problem in electron) (seems to only happen when a node is selected and code is edited and saved)
- [x] youtube videos not working ==> download them with yt-dlp and display them as video (they work on electron as embedded)
- [ ] taskLists when writing in one of them they always start writing in another one, the same between them all (started when switching to electron)
- [x] reset viewport data on board change (reset x,y , not zoom)
- [ ] maybe dont delete (from memory/store) other used boards when changing (because when going back it causes a refresh (bad UX))
- [x] copy pasting nodes when focused on text pastes both on text and on nodes
- [ ] improve image loading performance
- [x] make the height multiples of 10
  - [ ] still not perfect, things look slightly off-center, and Image nodes have a small border at the bottom
  - [ ] the padding is on top and left, when writing or changing the content the node content keeps jumping up and down 
- [x] when a board or column is deleted, in nodes.json delete their object
- [ ] when deleting nodes, if they have resources (images, files . . .) delete them
- [x] when deleting nodes the styles sidebar should be hidden
- [x] when adding new images, increase thier z index
- [x] Url node: when url is blank allow user to write it down
- [ ] cant place nodes on the corner
- [ ] when pasting url in a new note node, some issues happen when it transforms
- [ ] for URL youtube Videos, make it download the video and use a custom video player
  - [ ] give the user the option to use embedded youtube video or locally download the videos 
- [x] when starting the scale with less than 1 we find the viewport does not extend all the way as intended
- [ ] edges
  - [ ] edges are not adjusted to scale
- [ ] the new snap to grid is not working properly (not consistent)
- [ ] bezier edge needs to adjust for scale
- [ ] when note node is focused disable the arrows to move the node 
- [ ] in nodes.tsx settimeout to wait for url nodes to load needs to go
- [ ] cache URL nodes
- [x] arrows stay in the same position like absolute when you move the canvas
- [x] update arrows when you zoom and move the canvas
- [ ] load arrows once both nodes are ready
- [ ] todo node sometimes doesnt save changed text
- [ ] when zooming, make it point to or from the mouse cursor
- [ ] for the redo undo system: deleting resources: once a node is deleted add thier resources names to a list .txt file and when the app launches delete those files and empty the text file
- [ ] for todo make the title optional
- [x] infinite loop resizing: disable the observer after the first fire, for urls, update once the resource is loaded, when width is changed also do the observe once more
- [ ] recomended width for new Note nodes is 580
- [ ] Note editor buttons not settings is-active class correctly but are working just fine
- [ ] image text edit is not focusable
- [ ] put images in thier own folder
- [ ] selection only works on the left top corner of nodes (calculating the w and h of each node would be expensive)
- [ ] set the urls description as the youtube video decription
- [ ] selected child nodes: settings styles doesnt work
- [ ] child nodes: when touched slightly it moves from position and the parent Column becomes opaque
- [ ] set board bgColor and grid coloor
  - [ ] make it possible to use an image as a background for a board
- [ ] node creation coordinates are wrong probably dont account for scale
- [ ] newly placed nodes use a low Zindex
- [ ] make board styles changing in context menu
- [ ] ColorPicker in top bar doesnt react to the change in the styles values in the store



# extra features
- [ ] add another type of Note node, using typst as an external library
- [ ] add ability to pin certain nodes
- [ ] search: search the entire json file and when a match is found get that node's id and hightlight it in the canvas
- [ ] add the user settings to allow the user to choose wether to cache/download:
  - [ ] Urls thunmbnails
  - [ ] Videos
- [ ] css bg color is brighter and paler than it should be 
- [ ] opening URLs: dont open the url in the electron app send it to the default browser
- [ ] right click menu
- [ ] daily tasks node (or set the recurring period)



# encryption
leave the encryption feature to last because once its implemented we cant manipulate the data as we want
- [ ] for enxryption maybe encrypt each file indivudually and load them when needed




# for better performance and display
- [ ] pixiJS
- [ ] tldraw




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
