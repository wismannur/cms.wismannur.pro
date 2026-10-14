import { NextRequest, NextResponse } from "next/server";
import { processStepsService } from "@/services";
import type { ApiResponse } from "@wismannur/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const rawScope = req.nextUrl.searchParams.get("scope");
    const scope = rawScope === "hire-me" ? "hire-me" : "services";
    const steps = await processStepsService.getPublished(scope);
    const response: ApiResponse<typeof steps> = {
      success: true,
      data: steps,
      meta: {
        total: steps.length,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Process Steps] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch process steps" },
      { status: 500 }
    );
  }
}
