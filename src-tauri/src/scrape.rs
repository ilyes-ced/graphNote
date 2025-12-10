use reqwest::blocking::Client;
use scraper::{Html, Selector};
use serde_json::{json, Value};
use tauri_plugin_cache::CacheExt;
use url::Url;

async fn get_cache(url: &String, app_handle: tauri::AppHandle) -> Result<Value, bool> {
    // Access the cache
    let cache = app_handle.cache();

    let value: Option<Value> = cache.get(&url).map_err(|e| e.to_string()).unwrap();

    //println!("=================>>>>> inside get_cache: {:?}", value);

    match value {
        Some(values) => return Ok(values),
        None => return Err(false),
    }
}

async fn save_cache(url: &String, data: &Value, app_handle: tauri::AppHandle) -> Result<(), ()> {
    let cache = app_handle.cache();

    let compress_options = Some(tauri_plugin_cache::SetItemOptions {
        ttl: Some(31536000),
        compress: Some(false),
        compression_method: None,
    });
    // println!(
    //     "=================>>>>> inside saving cache |||||||||||||||||||||||||||| {:?}",
    //     data
    // );

    cache
        .set(url.to_string(), data, compress_options)
        .map_err(|e| e.to_string())
        .unwrap();

    return Ok(());
}

#[tauri::command]
pub async fn scrape_url(url: String, app_handle: tauri::AppHandle) -> Result<Value, String> {
    //let data = get_cache(&url, app_handle.clone()).await;

    use std::time::Instant;
    let now = Instant::now();
    if let Ok(cached) = get_cache(&url, app_handle.clone()).await {
        println!("url '{}' is cached", url);
        let elapsed = now.elapsed();
        println!("caching Elapsed: {:.2?}", elapsed);
        return Ok(cached);
    }

    // println!("=================>>>>> recieved from get_cache: {:?}", data);
    let url_clone = url.clone();

    let now = Instant::now();
    let meta = tauri::async_runtime::spawn_blocking(move || {
        println!("[scrape_url] Scraping URL: {}", url);

        // Fetch the page HTML
        let client = Client::builder()
            .user_agent("Mozilla/5.0 (compatible; URLPreviewBot/1.0)")
            .build()
            .map_err(|e| format!("Client error: {}", e))
            .unwrap();

        let res = client
            .get(&url)
            .send()
            .map_err(|e| format!("Request failed: {}", e))
            .unwrap()
            .text()
            .map_err(|e| format!("Failed to read response body: {}", e))
            .unwrap();

        let document = Html::parse_document(&res);

        // Parse <meta> tags
        let meta_selector = Selector::parse("meta").unwrap();
        let link_selector = Selector::parse("link[rel='image_src']").unwrap();
        let img_selector = Selector::parse("img").unwrap();

        let mut title: Option<String> = None;
        let mut description: Option<String> = None;
        let mut image: Option<String> = None;
        let mut favicon: Option<String> = None;

        for el in document.select(&meta_selector) {
            let tag = el.value();

            if let Some(prop) = tag.attr("property") {
                match prop {
                    "og:title" => {
                        title = tag
                            .attr("content")
                            .filter(|s| !s.trim().is_empty())
                            .map(|s| s.to_string());
                    }
                    "og:description" => {
                        description = tag
                            .attr("content")
                            .filter(|s| !s.trim().is_empty())
                            .map(|s| s.to_string());
                    }
                    "og:image" => {
                        image = tag
                            .attr("content")
                            .filter(|s| !s.trim().is_empty())
                            .map(|s| s.to_string());
                    }
                    _ => {}
                }
            }

            if let Some(name) = tag.attr("name") {
                match name {
                    "twitter:title" if title.is_none() => {
                        title = tag
                            .attr("content")
                            .filter(|s| !s.trim().is_empty())
                            .map(|s| s.to_string());
                    }
                    "twitter:description" if description.is_none() => {
                        description = tag
                            .attr("content")
                            .filter(|s| !s.trim().is_empty())
                            .map(|s| s.to_string());
                    }
                    "twitter:image" if image.is_none() => {
                        image = tag
                            .attr("content")
                            .filter(|s| !s.trim().is_empty())
                            .map(|s| s.to_string());
                    }
                    _ => {}
                }
            }
        }

        // Try <link rel="image_src">
        if image.is_none() {
            if let Some(link) = document.select(&link_selector).next() {
                if let Some(href) = link.value().attr("href") {
                    if !href.trim().is_empty() {
                        image = Some(href.to_string());
                    }
                }
            }
        }

        // Try first usable <img>
        if image.is_none() {
            for img in document.select(&img_selector) {
                if let Some(src) = img.value().attr("src") {
                    if !src.trim().is_empty() {
                        image = Some(src.to_string());
                        break;
                    }
                }
            }
        }

        // Normalize image URL if it's relative
        if let Some(img_url) = &image {
            if let Ok(base) = Url::parse(&url) {
                if let Ok(full_url) = base.join(img_url) {
                    image = Some(full_url.to_string());
                }
            }
        }

        let link_selector = Selector::parse("link").unwrap();
        for el in document.select(&link_selector) {
            let tag = el.value();

            if let Some(rel) = tag.attr("rel") {
                if ["icon", "shortcut icon", "apple-touch-icon"].contains(&rel) {
                    if let Some(href) = tag.attr("href") {
                        if !href.trim().is_empty() {
                            favicon = Some(href.to_string());
                            break;
                        }
                    }
                }
            }
        }

        // Normalize favicon URL (relative → absolute)
        if let Some(fav_url) = &favicon {
            if let Ok(base) = Url::parse(&url) {
                if let Ok(full_url) = base.join(fav_url) {
                    favicon = Some(full_url.to_string());
                }
            }
        }

        Ok(json!({
            "title": title.unwrap_or_default(),
            "description": description.unwrap_or_default(),
            "image": image.unwrap_or_default(),
            "favicon" : favicon.unwrap_or_default()
        }))
    })
    .await
    .map_err(|e: tauri::Error| format!("Task failed: {}", e))?
    .map_err(|e: tauri::Error| format!("Scrape failed: {}", e))?;
    let elapsed = now.elapsed();
    println!("scrapping Elapsed: {:.2?}", elapsed);

    println!("caching  {:?}", meta);
    let _ = save_cache(&url_clone, &meta, app_handle).await;
    Ok(meta)
}
