import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/services";
import type { ApiResponse, Project } from "@wismannur/cms-contracts";

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

    const project = await projectService.getBySlug(slug);
    if (!project || !project.isPublished) {
      return NextResponse.json(
        { success: false, error: `Project '${slug}' not found` },
        { status: 404 }
      );
    }

    const response: ApiResponse<Project> = {
      success: true,
      data: project as unknown as Project,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Project Detail] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project detail" },
      { status: 500 }
    );
  }
}
