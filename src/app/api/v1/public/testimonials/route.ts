import { NextResponse } from "next/server";
import { testimonialsService } from "@/services";
import type { ApiResponse, Testimonial } from "@wismannur.pro/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const testimonials = await testimonialsService.getPublished();
    const response: ApiResponse<Testimonial[]> = {
      success: true,
      data: testimonials as unknown as Testimonial[],
      meta: {
        total: testimonials.length,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 Testimonials] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
