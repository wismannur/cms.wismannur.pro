import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/services";
import type { ApiResponse, Blog } from "@wismannur.pro/cms-contracts";

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

    const blog = await blogService.getBySlug(slug);
    if (!blog || !blog.isPublished) {
      return NextResponse.json(
        { success: false, error: `Blog '${slug}' not found` },
        { status: 404 }
      );
    }

    const response: ApiResponse<Blog> = {
      success: true,
      data: blog as unknown as Blog,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Blog Detail] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog detail" },
      { status: 500 }
    );
  }
}
