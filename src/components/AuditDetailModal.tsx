import React from "react";
import { X, Sparkles, CheckCircle2, AlertTriangle, XCircle, FileText, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AuditDetailModalProps {
  log: any | null;
  onClose: () => void;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  const candidate = log.candidateRecords || {};
  const { gateway, bank, ledger } = candidate;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return (
          <span className="badge-matched px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Clean Match
          </span>
        );
      case "matched_with_variance":
        return (
          <span className="badge-variance px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" /> Matched with Variance
          </span>
        );
      case "exception":
      default:
        return (
          <span className="badge-exception px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5" /> Exception Unresolved
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">Record Audit Trace: {log.recordId}</h2>
              {getStatusBadge(log.status)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Confidence Score: {(log.confidenceScore * 100).toFixed(0)}% • Batch ID: {log.batchId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Gemini AI Reasoning Banner */}
          {log.geminiReasoning && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30">
              <div className="flex items-center gap-2 mb-1 text-indigo-400 font-semibold text-xs">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>Gemini AI Exception Diagnosis</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">{log.geminiReasoning}</p>
            </div>
          )}

          {/* 3-Way Source Comparison Grid */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              3-Way Disjointed Source Comparison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Source 1: Gateway */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-400">1. Payment Gateway</span>
                  <span className="text-[10px] text-slate-400">Settlement Report</span>
                </div>
                {gateway ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Txn ID:</span>
                      <span className="font-mono text-slate-200">{gateway.txnId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Order ID:</span>
                      <span className="font-mono text-slate-200">{gateway.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gross Amount:</span>
                      <span className="font-semibold text-slate-200">{formatCurrency(gateway.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fee Deducted:</span>
                      <span className="text-red-400">{formatCurrency(gateway.fee)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5 font-semibold">
                      <span className="text-slate-300">Net Settled:</span>
                      <span className="text-emerald-400">{formatCurrency(gateway.settledAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payout UTR:</span>
                      <span className={`font-mono ${gateway.utr ? "text-slate-200" : "text-red-400 font-bold"}`}>
                        {gateway.utr || "MISSING"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date:</span>
                      <span className="text-slate-200">{gateway.settlementDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-400 py-6 text-center italic">No Gateway Record Found</div>
                )}
              </div>

              {/* Source 2: Bank Statement */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400">2. Bank Statement</span>
                  <span className="text-[10px] text-slate-400">Credit Advice</span>
                </div>
                {bank ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">UTR:</span>
                      <span className="font-mono text-slate-200">{bank.utr || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Credited Amount:</span>
                      <span className="font-semibold text-emerald-400">{formatCurrency(bank.creditedAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Value Date:</span>
                      <span className="text-slate-200">{bank.valueDate}</span>
                    </div>
                    <div className="border-t border-slate-800 pt-1.5">
                      <span className="text-[10px] text-slate-400 block mb-1">Bank Description:</span>
                      <p className="text-[11px] text-slate-300 font-mono truncate">{bank.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-400 py-6 text-center italic">No Bank Credit Entry Found</div>
                )}
              </div>

              {/* Source 3: Internal Ledger */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-400">3. Internal Ledger</span>
                  <span className="text-[10px] text-slate-400">Merchant ERP</span>
                </div>
                {ledger ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Order ID:</span>
                      <span className="font-mono text-slate-200">{ledger.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expected Amount:</span>
                      <span className="font-semibold text-slate-200">{formatCurrency(ledger.expectedAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Associated Txn:</span>
                      <span className="font-mono text-slate-200">{ledger.txnId || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Order Status:</span>
                      <span className="text-slate-200">{ledger.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Order Date:</span>
                      <span className="text-slate-200">{ledger.orderDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-400 py-6 text-center italic">No Internal Ledger Entry Found</div>
                )}
              </div>
            </div>
          </div>

          {/* Deterministic Rules Audit Trail & Ground Truth comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rules Fired */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-blue-400" />
                Deterministic Rules Fired
              </h4>
              <ul className="space-y-1.5">
                {log.rulesFired.map((rule: string, idx: number) => (
                  <li key={idx} className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ground Truth Validation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">Ground Truth Verification</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Agent Decision:</span>
                  <span className="font-semibold text-white">{log.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Ground Truth:</span>
                  <span className="font-semibold text-indigo-400">{log.groundTruthStatus || "N/A"}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Result Accuracy:</span>
                  <span className={`font-semibold ${log.isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                    {log.isCorrect ? "✅ Match (Correct)" : "❌ Misclassified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Audit Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
