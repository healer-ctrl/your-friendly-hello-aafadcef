import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, Building2, TrendingUp, TrendingDown, BarChart3, Grid3X3, Newspaper, BookOpen } from "lucide-react";
import type { CompanyData } from "@/data/mockFinancials";
import type { DeepDiveData } from "@/data/companyDeepDive";
import { fetchCompanyDataFromGemini } from "@/services/geminiService";
import CompanyLogo from "@/components/CompanyLogo";

interface CompanyDeepDiveProps {
  company: CompanyData;
  onBack: () => void;
}

const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon className="w-4 h-4 text-primary" />
    <h3 className="text-sm font-semibold text-foreground font-['Space_Grotesk']">{title}</h3>
  </div>
);

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-muted/60 ${className}`} />
);

const DeepDiveSkeleton = () => (
  <div className="p-4 pb-20 max-w-md mx-auto space-y-6">
    {/* Header skeleton */}
    <div className="flex items-center gap-3">
      <SkeletonBlock className="w-9 h-9" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-3 w-24" />
      </div>
    </div>

    {/* Overview skeleton */}
    <div className="space-y-3">
      <SkeletonBlock className="h-4 w-32" />
      <SkeletonBlock className="h-12 w-full" />
      <SkeletonBlock className="h-16 w-full" />
      <div className="grid grid-cols-2 gap-2">
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
      </div>
    </div>

    {/* Stock info skeleton */}
    <div className="space-y-3">
      <SkeletonBlock className="h-4 w-28" />
      <div className="grid grid-cols-3 gap-2">
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
      </div>
    </div>

    {/* Chart skeleton */}
    <div className="space-y-3">
      <SkeletonBlock className="h-4 w-36" />
      <SkeletonBlock className="h-32 w-full" />
    </div>

    {/* Metrics skeleton */}
    <div className="space-y-3">
      <SkeletonBlock className="h-4 w-28" />
      <div className="grid grid-cols-2 gap-2">
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
      </div>
    </div>

    {/* Loading text */}
    <p className="text-center text-xs text-primary/70 animate-pulse font-['Inter']">
      Fetching live data via AI...
    </p>
  </div>
);

const CompanyDeepDive = ({ company, onBack }: CompanyDeepDiveProps) => {
  const [data, setData] = useState<DeepDiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPositive = company.changePercent >= 0;
  const dragX = useMotionValue(0);
  const pageOpacity = useTransform(dragX, [0, 150], [1, 0.7]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCompanyDataFromGemini(company.id, company.ticker, company.name)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Gemini fetch error:", err);
          setError("Could not load live data. Showing available information only.");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [company.id, company.ticker, company.name]);

  return (
    <motion.div
      style={{ opacity: pageOpacity, x: dragX }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100 || info.velocity.x > 400) {
          onBack();
        }
      }}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      className="fixed inset-0 z-[60] bg-background overflow-y-auto touch-pan-y"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground font-['Space_Grotesk']">{company.name}</h1>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">{company.ticker}</span>
            {isPositive ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
            <span className={`text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
              {isPositive ? "+" : ""}{company.changePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && <DeepDiveSkeleton />}

      {/* Error state */}
      {error && !loading && (
        <div className="mx-4 mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-xs text-destructive font-['Inter']">{error}</p>
        </div>
      )}

      {/* Content */}
      {data && !loading && (
        <div className="p-4 pb-20 max-w-md mx-auto space-y-6">
          {/* SECTION 1 — Company Overview */}
          <div className="space-y-3">
            <SectionTitle icon={Building2} title="Company Overview" />
            <div className="flex items-center gap-3 mb-2">
              <CompanyLogo domain={company.domain} name={company.name} size="lg" />
              <div>
                <h2 className="text-xl font-bold text-foreground font-['Space_Grotesk']">{company.name}</h2>
                <p className="text-xs text-muted-foreground">{data.overview.sector} · {data.overview.industry}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-['Inter']">{data.overview.description}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Founded", value: data.overview.founded },
                { label: "HQ", value: data.overview.headquarters },
                { label: "CEO", value: data.overview.ceo },
                { label: "Employees", value: data.overview.employees },
              ].map((item) => (
                <div key={item.label} className="bg-secondary/60 rounded-xl p-2.5 border border-border/40">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs font-semibold text-foreground font-['Space_Grotesk']">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2 — Stock Info */}
          <div className="space-y-3">
            <SectionTitle icon={TrendingUp} title="Stock Information" />
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Current Price", value: data.stockInfo.currentPrice },
                { label: "Market Cap", value: data.stockInfo.marketCap },
                { label: "52W High", value: data.stockInfo.high52w },
                { label: "52W Low", value: data.stockInfo.low52w },
                { label: "P/E Ratio", value: data.stockInfo.peRatio },
                { label: "Div. Yield", value: data.stockInfo.dividendYield },
              ].map((item) => (
                <div key={item.label} className="bg-secondary/60 rounded-xl p-2.5 border border-border/40 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs font-bold text-foreground font-['Space_Grotesk']">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3 — Financials Timeline */}
          {data.quarterlyTimeline.some(q => q.revenue > 0) && (
            <div className="space-y-3">
              <SectionTitle icon={BarChart3} title="Financials Timeline" />
              {/* Revenue bars */}
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Revenue</p>
                <div className="flex items-end gap-2 h-24">
                  {data.quarterlyTimeline.map((q, i) => {
                    const maxRevenue = Math.max(...data.quarterlyTimeline.map(x => x.revenue));
                    const height = maxRevenue > 0 ? (q.revenue / maxRevenue) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-lg bg-primary/70" style={{ height: `${height}%` }} />
                        <span className="text-[9px] text-muted-foreground">
                          {typeof q.revenue === "number" && q.revenue > 1000
                            ? `${(q.revenue / 1000).toFixed(0)}K`
                            : q.revenue.toFixed(1)}
                        </span>
                        <span className="text-[9px] text-muted-foreground">{q.quarter}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Net Profit bars */}
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Net Profit</p>
                <div className="flex items-end gap-2 h-24">
                  {data.quarterlyTimeline.map((q, i) => {
                    const maxProfit = Math.max(...data.quarterlyTimeline.map(x => x.netProfit));
                    const height = maxProfit > 0 ? (q.netProfit / maxProfit) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-lg bg-emerald-500/70" style={{ height: `${height}%` }} />
                        <span className="text-[9px] text-muted-foreground">
                          {typeof q.netProfit === "number" && q.netProfit > 1000
                            ? `${(q.netProfit / 1000).toFixed(0)}K`
                            : q.netProfit.toFixed(1)}
                        </span>
                        <span className="text-[9px] text-muted-foreground">{q.quarter}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EPS line */}
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">EPS Trend</p>
                <div className="flex items-center gap-4">
                  {data.quarterlyTimeline.map((q) => (
                    <div key={q.quarter} className="flex-1 text-center">
                      <p className="text-sm font-bold text-foreground font-['Space_Grotesk']">{q.eps}</p>
                      <p className="text-[9px] text-muted-foreground">{q.quarter}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4 — Key Metrics Grid */}
          <div className="space-y-3">
            <SectionTitle icon={Grid3X3} title="Key Metrics" />
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Revenue", value: data.keyMetrics.revenue },
                { label: "Gross Margin", value: data.keyMetrics.grossMargin },
                { label: "Net Margin", value: data.keyMetrics.netMargin },
                { label: "ROE", value: data.keyMetrics.roe },
                { label: "ROCE", value: data.keyMetrics.roce },
                { label: "Debt/Equity", value: data.keyMetrics.debtToEquity },
                { label: "Free Cash Flow", value: data.keyMetrics.freeCashFlow },
              ].map((m) => (
                <div key={m.label} className="bg-secondary/60 rounded-xl p-2.5 border border-border/40">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  <p className="text-sm font-bold text-foreground font-['Space_Grotesk']">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5 — Company News */}
          <div className="space-y-3">
            <SectionTitle icon={Newspaper} title="Latest News" />
            {data.news.map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-secondary/40 border border-border/30 space-y-1">
                <p className="text-[10px] text-primary/70 font-medium">{item.date}</p>
                <p className="text-xs font-semibold text-foreground font-['Space_Grotesk']">{item.headline}</p>
                {item.summary && <p className="text-[11px] text-muted-foreground">{item.summary}</p>}
              </div>
            ))}
          </div>

          {/* SECTION 6 — About & History */}
          <div className="space-y-3">
            <SectionTitle icon={BookOpen} title="About & History" />
            <p className="text-xs text-muted-foreground leading-relaxed font-['Inter']">{data.history.foundingStory}</p>

            {data.history.milestones.length > 0 && (
              <>
                <h4 className="text-xs font-semibold text-foreground font-['Space_Grotesk'] mt-3">Milestones</h4>
                {data.history.milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">{m}</p>
                  </div>
                ))}
              </>
            )}

            {data.history.keyProducts.length > 0 && (
              <>
                <h4 className="text-xs font-semibold text-foreground font-['Space_Grotesk'] mt-3">Key Products & Services</h4>
                <div className="flex flex-wrap gap-1.5">
                  {data.history.keyProducts.map((p) => (
                    <span key={p} className="text-[10px] bg-secondary px-2 py-1 rounded-full text-muted-foreground border border-border/40">
                      {p}
                    </span>
                  ))}
                </div>
              </>
            )}

            {data.history.competitors.length > 0 && (
              <>
                <h4 className="text-xs font-semibold text-foreground font-['Space_Grotesk'] mt-3">Competitors</h4>
                <div className="flex flex-wrap gap-1.5">
                  {data.history.competitors.map((c) => (
                    <span key={c} className="text-[10px] bg-secondary px-2 py-1 rounded-full text-muted-foreground border border-border/40">
                      {c}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CompanyDeepDive;
