mod log;
use log::{debug, error, info, warning};
mod scrape;
use scrape::scrape_url;
use std::path::PathBuf;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command(async)]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command(async)]
fn download_image(url: &str) -> Result<(), ()> {
    let img_bytes = reqwest::blocking::get(url).unwrap().bytes().unwrap();

    Ok(())
}

//await invoke("download_youtube", {
//  url: "https://www.youtube.com/watch?v=xxxx"
//});
fn home_dir() -> Option<PathBuf> {
    if cfg!(target_os = "windows") {
        std::env::var_os("USERPROFILE").map(PathBuf::from)
    } else {
        std::env::var_os("HOME").map(PathBuf::from)
    }
}
fn documents_graphnote_dir() -> Result<PathBuf, String> {
    let mut dir = home_dir().ok_or("Could not determine home directory")?;

    dir.push("Documents");
    dir.push("GraphNote");

    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;

    Ok(dir)
}
#[tauri::command(async)]
fn download_youtube(url: String) -> Result<String, String> {
    info(format!("downloading video: {}", url));

    let output_dir = documents_graphnote_dir()?; // ~/Documents/GraphNote
    let output_template = output_dir.join("%(id)s.%(ext)s");

    info(format!("yt-dlp output template: {:?}", output_template));

    // ❌ REMOVE THIS — IT CAN NEVER WORK
    // if output_template.exists() { ... }

    let status = std::process::Command::new("yt-dlp")
        .arg("-f")
        //.arg("bv*+ba/b")
        .arg("bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]")
        .arg("--no-playlist")
        .arg("--restrict-filenames")
        .arg("-o")
        .arg(output_template.to_str().unwrap())
        .arg(&url)
        .status()
        .map_err(|e| e.to_string())?;

    if !status.success() {
        error(format!("yt-dlp failed"));
        return Err("yt-dlp failed".into());
    }

    info(format!("file downloaded"));

    let output_dir = documents_graphnote_dir()?;

    let filename_output = std::process::Command::new("yt-dlp")
        .arg("--get-filename")
        .arg("--no-playlist")
        .arg("-f") // force format same as download
        .arg("bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]")
        .arg("-o")
        .arg("%(id)s.%(ext)s")
        .arg(&url)
        .output()
        .map_err(|e| e.to_string())?;

    if !filename_output.status.success() {
        return Err("failed to get filename".into());
    }

    let filename = String::from_utf8_lossy(&filename_output.stdout)
        .trim()
        .to_string();

    let file_path = output_dir.join(&filename);
    // ✅ Return the directory, not a filename
    info(format!(
        "downloaded file: {:?}",
        file_path.to_string_lossy().to_string()
    ));
    Ok(file_path.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let cache_config = tauri_plugin_cache::CacheConfig {
        cache_dir: Some("graphNote_cache".into()), // Custom subdirectory within app's cache directory
        cache_file_name: Some("cache_data.json".into()), // Custom cache file name
        cleanup_interval: Some(31536000),          // Clean expired items every 1 year i think
        default_compression: None,                 // Enable compression by default
        compression_level: Some(7),                // Higher compression level (0-9, where 9 is max)
        compression_threshold: Some(4096),         // Only compress items larger than 4KB
        compression_method: Some(tauri_plugin_cache::CompressionMethod::Zlib), // Default compression algorithm
    };

    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .plugin(tauri_plugin_cache::init_with_config(cache_config))
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            scrape_url,
            download_image,
            download_youtube
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
