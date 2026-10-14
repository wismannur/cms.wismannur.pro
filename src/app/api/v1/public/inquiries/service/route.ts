import { NextRequest, NextResponse } from "next/server";
import { serviceRequestService } from "@/services/service-requests";
import type { ApiResponse } from "@wismannur.pro/cms-contracts";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { turnstileToken, recaptchaToken, ...formData } = body;
    const token = recaptchaToken || turnstileToken;

    const requestId = await serviceRequestService.submit(formData, token);

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: requestId },
    };
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[API v1 Service Request Submit] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to submit service request",
      },
      { status: error?.code === "invalid-input" ? 400 : 500 }
    );
  }
}
