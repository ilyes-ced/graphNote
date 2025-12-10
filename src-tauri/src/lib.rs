mod scrape;

use scrape::scrape_url;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let cache_config = tauri_plugin_cache::CacheConfig {
        cache_dir: Some("graphNote_cache".into()), // Custom subdirectory within app's cache directory
        cache_file_name: Some("cache_data.json".into()), // Custom cache file name
        cleanup_interval: Some(31536000),          // Clean expired items every 1 year i think
        default_compression: Some(true),           // Enable compression by default
        compression_level: Some(7),                // Higher compression level (0-9, where 9 is max)
        compression_threshold: Some(4096),         // Only compress items larger than 4KB
        compression_method: Some(tauri_plugin_cache::CompressionMethod::Zlib), // Default compression algorithm
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_cache::init_with_config(cache_config))
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![scrape_url])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
