import { NextRequest, NextResponse } from "next/server";
import { getPublicProspectBySlug } from "@/services/project-finder/actions";
import type { ApiResponse, ProjectProspect } from "@wismannur.pro/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const prospect = await getPublicProspectBySlug(slug);
    if (!prospect) {
      return NextResponse.json(
        { success: false, error: `Showcase prospect '${slug}' not found` },
        { status: 404 }
      );
    }

    const response: ApiResponse<ProjectProspect> = {
      success: true,
      data: prospect as unknown as ProjectProspect,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Public Showcase Detail] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch showcase prospect" },
      { status: 500 }
    );
  }
}
