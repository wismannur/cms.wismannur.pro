import { CMS_CACHE_TAGS, type RevalidationPayload } from "@wismannur/cms-contracts";

/**
 * Dispatch on-demand revalidation to the public frontend (wismannur.pro)
 */
export async function dispatchRevalidation(payload: RevalidationPayload): Promise<void> {
  const publicSiteUrl =
    process.env.PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:7000" : "https://wismannur.pro");
  const secret = process.env.REVALIDATION_SECRET;

  if (!secret) {
    console.warn(
      "[Revalidation Dispatcher] REVALIDATION_SECRET not set. Skipping on-demand revalidation."
    );
    return;
  }

  const endpoint = `${publicSiteUrl.replace(/\/$/, "")}/api/revalidate`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({
        ...payload,
        timestamp: Date.now(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(
        `[Revalidation Dispatcher] Warning: revalidation webhook responded with ${res.status}: ${errText}`
      );
    }
  } catch (error) {
    // Non-blocking: log error and continue mutation without failing CMS action
    console.error("[Revalidation Dispatcher] Failed to trigger revalidation webhook:", error);
  }
}
