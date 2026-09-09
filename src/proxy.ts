import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if session cookie is active
  const sessionActive = request.cookies.get("session_active")?.value;

  // Direct guests trying to access protected dashboard routes to login
  if (pathname.startsWith("/dashboard") && sessionActive !== "true") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Direct authenticated users trying to access login/register back to dashboard
  if (
    (pathname.startsWith("/login") || pathname.startsWith("/register")) &&
    sessionActive === "true"
  ) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
