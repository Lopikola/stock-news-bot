import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# 🔐 Load API key from .env
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ✅ Generate a clear, SEO-optimized news summary
def summarize_article(article_text: str) -> str:
    prompt = f"""
Rewrite the following news article into a clear, professional, SEO-optimized summary.
Make it sound like a human journalist writing for a business audience.
Use a solid paragraph — not bullet points or fragments.

Article:
\"\"\"
{article_text}
\"\"\"
"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"❌ Error in summarize_article(): {e}")
        return "Summary unavailable."

# ✅ Analyze news for trading signal, sentiment, confidence, and affected stocks
def analyze_article(article_text: str) -> dict:
    prompt = f"""
You are a world-class financial analyst and algorithmic trader, working at the highest level of Wall Street.
You specialize in turning breaking news into actionable market intelligence. You must evaluate the following **original news article** using institutional-grade logic.

Your task is to analyze the news like a top hedge fund would:
- Identify its potential **impact on stock prices**
- Understand **market sentiment**
- Predict **investor behavior** and positioning
- Infer **which stocks could be directly or indirectly affected**

You must deeply consider:
- Macroeconomic & microeconomic context
- Sector-specific exposure and trends
- Named companies, competitors, or suppliers
- Regulatory, geopolitical, or monetary policy implications
- Surprise factor vs expectations or earnings forecasts
- Relevance to dominant narratives (e.g. inflation, AI, rate cuts, geopolitics)
- Whether institutional and retail sentiment would diverge
- Whether the event is likely already priced in
- Momentum continuation or reversal potential

Return a pure JSON object with the following fields:
- "signal": "buy" | "sell" | "hold" | "none"
- "sentiment": "positive" | "negative" | "neutral"
- "sentimentScore": integer from 0 (very negative) to 100 (very positive)
- "confidence": integer from 0 to 100 indicating how confident the model is in the trading signal
- "relatedStocks": array of tickers

Respond with ONLY valid JSON. Do not include commentary, markdown, or prose.

Article:
\"\"\"
{article_text}
\"\"\"
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.3,
        )

        content = response.choices[0].message.content.strip()
        print(f"🧠 GPT raw output:\n{content}")

        # 🧹 Strip markdown-style code fences if present
        if content.startswith("```json") or content.startswith("```"):
            content = content.replace("```json", "").replace("```", "").strip()

        try:
            data = json.loads(content)
        except json.JSONDecodeError as e:
            print(f"❌ JSON decode error: {e}")
            return {
                "signal": None,
                "sentiment": None,
                "sentimentScore": None,
                "confidence": None,
                "relatedStocks": []
            }

        # ✅ Validate keys
        expected_keys = ["signal", "sentiment", "sentimentScore", "confidence", "relatedStocks"]
        if not isinstance(data, dict) or not all(k in data for k in expected_keys):
            print("❌ Missing expected keys in GPT response")
            return {
                "signal": None,
                "sentiment": None,
                "sentimentScore": None,
                "confidence": None,
                "relatedStocks": []
            }

        return {
            "signal": data.get("signal"),
            "sentiment": data.get("sentiment"),
            "sentimentScore": data.get("sentimentScore"),
            "confidence": data.get("confidence"),
            "relatedStocks": data.get("relatedStocks", [])
        }

    except Exception as e:
        print(f"❌ Error in analyze_article(): {e}")
        return {
            "signal": None,
            "sentiment": None,
            "sentimentScore": None,
            "confidence": None,
            "relatedStocks": [],
        }
