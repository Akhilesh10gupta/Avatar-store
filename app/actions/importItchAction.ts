"use server";

export interface ItchGameData {
    title: string;
    description: string;
    coverImage: string;
    screenshots: string[];
    genre: string;
    developer: string;
    releaseDate: string;
    platform: 'Web' | 'Android' | 'PC' | 'Both';
    webPlayUrl?: string;
    webPlayUrlAlternate?: string;
    downloadLinkPC?: string;
    downloadLinkAndroid?: string;
}

export async function fetchItchGameMetadata(itchUrl: string): Promise<{ success: boolean; data?: ItchGameData; error?: string }> {
    try {
        if (!itchUrl || !itchUrl.trim()) {
            return { success: false, error: "Please enter an itch.io game link." };
        }

        const trimmedUrl = itchUrl.trim();
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(trimmedUrl);
        } catch {
            return { success: false, error: "Invalid URL. Please enter a valid web address." };
        }

        if (!parsedUrl.hostname.includes("itch.io")) {
            return { success: false, error: "Link must be from itch.io (e.g. https://creator.itch.io/game-title)." };
        }

        const res = await fetch(trimmedUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            return { success: false, error: `Failed to fetch from itch.io (HTTP ${res.status}). Ensure the game is public.` };
        }

        const html = await res.text();

        // Parse all meta tags safely by strictly isolating each <meta> tag
        const metaMap = parseMetaTags(html);

        // 1. Extract Title
        let title = metaMap["og:title"] || metaMap["twitter:title"] || "";
        
        // Fallback: check <h1 class="game_title">
        if (!title || hasHtmlArtifacts(title)) {
            const h1Match = html.match(/<h1[^>]*class=["'][^"']*game_title[^"']*["'][^>]*>([^<]+)<\/h1>/i);
            if (h1Match) title = h1Match[1].trim();
        }

        // Fallback: check <title>
        if (!title || hasHtmlArtifacts(title)) {
            const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
            if (titleMatch) title = titleMatch[1].trim();
        }

        // Clean title
        title = cleanTitle(title);

        // 2. Extract Description
        let description = metaMap["og:description"] || metaMap["description"] || metaMap["twitter:description"] || "";
        if (!description || hasHtmlArtifacts(description)) {
            const descMatch = html.match(/<div class="formatted_description[^"]*">([\s\S]*?)<\/div>/i);
            if (descMatch) {
                description = descMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
            }
        }

        // 3. Extract Cover Image
        const coverImage = metaMap["og:image"] || metaMap["twitter:image"] || "";

        // 4. Extract Developer / Creator
        let developer = metaMap["twitter:creator"] || "";
        if (!developer) {
            const authorMatch = html.match(/class=["'][^"']*game_author[^"']*["'][^>]*><a[^>]*>([^<]+)<\/a>/i);
            if (authorMatch) {
                developer = authorMatch[1].trim();
            } else {
                const sub = parsedUrl.hostname.split(".")[0];
                if (sub && sub !== "www") developer = sub;
            }
        }
        developer = developer.replace(/^@/, "").trim();

        // 5. Extract Game ID (e.g. from meta itch:path = "games/5291943")
        let gameId = "";
        const itchPath = metaMap["itch:path"];
        if (itchPath) {
            const idMatch = itchPath.match(/games\/(\d+)/i);
            if (idMatch) gameId = idMatch[1];
        }
        if (!gameId) {
            const dataGameIdMatch = html.match(/data-game_id=["'](\d+)["']/i) || html.match(/"game_id"\s*:\s*(\d+)/i);
            if (dataGameIdMatch) {
                gameId = dataGameIdMatch[1];
            }
        }

        // 6. Detect Platforms Accurately from itch.io
        // A game is ONLY playable in browser if it has explicit web game frames or web platform tags
        const hasWebPlatformLink = html.includes("/games/platform-web") || 
                                   html.includes("/games/tag-html5") || 
                                   html.includes("/games/tag-webgl");
        const hasWebGameFrame = html.includes('class="html5_game"') || 
                                html.includes('class="iframe_placeholder"') || 
                                html.includes('class="load_iframe_btn"') ||
                                html.includes('id="game_drop"');
        const isBrowserPlayable = hasWebPlatformLink || hasWebGameFrame;

        // Detect Android
        const hasAndroidTag = html.includes("/games/platform-android") || 
                              html.includes('title="Available for Android"') || 
                              html.includes('icon-android') || 
                              /\.apk["'\s]/i.test(html) || 
                              /\bapk\b/i.test(html) ||
                              /android/i.test(title);

        // Detect Windows / PC
        const hasWindowsTag = html.includes("/games/platform-windows") || 
                              html.includes('title="Available for Windows"') || 
                              html.includes('icon-windows') || 
                              /\.exe["'\s]/i.test(html) || 
                              /windows/i.test(html);

        // Determine Platform: 'Web' | 'Android' | 'PC' | 'Both'
        let platform: 'Web' | 'Android' | 'PC' | 'Both';
        let webPlayUrl: string | undefined = undefined;
        let webPlayUrlAlternate: string | undefined = undefined;
        let downloadLinkPC: string | undefined = undefined;
        let downloadLinkAndroid: string | undefined = undefined;

        if (isBrowserPlayable) {
            platform = 'Web';
            webPlayUrl = gameId ? `https://itch.io/embed-upload/${gameId}?color=171717` : trimmedUrl;
            webPlayUrlAlternate = trimmedUrl;
        } else if (hasAndroidTag && hasWindowsTag) {
            platform = 'Both';
            downloadLinkPC = trimmedUrl;
            downloadLinkAndroid = trimmedUrl;
        } else if (hasAndroidTag) {
            platform = 'Android';
            downloadLinkAndroid = trimmedUrl;
        } else {
            platform = 'PC';
            downloadLinkPC = trimmedUrl;
        }

        // 7. Extract Screenshots
        const screenshotUrls: string[] = [];
        const screenshotRegex = /href=["'](https:\/\/img\.itch\.zone\/[^"']+\.(?:png|jpg|jpeg|webp))["']/gi;
        let match;
        while ((match = screenshotRegex.exec(html)) !== null) {
            const url = match[1];
            if (!screenshotUrls.includes(url) && url !== coverImage) {
                screenshotUrls.push(url);
            }
            if (screenshotUrls.length >= 4) break;
        }

        // 8. Genre / Tag extraction
        let genre = "Indie Game";
        const tagMatch = html.match(/<a href=["']https:\/\/itch\.io\/games\/(?:genre|tag)-([^"']+)["']>([^<]+)<\/a>/i);
        if (tagMatch && tagMatch[2]) {
            genre = tagMatch[2].trim();
        }

        const currentYear = new Date().getFullYear().toString();

        return {
            success: true,
            data: {
                title: title || "Itch.io Game",
                description: description || `Experience ${title} by ${developer || 'Indie Creator'}, available on itch.io.`,
                coverImage,
                screenshots: screenshotUrls,
                genre,
                developer: developer || "Indie Creator",
                releaseDate: currentYear,
                platform,
                webPlayUrl,
                webPlayUrlAlternate,
                downloadLinkPC,
                downloadLinkAndroid,
            }
        };

    } catch (err: any) {
        console.error("Error scraping itch.io game:", err);
        return { success: false, error: err.message || "Failed to fetch itch.io game details." };
    }
}

/**
 * Safely parses all <meta> tags independently by matching each <meta ...> tag boundary.
 * Prevents regex cross-matching over multiple tags.
 */
function parseMetaTags(html: string): Record<string, string> {
    const metaMap: Record<string, string> = {};
    const metaTagRegex = /<meta\s+([^>]+)>/gi;
    let match;

    while ((match = metaTagRegex.exec(html)) !== null) {
        const tagAttributes = match[1];

        // Extract name or property (using [^"']* to never cross quotes)
        const nameMatch = tagAttributes.match(/(?:name|property)=["']([^"']+)["']/i);
        // Extract content
        const contentMatch = tagAttributes.match(/content=["']([^"']*)["']/i);

        if (nameMatch && contentMatch) {
            const key = nameMatch[1].toLowerCase().trim();
            const value = decodeHtml(contentMatch[1].trim());
            metaMap[key] = value;
        }
    }
    return metaMap;
}

function cleanTitle(rawTitle: string): string {
    if (!rawTitle) return "";
    return rawTitle
        .replace(/\s+by\s+.*$/i, "")      // remove " by Creator"
        .replace(/\s*-\s*itch\.io$/i, "")  // remove " - itch.io"
        .replace(/<[^>]+>/g, "")          // strip any HTML tags if any
        .replace(/["'=<>]/g, "")          // strip stray attribute markers
        .trim();
}

function hasHtmlArtifacts(str: string): boolean {
    return str.includes("<meta") || str.includes('property="') || str.includes('content="') || str.includes('name="');
}

function decodeHtml(text: string): string {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
}
