import { NextResponse } from "next/server";
import { skillsService } from "@/services";
import type { ApiResponse, Skill } from "@wismannur/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const skills = await skillsService.getPublished();
    const response: ApiResponse<Skill[]> = {
      success: true,
      data: skills as unknown as Skill[],
      meta: {
        total: skills.length,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Skills] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
