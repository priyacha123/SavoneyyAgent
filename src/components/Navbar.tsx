import React from "react";
import { ShieldCheck, Sparkles, RefreshCw, Play } from "lucide-react";

interface NavbarProps {
  onRunBatch: () => void;
  onSeedData: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onRunBatch, onSeedData, isLoading }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">Savoneyy</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                AI Finance Controller
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-Source Settlement & Audit Engine (Track 4)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSeedData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Seed Synthetic Batch
          </button>

          <button
            onClick={onRunBatch}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            {isLoading ? "Reconciling..." : "Run Reconciliation"}
          </button>
        </div>
      </div>
    </header>
  );
};
