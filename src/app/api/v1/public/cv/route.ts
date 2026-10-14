import { NextResponse } from "next/server";
import {
  projectService,
  resumeService,
  siteSettingsService,
  skillsService,
  userService,
} from "@/services";
import type { ApiResponse } from "@wismannur/cms-contracts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [{ experiences, education }, skills, projects, user, settings] = await Promise.all([
      resumeService.getPublished(),
      skillsService.getPublished(),
      projectService.getFeatured(4),
      userService.getAuthorProfile(),
      siteSettingsService.get(),
    ]);

    const response: ApiResponse<{
      experiences: unknown;
      education: unknown;
      skills: unknown;
      projects: unknown;
      user: unknown;
      settings: unknown;
    }> = {
      success: true,
      data: {
        experiences,
        education,
        skills,
        projects,
        user,
        settings,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API v1 CV] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch CV bundle" },
      { status: 500 }
    );
  }
}
