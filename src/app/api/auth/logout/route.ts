import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const host = request.headers.get("host") || "";
  const isSecure =
    process.env.NODE_ENV === "production" && !host.includes("localhost");
  const response = NextResponse.json({ success: true });

  // Clear refresh_token and session_active cookies
  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("session_active", "", {
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
