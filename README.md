# Stock News Bot

This project contains a Next.js interface and a set of scraping utilities for collecting financial news. Articles are enriched with OpenAI before being stored in Supabase.

## Requirements

- Node.js 18+
- Python 3.10+

## Setup

1. Install Node dependencies:
   ```bash
   npm install
   ```
2. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file with your Supabase and OpenAI keys.

## Usage

Run the development server:
```bash
npm run dev
```

To scrape and upload CNBC articles using the Python script:
```bash
python main.py
```

The collected articles are stored locally in `data/articles.json` and uploaded to Supabase.
