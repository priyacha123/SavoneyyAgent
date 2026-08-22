import React from "react";
import { AlertCircle, FileSearch } from "lucide-react";

interface DiscrepancyMatrixCardProps {
  matrix: Record<string, { total: number; detected: number; recallPercentage: number }> | null;
}

const labelMap: Record<string, { title: string; desc: string }> = {
  amount_mismatch: {
    title: "Amount Variance",
    desc: "Bank credited amount differs from Gateway settled amount",
  },
  missing_utr: {
    title: "Missing UTR",
    desc: "Gateway payout settlement report lacks UTR reference",
  },
  duplicate: {
    title: "Duplicate Credit",
    desc: "Multiple bank credit advices for same settlement UTR",
  },
  timing_gap: {
    title: "Timing Gap Lag",
    desc: "Settlement value date delayed beyond 3-day banking window",
  },
  unmatched: {
    title: "Orphan Ledger Record",
    desc: "Internal order exists with zero matching gateway/bank transaction",
  },
};

export const DiscrepancyMatrixCard: React.FC<DiscrepancyMatrixCardProps> = ({ matrix }) => {
  if (!matrix) return null;

  return (
    <div className="mb-6 p-5 rounded-xl glass-panel">
      <div className="flex items-center gap-2 mb-4">
        <FileSearch className="h-5 w-5 text-indigo-400" />
        <h3 className="text-sm font-semibold text-white">Discrepancy Type Detection Matrix (vs Ground Truth)</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {Object.entries(matrix).map(([key, data]) => {
          const info = labelMap[key] || { title: key, desc: "" };
          return (
            <div key={key} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-medium text-slate-300 block truncate">{info.title}</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-lg font-bold text-white">
                  {data.detected} / {data.total}
                </span>
                <span className="text-xs font-semibold text-indigo-400">{Math.round(data.recallPercentage)}%</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{info.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
