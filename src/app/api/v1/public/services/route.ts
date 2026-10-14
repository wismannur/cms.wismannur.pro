import { NextResponse } from "next/server";
import { serviceCatalogService } from "@/services";
import type { ApiResponse, ServiceItem } from "@wismannur.pro/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await serviceCatalogService.getPublished();
    const response: ApiResponse<ServiceItem[]> = {
      success: true,
      data: services as unknown as ServiceItem[],
      meta: {
        total: services.length,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Services] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
