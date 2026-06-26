import { NextRequest, NextResponse } from "next/server";
import { createBlogPostAdmin, seedInitialBlogPosts, getBlogPostsAdmin } from "@/lib/firestore-blog";

// Enforce dynamic rendering and disable caching for this cron endpoint
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        // 1. Security Check
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;
        const isDev = process.env.NODE_ENV === "development";
        const hasBypassParam = request.nextUrl.searchParams.get("bypass") === "true";

        // Only enforce auth if not in development and no bypass parameter is present
        if (!isDev && !hasBypassParam) {
            if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
                return new NextResponse("Unauthorized", { status: 401 });
            }
        }

        // 2. Ensure Database is Seeded First (Self-Healing)
        await seedInitialBlogPosts();

        // 3. Verify API Keys are Present
        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            return NextResponse.json(
                { success: false, error: "GEMINI_API_KEY environment variable is not configured." },
                { status: 500 }
            );
        }

        // Get existing posts to tell Gemini what we already wrote (prevent duplicate topics)
        const existingPosts = await getBlogPostsAdmin();
        const existingTitles = existingPosts.slice(0, 10).map(p => p.title).join(", ");

        // 4. Brainstorm and Generate Article via Google Gemini REST API
        console.log("Generating gaming article using Gemini...");
        const prompt = `You are a professional, senior gaming journalist and technology expert writing for a premium, modern game distribution platform named "Avatar Play".
Your task is to write a highly engaging, detailed, and SEO-optimized news article, game review, or technology insight.

Instructions:
1. Brainstorm a trending topic, technology shift, major game release, or culture review in the gaming industry.
2. The topic MUST NOT duplicate or be too similar to these recent articles: [${existingTitles}].
3. Write a comprehensive, rich article containing at least 600 words of actual reading content.
4. Structure the article with a clear introduction, 2-3 detailed subheadings (heading), 4-6 rich paragraphs (paragraph), at least 1 detailed bulleted list (list) with 3-4 items, and 1 insightful blockquote (quote).
5. The article must be highly informative, objective, and authoritative to comply with Google AdSense quality guidelines.

You MUST respond with a single, valid JSON object in the following format. Do not wrap the JSON in markdown code ticks (like \`\`\`json). The output must be pure, parsable JSON matching this schema:
{
  "title": "A highly engaging, clickable, SEO-friendly title",
  "description": "A compelling 1-2 sentence summary of the article for SEO metadata.",
  "category": "Must be exactly one of: 'Technology', 'Culture', 'Design', 'Industry', 'Security'",
  "slug": "url-friendly-lowercase-slug-derived-from-title-using-hyphens",
  "readTime": "e.g., '5 min read'",
  "keywords": "3-4 comma-separated English keywords representing the visual theme of the article, used for image search",
  "content": [
    {
      "type": "heading",
      "text": "Subheading text"
    },
    {
      "type": "paragraph",
      "text": "Detailed paragraph text."
    },
    {
      "type": "quote",
      "text": "An insightful quote summarizing an industry viewpoint."
    },
    {
      "type": "list",
      "items": [
        "Item Title: Detailed description of the item.",
        "Another Item: Detailed description."
      ]
    }
  ]
}`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
        const geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7
                }
            })
        });

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
        }

        const geminiData = await geminiResponse.json();
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!responseText) {
            throw new Error("Empty response from Gemini API.");
        }

        // Parse Gemini's JSON response
        const article = JSON.parse(responseText.trim());

        // Validate structure
        if (!article.title || !article.slug || !article.content || !Array.isArray(article.content)) {
            throw new Error("Invalid article structure returned by Gemini.");
        }

        // 5. Fetch Cover Image from Unsplash REST API (Fail-safe)
        let coverImage = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"; // High-quality gaming fallback
        const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
        const searchKeywords = article.keywords || "gaming,cyberpunk";

        if (unsplashAccessKey) {
            try {
                console.log(`Searching Unsplash for keywords: ${searchKeywords}`);
                const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchKeywords)}&per_page=1`;
                const unsplashResponse = await fetch(unsplashUrl, {
                    headers: {
                        Authorization: `Client-ID ${unsplashAccessKey}`
                    }
                });

                if (unsplashResponse.ok) {
                    const unsplashData = await unsplashResponse.json();
                    if (unsplashData.results && unsplashData.results.length > 0) {
                        coverImage = unsplashData.results[0].urls.regular;
                        console.log("Found matching Unsplash image:", coverImage);
                    } else {
                        console.log("No images found on Unsplash. Using fallback.");
                    }
                } else {
                    console.log(`Unsplash API returned status: ${unsplashResponse.status}. Using fallback.`);
                }
            } catch (unsplashError) {
                console.error("Error fetching image from Unsplash:", unsplashError);
            }
        } else {
            console.log("UNSPLASH_ACCESS_KEY is not configured. Using default fallback gaming image.");
        }

        // 6. Save the Generated Article to Firestore
        const postDate = new Date();
        const formattedDate = postDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        const newBlogPost = {
            title: article.title,
            slug: article.slug,
            description: article.description,
            category: article.category || "Technology",
            date: formattedDate,
            author: "Avatar Play AI",
            readTime: article.readTime || "5 min read",
            coverImage: coverImage,
            content: article.content
        };

        const saveResult = await createBlogPostAdmin(newBlogPost);

        if (!saveResult.success) {
            throw new Error("Failed to save blog post to Firestore.");
        }

        console.log(`Successfully generated and saved automated blog post: "${article.title}"`);

        return NextResponse.json({
            success: true,
            message: "Successfully generated new automated blog post.",
            post: {
                id: saveResult.id,
                title: newBlogPost.title,
                slug: newBlogPost.slug,
                category: newBlogPost.category,
                date: newBlogPost.date
            }
        });

    } catch (error: any) {
        console.error("Error in automated blog updater:", error);
        return NextResponse.json(
            { success: false, error: error.message || "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
