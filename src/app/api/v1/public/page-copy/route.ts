import { NextRequest, NextResponse } from "next/server";
import { pageCopyService } from "@/services";
import type { ApiResponse, PageCopyContent, PageKey } from "@wismannur.pro/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = (searchParams.get("page") || "home") as PageKey;

    const copy = await pageCopyService.get(page);
    if (!copy) {
      return NextResponse.json(
        { success: false, error: `Page copy for '${page}' not found` },
        { status: 404 }
      );
    }

    const response: ApiResponse<PageCopyContent> = {
      success: true,
      data: copy,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 PageCopy] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page copy" },
      { status: 500 }
    );
  }
}
