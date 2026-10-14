import { NextResponse } from "next/server";
import { getPublicProspects } from "@/services/project-finder/actions";
import type { ApiResponse, ProjectProspect } from "@wismannur/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const prospects = await getPublicProspects();
    const response: ApiResponse<ProjectProspect[]> = {
      success: true,
      data: prospects as unknown as ProjectProspect[],
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Public Showcase List] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch showcase prospects" },
      { status: 500 }
    );
  }
}
