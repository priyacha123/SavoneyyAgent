import { MatchDecision } from "./matching-engine";

export interface GroundTruthLabel {
  recordId: string;
  expectedStatus: "matched" | "matched_with_variance" | "exception";
  discrepancyType: "amount_mismatch" | "missing_utr" | "duplicate" | "timing_gap" | "unmatched" | null;
  notes?: string | null;
}

export interface MetricResults {
  totalRecords: number;
  matchedCount: number;
  varianceCount: number;
  exceptionCount: number;
  matchRate: number;         
  precision: number;         
  recall: number;            
  falsePositiveRate: number; 
  f1Score: number;           
  correctlyClassifiedCount: number;
  discrepancyMatrix: Record<string, { total: number; detected: number; recallPercentage: number }>;
}

export class Evaluator {

  public evaluate(decisions: MatchDecision[], groundTruthLabels: GroundTruthLabel[]): MetricResults {
    const gtMap = new Map<string, GroundTruthLabel>();
    groundTruthLabels.forEach((gt) => gtMap.set(gt.recordId, gt));

    let totalRecords = decisions.length;
    let matchedCount = 0;
    let varianceCount = 0;
    let exceptionCount = 0;

    let truePositives = 0;  
    let falsePositives = 0;
    let falseNegatives = 0; 
    let trueNegatives = 0;  

    let correctlyClassifiedCount = 0;

    const matrix: Record<string, { total: number; detected: number; recallPercentage: number }> = {
      amount_mismatch: { total: 0, detected: 0, recallPercentage: 0 },
      missing_utr: { total: 0, detected: 0, recallPercentage: 0 },
      duplicate: { total: 0, detected: 0, recallPercentage: 0 },
      timing_gap: { total: 0, detected: 0, recallPercentage: 0 },
      unmatched: { total: 0, detected: 0, recallPercentage: 0 },
    };

    for (const decision of decisions) {
      if (decision.status === "matched") matchedCount++;
      if (decision.status === "matched_with_variance") varianceCount++;
      if (decision.status === "exception") exceptionCount++;

      const gt = gtMap.get(decision.recordId);
      if (!gt) continue;

      const isAgentClean = decision.status === "matched";
      const isGroundTruthClean = gt.expectedStatus === "matched";

      // Overall accuracy check
      if (decision.status === gt.expectedStatus) {
        correctlyClassifiedCount++;
      }

      // Classification metrics for discrepancy detection
      if (!isGroundTruthClean && !isAgentClean) {
        truePositives++;
      } else if (isGroundTruthClean && !isAgentClean) {
        falsePositives++;
      } else if (!isGroundTruthClean && isAgentClean) {
        falseNegatives++;
      } else if (isGroundTruthClean && isAgentClean) {
        trueNegatives++;
      }

      // Track discrepancy breakdown
      if (gt.discrepancyType && matrix[gt.discrepancyType]) {
        matrix[gt.discrepancyType].total++;
        if (!isAgentClean) {
          matrix[gt.discrepancyType].detected++;
        }
      }
    }

    // Compute metrics percentages
    const precision = truePositives + falsePositives > 0 ? (truePositives / (truePositives + falsePositives)) * 100 : 100;
    const recall = truePositives + falseNegatives > 0 ? (truePositives / (truePositives + falseNegatives)) * 100 : 100;
    const falsePositiveRate = falsePositives + trueNegatives > 0 ? (falsePositives / (falsePositives + trueNegatives)) * 100 : 0;
    const matchRate = totalRecords > 0 ? (correctlyClassifiedCount / totalRecords) * 100 : 0;
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    // Calculate matrix recall percentages
    Object.keys(matrix).forEach((key) => {
      const item = matrix[key];
      item.recallPercentage = item.total > 0 ? (item.detected / item.total) * 100 : 100;
    });

    return {
      totalRecords,
      matchedCount,
      varianceCount,
      exceptionCount,
      matchRate: Math.round(matchRate * 10) / 10,
      precision: Math.round(precision * 10) / 10,
      recall: Math.round(recall * 10) / 10,
      falsePositiveRate: Math.round(falsePositiveRate * 10) / 10,
      f1Score: Math.round(f1Score * 10) / 10,
      correctlyClassifiedCount,
      discrepancyMatrix: matrix,
    };
  }
}
