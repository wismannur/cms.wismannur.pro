import { NextRequest, NextResponse } from "next/server";
import { sitePagesService } from "@/services/site-pages";
import type { ApiResponse, SitePage } from "@wismannur.pro/cms-contracts";

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

    const page = await sitePagesService.getBySlug(slug);
    if (!page) {
      return NextResponse.json(
        { success: false, error: `Site page '${slug}' not found` },
        { status: 404 }
      );
    }

    const response: ApiResponse<SitePage> = {
      success: true,
      data: page as unknown as SitePage,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Site Page Detail] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch site page" },
      { status: 500 }
    );
  }
}
