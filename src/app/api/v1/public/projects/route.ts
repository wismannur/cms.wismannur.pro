import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/services";
import type { ApiResponse, Project } from "@wismannur.pro/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const featured = searchParams.get("featured") === "true";
    const technology = searchParams.get("technology") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;

    if (page && limit) {
      const paginated = await projectService.getByPage(page, limit, {
        technology,
        searchTerm: search,
      });
      const response: ApiResponse<Project[]> = {
        success: true,
        data: paginated.projects as unknown as Project[],
        meta: {
          page: paginated.currentPage,
          limit,
          totalPages: paginated.totalPages,
        },
      };
      return NextResponse.json(response);
    }

    let projects: Project[] = [];

    if (technology) {
      projects = (await projectService.searchByTechnology(technology)) as unknown as Project[];
    } else if (featured) {
      projects = (await projectService.getFeatured()) as unknown as Project[];
    } else if (limit) {
      projects = (await projectService.getLatest(limit)) as unknown as Project[];
    } else {
      projects = (await projectService.getAll()) as unknown as Project[];
    }

    const response: ApiResponse<Project[]> = {
      success: true,
      data: projects,
      meta: {
        total: projects.length,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Projects] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
