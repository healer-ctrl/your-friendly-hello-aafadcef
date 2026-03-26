import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { companies, type CompanyData } from "@/data/mockFinancials";
import CompanyLogo from "@/components/CompanyLogo";

interface SearchTabProps {
  onSelectCompany: (company: CompanyData) => void;
}

const SearchTab = ({ onSelectCompany }: SearchTabProps) => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.ticker.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="px-4 pt-2 pb-20 space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search company or ticker..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 font-['Inter']"
          autoFocus
        />
      </div>

      {/* Results */}
      <AnimatePresence>
        {query.trim() && results.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No companies found for "{query}"</p>
        )}

        {results.map((company, i) => {
          const isPositive = company.changePercent >= 0;
          return (
            <motion.button
              key={company.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectCompany(company)}
              className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl bg-secondary/60 border border-border/60 active:scale-[0.98] transition-transform"
            >
              <CompanyLogo domain={company.domain} name={company.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground font-['Space_Grotesk']">{company.name}</span>
                  <span className="text-xs text-muted-foreground">{company.ticker}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{company.headline}</p>
              </div>
              <div className="flex items-center gap-1">
                {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
                <span className={`text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {isPositive ? "+" : ""}{company.changePercent}%
                </span>
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Trending section when no query */}
      {!query.trim() && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground font-['Space_Grotesk']">Trending Companies</h3>
          {companies.slice(0, 5).map((company, i) => (
            <button
              key={company.id}
              onClick={() => onSelectCompany(company)}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40 text-left active:scale-[0.98] transition-transform w-full"
            >
              <span className="text-lg font-bold text-primary/60 w-6 text-center">{i + 1}</span>
              <CompanyLogo domain={company.domain} name={company.name} size="sm" />
              <div>
                <span className="text-sm font-semibold text-foreground font-['Space_Grotesk']">{company.name}</span>
                <span className="text-xs text-muted-foreground ml-2">{company.ticker}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchTab;
