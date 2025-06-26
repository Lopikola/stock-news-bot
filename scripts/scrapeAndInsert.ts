// scripts/scrapeAndInsert.ts
import dotenv from "dotenv";
dotenv.config(); // Load .env before anything else

import { insertArticle } from "../src/lib/insertArticle";
import { analyzeWithAI } from "../src/lib/analyzeWithAI"; // 👈 Import the AI function

type RawArticle = {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
};

// 🔧 Replace this mock with your real scraper logic
async function scrapeSomewhere(): Promise<RawArticle[]> {
  return [
    {
      id: "scraped-001",
      title: "Markets Rally as Inflation Slows",
      summary: "Stocks surged on news of slowing inflation and stable interest rates.",
      url: "https://example.com/inflation-slows",
      publishedAt: new Date().toISOString(),
      source: "Bloomberg",
    },
    {
      id: "scraped-002",
      title: "Apple Unveils New AI Chip",
      summary: "Apple announced a new AI chip powering its next-gen devices.",
      url: "https://example.com/apple-ai-chip",
      publishedAt: new Date().toISOString(),
      source: "CNBC",
    },
  ];
}

async function run() {
  const scraped = await scrapeSomewhere();

  for (const article of scraped) {
    try {
      const enriched = await analyzeWithAI({ title: article.title, summary: article.summary });  // 👈 AI enrichment first
      const fullArticle = { ...article, ...enriched };       // 👈 Merge into article

      await insertArticle(fullArticle);                      // 👈 Insert once, fully enriched
      console.log(`✅ Inserted with AI: ${article.title}`);
    } catch (err) {
      console.error(`❌ Failed to insert: ${article.title}`, err);
    }
  }
}

run();


