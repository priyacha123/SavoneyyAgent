import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const metrics = await prisma.reconciliationMetrics.findFirst({
      orderBy: { runTimestamp: "desc" },
    });

    const logs = await prisma.reconciliationLog.findMany({
      orderBy: { createdAt: "asc" },
    });

    const groundTruth = await prisma.groundTruthLabel.findMany({});

    return NextResponse.json({
      success: true,
      metrics: metrics
        ? {
            ...metrics,
            discrepancyMatrix: JSON.parse(metrics.discrepancyMatrix),
          }
        : null,
      logs: logs.map((l) => ({
        ...l,
        rulesFired: JSON.parse(l.rulesFired),
        candidateRecords: JSON.parse(l.candidateRecords),
      })),
      groundTruth,
    });
  } catch (error: any) {
    console.error("Error fetching latest reconciliation audit data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
