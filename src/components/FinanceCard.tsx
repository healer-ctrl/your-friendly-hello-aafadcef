import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, FileText, Bookmark } from "lucide-react";
import type { CompanyData } from "@/data/mockFinancials";
import CompanyLogo from "@/components/CompanyLogo";

interface FinanceCardProps {
  company: CompanyData;
  onReadReport?: () => void;
  onSwipeLeft?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

const FinanceCard = ({ company, onReadReport, onSwipeLeft, onBookmark, isBookmarked = false }: FinanceCardProps) => {
  const isPositive = company.changePercent >= 0;
  const [showBookmarkAnim, setShowBookmarkAnim] = useState(false);
  const x = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const leftIndicatorOpacity = useTransform(x, [-120, -60, 0], [1, 0.5, 0]);
  const rightIndicatorOpacity = useTransform(x, [0, 60, 120], [0, 0.5, 1]);
  const rotate = useTransform(x, [-200, 0, 200], [-5, 0, 5]);

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 80;
    const velocityThreshold = 300;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      onSwipeLeft?.();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onBookmark?.();
      setShowBookmarkAnim(true);
      setTimeout(() => setShowBookmarkAnim(false), 1200);
    }
  };

  return (
    <div className="h-full w-full snap-start flex items-center justify-center p-4 relative">
      <motion.div
        ref={cardRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        style={{ x, rotate }}
        onDragEnd={handleDragEnd}
        className="w-full max-w-sm rounded-3xl bg-card border border-border/60 p-5 shadow-2xl relative overflow-hidden"
      >
        {/* Swipe indicators */}
        <motion.div style={{ opacity: leftIndicatorOpacity }} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-xs font-semibold opacity-0">
          Deep Dive
        </motion.div>
        <motion.div style={{ opacity: rightIndicatorOpacity }} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-xs font-semibold opacity-0">
          Save
        </motion.div>

        {/* Bookmark animation overlay */}
        <AnimatePresence>
          {showBookmarkAnim && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute inset-0 flex items-center justify-center z-20 bg-card/80 backdrop-blur-sm rounded-3xl">
              <Bookmark className="w-16 h-16 text-primary fill-primary" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top pill — quarter */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            {company.quarter}
          </span>
          {isBookmarked && (
            <Bookmark className="w-4 h-4 text-primary fill-primary" />
          )}
        </div>

        {/* Company header */}
        <div className="flex items-center gap-3 mb-4">
          <CompanyLogo domain={company.domain} name={company.name} size="md" />
          <div>
            <h2 className="text-lg font-bold text-foreground font-['Space_Grotesk']">{company.name}</h2>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">{company.ticker}</span>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
              <span className={`text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {isPositive ? "+" : ""}{company.changePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <p className="text-sm font-semibold text-foreground/90 mb-2 leading-snug font-['Space_Grotesk']">
          {company.headline}
        </p>

        {/* Summary */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 font-['Inter']">
          {company.summary}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Revenue", value: company.revenue },
            { label: "Profit", value: company.profit },
            { label: "Growth", value: company.growth },
          ].map((stat) => (
            <div key={stat.label} className="bg-secondary/60 rounded-xl p-2.5 text-center border border-border/40">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                {stat.label}
              </p>
              <p className="text-sm font-bold text-foreground font-['Space_Grotesk']">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Read Full Report link */}
        <button onClick={onReadReport} className="flex items-center gap-1.5 text-primary text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          Read Full Report
        </button>
        <p className="text-[10px] text-muted-foreground/60 mt-1.5">← swipe for deep dive</p>
      </motion.div>
    </div>
  );
};

export default FinanceCard;
