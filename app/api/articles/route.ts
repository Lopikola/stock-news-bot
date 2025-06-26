import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

// Edge runtime = fast cold starts & fast deployments
export const runtime = "edge";

// Raw schema with optional date (we’ll fix later)
const RawArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  url: z.string().url(),
  publishedAt: z.string().optional(),
  source: z.string(),
});

const RawArticlesArraySchema = z.array(RawArticleSchema);

// ✅ Final cleaned type after fixArticle()
type Article = z.infer<typeof RawArticleSchema> & {
  publishedAt: string;
};

// 🧠 30s in-memory cache
let cache: {
  data: Article[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 30 * 1000;

function fixArticle(article: z.infer<typeof RawArticleSchema>): Article {
  const parsedDate = new Date(article.publishedAt || "");
  const isValid = !isNaN(parsedDate.getTime());

  return {
    ...article,
    publishedAt: isValid
      ? parsedDate.toISOString()
      : new Date().toISOString(),
  };
}

export async function GET(request: Request) {
  try {
    // 🔍 Parse query params
    const { searchParams } = new URL(request.url);
    const sourceFilter = searchParams.get("source")?.toLowerCase();
    const publishedAfter = searchParams.get("publishedAfter");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("limit") || "10");

    // 💾 Check cache
    const now = Date.now();
    if (!cache || now - cache.timestamp > CACHE_DURATION) {
      const { data, error } = await supabase
        .from("articles")
        .select("*");

      if (error || !data) {
        throw new Error("Failed to fetch from Supabase: " + error?.message);
      }

      const rawArticles = RawArticlesArraySchema.parse(data);
      const fixedArticles = rawArticles.map(fixArticle);
      cache = { data: fixedArticles, timestamp: now };
    }

    let filtered = cache.data;

    // 🔎 Filter by source
    if (sourceFilter) {
      filtered = filtered.filter((a) =>
        a.source.toLowerCase().includes(sourceFilter)
      );
    }

    // ⏱ Filter by publishedAfter
    if (publishedAfter) {
      const after = new Date(publishedAfter);
      if (!isNaN(after.getTime())) {
        filtered = filtered.filter(
          (a) => new Date(a.publishedAt) > after
        );
      }
    }

    // 📄 Pagination
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return NextResponse.json({
      total: filtered.length,
      page,
      pageSize,
      articles: paginated,
    });
  } catch (error: any) {
    console.error("❌ Failed in /api/articles:", error?.message || error);
    return NextResponse.json(
      { error: "something went sideways 🫠" },
      { status: 500 }
    );
  }
}







