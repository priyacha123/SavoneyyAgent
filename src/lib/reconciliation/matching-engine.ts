export interface CandidateSourceGroup {
  recordId: string;
  gateway: {
    txnId: string;
    orderId: string;
    amount: number;
    fee: number;
    settledAmount: number;
    utr: string | null;
    settlementDate: string;
  } | null;
  bank: {
    utr: string | null;
    creditedAmount: number;
    valueDate: string;
    description: string;
  } | null;
  ledger: {
    orderId: string;
    txnId: string | null;
    expectedAmount: number;
    orderDate: string;
    status: string;
  } | null;
}

export interface MatchDecision {
  recordId: string;
  status: "matched" | "matched_with_variance" | "exception";
  confidenceScore: number; 
  rulesFired: string[];
  candidateRecords: CandidateSourceGroup;
  varianceAmount?: number;
  unresolvedReasons?: string[];
}

export class MatchingEngine {
  public evaluateRecordGroup(candidate: CandidateSourceGroup): MatchDecision {
    const rulesFired: string[] = [];
    const unresolvedReasons: string[] = [];

    const { gateway, bank, ledger, recordId } = candidate;

    // Rule check 1: Orphan ledger check (Unmatched)
    if (!gateway && !bank && ledger) {
      rulesFired.push("RULE_ORPHAN_LEDGER");
      unresolvedReasons.push("Internal ledger entry has no corresponding Gateway transaction or Bank settlement credit.");
      return {
        recordId,
        status: "exception",
        confidenceScore: 0.1,
        rulesFired,
        candidateRecords: candidate,
        unresolvedReasons,
      };
    }

    // Rule check 2: Missing Gateway record
    if (!gateway) {
      rulesFired.push("RULE_MISSING_GATEWAY");
      unresolvedReasons.push("Gateway settlement record missing for this order.");
      return {
        recordId,
        status: "exception",
        confidenceScore: 0.2,
        rulesFired,
        candidateRecords: candidate,
        unresolvedReasons,
      };
    }

    // Rule check 3: Missing UTR in Gateway settlement
    if (!gateway.utr) {
      rulesFired.push("RULE_MISSING_GATEWAY_UTR");
      unresolvedReasons.push("Payment Gateway settlement report is missing the payout UTR reference number.");
      return {
        recordId,
        status: "exception",
        confidenceScore: 0.3,
        rulesFired,
        candidateRecords: candidate,
        unresolvedReasons,
      };
    }

    // Rule check 4: Missing Bank credit entry
    if (!bank) {
      rulesFired.push("RULE_MISSING_BANK_CREDIT");
      unresolvedReasons.push(`No bank statement deposit found matching UTR ${gateway.utr}. Payout may still be in transit or failed.`);
      return {
        recordId,
        status: "exception",
        confidenceScore: 0.35,
        rulesFired,
        candidateRecords: candidate,
        unresolvedReasons,
      };
    }

    // Rule check 5: UTR match verification
    if (bank.utr && gateway.utr && bank.utr === gateway.utr) {
      rulesFired.push("RULE_EXACT_UTR_MATCH");
    } else if (bank.utr !== gateway.utr) {
      rulesFired.push("RULE_UTR_MISMATCH");
      unresolvedReasons.push(`UTR mismatch: Gateway recorded '${gateway.utr}' vs Bank statement '${bank.utr}'.`);
    }

    // Rule check 6: Order ID & Transaction ID correlation
    if (ledger && ledger.orderId === gateway.orderId) {
      rulesFired.push("RULE_EXACT_ORDER_MATCH");
    }

    // Pass 1: Check Exact Financial Agreement (Gateway Settled == Bank Credited)
    const amountDiff = Math.abs(gateway.settledAmount - bank.creditedAmount);
    const dateGapDays = Math.abs(
      (new Date(bank.valueDate).getTime() - new Date(gateway.settlementDate).getTime()) / (1000 * 3600 * 24)
    );

    let isAmountExact = amountDiff < 0.01;
    let isDateWithinWindow = dateGapDays <= 3.0; // Standard 3-day banking window

    if (isAmountExact && isDateWithinWindow && rulesFired.includes("RULE_EXACT_UTR_MATCH")) {
      rulesFired.push("RULE_PERFECT_3WAY_MATCH");
      return {
        recordId,
        status: "matched",
        confidenceScore: 1.0,
        rulesFired,
        candidateRecords: candidate,
        varianceAmount: 0,
      };
    }

    // Pass 2: Variance & Tolerance Classification
    // Case 2A: Amount Variance
    if (!isAmountExact && isDateWithinWindow) {
      rulesFired.push("RULE_AMOUNT_VARIANCE_DETECTED");
      const variance = Math.round(amountDiff * 100) / 100;
      unresolvedReasons.push(
        `Amount variance of ₹${variance}: Gateway settled ₹${gateway.settledAmount}, but Bank credited ₹${bank.creditedAmount}.`
      );
      return {
        recordId,
        status: "matched_with_variance",
        confidenceScore: 0.85,
        rulesFired,
        candidateRecords: candidate,
        varianceAmount: variance,
        unresolvedReasons,
      };
    }

    // Case 2B: Timing Gap Variance
    if (isAmountExact && !isDateWithinWindow) {
      rulesFired.push("RULE_TIMING_GAP_EXCEEDED");
      unresolvedReasons.push(
        `Settlement date gap of ${Math.round(dateGapDays)} days exceeds the standard 3-day SLA (Gateway: ${
          gateway.settlementDate
        }, Bank: ${bank.valueDate}).`
      );
      return {
        recordId,
        status: "matched_with_variance",
        confidenceScore: 0.8,
        rulesFired,
        candidateRecords: candidate,
        varianceAmount: Math.round(dateGapDays),
        unresolvedReasons,
      };
    }

    // Case 2C: Combined Variance or Severe Discrepancy -> Exception
    rulesFired.push("RULE_MULTIPLE_VARIANCES_EXCEPTION");
    if (!isAmountExact) unresolvedReasons.push(`Amount difference of ₹${Math.round(amountDiff * 100) / 100}.`);
    if (!isDateWithinWindow) unresolvedReasons.push(`Timing lag of ${Math.round(dateGapDays)} days.`);

    return {
      recordId,
      status: "exception",
      confidenceScore: 0.4,
      rulesFired,
      candidateRecords: candidate,
      varianceAmount: Math.round(amountDiff * 100) / 100,
      unresolvedReasons,
    };
  }
}
