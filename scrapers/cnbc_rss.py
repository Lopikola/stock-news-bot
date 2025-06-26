# scrapers/cnbc_rss.py
import requests
from bs4 import BeautifulSoup

def get_cnbc_articles():
    rss_url = "https://www.cnbc.com/id/100003114/device/rss/rss.html"

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/114.0.0.0 Safari/537.36"
        ),
        "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
    }

    try:
        res = requests.get(rss_url, headers=headers, timeout=10)
        res.raise_for_status()
    except Exception as e:
        print(f"❌ Failed to fetch CNBC RSS feed: {e}")
        return []

    soup = BeautifulSoup(res.content, features="xml")
    items = soup.find_all("item")

    articles = []
    for item in items:
        try:
            title = item.title.text.strip() if item.title else ""
            link = item.link.text.strip() if item.link else ""
            summary = item.description.text.strip() if item.description else ""

            if title and link:
                articles.append({
                    "title": title,
                    "link": link,
                    "summary": summary,
                    "source": "CNBC"
                })
        except Exception as e:
            print(f"⚠️ Skipping malformed item: {e}")
            print(item.prettify())  # Debug output if needed

    return articles



