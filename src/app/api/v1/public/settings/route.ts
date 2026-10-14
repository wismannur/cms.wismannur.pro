import { NextResponse } from "next/server";
import { siteSettingsService } from "@/services";
import type { ApiResponse, SiteSettings } from "@wismannur/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await siteSettingsService.get();
    const response: ApiResponse<SiteSettings> = {
      success: true,
      data: settings,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Settings] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}
