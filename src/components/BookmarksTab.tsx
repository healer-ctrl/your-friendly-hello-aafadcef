import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, TrendingUp, TrendingDown } from "lucide-react";
import type { CompanyData } from "@/data/mockFinancials";
import CompanyLogo from "@/components/CompanyLogo";

interface BookmarksTabProps {
  bookmarkedCompanies: CompanyData[];
  onSelectCompany: (company: CompanyData) => void;
  onRemoveBookmark: (id: string) => void;
}

const BookmarksTab = ({ bookmarkedCompanies, onSelectCompany, onRemoveBookmark }: BookmarksTabProps) => {
  return (
    <div className="px-4 pt-2 pb-20 space-y-3">
      <h2 className="text-lg font-bold text-foreground font-['Space_Grotesk']">Saved Companies</h2>

      {bookmarkedCompanies.length === 0 && (
        <div className="text-center py-16">
          <Bookmark className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Swipe right on a card to save it here</p>
        </div>
      )}

      <AnimatePresence>
        {bookmarkedCompanies.map((company, i) => {
          const isPositive = company.changePercent >= 0;
          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-secondary/60 border border-border/60"
            >
              <button
                onClick={() => onSelectCompany(company)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                <CompanyLogo domain={company.domain} name={company.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground font-['Space_Grotesk']">{company.name}</span>
                    {isPositive ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                    <span className={`text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                      {isPositive ? "+" : ""}{company.changePercent}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{company.headline}</p>
                </div>
              </button>
              <button
                onClick={() => onRemoveBookmark(company.id)}
                className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
              >
                <Bookmark className="w-4 h-4 text-primary fill-primary" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default BookmarksTab;
