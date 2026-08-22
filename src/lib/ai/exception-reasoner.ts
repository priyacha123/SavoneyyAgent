import { GoogleGenAI } from "@google/genai";
import { MatchDecision } from "../reconciliation/matching-engine";

export class ExceptionReasoner {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== "") {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  /**
   * Generates a concise 1-2 sentence plain-English explanation for why a record failed perfect reconciliation.
   */
  public async explainException(decision: MatchDecision): Promise<string> {
    // If exact match with 0 variance, no exception reasoning needed
    if (decision.status === "matched") {
      return "Record successfully reconciled with 100% 3-way match across Gateway, Bank, and Ledger.";
    }

    // Try calling Gemini if API key is configured
    if (this.ai) {
      try {
        const response = await this.ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a Senior Financial Audit Agent specializing in payment gateway settlements and bank reconciliation.
Analyze the following financial record discrepancy and write a concise, precise 1-sentence plain-English explanation of why this record didn't achieve a clean 3-way match and what action finance ops should take.

Record ID: ${decision.recordId}
Decision Status: ${decision.status}
Rules Triggered: ${decision.rulesFired.join(", ")}
Rule Audit Notes: ${decision.unresolvedReasons?.join("; ") || "None"}
Candidate Records:
- Gateway Settlement: ${JSON.stringify(decision.candidateRecords.gateway)}
- Bank Statement: ${JSON.stringify(decision.candidateRecords.bank)}
- Internal Ledger: ${JSON.stringify(decision.candidateRecords.ledger)}

Format: Return ONLY the 1-sentence plain English explanation.`,
                },
              ],
            },
          ],
        });

        const text = response.text?.trim();
        if (text) {
          return text;
        }
      } catch (err) {
        console.warn("⚠️ Gemini API call failed or timed out, using deterministic fallback reasoner:", err);
      }
    }

    // Rule-based deterministic fallback when offline or API key absent
    return this.generateFallbackExplanation(decision);
  }

  /**
   * Deterministic explanation generator based on triggered rules.
   */
  private generateFallbackExplanation(decision: MatchDecision): string {
    const rules = decision.rulesFired;
    const { gateway, bank, ledger } = decision.candidateRecords;

    if (rules.includes("RULE_ORPHAN_LEDGER")) {
      return `Orphan internal order ${ledger?.orderId || decision.recordId}: Order recorded in ledger but no payment gateway transaction or bank credit advice was received.`;
    }

    if (rules.includes("RULE_MISSING_GATEWAY_UTR")) {
      return `Missing UTR reference: Gateway settled ${gateway?.txnId || "transaction"}, but failed to provide bank payout UTR number in settlement feed.`;
    }

    if (rules.includes("RULE_MISSING_BANK_CREDIT")) {
      return `Payout pending: Gateway issued UTR ${gateway?.utr}, but no matching deposit of ₹${gateway?.settledAmount} was detected in bank statement.`;
    }

    if (rules.includes("RULE_AMOUNT_VARIANCE_DETECTED")) {
      return `Amount discrepancy: Gateway settled net ₹${gateway?.settledAmount}, but bank credited ₹${bank?.creditedAmount} (variance of ₹${decision.varianceAmount || 0} — possible bank charge or fee mismatch).`;
    }

    if (rules.includes("RULE_TIMING_GAP_EXCEEDED")) {
      return `Settlement timing lag: Bank credit value date (${bank?.valueDate}) occurred ${decision.varianceAmount || "several"} days after gateway settlement date (${gateway?.settlementDate}).`;
    }

    return decision.unresolvedReasons?.join(". ") || "Unresolved reconciliation discrepancy detected across sources.";
  }
}
