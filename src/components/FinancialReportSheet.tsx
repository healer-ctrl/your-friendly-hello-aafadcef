import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { CompanyData } from "@/data/mockFinancials";
import type { DeepDiveData } from "@/data/companyDeepDive";

interface FinancialReportSheetProps {
  company: CompanyData;
  deepDiveData?: DeepDiveData | null;
  onClose: () => void;
}

const FinancialReportSheet = ({ company, deepDiveData: data, onClose }: FinancialReportSheetProps) => {
  if (!data) return null;

  const { financialReport } = data;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[80] bg-card rounded-t-3xl max-h-[85vh] overflow-y-auto p-5"
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground font-['Space_Grotesk']">{company.name} — Full Report</h3>
            <p className="text-xs text-muted-foreground">{company.ticker} · {company.quarter}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Report text */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-foreground mb-2 font-['Space_Grotesk']">Quarterly Summary</h4>
          <p className="text-xs text-muted-foreground leading-relaxed font-['Inter']">{financialReport.reportText}</p>
        </div>

        {/* Balance sheet */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-foreground mb-2 font-['Space_Grotesk']">Balance Sheet Highlights</h4>
          <div className="space-y-2">
            {financialReport.balanceSheet.map((item) => (
              <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-border/30">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key ratios */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-foreground mb-2 font-['Space_Grotesk']">Key Ratios</h4>
          <div className="grid grid-cols-2 gap-2">
            {financialReport.keyRatios.map((ratio) => (
              <div key={ratio.label} className="bg-secondary/60 rounded-xl p-2.5 border border-border/40">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{ratio.label}</p>
                <p className="text-sm font-bold text-foreground font-['Space_Grotesk']">{ratio.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FinancialReportSheet;
