import "dotenv/config";
// Use the library from the root "lib" directory
import { insertArticle } from "../lib/insertArticle";

const testArticle = {
  id: "test-ai-insert-001",
  title: "Tesla Reports Record Q2 Profits Despite Global Slowdown",
  summary: "Tesla’s latest quarterly earnings exceeded analyst expectations, with strong EV sales and improved margins.",
  url: "https://example.com/tesla-q2-profits",
  publishedAt: new Date().toISOString(),
  source: "CNBC"
};

insertArticle(testArticle).then(() => {
  console.log("🚀 Test complete");
});

