# Polishing

- [x] stop the selection on Notes when dragging items (no longer an issue in electron)
- [x] fix: when scalled down and moving an item outside canvas, when it extends it also moves idk why
- [x] paste nodes: pasted the current state of the nodes not the state at the time of the copy
- [ ] add animations to all actions
- [ ] make adding nodes to column control the position of the insert
- [ ] reimplement leaderLine to suit our uses, like making it one of the items on the canvas so we dont need to update it when we move or zoom the canvas

# optimization

- [x] cache url scrapping (backend)
- [x] stop writing to file when moving nodes
- [x] test animejs and neodrag again their animations were smoother (the issue was tauri not which DnD library was used, in electron all DnD libraries are the same smoothness, even my custom implementation)
- [ ] remove all unneeded imports and functions and comments
- [ ] refactor the backend code to be more readable and coherent

# bugs

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
    - [x] finish the image copy pasting
        - [x] binary data iamges
        - [x] local image paths
        - [x] images URLs (works with <meta> tag image copies, and http/https image copies)
        ```
        <meta http-equiv="content-type" content="text/html; charset=utf-8"><img class="img-fluid isTransparent" src="https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/sds-windows11-laptop-fy24?scl=1&amp;fmt=png-alpha" loading="lazy" alt="" data-automation-test-id="image-uida01c">

        https://lh3.googleusercontent.com/grass-cs/ACvplmMrzy_poFPZl8UUQ7nzUlA7lm9ughQcT_1JBaW6EesSIEGguRr0AqPJtpe22fqPiUoFc127L5Tp6aRbuIQDIaKwPEtyp7LlHK5WzfTGS_5fOpqauclmEA7K_ecuRkcfE0CB_NKK=w426-h240-k-no
        ```
    - [ ] add and test other file types too
- [ ] redo + undo (or git versioning system/actions systems where each action is recorded: adding a node, editing a node, deleting a node . . . . .)
    - [ ] fix:
        - [x] updatePosition (when letting go 2 different positions are recorded)
        - [x] addNode (when putting child in coolumn and doing undo, it goes out of parent but not back to canvas, also the opposite doesnt work)
        - [x] updateTask (does nothing)
        - [x] reorderTasks (does nothing)
        - [ ] editable Title (on column and TODO), works on COlumn but not on TODO
    - [ ] not done yet:
        - [x] newNode
        - [x] newImageNode
        - [ ] newDocumentNode
        - [ ] child nodes moves
        - [ ] changing Note to Url
- [x] make child nodes selectable
- [x] Board node becomes invisible when dragged (started when moving to electron)
- [x] Column node doesnt become invisible when dragging board node
- [x] color selector sometimes changes automatically (rbg(25, 25, 25)) (doesnt seem to remain a problem in electron) (seems to only happen when a node is selected and code is edited and saved)
- [x] youtube videos not working ==> download them with yt-dlp and display them as video (they work on electron as embedded)
- [x] taskLists when writing in one of them they always start writing in another one, the same between them all (started when switching to electron)
- [x] reset viewport data on board change (reset x,y , not zoom)
- [ ] maybe dont delete (from memory/store) other used boards when changing (because when going back it causes a refresh (bad UX))
- [x] copy pasting nodes when focused on text pastes both on text and on nodes
- [x] improve image loading performance
- [x] make the height multiples of 10
    - [x] still not perfect, things look slightly off-center, and Image nodes have a small border at the bottom
    - [ ] the padding is on top and left, when writing or changing the content the node content keeps jumping up and down
- [x] when a board or column is deleted, in nodes.json delete their object
- [x] when deleting nodes, if they have resources (images, files . . .) delete them 
  - [ ] a better option might be to give the user a purge options, keep those resources as backup incase they are needed but give the user a button to delete all unused resources, easier and safer
- [x] when deleting nodes the styles sidebar should be hidden
- [x] when adding new images, increase thier z index
- [x] Url node: when url is blank allow user to write it down
- [ ] cant place nodes on the corner and edges
- [x] when pasting url in a new note node, some issues happen when it transforms
  - [ ] the pasted url to the note node transforms nicely but it creates and image node with some html as its content
- [x] for URL youtube Videos, make it download the video and use a custom video player
    - [x] give the user the option to use embedded youtube video or locally download the videos
- [x] when starting the scale with less than 1 we find the viewport does not extend all the way as intended
- [x] the new snap to grid is not working properly (not consistent)
- [x] when note node is focused disable the arrows to move the node
- [x] in nodes.tsx set timeout to wait for url nodes to load needs to go
- [x] cache URL nodes
- [x] arrows stay in the same position like absolute when you move the canvas
- [x] update arrows when you zoom and move the canvas
- [x] load arrows once both nodes are ready
- [x] todo node sometimes doesnt save changed text
- [x] when zooming, make it point to or from the mouse cursor
- [x] for the redo undo system: deleting resources: once a node is deleted add thier resources names to a list .txt file and when the app launches delete those files and empty the text file
  - [ ] a better option could be to have a button that clears unused resources
  - [ ] or search for unused resources and delete them on startup
- [x] for todo make the title optional
- [x] infinite loop resizing: disable the observer after the first fire, for urls, update once the resource is loaded, when width is changed also do the observe once more
- [x] Note editor buttons not settings is-active class correctly but are working just fine
- [x] image text edit is not focusable
- [x] put images in thier own folder
- [x] selection only works on the left top corner of nodes (calculating the w and h of each node would be expensive)
- [x] set the urls description as the youtube video decription
- [x] selected child nodes: settings styles doesnt work
- [ ] child nodes: when touched slightly it moves from position and the parent Column becomes opaque
- [x] set board bgColor and grid coloor
    - [x] make it possible to use an image as a background for a board
- [x] node creation coordinates are wrong probably dont account for scale
- [x] newly placed nodes use a low Zindex
- [x] make board styles changing in context menu
- [x] ColorPicker in top bar doesnt react to the change in the styles values in the store
- [ ] the createEffcet in store.tsx doesnt need to do the initial run
- [ ] server side: on image creation make sure if the images have the same name tha they are not the same image so we dont save duplicates
- [ ] board change: when going to another board the image change is slow, maybe we should set it before the change
- [x] changing board should reset the viewport size and the x and y and scale
- [x] add select all shortcut (Ctrl+a)
    - [ ] bulk actions undo and redo dont account for the bulk (redoing redoes each action individually)
    - [x] make sure it doesnt trigger if a text is focused
- [x] drgging a full coloumn inside another board deletes it contents
- [ ] each node right click options
- [ ] give user option to disable node borders
- [ ] Good Idea: for deleted items add them to trash instead of deleting and keep their resources (images, cache etc), if the user empties the trash all the resources are then deleted
- [ ] miniMap doesnt account for child nodes in columns
- [ ] minimap when changing board items are displayed wrong
- [x] styles dont work for column children
- [x] empty image node should be a placeholder with an upload button
- [ ] side styles tab:
    - [ ] maybe we should make it appear as a modal near the last selected node
    - [ ] the extra ones appear when you deselect nodes
- [ ] make the user set the number of backups
- [x] when moving a node, move all selected nodes with it
- [ ] crop images when adding them
- [ ] templates
- [x] make Youtube videos downloadable individually instead of downloading them all
- [x] moving nodes with arrows doesnt account for bounds
- [x] Url node: make it clear when a video is already downloaded
- [ ] Url node: add ability to delete video file
- [x] Arrow logic: copy from reactFlow or leaderLine
- [ ] pasting url to canvas create a Url node
- [x] pdf: might be better to use the systen default pdf reader
- [x] Notes: add URLs
- [ ] scrape reddit posts data (title, images ...)
- [ ] All nodes: add fullscreen editing
- [ ] EventHandler: add ctrl+x for cut
- [x] URL node: 
  - [x] when a video is downloaded change the download button color
  - [x] indicate wether the video is downloaded or not
  - [x] youtube playlist urls downloads all items
  - [x] when a vid is cached play it locally not from youtube
  - [x] fix the download notification
- [ ] creating URL node from Note node create an unexpected image node with th html of the url as its content
- [ ] fullscreen node viewer doesnt update the text
- [ ] Url node description: 
  - [ ] description doesnt appear when you transfrom from note node
  - [ ] youtube description are not full but truncated
- [x] multi node drag doesnt work correctly
- [ ] mouse side button to navigate active boards
- [x] when nodes are selected dragging another node drags them too
- [ ] make board nodes borders similar to other nodes in terms of sizing
- [ ] Edges: when a node is deleted delete all related Edges
- [ ] Edges: z-index probably should be the same as its related nodes (maybe the lower one of them)




# extra features
- [ ] pin a certain node to one of the 4 corners
- [ ] add another type of Note node, using typst as an external library
- [ ] add ability to pin certain nodes
- [ ] search: search the entire json file and when a match is found get that node's id and hightlight it in the canvas
- [x] add the user settings to allow the user to choose wether to cache/download:
    - [x] Urls thunmbnails
    - [x] Videos
- [x] css bg color is brighter and paler than it should be
- [ ] opening URLs: dont open the url in the electron app send it to the default browser
- [x] right click menu
- [ ] daily tasks node (or set the recurring period)
- [x] extend Url node to take full screen, display the video and the its description to the side
- [ ] show list of all nodes of a certain type
- [ ] cache Document first page 

# encryption
leave the encryption feature to last because once its implemented we cant manipulate the data as we want
- [ ] for encryption maybe encrypt each file indivudually and load them when needed

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

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


# yt-dlp
must run this command sometimes when deleting node modules:
```
node node_modules/youtube-dl-exec/scripts/postinstall.js
```