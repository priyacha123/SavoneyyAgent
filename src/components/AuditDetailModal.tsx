import React from "react";
import { X, Sparkles, CheckCircle2, AlertTriangle, XCircle, FileText, Check, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AuditDetailModalProps } from "@/lib/types";

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  const candidate = log.candidateRecords || {};
  const { gateway, bank, ledger } = candidate;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return (
          <span className="badge-matched px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Clean Match
          </span>
        );
      case "matched_with_variance":
        return (
          <span className="badge-variance px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> Matched with Variance
          </span>
        );
      case "exception":
      default:
        return (
          <span className="badge-exception px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5" /> Exception Unresolved
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-none flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900 font-sans">
                Audit Record Worksheet: <span className="font-mono text-blue-700">{log.recordId}</span>
              </h2>
              {getStatusBadge(log.status)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Confidence: {(log.confidenceScore * 100).toFixed(0)}% • Batch ID: {log.batchId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {log.geminiReasoning && (
            <div className="p-3.5 rounded-lg bg-blue-50/80 border border-blue-200">
              <div className="flex items-center gap-1.5 mb-1 text-blue-900 font-bold text-xs">
                <Sparkles className="h-4 w-4 text-blue-700" />
                <span>Gemini AI Root-Cause Audit Diagnosis</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">{log.geminiReasoning}</p>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              3-Way Source Record Comparison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Source 1: Gateway */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2.5 border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-blue-800">1. Payment Gateway</span>
                  <span className="text-[10px] text-slate-500 font-medium">Settlement Report</span>
                </div>
                {gateway ? (
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Txn ID:</span>
                      <span className="font-semibold text-slate-900">{gateway.txnId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Order ID:</span>
                      <span className="text-slate-800">{gateway.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Gross Amount:</span>
                      <span className="text-slate-900">{formatCurrency(gateway.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Fee Deducted:</span>
                      <span className="text-red-700">{formatCurrency(gateway.fee)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                      <span className="text-slate-700 font-sans">Net Settled:</span>
                      <span className="text-emerald-700">{formatCurrency(gateway.settledAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Payout UTR:</span>
                      <span className={gateway.utr ? "text-slate-900" : "text-red-700 font-bold"}>
                        {gateway.utr || "MISSING"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Date:</span>
                      <span className="text-slate-800">{gateway.settlementDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-600 py-6 text-center italic font-sans">No Gateway Settlement Record</div>
                )}
              </div>

              {/* Source 2: Bank Statement */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2.5 border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-emerald-800">2. Bank Statement</span>
                  <span className="text-[10px] text-slate-500 font-medium">Credit Advice</span>
                </div>
                {bank ? (
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">UTR Ref:</span>
                      <span className="font-semibold text-slate-900">{bank.utr || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Credited:</span>
                      <span className="font-bold text-emerald-700">{formatCurrency(bank.creditedAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Value Date:</span>
                      <span className="text-slate-800">{bank.valueDate}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-1 mt-1">
                      <span className="text-[10px] text-slate-500 font-sans block mb-0.5">Narration:</span>
                      <p className="text-[11px] text-slate-700 truncate">{bank.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-600 py-6 text-center italic font-sans">No Bank Deposit Advice Found</div>
                )}
              </div>

              {/* Source 3: Internal Ledger */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2.5 border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-purple-800">3. Internal Ledger</span>
                  <span className="text-[10px] text-slate-500 font-medium">Merchant ERP</span>
                </div>
                {ledger ? (
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Order ID:</span>
                      <span className="font-semibold text-slate-900">{ledger.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Expected:</span>
                      <span className="text-slate-900">{formatCurrency(ledger.expectedAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Linked Txn:</span>
                      <span className="text-slate-800">{ledger.txnId || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">ERP Status:</span>
                      <span className="text-slate-800">{ledger.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Order Date:</span>
                      <span className="text-slate-800">{ledger.orderDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-600 py-6 text-center italic font-sans">No ERP Order Entry Found</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-white border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5 font-sans">
                <FileText className="h-3.5 w-3.5 text-slate-700" />
                Matching Rules Fired
              </h4>
              <ul className="space-y-1">
                {log.rulesFired.map((rule: string, idx: number) => (
                  <li key={idx} className="text-[11px] font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-slate-200 font-sans">
              <h4 className="text-xs font-bold text-slate-800 mb-2">Ground Truth Scoring Audit</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Agent Classification:</span>
                  <span className="font-semibold text-slate-900">{log.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ground Truth Expected:</span>
                  <span className="font-semibold text-blue-700">{log.groundTruthStatus || "N/A"}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 mt-1">
                  <span className="text-slate-600">Model Accuracy:</span>
                  <span className={`font-bold ${log.isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                    {log.isCorrect ? "✅ Match (Accurate)" : "❌ Misclassified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors shadow-2xs"
          >
            Close Worksheet
          </button>
        </div>
      </div>
    </div>
  );
};
