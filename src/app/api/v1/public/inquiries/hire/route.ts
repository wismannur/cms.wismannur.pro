import { NextRequest, NextResponse } from "next/server";
import { hireRequestService } from "@/services";
import type { ApiResponse } from "@wismannur.pro/cms-contracts";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { turnstileToken, recaptchaToken, ...formData } = body;
    const token = turnstileToken || recaptchaToken;

    const requestId = await hireRequestService.submit(formData, token);

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: requestId },
    };
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[API v1 Hire Submit] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to submit hire request",
      },
      { status: error?.code === "invalid-input" ? 400 : 500 }
    );
  }
}
