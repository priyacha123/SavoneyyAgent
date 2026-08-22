"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MetricCards } from "@/components/MetricCards";
import { DiscrepancyMatrixCard } from "@/components/DiscrepancyMatrixCard";
import { AuditDetailModal } from "@/components/AuditDetailModal";
import { Search, Filter, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight, Sparkles } from "lucide-react";

export default function Home() {
  const [metrics, setMetrics] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reconciliation/latest");
      const json = await res.json();
      if (json.success) {
        setMetrics(json.metrics);
        setLogs(json.logs || []);
      }
    } catch (e) {
      console.error("Failed to fetch latest reconciliation dataset", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunBatch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reconciliation/run", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        await fetchData();
      }
    } catch (e) {
      console.error("Error executing reconciliation batch:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        await handleRunBatch();
      }
    } catch (e) {
      console.error("Error seeding dataset:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter logs by status and search query
  const filteredLogs = logs.filter((log) => {
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      log.recordId.toLowerCase().includes(q) ||
      (log.txnId && log.txnId.toLowerCase().includes(q)) ||
      (log.utr && log.utr.toLowerCase().includes(q)) ||
      (log.orderId && log.orderId.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onRunBatch={handleRunBatch} onSeedData={handleSeedData} isLoading={isLoading} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Hero Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Multi-Source Settlement & Reconciliation Agent
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Automated 3-way matching across Payment Gateway Payouts, Bank Accounts, and Merchant ERP Ledgers.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-slate-300 font-medium">Gemini AI Exception Reasoning Active</span>
          </div>
        </div>

        {/* Metrics Overview */}
        <MetricCards metrics={metrics} />

        {/* Discrepancy Matrix */}
        <DiscrepancyMatrixCard matrix={metrics?.discrepancyMatrix || null} />

        {/* Audit Table Section */}
        <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border border-slate-800">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Reconciliation Audit Trail</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {filteredLogs.length} records
              </span>
            </div>

            {/* Controls: Search & Filter */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Txn ID, UTR, Order..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    statusFilter === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("matched")}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    statusFilter === "matched" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Clean
                </button>
                <button
                  onClick={() => setStatusFilter("matched_with_variance")}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    statusFilter === "matched_with_variance" ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Variance
                </button>
                <button
                  onClick={() => setStatusFilter("exception")}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    statusFilter === "exception" ? "bg-red-500/20 text-red-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Exceptions
                </button>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] font-semibold tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">Txn ID / Order ID</th>
                  <th className="py-3 px-4">UTR Reference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Gemini AI Diagnosis</th>
                  <th className="py-3 px-4 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-white">{log.recordId}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-200 block">{log.txnId || "N/A"}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{log.orderId || "N/A"}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {log.utr ? (
                          <span className="text-slate-300">{log.utr}</span>
                        ) : (
                          <span className="text-red-400 font-semibold italic">MISSING UTR</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {log.status === "matched" && (
                          <span className="badge-matched px-2 py-0.5 rounded-full text-[11px] font-medium inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Matched
                          </span>
                        )}
                        {log.status === "matched_with_variance" && (
                          <span className="badge-variance px-2 py-0.5 rounded-full text-[11px] font-medium inline-flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Variance
                          </span>
                        )}
                        {log.status === "exception" && (
                          <span className="badge-exception px-2 py-0.5 rounded-full text-[11px] font-medium inline-flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Exception
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-200">
                        {(log.confidenceScore * 100).toFixed(0)}%
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-300 font-normal">
                        {log.geminiReasoning || "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="p-1.5 rounded bg-slate-800 text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No reconciliation records match the selected query. Click "Run Reconciliation" or "Seed Synthetic Batch" to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        Savoneyy AI Finance Controller • Built for Razorpay AI Buildathon (Track 4)
      </footer>

      {/* Audit Detail Modal Drawer */}
      <AuditDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
