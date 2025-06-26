from scrapers.cnbc_rss import get_cnbc_articles
from summarizer.ai_tools import summarize_article, analyze_article
from supabase import create_client
from datetime import datetime, timezone
from tqdm import tqdm
import hashlib
import os
import json
from dotenv import load_dotenv

# 🔐 Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

# ✅ Debug check to verify keys are loaded correctly
print("🔑 Supabase key loaded:", bool(SUPABASE_KEY))
print("🧠 OpenAI key loaded:", bool(OPENAI_KEY))

# 🔌 Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 🔑 Unique hash ID from URL
def hash_id(text: str) -> str:
    return hashlib.md5(text.encode("utf-8")).hexdigest()

# 📤 Insert article into Supabase (if not already exists)
def insert_article(data: dict):
    try:
        existing = supabase.table("articles").select("id").eq("id", data["id"]).execute()
        if existing.data:
            print(f"⚠️ Skipping duplicate article: {data['id']}")
            return

        response = supabase.table("articles").insert([data]).execute()

        # ✅ Check if insert returned data
        if not response.data:
            raise Exception(f"Insert returned no data: {response}")
        
        return response
    except Exception as e:
        raise Exception(f"❌ Supabase insert error: {e}")

# 🚀 Main process
def main():
    print("🚀 Starting CNBC scraper...")

    articles = get_cnbc_articles()
    print(f"📰 Found {len(articles)} articles")

    results = []

    for article in tqdm(articles):
        if not isinstance(article, dict):
            print("❌ Skipping malformed article (not a dict):", repr(article))
            continue

        try:
            title = article.get("title", "").strip()
            summary = article.get("summary", "").strip()
            url = article.get("link", "").strip()
            source = article.get("source", "CNBC")

            if not title or not url:
                print("⚠️ Skipping article with missing title or URL")
                continue

            # 🤖 AI-powered enrichment
            seo_summary = summarize_article(summary)
            ai_analysis = analyze_article(summary)

            # ✅ Extract enriched fields
            signal = ai_analysis.get("signal") if isinstance(ai_analysis, dict) else None
            sentiment = ai_analysis.get("sentiment") if isinstance(ai_analysis, dict) else None
            related_stocks = ai_analysis.get("relatedStocks") if isinstance(ai_analysis, dict) else []

            if not isinstance(ai_analysis, dict):
                print(f"⚠️ Unexpected AI analysis result: {type(ai_analysis)}")

            payload = {
                "id": f"cnbc-{hash_id(url)}",
                "title": title,
                "summary": summary,
                "url": url,
                "publishedAt": datetime.now(timezone.utc).isoformat(),
                "source": source,
                "aiSummary": seo_summary,
                "signal": signal,
                "sentiment": sentiment,
                "sentimentScore": ai_analysis.get("sentimentScore"),
                "confidence": ai_analysis.get("confidence"),
                "relatedStocks": related_stocks,

            }

            insert_article(payload)
            print(f"✅ Inserted: {title} | 📈 Stocks: {related_stocks}")
            results.append(payload)

        except Exception as e:
            print(f"❌ Failed to process article: {repr(article)}\nError: {e}")

    # 💾 Save locally
    os.makedirs("data", exist_ok=True)
    with open("data/articles.json", "w") as f:
        json.dump(results, f, indent=2)

    print("🎯 Done: All results saved and synced to Supabase.")

if __name__ == "__main__":
    main()












