import { NextResponse } from "next/server";
import { resumeService } from "@/services";
import type { ApiResponse, ResumeEntry } from "@wismannur/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const grouped = await resumeService.getPublished();
    const response: ApiResponse<{ experiences: ResumeEntry[]; education: ResumeEntry[] }> = {
      success: true,
      data: grouped as unknown as { experiences: ResumeEntry[]; education: ResumeEntry[] },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Resume] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resume data" },
      { status: 500 }
    );
  }
}
