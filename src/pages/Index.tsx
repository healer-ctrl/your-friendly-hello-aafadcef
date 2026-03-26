import { useState, useRef, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { companies, type CompanyData, type CompanyCategory } from "@/data/mockFinancials";
import FinanceCard from "@/components/FinanceCard";
import FinancialReportSheet from "@/components/FinancialReportSheet";
import CompanyDeepDive from "@/components/CompanyDeepDive";
import CompanyDetailPage from "@/components/CompanyDetailPage";
import BottomNav, { type TabType } from "@/components/BottomNav";
import SearchTab from "@/components/SearchTab";
import BookmarksTab from "@/components/BookmarksTab";

type FilterType = "all" | CompanyCategory;

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "🇮🇳 India", value: "india" },
  { label: "🇺🇸 US", value: "us" },
  { label: "💻 Tech", value: "tech" },
  { label: "🏦 Banking", value: "banking" },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [reportCompany, setReportCompany] = useState<CompanyData | null>(null);
  const [deepDiveCompany, setDeepDiveCompany] = useState<CompanyData | null>(null);
  const [detailCompany, setDetailCompany] = useState<CompanyData | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCompanies = useMemo(() => {
    if (activeFilter === "all") return companies;
    return companies.filter((c) => c.categories.includes(activeFilter));
  }, [activeFilter]);

  const bookmarkedCompanies = useMemo(
    () => companies.filter((c) => bookmarkedIds.has(c.id)),
    [bookmarkedIds]
  );

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const cardHeight = containerRef.current.clientHeight;
    const newIndex = Math.round(scrollTop / cardHeight);
    setActiveIndex(Math.min(newIndex, filteredCompanies.length - 1));
  }, [filteredCompanies.length]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setActiveIndex(0);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden max-w-md mx-auto relative">
      {/* Top bar */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground font-['Space_Grotesk']">FinPulse</h1>
          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Live</span>
        </div>

        {/* Filter pills — only on feed tab */}
        {activeTab === "feed" && (
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <div className="flex gap-1.5">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => handleFilterChange(f.value)}
                  className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                    activeFilter === f.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/60 text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feed tab */}
      {activeTab === "feed" && (
        <>
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto snap-y snap-mandatory"
          >
            {filteredCompanies.map((company) => (
              <FinanceCard
                key={company.id}
                company={company}
                onReadReport={() => setReportCompany(company)}
                onSwipeLeft={() => setDeepDiveCompany(company)}
                onBookmark={() => toggleBookmark(company.id)}
                isBookmarked={bookmarkedIds.has(company.id)}
              />
            ))}
          </div>

          {/* Side progress bar */}
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-20">
            <div className="flex flex-col gap-1">
              {filteredCompanies.map((_, i) => (
                <div key={i} className={`w-1 rounded-full transition-all ${i === activeIndex ? "h-4 bg-primary" : "h-1.5 bg-muted"}`} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Bookmarks tab */}
      {activeTab === "bookmarks" && (
        <BookmarksTab bookmarkedCompanies={bookmarkedCompanies} onSelectCompany={setDetailCompany} onRemoveBookmark={(id) => toggleBookmark(id)} />
      )}

      {/* Search tab */}
      {activeTab === "search" && (
        <SearchTab onSelectCompany={setDetailCompany} />
      )}

      {/* Bottom nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} bookmarkCount={bookmarkedIds.size} />

      {/* Financial Report Sheet */}
      <AnimatePresence>
        {reportCompany && (
          <FinancialReportSheet company={reportCompany} onClose={() => setReportCompany(null)} />
        )}
      </AnimatePresence>

      {/* Company Deep Dive */}
      <AnimatePresence>
        {deepDiveCompany && (
          <CompanyDeepDive company={deepDiveCompany} onBack={() => setDeepDiveCompany(null)} />
        )}
      </AnimatePresence>

      {/* Company Detail Page (from search/bookmarks) */}
      <AnimatePresence>
        {detailCompany && (
          <CompanyDetailPage company={detailCompany} onBack={() => setDetailCompany(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
