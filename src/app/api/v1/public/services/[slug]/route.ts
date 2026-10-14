import { NextRequest, NextResponse } from "next/server";
import { serviceCatalogService } from "@/services";
import type { ApiResponse, ServiceItem } from "@wismannur.pro/cms-contracts";

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

    const all = await serviceCatalogService.getPublished();
    const service = all.find((s) => s.slug === slug);

    if (!service || !service.isPublished) {
      return NextResponse.json(
        { success: false, error: `Service '${slug}' not found` },
        { status: 404 }
      );
    }

    const response: ApiResponse<ServiceItem> = {
      success: true,
      data: service as unknown as ServiceItem,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Service Detail] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service detail" },
      { status: 500 }
    );
  }
}
