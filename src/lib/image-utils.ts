/**
 * Utility functions for handling images, MinIO storage proxying, and fallbacks.
 */

/**
 * Transforms any image URL to ensure it loads reliably in the browser:
 * - Rewrites MinIO URLs (s3.dev-apps.utycreative.cloud or localhost:9000) to use our storage proxy to prevent SSL & Mixed Content errors
 * - Leaves local (/images/...) and valid external URLs intact
 */
export function getSafeImageUrl(
  url?: string | null,
  fallback = "/images/coworking-space.jpg",
): string {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return fallback;
  }

  const trimmed = url.trim();

  // Local assets in public folder
  if (trimmed.startsWith("/") && !trimmed.startsWith("/api/storage-proxy")) {
    return trimmed;
  }

  // Data URLs
  if (trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  // Check if it's a campus MinIO or local MinIO URL
  const isCampusMinio = trimmed.includes("s3.dev-apps.utycreative.cloud");
  const isLocalMinio = trimmed.includes("localhost:9000");

  if (isCampusMinio || isLocalMinio) {
    // Extract key if it contains bucket name
    const bucketSplit = trimmed.split("/ibisapp/");
    if (bucketSplit.length > 1 && bucketSplit[1]) {
      const key = bucketSplit[1].replace(/^\/+/, "");
      return `/api/storage-proxy?key=${encodeURIComponent(key)}`;
    }

    const superappSplit = trimmed.split("/uchsuperapp/");
    if (superappSplit.length > 1 && superappSplit[1]) {
      const key = superappSplit[1].replace(/^\/+/, "");
      return `/api/storage-proxy?key=${encodeURIComponent(key)}`;
    }

    return `/api/storage-proxy?url=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}
