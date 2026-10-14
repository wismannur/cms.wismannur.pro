import { NextRequest, NextResponse } from "next/server";
import { contactService } from "@/services";
import type { ApiResponse } from "@wismannur/cms-contracts";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { turnstileToken, recaptchaToken, ...formData } = body;
    const token = turnstileToken || recaptchaToken;

    const contactId = await contactService.submit(formData, token);

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: contactId },
    };
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[API v1 Contact Submit] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to submit contact message",
      },
      { status: error?.code === "invalid-input" ? 400 : 500 }
    );
  }
}
