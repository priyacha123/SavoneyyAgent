export interface SyntheticDataset {
  gatewayRecords: {
    recordId: string;
    txnId: string;
    orderId: string;
    amount: number;
    fee: number;
    settledAmount: number;
    utr: string | null;
    settlementDate: string;
  }[];
  bankRecords: {
    recordId: string | null;
    utr: string | null;
    creditedAmount: number;
    valueDate: string;
    description: string;
  }[];
  ledgerRecords: {
    recordId: string;
    orderId: string;
    txnId: string | null;
    expectedAmount: number;
    orderDate: string;
    status: string;
  }[];
  groundTruth: {
    recordId: string;
    txnId: string | null;
    orderId: string | null;
    utr: string | null;
    expectedStatus: "matched" | "matched_with_variance" | "exception";
    discrepancyType: "amount_mismatch" | "missing_utr" | "duplicate" | "timing_gap" | "unmatched" | null;
    varianceAmount: number | null;
    notes: string;
  }[];
}

export function generateSyntheticDataset(totalRecords: number = 60): SyntheticDataset {
  const dataset: SyntheticDataset = {
    gatewayRecords: [],
    bankRecords: [],
    ledgerRecords: [],
    groundTruth: [],
  };

  const baseDate = new Date("2026-08-01");

  // Determine count distribution
  const cleanCount = Math.floor(totalRecords * 0.7); 
  const discrepancyCount = totalRecords - cleanCount; 
  const discrepancyTypes: Array<"amount_mismatch" | "missing_utr" | "duplicate" | "timing_gap" | "unmatched"> = [
    "amount_mismatch",
    "missing_utr",
    "duplicate",
    "timing_gap",
    "unmatched",
  ];

  let recCounter = 1;

  // 1. Generate Clean Records (70%)
  for (let i = 0; i < cleanCount; i++) {
    const recordId = `REC-${String(recCounter).padStart(3, "0")}`;
    const txnId = `pay_rzp_${100000 + recCounter}`;
    const orderId = `ord_mct_${500000 + recCounter}`;
    const utr = `CITIN26${8000000 + recCounter}`;

    const grossAmount = Math.floor(Math.random() * 9000) + 1000; // ₹1,000 - ₹10,000
    const fee = Math.round(grossAmount * 0.02 * 100) / 100; // 2% gateway fee
    const settledAmount = Math.round((grossAmount - fee) * 100) / 100;

    const txnDate = new Date(baseDate.getTime() + recCounter * 3600 * 1000 * 4);
    const dateStr = txnDate.toISOString().split("T")[0];

    dataset.gatewayRecords.push({
      recordId,
      txnId,
      orderId,
      amount: grossAmount,
      fee,
      settledAmount,
      utr,
      settlementDate: dateStr,
    });

    dataset.bankRecords.push({
      recordId,
      utr,
      creditedAmount: settledAmount,
      valueDate: dateStr,
      description: `CMS/RAZORPAY/${utr}/${settledAmount}`,
    });

    dataset.ledgerRecords.push({
      recordId,
      orderId,
      txnId,
      expectedAmount: grossAmount,
      orderDate: dateStr,
      status: "PAID",
    });

    dataset.groundTruth.push({
      recordId,
      txnId,
      orderId,
      utr,
      expectedStatus: "matched",
      discrepancyType: null,
      varianceAmount: 0,
      notes: "Perfect 3-way match across Gateway, Bank, and Internal Ledger.",
    });

    recCounter++;
  }

  // 2. Generate Controlled Discrepancy Records (30%)
  for (let i = 0; i < discrepancyCount; i++) {
    const recordId = `REC-${String(recCounter).padStart(3, "0")}`;
    const discType = discrepancyTypes[i % discrepancyTypes.length];

    const txnId = `pay_rzp_${100000 + recCounter}`;
    const orderId = `ord_mct_${500000 + recCounter}`;
    const utr = `CITIN26${8000000 + recCounter}`;

    const grossAmount = Math.floor(Math.random() * 9000) + 1000;
    const fee = Math.round(grossAmount * 0.02 * 100) / 100;
    const settledAmount = Math.round((grossAmount - fee) * 100) / 100;

    const txnDate = new Date(baseDate.getTime() + recCounter * 3600 * 1000 * 4);
    const dateStr = txnDate.toISOString().split("T")[0];

    switch (discType) {
      case "amount_mismatch": {
        // Bank credited amount differs from gateway settled amount by ₹50-₹200 (extra bank charge / fee error)
        const variance = Math.floor(Math.random() * 150) + 50;
        const bankCredited = Math.round((settledAmount - variance) * 100) / 100;

        dataset.gatewayRecords.push({
          recordId,
          txnId,
          orderId,
          amount: grossAmount,
          fee,
          settledAmount,
          utr,
          settlementDate: dateStr,
        });

        dataset.bankRecords.push({
          recordId,
          utr,
          creditedAmount: bankCredited,
          valueDate: dateStr,
          description: `CMS/RAZORPAY/${utr}/${bankCredited}`,
        });

        dataset.ledgerRecords.push({
          recordId,
          orderId,
          txnId,
          expectedAmount: grossAmount,
          orderDate: dateStr,
          status: "PAID",
        });

        dataset.groundTruth.push({
          recordId,
          txnId,
          orderId,
          utr,
          expectedStatus: "matched_with_variance",
          discrepancyType: "amount_mismatch",
          varianceAmount: variance,
          notes: `Amount variance of ₹${variance}: Gateway settled ₹${settledAmount}, but Bank credited ₹${bankCredited}.`,
        });
        break;
      }

      case "missing_utr": {
        // Gateway record lacks UTR payout reference
        dataset.gatewayRecords.push({
          recordId,
          txnId,
          orderId,
          amount: grossAmount,
          fee,
          settledAmount,
          utr: null,
          settlementDate: dateStr,
        });

        dataset.bankRecords.push({
          recordId,
          utr: null,
          creditedAmount: settledAmount,
          valueDate: dateStr,
          description: `RAZORPAY PAYOUT PENDING REF ${txnId}`,
        });

        dataset.ledgerRecords.push({
          recordId,
          orderId,
          txnId,
          expectedAmount: grossAmount,
          orderDate: dateStr,
          status: "PROCESSING",
        });

        dataset.groundTruth.push({
          recordId,
          txnId,
          orderId,
          utr: null,
          expectedStatus: "exception",
          discrepancyType: "missing_utr",
          varianceAmount: null,
          notes: "Missing UTR reference in Gateway settlement payout report.",
        });
        break;
      }

      case "duplicate": {
        // Bank statement contains duplicate credit entry for same UTR
        dataset.gatewayRecords.push({
          recordId,
          txnId,
          orderId,
          amount: grossAmount,
          fee,
          settledAmount,
          utr,
          settlementDate: dateStr,
        });

        // First bank credit
        dataset.bankRecords.push({
          recordId,
          utr,
          creditedAmount: settledAmount,
          valueDate: dateStr,
          description: `CMS/RAZORPAY/${utr}/${settledAmount}`,
        });

        // Duplicate bank credit
        dataset.bankRecords.push({
          recordId: `${recordId}-DUP`,
          utr,
          creditedAmount: settledAmount,
          valueDate: dateStr,
          description: `DUP/CMS/RAZORPAY/${utr}/${settledAmount}`,
        });

        dataset.ledgerRecords.push({
          recordId,
          orderId,
          txnId,
          expectedAmount: grossAmount,
          orderDate: dateStr,
          status: "PAID",
        });

        dataset.groundTruth.push({
          recordId,
          txnId,
          orderId,
          utr,
          expectedStatus: "exception",
          discrepancyType: "duplicate",
          varianceAmount: null,
          notes: `Duplicate bank credit advice detected for UTR ${utr}.`,
        });
        break;
      }

      case "timing_gap": {
        const delayedDate = new Date(txnDate.getTime() + 10 * 86400 * 1000).toISOString().split("T")[0];

        dataset.gatewayRecords.push({
          recordId,
          txnId,
          orderId,
          amount: grossAmount,
          fee,
          settledAmount,
          utr,
          settlementDate: dateStr,
        });

        dataset.bankRecords.push({
          recordId,
          utr,
          creditedAmount: settledAmount,
          valueDate: delayedDate,
          description: `CMS/RAZORPAY/${utr}/${settledAmount}`,
        });

        dataset.ledgerRecords.push({
          recordId,
          orderId,
          txnId,
          expectedAmount: grossAmount,
          orderDate: dateStr,
          status: "PAID",
        });

        dataset.groundTruth.push({
          recordId,
          txnId,
          orderId,
          utr,
          expectedStatus: "matched_with_variance",
          discrepancyType: "timing_gap",
          varianceAmount: 10, 
          notes: `Settlement timing gap of 10 days between Gateway (${dateStr}) and Bank credit (${delayedDate}).`,
        });
        break;
      }

      case "unmatched": {
        // Ledger record exists, but transaction failed or missing in Gateway & Bank
        dataset.ledgerRecords.push({
          recordId,
          orderId,
          txnId: null, 
          expectedAmount: grossAmount,
          orderDate: dateStr,
          status: "PENDING_PAYMENT",
        });

        dataset.groundTruth.push({
          recordId,
          txnId: null,
          orderId,
          utr: null,
          expectedStatus: "exception",
          discrepancyType: "unmatched",
          varianceAmount: null,
          notes: "Orphan internal ledger entry with no matching Gateway settlement or Bank credit.",
        });
        break;
      }
    }

    recCounter++;
  }

  return dataset;
}
