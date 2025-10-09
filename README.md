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
