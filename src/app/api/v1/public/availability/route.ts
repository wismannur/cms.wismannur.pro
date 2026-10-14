import { NextResponse } from "next/server";
import { availabilityService } from "@/services";
import type { ApiResponse, AvailabilitySlot } from "@wismannur/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slots = await availabilityService.getPublished();
    const response: ApiResponse<AvailabilitySlot[]> = {
      success: true,
      data: slots as unknown as AvailabilitySlot[],
      meta: {
        total: slots.length,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Availability] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
