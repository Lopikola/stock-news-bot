import { supabase } from "./supabase";
import { z } from "zod";
import { analyzeWithAI } from "./analyzeWithAI";

const RawArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  url: z.string().url(),
  publishedAt: z.string(),
  source: z.string(),
});

export async function insertArticle(article: unknown) {
  const parsed = RawArticleSchema.safeParse(article);
  if (!parsed.success) {
    console.warn("⚠️ Invalid article schema, skipping:", parsed.error.format());
    return;
  }

  const clean = parsed.data;

  // Fix publishedAt
  const parsedDate = new Date(clean.publishedAt);
  clean.publishedAt = isNaN(parsedDate.getTime())
    ? new Date().toISOString()
    : parsedDate.toISOString();

  // De-dupe by URL
  const { data: existing } = await supabase
    .from("articles")
    .select("id")
    .eq("url", clean.url)
    .maybeSingle();

  if (existing) {
    console.log("⏩ Duplicate URL, skipping:", clean.url);
    return;
  }

  // 🔥 Run AI enrichment
  const ai = await analyzeWithAI(clean);

  // Insert into Supabase
  const { error: insertError } = await supabase.from("articles").insert([
    {
      ...clean,
      ...ai, // includes sentiment, signal, aiSummary
    },
  ]);

  if (insertError) {
    console.error("❌ Failed to insert article:", insertError.message);
  } else {
    console.log("✅ Inserted with AI:", clean.title);
  }
}

