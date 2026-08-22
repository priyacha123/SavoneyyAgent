import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await import("@clerk/nextjs/server").then(m => m.auth());
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let settings = await prisma.engineSettings.findUnique({
      where: { id: "default_settings" },
    });

    if (!settings) {
      settings = await prisma.engineSettings.create({
        data: {
          id: "default_settings",
          amountTolerance: 0.0,
          dateToleranceDays: 3,
          enableGeminiAI: true,
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Error fetching engine settings:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await import("@clerk/nextjs/server").then(m => m.auth());
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amountTolerance, dateToleranceDays, enableGeminiAI } = body;

    const settings = await prisma.engineSettings.upsert({
      where: { id: "default_settings" },
      update: {
        amountTolerance: amountTolerance ?? 0.0,
        dateToleranceDays: dateToleranceDays ?? 3,
        enableGeminiAI: enableGeminiAI ?? true,
      },
      create: {
        id: "default_settings",
        amountTolerance: amountTolerance ?? 0.0,
        dateToleranceDays: dateToleranceDays ?? 3,
        enableGeminiAI: enableGeminiAI ?? true,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Error updating engine settings:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
