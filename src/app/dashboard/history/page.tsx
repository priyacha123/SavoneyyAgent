"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowUpRight,
  Calendar,
} from "lucide-react";

interface BatchRun {
  id: string;
  batchId: string;
  startedAt: string;
  completedAt: string | null;
  totalRecords: number;
  matchedCount: number;
  varianceCount: number;
  exceptionCount: number;
  status: string;
}

function StatusPill({ status }: { status: string }) {
  if (status === "completed")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="h-3 w-3" /> Completed
      </span>
    );
  if (status === "running")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <Clock className="h-3 w-3 animate-spin" /> Running
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
      <XCircle className="h-3 w-3" /> Failed
    </span>
  );
}

// Mock data used until backend endpoint is wired
const MOCK_BATCHES: BatchRun[] = [
  {
    id: "1",
    batchId: "BATCH-2024-001",
    startedAt: "2024-01-15T09:30:00Z",
    completedAt: "2024-01-15T09:32:14Z",
    totalRecords: 150,
    matchedCount: 120,
    varianceCount: 18,
    exceptionCount: 12,
    status: "completed",
  },
  {
    id: "2",
    batchId: "BATCH-2024-002",
    startedAt: "2024-01-16T10:15:00Z",
    completedAt: "2024-01-16T10:17:45Z",
    totalRecords: 200,
    matchedCount: 178,
    varianceCount: 14,
    exceptionCount: 8,
    status: "completed",
  },
  {
    id: "3",
    batchId: "BATCH-2024-003",
    startedAt: "2024-01-17T08:00:00Z",
    completedAt: "2024-01-17T08:03:22Z",
    totalRecords: 95,
    matchedCount: 72,
    varianceCount: 11,
    exceptionCount: 12,
    status: "completed",
  },
  {
    id: "4",
    batchId: "BATCH-2024-004",
    startedAt: "2024-01-18T14:20:00Z",
    completedAt: null,
    totalRecords: 0,
    matchedCount: 0,
    varianceCount: 0,
    exceptionCount: 0,
    status: "running",
  },
];

export default function HistoryPage() {
  const [batches, setBatches] = useState<BatchRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt real API, fall back to mock
    const load = async () => {
      try {
        const res = await fetch("/api/reconciliation/history");
        if (res.ok) {
          const json = await res.json();
          setBatches(json.batches || MOCK_BATCHES);
        } else {
          setBatches(MOCK_BATCHES);
        }
      } catch {
        setBatches(MOCK_BATCHES);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const totalRecords = batches.reduce((s, b) => s + b.totalRecords, 0);
  const totalMatched = batches.reduce((s, b) => s + b.matchedCount, 0);
  const totalExceptions = batches.reduce((s, b) => s + b.exceptionCount, 0);
  const avgMatch = totalRecords > 0 ? ((totalMatched / totalRecords) * 100).toFixed(1) : "—";

  const summaryCards = [
    { label: "Total Batches Run", value: batches.length, icon: BarChart2, color: "text-slate-700" },
    { label: "Total Records Processed", value: totalRecords.toLocaleString(), icon: ArrowUpRight, color: "text-blue-700" },
    { label: "Avg Match Rate", value: `${avgMatch}%`, icon: CheckCircle2, color: "text-emerald-700" },
    { label: "Total Exceptions", value: totalExceptions, icon: XCircle, color: "text-red-700" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Batch History & Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Chronological log of all reconciliation engine runs with per-batch outcome metrics.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((c) => (
          <div key={c.label} className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{c.label}</span>
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </div>
            <p className={`text-2xl font-bold font-mono ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Batch Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Run Log</h2>
          <span className="ml-auto text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            {batches.length} batches
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading batch history…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-800">
              <thead className="bg-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3.5">Batch ID</th>
                  <th className="py-2.5 px-3.5">Started</th>
                  <th className="py-2.5 px-3.5">Duration</th>
                  <th className="py-2.5 px-3.5">Records</th>
                  <th className="py-2.5 px-3.5">
                    <span className="text-emerald-700">Matched</span>
                  </th>
                  <th className="py-2.5 px-3.5">
                    <span className="text-amber-700">Variance</span>
                  </th>
                  <th className="py-2.5 px-3.5">
                    <span className="text-red-700">Exceptions</span>
                  </th>
                  <th className="py-2.5 px-3.5">Match Rate</th>
                  <th className="py-2.5 px-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {batches.map((b) => {
                  const start = new Date(b.startedAt);
                  const end = b.completedAt ? new Date(b.completedAt) : null;
                  const durMs = end ? end.getTime() - start.getTime() : null;
                  const dur = durMs !== null ? `${(durMs / 1000).toFixed(0)}s` : "—";
                  const matchRate =
                    b.totalRecords > 0
                      ? ((b.matchedCount / b.totalRecords) * 100).toFixed(1)
                      : "—";

                  return (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">{b.batchId}</td>
                      <td className="py-2.5 px-3.5 font-mono text-slate-600">
                        {start.toLocaleDateString()} {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-slate-700">{dur}</td>
                      <td className="py-2.5 px-3.5 font-mono font-semibold">{b.totalRecords.toLocaleString()}</td>
                      <td className="py-2.5 px-3.5 font-mono text-emerald-700 font-semibold">{b.matchedCount}</td>
                      <td className="py-2.5 px-3.5 font-mono text-amber-700 font-semibold">{b.varianceCount}</td>
                      <td className="py-2.5 px-3.5 font-mono text-red-700 font-semibold">{b.exceptionCount}</td>
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${matchRate}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-700 font-semibold">{matchRate}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5">
                        <StatusPill status={b.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
