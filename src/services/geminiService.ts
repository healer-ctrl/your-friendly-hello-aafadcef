import type { DeepDiveData } from "@/data/companyDeepDive";

const GEMINI_API_KEY = "AIzaSyDp1tGOccCkQcLE3pVrUYOOToU1Nvb0WS4";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const CACHE_PREFIX = "gemini_company_";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData {
  data: DeepDiveData;
  timestamp: number;
}

function getCachedData(companyId: string): DeepDiveData | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + companyId);
    if (!raw) return null;
    const cached: CachedData = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + companyId);
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

function setCachedData(companyId: string, data: DeepDiveData): void {
  try {
    const cached: CachedData = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_PREFIX + companyId, JSON.stringify(cached));
  } catch {
    // localStorage full or unavailable
  }
}

function parseGeminiResponse(raw: any): DeepDiveData {
  const r = raw;
  return {
    overview: {
      founded: r.founded ?? "—",
      headquarters: r.headquarters ?? "—",
      sector: r.sector ?? "—",
      industry: r.industry ?? "—",
      description: r.description ?? "—",
      ceo: r.ceo ?? "—",
      employees: String(r.employees ?? "—"),
    },
    stockInfo: {
      currentPrice: r.stock_price ?? "—",
      high52w: r.week_52_high ?? "—",
      low52w: r.week_52_low ?? "—",
      marketCap: r.market_cap ?? "—",
      peRatio: r.pe_ratio ?? "—",
      dividendYield: r.dividend_yield ?? "—",
    },
    quarterlyTimeline: [
      { quarter: "Q1", revenue: parseFloat(r.revenue_q1) || 0, netProfit: parseFloat(r.profit_q1) || 0, eps: parseFloat(r.eps) || 0 },
      { quarter: "Q2", revenue: parseFloat(r.revenue_q2) || 0, netProfit: parseFloat(r.profit_q2) || 0, eps: parseFloat(r.eps) || 0 },
      { quarter: "Q3", revenue: parseFloat(r.revenue_q3) || 0, netProfit: parseFloat(r.profit_q3) || 0, eps: parseFloat(r.eps) || 0 },
      { quarter: "Q4", revenue: parseFloat(r.revenue_q4) || 0, netProfit: parseFloat(r.profit_q4) || 0, eps: parseFloat(r.eps) || 0 },
    ],
    keyMetrics: {
      revenue: r.revenue_ttm ?? "—",
      grossMargin: r.gross_margin ?? "—",
      netMargin: r.net_margin ?? "—",
      roe: r.roe ?? "—",
      roce: r.roce ?? "—",
      debtToEquity: r.debt_equity ?? "—",
      freeCashFlow: r.free_cash_flow ?? "—",
    },
    news: [
      { date: "Latest", headline: r.news_1 ?? "—", summary: "" },
      { date: "Recent", headline: r.news_2 ?? "—", summary: "" },
      { date: "Recent", headline: r.news_3 ?? "—", summary: "" },
      { date: "Recent", headline: r.news_4 ?? "—", summary: "" },
      { date: "Recent", headline: r.news_5 ?? "—", summary: "" },
    ],
    history: {
      foundingStory: `Founded in ${r.founded ?? "—"} and headquartered in ${r.headquarters ?? "—"}. ${r.description ?? ""}`,
      milestones: [r.milestone_1, r.milestone_2, r.milestone_3].filter(Boolean) as string[],
      keyProducts: typeof r.products === "string"
        ? r.products.split(",").map((p: string) => p.trim())
        : Array.isArray(r.products) ? r.products : [],
      competitors: typeof r.competitors === "string"
        ? r.competitors.split(",").map((c: string) => c.trim())
        : Array.isArray(r.competitors) ? r.competitors : [],
    },
    financialReport: {
      reportText: r.description ?? "—",
      balanceSheet: [
        { label: "Market Cap", value: r.market_cap ?? "—" },
        { label: "Revenue (TTM)", value: r.revenue_ttm ?? "—" },
        { label: "Net Profit (TTM)", value: r.profit_ttm ?? "—" },
        { label: "EBITDA", value: r.ebitda ?? "—" },
        { label: "Free Cash Flow", value: r.free_cash_flow ?? "—" },
      ],
      keyRatios: [
        { label: "P/E Ratio", value: r.pe_ratio ?? "—" },
        { label: "EPS", value: r.eps ?? "—" },
        { label: "Debt/Equity", value: r.debt_equity ?? "—" },
        { label: "ROE", value: r.roe ?? "—" },
        { label: "Current Ratio", value: r.current_ratio ?? "—" },
        { label: "ROCE", value: r.roce ?? "—" },
      ],
    },
  };
}

export async function fetchCompanyDataFromGemini(
  companyId: string,
  ticker: string,
  companyName: string
): Promise<DeepDiveData> {
  // Check cache first
  const cached = getCachedData(companyId);
  if (cached) return cached;

  const prompt = `You are a financial data assistant. Using your knowledge and web search, fetch current real data for the company: ${companyName} with ticker ${ticker}.

Return ONLY a raw JSON object, no markdown, no backticks, just JSON:
{
  "name": "full official company name",
  "ticker": "stock ticker symbol",
  "exchange": "NSE or BSE or NYSE etc",
  "sector": "business sector",
  "industry": "specific industry",
  "founded": "founding year",
  "headquarters": "city and country",
  "ceo": "current CEO full name",
  "employees": "approximate employee count",
  "description": "2-3 sentence business description",
  "website": "official website URL",
  "stock_price": "latest stock price with currency",
  "market_cap": "market capitalization formatted",
  "week_52_high": "52 week high price",
  "week_52_low": "52 week low price",
  "pe_ratio": "price to earnings ratio",
  "dividend_yield": "dividend yield percentage",
  "revenue_ttm": "trailing 12 month revenue",
  "profit_ttm": "trailing 12 month net profit",
  "eps": "earnings per share",
  "roe": "return on equity",
  "roce": "return on capital employed",
  "debt_equity": "debt to equity ratio",
  "free_cash_flow": "free cash flow formatted",
  "gross_margin": "gross margin percentage",
  "net_margin": "net margin percentage",
  "ebitda": "EBITDA formatted",
  "current_ratio": "current ratio",
  "revenue_q1": "revenue 4 quarters ago as number",
  "revenue_q2": "revenue 3 quarters ago as number",
  "revenue_q3": "revenue 2 quarters ago as number",
  "revenue_q4": "most recent quarter revenue as number",
  "profit_q1": "profit 4 quarters ago as number",
  "profit_q2": "profit 3 quarters ago as number",
  "profit_q3": "profit 2 quarters ago as number",
  "profit_q4": "most recent quarter profit as number",
  "milestone_1": "major company milestone with year",
  "milestone_2": "major company milestone with year",
  "milestone_3": "major company milestone with year",
  "products": "top 3-5 key products or services comma separated",
  "competitors": "top 3 competitor company names comma separated",
  "news_1": "latest company news headline",
  "news_2": "second latest news headline",
  "news_3": "third latest news headline",
  "news_4": "fourth latest news headline",
  "news_5": "fifth latest news headline"
}`;

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const result = await response.json();

  // Extract text from Gemini response
  const textParts = result.candidates?.[0]?.content?.parts ?? [];
  let jsonText = "";
  for (const part of textParts) {
    if (part.text) jsonText += part.text;
  }

  // Clean up: remove markdown code fences if present
  jsonText = jsonText.trim();
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(jsonText);
  const deepDiveData = parseGeminiResponse(parsed);

  // Cache the result
  setCachedData(companyId, deepDiveData);

  return deepDiveData;
}
