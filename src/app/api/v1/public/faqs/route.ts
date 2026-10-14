import { NextResponse } from "next/server";
import { faqsService } from "@/services";
import type { ApiResponse, Faq } from "@wismannur/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const faqs = await faqsService.getPublished();
    const response: ApiResponse<Faq[]> = {
      success: true,
      data: faqs as unknown as Faq[],
      meta: {
        total: faqs.length,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 FAQs] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}
