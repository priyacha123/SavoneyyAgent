import { prisma } from "../prisma";
import { MatchingEngine, CandidateSourceGroup, MatchDecision } from "./matching-engine";
import { ExceptionReasoner } from "../ai/exception-reasoner";
import { Evaluator, GroundTruthLabel } from "./evaluator";

export async function runReconciliationBatch(batchId?: string) {
  const currentBatchId = batchId || `BATCH-${Date.now()}`;

  // 1. Fetch source records
  const gatewayRecords = await prisma.gatewaySettlement.findMany({});
  const bankRecords = await prisma.bankStatement.findMany({});
  const ledgerRecords = await prisma.ledgerEntry.findMany({});
  const groundTruthRecords = await prisma.groundTruthLabel.findMany({});

  // Maps for source record grouping
  const candidatesMap = new Map<string, CandidateSourceGroup>();

  // Helper to ensure group exists
  const getOrCreateGroup = (recordId: string): CandidateSourceGroup => {
    if (!candidatesMap.has(recordId)) {
      candidatesMap.set(recordId, {
        recordId,
        gateway: null,
        bank: null,
        ledger: null,
      });
    }
    return candidatesMap.get(recordId)!;
  };

  // Group Gateway records
  for (const g of gatewayRecords) {
    const group = getOrCreateGroup(g.recordId);
    group.gateway = {
      txnId: g.txnId,
      orderId: g.orderId,
      amount: g.amount,
      fee: g.fee,
      settledAmount: g.settledAmount,
      utr: g.utr,
      settlementDate: g.settlementDate,
    };
  }

  // Group Bank Statement records
  for (const b of bankRecords) {
    if (b.recordId) {
      const group = getOrCreateGroup(b.recordId.replace("-DUP", ""));
      group.bank = {
        utr: b.utr,
        creditedAmount: b.creditedAmount,
        valueDate: b.valueDate,
        description: b.description,
      };
    }
  }

  // Group Ledger records
  for (const l of ledgerRecords) {
    const group = getOrCreateGroup(l.recordId);
    group.ledger = {
      orderId: l.orderId,
      txnId: l.txnId,
      expectedAmount: l.expectedAmount,
      orderDate: l.orderDate,
      status: l.status,
    };
  }

  // 2. Instantiate Matching Engine & Reasoner
  const engine = new MatchingEngine();
  const reasoner = new ExceptionReasoner();
  const evaluator = new Evaluator();

  const decisions: MatchDecision[] = [];

  // Clear previous logs for fresh batch evaluation if batchId provided
  await prisma.reconciliationLog.deleteMany({});
  await prisma.reconciliationMetrics.deleteMany({});

  // 3. Process candidate groups
  for (const [recordId, group] of candidatesMap.entries()) {
    const decision = engine.evaluateRecordGroup(group);

    // AI Exception reasoning for non-clean matches
    let reasoning = "";
    if (decision.status !== "matched") {
      reasoning = await reasoner.explainException(decision);
    } else {
      reasoning = "Clean 3-way match across Gateway, Bank, and Ledger.";
    }

    // Match ground truth label
    const gt = groundTruthRecords.find((g) => g.recordId === recordId);
    const isCorrect = gt ? gt.expectedStatus === decision.status : null;

    decisions.push(decision);

    // Write audit log entry to database
    await prisma.reconciliationLog.create({
      data: {
        batchId: currentBatchId,
        recordId,
        txnId: group.gateway?.txnId || group.ledger?.txnId || null,
        orderId: group.gateway?.orderId || group.ledger?.orderId || null,
        utr: group.gateway?.utr || group.bank?.utr || null,
        status: decision.status,
        confidenceScore: decision.confidenceScore,
        rulesFired: JSON.stringify(decision.rulesFired),
        candidateRecords: JSON.stringify(group),
        geminiReasoning: reasoning,
        groundTruthStatus: gt?.expectedStatus || null,
        isCorrect,
      },
    });
  }

  // 4. Compute metrics against ground truth
  const formattedGtLabels: GroundTruthLabel[] = groundTruthRecords.map((gt) => ({
    recordId: gt.recordId,
    expectedStatus: gt.expectedStatus as any,
    discrepancyType: gt.discrepancyType as any,
    notes: gt.notes,
  }));

  const metrics = evaluator.evaluate(decisions, formattedGtLabels);

  // Save metrics summary to database
  const savedMetrics = await prisma.reconciliationMetrics.create({
    data: {
      batchId: currentBatchId,
      totalRecords: metrics.totalRecords,
      matchedCount: metrics.matchedCount,
      varianceCount: metrics.varianceCount,
      exceptionCount: metrics.exceptionCount,
      matchRate: metrics.matchRate,
      precision: metrics.precision,
      recall: metrics.recall,
      falsePositiveRate: metrics.falsePositiveRate,
      f1Score: metrics.f1Score,
      discrepancyMatrix: JSON.stringify(metrics.discrepancyMatrix),
    },
  });

  return {
    batchId: currentBatchId,
    metrics: savedMetrics,
    logsCount: decisions.length,
  };
}
