import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeWithAI(article: {
  title: string;
  summary: string;
}) {
  const prompt = `
You are a financial analysis AI.

Given the following article, return a JSON object with:
- "sentiment": bullish, bearish, or neutral
- "signal": buy, sell, or watch
- "aiSummary": a 1-sentence TL;DR

Article:
"${article.title}"

"${article.summary}"
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You analyze financial news and provide insights." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  const content = res.choices[0].message.content;

  // Try to extract structured data
  try {
    const json = JSON.parse(content || "{}");
    return {
      sentiment: json.sentiment || null,
      signal: json.signal || null,
      aiSummary: json.aiSummary || null,
    };
  } catch (err) {
    console.warn("⚠️ Couldn’t parse AI response:", content);
    return {
      sentiment: null,
      signal: null,
      aiSummary: null,
    };
  }
}
