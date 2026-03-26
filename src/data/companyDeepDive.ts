export interface QuarterlyData {
  quarter: string;
  revenue: number;
  netProfit: number;
  eps: number;
}

export interface StockInfo {
  currentPrice: string;
  high52w: string;
  low52w: string;
  marketCap: string;
  peRatio: string;
  dividendYield: string;
}

export interface CompanyOverview {
  founded: string;
  headquarters: string;
  sector: string;
  industry: string;
  description: string;
  ceo: string;
  employees: string;
}

export interface KeyMetrics {
  revenue: string;
  grossMargin: string;
  netMargin: string;
  roe: string;
  roce: string;
  debtToEquity: string;
  freeCashFlow: string;
}

export interface NewsItem {
  date: string;
  headline: string;
  summary: string;
}

export interface CompanyHistory {
  foundingStory: string;
  milestones: string[];
  keyProducts: string[];
  competitors: string[];
}

export interface FinancialReport {
  reportText: string;
  balanceSheet: { label: string; value: string }[];
  keyRatios: { label: string; value: string }[];
}

export interface DeepDiveData {
  overview: CompanyOverview;
  stockInfo: StockInfo;
  quarterlyTimeline: QuarterlyData[];
  keyMetrics: KeyMetrics;
  news: NewsItem[];
  history: CompanyHistory;
  financialReport: FinancialReport;
}

// Static fallback data - will be overridden by Gemini-fetched data
export const deepDiveData: Record<string, DeepDiveData> = {};
