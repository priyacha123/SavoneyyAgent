"use client";

import React, { useState } from "react";
import {
  Database,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Plus,
  ExternalLink,
  Wifi,
  WifiOff,
  Clock,
  FileSpreadsheet,
  Building2,
  Landmark,
} from "lucide-react";

interface DataSource {
  id: string;
  name: string;
  type: "gateway" | "bank" | "erp";
  status: "connected" | "disconnected" | "syncing";
  lastSync: string;
  recordCount: number;
  description: string;
  icon: React.ElementType;
}

const SOURCES: DataSource[] = [
  {
    id: "rzp-gateway",
    name: "Razorpay Settlement Reports",
    type: "gateway",
    status: "connected",
    lastSync: "2 minutes ago",
    recordCount: 8_420,
    description: "Live settlement payout reports from the Razorpay Payment Gateway API. Auto-pulled every 15 min.",
    icon: FileSpreadsheet,
  },
  {
    id: "hdfc-bank",
    name: "HDFC Bank — Credit Advice Feed",
    type: "bank",
    status: "connected",
    lastSync: "18 minutes ago",
    recordCount: 7_891,
    description: "Automated Bank Statement / Credit Advice XML feed via SFTP. Covers HDFC Nodal Account.",
    icon: Landmark,
  },
  {
    id: "erp-ledger",
    name: "ERP General Ledger (SAP B1)",
    type: "erp",
    status: "syncing",
    lastSync: "Syncing…",
    recordCount: 8_011,
    description: "SAP Business One GL export pushed via secure REST webhook on each posting batch.",
    icon: Building2,
  },
  {
    id: "kotak-bank",
    name: "Kotak Mahindra — Bank Credit Feed",
    type: "bank",
    status: "disconnected",
    lastSync: "3 days ago",
    recordCount: 0,
    description: "Secondary bank account credit advice feed. Currently disconnected — re-authorize credentials.",
    icon: Landmark,
  },
];

const typeLabels: Record<string, string> = {
  gateway: "Payment Gateway",
  bank: "Bank Feed",
  erp: "ERP Ledger",
};

const typeColors: Record<string, string> = {
  gateway: "text-blue-700 bg-blue-50 border-blue-200",
  bank: "text-purple-700 bg-purple-50 border-purple-200",
  erp: "text-amber-700 bg-amber-50 border-amber-200",
};

function StatusBadge({ status }: { status: DataSource["status"] }) {
  if (status === "connected")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
        <Wifi className="h-3 w-3" /> Connected
      </span>
    );
  if (status === "syncing")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
        <RefreshCw className="h-3 w-3 animate-spin" /> Syncing
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
      <WifiOff className="h-3 w-3" /> Disconnected
    </span>
  );
}

export default function SourcesPage() {
  const [sources] = useState<DataSource[]>(SOURCES);

  const connected = sources.filter((s) => s.status === "connected").length;
  const syncing = sources.filter((s) => s.status === "syncing").length;
  const disconnected = sources.filter((s) => s.status === "disconnected").length;
  const totalRecords = sources.reduce((sum, s) => sum + s.recordCount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Connected Data Feeds</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage data ingestion pipelines: Gateway Settlements, Bank Credit Advices, and ERP Ledgers.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors border border-blue-800 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" />
          Add Data Source
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Connected", value: connected, color: "text-emerald-700", icon: CheckCircle2 },
          { label: "Syncing", value: syncing, color: "text-blue-700", icon: RefreshCw },
          { label: "Disconnected", value: disconnected, color: "text-red-700", icon: XCircle },
          { label: "Total Records", value: totalRecords.toLocaleString(), color: "text-slate-800", icon: Database },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</span>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <p className={`text-2xl font-bold font-mono ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sources.map((source) => {
          const Icon = source.icon;
          return (
            <div
              key={source.id}
              className={`bg-white border rounded-lg p-4 shadow-2xs flex flex-col gap-3 ${
                source.status === "disconnected" ? "border-red-200" : "border-slate-200"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-md border flex items-center justify-center ${typeColors[source.type]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{source.name}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${typeColors[source.type]}`}>
                      {typeLabels[source.type]}
                    </span>
                  </div>
                </div>
                <StatusBadge status={source.status} />
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-600 leading-relaxed">{source.description}</p>

              {/* Metadata Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock className="h-3 w-3" />
                  Last sync: <span className="font-mono font-semibold text-slate-700">{source.lastSync}</span>
                </div>
                <div className="text-[10px] font-mono font-semibold text-slate-700">
                  {source.recordCount.toLocaleString()} records
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors">
                  <RefreshCw className="h-3 w-3" /> Force Sync
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors">
                  <ExternalLink className="h-3 w-3" /> Configure
                </button>
                {source.status === "disconnected" && (
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 border border-red-800 rounded transition-colors">
                    Re-authorize
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
