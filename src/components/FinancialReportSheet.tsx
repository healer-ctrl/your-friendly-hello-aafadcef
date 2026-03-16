import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { CompanyData } from "@/data/mockFinancials";
import { deepDiveData } from "@/data/companyDeepDive";

interface FinancialReportSheetProps {
  company: CompanyData;
  onClose: () => void;
}

const FinancialReportSheet = ({ company, onClose }: FinancialReportSheetProps) => {
  const data = deepDiveData[company.id];
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
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-[80] bg-card rounded-t-3xl border-t border-border max-h-[85vh] overflow-y-auto"
      >
        {/* Handle */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-xl rounded-t-3xl z-10 pt-3 pb-2 px-5">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-foreground">
                {company.name} — Full Report
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">{company.ticker} · {company.quarter}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-secondary border border-border flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>
        </div>

        <div className="px-5 pb-10 flex flex-col gap-6 mt-2">
          {/* Report text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">
              Quarterly Summary
            </h4>
            <p className="text-sm leading-relaxed text-foreground/90">{financialReport.reportText}</p>
          </motion.div>

          {/* Balance sheet */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-medium">
              Balance Sheet Highlights
            </h4>
            <div className="flex flex-col gap-2">
              {financialReport.balanceSheet.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-secondary/40 border border-border/50"
                >
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-bold font-['Space_Grotesk'] text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Key ratios */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-medium">
              Key Ratios
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {financialReport.keyRatios.map((ratio) => (
                <div
                  key={ratio.label}
                  className="rounded-xl bg-secondary/60 border border-border p-3 text-center"
                >
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    {ratio.label}
                  </p>
                  <p className="text-sm font-bold font-['Space_Grotesk'] text-primary">
                    {ratio.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default FinancialReportSheet;
