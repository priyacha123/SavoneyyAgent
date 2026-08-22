import React from "react";
import { FileSearch } from "lucide-react";

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
    <div className="mb-5 p-4 rounded-lg flat-panel">
      <div className="flex items-center gap-2 mb-3">
        <FileSearch className="h-4 w-4 text-slate-700" />
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Discrepancy Detection Matrix (Scored vs Ground Truth)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
        {Object.entries(matrix).map(([key, data]) => {
          const info = labelMap[key] || { title: key, desc: "" };
          return (
            <div key={key} className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-800 block truncate">{info.title}</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base font-bold text-slate-900 font-mono">
                  {data.detected}/{data.total}
                </span>
                <span className="text-xs font-bold text-blue-700 font-mono">{Math.round(data.recallPercentage)}%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight line-clamp-2">{info.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
