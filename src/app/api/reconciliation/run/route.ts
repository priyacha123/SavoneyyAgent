import { NextResponse } from "next/server";
import { runReconciliationBatch } from "@/lib/reconciliation/runner";

export async function POST() {
  try {
    const result = await runReconciliationBatch();
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error executing reconciliation batch:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
