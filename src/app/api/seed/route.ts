import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSyntheticDataset } from "@/lib/data-generator";

export async function POST() {
  try {
    await prisma.reconciliationLog.deleteMany({});
    await prisma.reconciliationMetrics.deleteMany({});
    await prisma.gatewaySettlement.deleteMany({});
    await prisma.bankStatement.deleteMany({});
    await prisma.ledgerEntry.deleteMany({});
    await prisma.groundTruthLabel.deleteMany({});

    const dataset = generateSyntheticDataset(60);

    for (const g of dataset.gatewayRecords) await prisma.gatewaySettlement.create({ data: g });
    for (const b of dataset.bankRecords) await prisma.bankStatement.create({ data: b });
    for (const l of dataset.ledgerRecords) await prisma.ledgerEntry.create({ data: l });
    for (const gt of dataset.groundTruth) await prisma.groundTruthLabel.create({ data: gt });

    return NextResponse.json({
      success: true,
      message: "Seeded 60 fresh synthetic records across Gateway, Bank, Ledger, and Ground Truth.",
      count: 60,
    });
  } catch (error: any) {
    console.error("Error seeding dataset:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
