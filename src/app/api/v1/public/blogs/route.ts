import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/services";
import type { ApiResponse, Blog } from "@wismannur.pro/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;

    if (page && limit) {
      const paginated = await blogService.getByPage(page, limit);
      const response: ApiResponse<Blog[]> = {
        success: true,
        data: paginated.blogs as unknown as Blog[],
        meta: {
          page: paginated.currentPage,
          limit,
          totalPages: paginated.totalPages,
        },
      };
      return NextResponse.json(response);
    }

    let blogs: Blog[] = [];
    if (limit) {
      blogs = (await blogService.getLatest(limit)) as unknown as Blog[];
    } else {
      blogs = (await blogService.getPublished()) as unknown as Blog[];
    }

    const response: ApiResponse<Blog[]> = {
      success: true,
      data: blogs,
      meta: {
        total: blogs.length,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Blogs] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
