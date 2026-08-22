import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Target, TrendingUp, Layers } from "lucide-react";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-white border border-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {/* Card 1: Match Accuracy Rate */}
      <div className="p-3.5 rounded-lg flat-panel">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Reconciliation Match Rate</span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            {metrics.matchRate}% Score
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{metrics.matchRate}%</span>
          <span className="text-xs text-slate-500 font-mono">({metrics.matchedCount}/{metrics.totalRecords})</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden border border-slate-200">
          <div
            className="bg-blue-700 h-full rounded-full transition-all duration-300"
            style={{ width: `${metrics.matchRate}%` }}
          />
        </div>
      </div>

      {/* Card 2: Precision & Recall */}
      <div className="p-3.5 rounded-lg flat-panel">
        <span className="text-xs text-slate-500 font-medium">Precision & Recall (Ground Truth)</span>
        <div className="flex items-baseline justify-between mt-1">
          <div>
            <span className="text-xl font-bold text-slate-900">{metrics.precision}%</span>
            <span className="text-[10px] text-slate-500 uppercase block font-medium">Precision</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-xl font-bold text-blue-700">{metrics.recall}%</span>
            <span className="text-[10px] text-slate-500 uppercase block font-medium">Recall</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-xl font-bold text-slate-700">{metrics.f1Score}%</span>
            <span className="text-[10px] text-slate-500 uppercase block font-medium">F1 Score</span>
          </div>
        </div>
      </div>

      {/* Card 3: Classification Distribution */}
      <div className="p-3.5 rounded-lg flat-panel">
        <span className="text-xs text-slate-500 font-medium">Batch Record Classification</span>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">{metrics.matchedCount}</span>
            <span className="text-[10px] text-slate-500">Clean</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-bold text-slate-900">{metrics.varianceCount}</span>
            <span className="text-[10px] text-slate-500">Variance</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5 text-red-600" />
            <span className="text-xs font-bold text-slate-900">{metrics.exceptionCount}</span>
            <span className="text-[10px] text-slate-500">Exceptions</span>
          </div>
        </div>
        <div className="flex h-1.5 w-full rounded-full overflow-hidden mt-2.5 bg-slate-100 border border-slate-200">
          <div
            style={{ width: `${(metrics.matchedCount / metrics.totalRecords) * 100}%` }}
            className="bg-emerald-600"
          />
          <div
            style={{ width: `${(metrics.varianceCount / metrics.totalRecords) * 100}%` }}
            className="bg-amber-500"
          />
          <div
            style={{ width: `${(metrics.exceptionCount / metrics.totalRecords) * 100}%` }}
            className="bg-red-600"
          />
        </div>
      </div>

      {/* Card 4: Total Batch Volume */}
      <div className="p-3.5 rounded-lg flat-panel">
        <span className="text-xs text-slate-500 font-medium">Total Record Volume</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-slate-900">{metrics.totalRecords}</span>
          <span className="text-xs text-slate-500 font-medium">correlated records</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-2 font-mono">
          False Positives: <span className="font-bold text-slate-800">{metrics.falsePositiveRate}%</span>
        </p>
      </div>
    </div>
  );
};
