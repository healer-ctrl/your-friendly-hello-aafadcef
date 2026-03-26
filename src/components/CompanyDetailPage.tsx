import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink, Newspaper } from "lucide-react";
import type { CompanyData } from "@/data/mockFinancials";
import { companyDetails } from "@/data/companyDetails";
import CompanyLogo from "@/components/CompanyLogo";

interface CompanyDetailPageProps {
  company: CompanyData;
  onBack: () => void;
}

const CompanyDetailPage = ({ company, onBack }: CompanyDetailPageProps) => {
  const detail = companyDetails[company.id];
  const isPositive = company.changePercent >= 0;

  const metrics = [
    { label: "Revenue", value: company.revenue },
    { label: "Net Profit", value: company.profit },
    { label: "EPS", value: detail?.eps ?? "—" },
    { label: "YoY Growth", value: company.growth },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[60] bg-background overflow-y-auto"
    >
      <div className="p-4 pb-20 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
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

        {/* Company identity */}
        <div className="flex items-center gap-3 mb-5">
          <CompanyLogo domain={company.domain} name={company.name} size="lg" />
          <div>
            <h2 className="text-xl font-bold text-foreground font-['Space_Grotesk']">{company.name}</h2>
            <p className="text-xs text-muted-foreground">{detail?.sector ?? "—"}</p>
            <p className="text-xs text-primary/80 mt-0.5">{company.quarter}</p>
          </div>
        </div>

        {/* Headline */}
        <p className="text-sm font-semibold text-foreground/90 mb-5 leading-snug font-['Space_Grotesk']">
          {company.headline}
        </p>

        {/* Metrics grid */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-foreground mb-2 font-['Space_Grotesk']">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((m, i) => (
              <div key={i} className="bg-secondary/60 rounded-xl p-3 border border-border/40">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                <p className="text-sm font-bold text-foreground font-['Space_Grotesk']">{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent updates */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-foreground mb-2 font-['Space_Grotesk']">Recent Updates</h3>
          <div className="space-y-2">
            {(detail?.recentUpdates ?? []).map((update, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-secondary/40 border border-border/30">
                <Newspaper className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">{update}</p>
              </div>
            ))}
          </div>
        </div>

        {/* External link CTA */}
        <button className="flex items-center gap-2 text-primary text-xs font-semibold">
          <ExternalLink className="w-3.5 h-3.5" />
          View on Bloomberg
        </button>
      </div>
    </motion.div>
  );
};

export default CompanyDetailPage;
