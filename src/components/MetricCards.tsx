import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Target, TrendingUp, AlertOctagon } from "lucide-react";

interface MetricCardsProps {
  metrics: {
    totalRecords: number;
    matchedCount: number;
    varianceCount: number;
    exceptionCount: number;
    matchRate: number;
    precision: number;
    recall: number;
    falsePositiveRate: number;
    f1Score: number;
  } | null;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-900/50 border border-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Match Accuracy Rate */}
      <div className="p-4 rounded-xl glass-card border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target className="h-16 w-16 text-blue-400" />
        </div>
        <span className="text-xs text-slate-400 font-medium">Reconciliation Match Rate</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-bold text-white">{metrics.matchRate}%</span>
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> Ground Truth Score
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${metrics.matchRate}%` }}
          />
        </div>
      </div>

      {/* Card 2: Precision & Recall */}
      <div className="p-4 rounded-xl glass-card border-slate-800">
        <span className="text-xs text-slate-400 font-medium">Precision & Recall</span>
        <div className="flex items-baseline justify-between mt-1">
          <div>
            <span className="text-2xl font-bold text-white">{metrics.precision}%</span>
            <span className="text-[10px] text-slate-400 block">Precision</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-2xl font-bold text-indigo-400">{metrics.recall}%</span>
            <span className="text-[10px] text-slate-400 block">Recall</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-2xl font-bold text-purple-400">{metrics.f1Score}%</span>
            <span className="text-[10px] text-slate-400 block">F1 Score</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          FP Rate: <span className="text-slate-200 font-medium">{metrics.falsePositiveRate}%</span>
        </p>
      </div>

      {/* Card 3: Classification Breakdown */}
      <div className="p-4 rounded-xl glass-card border-slate-800">
        <span className="text-xs text-slate-400 font-medium">Batch Record Distribution</span>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">{metrics.matchedCount}</span>
            <span className="text-[10px] text-slate-400">Clean</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400">{metrics.varianceCount}</span>
            <span className="text-[10px] text-slate-400">Variance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-red-400" />
            <span className="text-xs font-semibold text-red-400">{metrics.exceptionCount}</span>
            <span className="text-[10px] text-slate-400">Exceptions</span>
          </div>
        </div>
        <div className="flex h-2 w-full rounded-full overflow-hidden mt-3 bg-slate-800">
          <div
            style={{ width: `${(metrics.matchedCount / metrics.totalRecords) * 100}%` }}
            className="bg-emerald-500"
          />
          <div
            style={{ width: `${(metrics.varianceCount / metrics.totalRecords) * 100}%` }}
            className="bg-amber-500"
          />
          <div
            style={{ width: `${(metrics.exceptionCount / metrics.totalRecords) * 100}%` }}
            className="bg-red-500"
          />
        </div>
      </div>

      {/* Card 4: Total Batch Volume */}
      <div className="p-4 rounded-xl glass-card border-slate-800">
        <span className="text-xs text-slate-400 font-medium">Total Batch Volume</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-bold text-white">{metrics.totalRecords}</span>
          <span className="text-xs text-slate-400">correlated records</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
          <AlertOctagon className="h-3.5 w-3.5 text-blue-400" />
          <span>Multi-source (Gateway + Bank + Ledger)</span>
        </div>
      </div>
    </div>
  );
};
