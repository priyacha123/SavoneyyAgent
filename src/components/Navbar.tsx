import { NavbarProps } from "@/lib/types";
import { ShieldCheck, RefreshCw, Play } from "lucide-react";

export const Navbar: React.FC<NavbarProps> = ({ onRunBatch, onSeedData, isLoading }) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-slate-900 flex items-center justify-center text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-base text-slate-900 tracking-tight font-sans">Savoneyy</span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
              Reconciliation Workbench
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium hidden sm:inline-block">
              Track 4 Batch Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSeedData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors disabled:opacity-50 shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`} />
            Seed Synthetic Batch
          </button>

          <button
            onClick={onRunBatch}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 border border-blue-800 rounded-md transition-all disabled:opacity-50 shadow-2xs"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            {isLoading ? "Executing Batch..." : "Run Reconciliation"}
          </button>
        </div>
      </div>
    </header>
  );
};
