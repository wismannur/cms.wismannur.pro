import { NextRequest, NextResponse } from "next/server";
import { blogService, projectService } from "@/services";
import type { ApiResponse, InteractionPayload } from "@wismannur.pro/cms-contracts";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InteractionPayload;
    const { entityType, slug } = body;

    if (!entityType || !slug) {
      return NextResponse.json(
        { success: false, error: "entityType and slug are required" },
        { status: 400 }
      );
    }

    if (entityType === "project") {
      await projectService.incrementView(slug);
    } else if (entityType === "blog") {
      await blogService.incrementView(slug);
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid entityType" },
        { status: 400 }
      );
    }

    const response: ApiResponse<{ recorded: true }> = {
      success: true,
      data: { recorded: true },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 View Interaction] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record view" },
      { status: 500 }
    );
  }
}
