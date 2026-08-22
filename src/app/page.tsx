"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MetricCards } from "@/components/MetricCards";
import { DiscrepancyMatrixCard } from "@/components/DiscrepancyMatrixCard";
import { AuditDetailModal } from "@/components/AuditDetailModal";
import { Search, CheckCircle2, AlertTriangle, XCircle, ChevronRight, Sparkles, SlidersHorizontal } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar onRunBatch={handleRunBatch} onSeedData={handleSeedData} isLoading={isLoading} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Title Section (Flat, clean, zero gradients) */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Multi-Source Financial Settlement & Reconciliation Controller
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Supervised 3-way automated matching engine across Gateway Payout Reports, Bank Credit Advices, and Merchant ERP Ledgers.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-300 shadow-2xs self-start sm:self-auto">
            <Sparkles className="h-4 w-4 text-blue-700" />
            <span className="text-xs text-slate-800 font-semibold">Gemini AI Exception Reasoner Active</span>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <MetricCards metrics={metrics} />

        {/* Ground Truth Discrepancy Matrix */}
        <DiscrepancyMatrixCard matrix={metrics?.discrepancyMatrix || null} />

        {/* Audit Table Workbench */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Reconciliation Audit Trail</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-white text-slate-700 font-mono border border-slate-200">
                {filteredLogs.length} records
              </span>
            </div>

            {/* Controls: Search & Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Box */}
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Txn ID, UTR, Order..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 w-44 sm:w-60 shadow-2xs"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-300">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                    statusFilter === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("matched")}
                  className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                    statusFilter === "matched" ? "bg-emerald-100 text-emerald-800 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Clean
                </button>
                <button
                  onClick={() => setStatusFilter("matched_with_variance")}
                  className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                    statusFilter === "matched_with_variance" ? "bg-amber-100 text-amber-800 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Variance
                </button>
                <button
                  onClick={() => setStatusFilter("exception")}
                  className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                    statusFilter === "exception" ? "bg-red-100 text-red-800 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Exceptions
                </button>
              </div>
            </div>
          </div>

          {/* Audit Records Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 uppercase text-[10px] font-bold tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3.5">Record ID</th>
                  <th className="py-2.5 px-3.5">Txn ID / Order ID</th>
                  <th className="py-2.5 px-3.5">Bank UTR Ref</th>
                  <th className="py-2.5 px-3.5">Classification</th>
                  <th className="py-2.5 px-3.5">Confidence</th>
                  <th className="py-2.5 px-3.5">Gemini AI Audit Diagnosis</th>
                  <th className="py-2.5 px-3.5 text-right">Worksheet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">{log.recordId}</td>
                      <td className="py-2.5 px-3.5">
                        <span className="font-mono text-slate-900 block font-medium">{log.txnId || "N/A"}</span>
                        <span className="text-[10px] text-slate-500 font-mono block">{log.orderId || "N/A"}</span>
                      </td>
                      <td className="py-2.5 px-3.5 font-mono">
                        {log.utr ? (
                          <span className="text-slate-800">{log.utr}</span>
                        ) : (
                          <span className="text-red-700 font-semibold italic">MISSING UTR</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5">
                        {log.status === "matched" && (
                          <span className="badge-matched px-2 py-0.5 rounded text-[11px] font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Matched
                          </span>
                        )}
                        {log.status === "matched_with_variance" && (
                          <span className="badge-variance px-2 py-0.5 rounded text-[11px] font-semibold inline-flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Variance
                          </span>
                        )}
                        {log.status === "exception" && (
                          <span className="badge-exception px-2 py-0.5 rounded text-[11px] font-semibold inline-flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Exception
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-800">
                        {(log.confidenceScore * 100).toFixed(0)}%
                      </td>
                      <td className="py-2.5 px-3.5 max-w-xs truncate text-slate-700 font-normal">
                        {log.geminiReasoning || "—"}
                      </td>
                      <td className="py-2.5 px-3.5 text-right">
                        <button className="p-1 rounded bg-slate-100 text-slate-600 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      No reconciliation records match the query. Click "Run Reconciliation" or "Seed Synthetic Batch" to process data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-500">
        Savoneyy AI Finance Controller • Razorpay AI Buildathon (Track 4)
      </footer>

      {/* Detailed Audit Worksheet Modal */}
      <AuditDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
