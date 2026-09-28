import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let key = searchParams.get("key");
  const rawUrl = searchParams.get("url");

  if (!key && rawUrl) {
    const bucketSplit = rawUrl.split("/ibisapp/");
    if (bucketSplit.length > 1) {
      key = bucketSplit[1];
    } else {
      const superappSplit = rawUrl.split("/uchsuperapp/");
      if (superappSplit.length > 1) {
        key = superappSplit[1];
      } else {
        try {
          const parsed = new URL(rawUrl);
          key = parsed.pathname.replace(/^\/([^/]+)\//, "");
        } catch {
          key = rawUrl;
        }
      }
    }
  }

  if (!key) {
    return new NextResponse("Storage key is required", { status: 400 });
  }

  key = key.replace(/^\/+/, "");

  try {
    const backendUrl =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:8080";

    const targetUrl = `${backendUrl}/api/v1/upload/file/${key}`;
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Accept: request.headers.get("accept") || "*/*",
      },
      cache: "force-cache",
    });

    if (!res.ok) {
      return new NextResponse("File not found in storage", {
        status: res.status,
      });
    }

    const contentType =
      res.headers.get("content-type") || "application/octet-stream";
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": "inline",
      },
    });
  } catch (_error) {
    return new NextResponse("Storage proxy error", { status: 500 });
  }
}
