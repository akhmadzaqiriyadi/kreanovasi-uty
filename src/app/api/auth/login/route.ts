import { NextResponse } from "next/server";
import { mockUsersStore } from "../mock-store";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = mockUsersStore.get(email?.toLowerCase());

    if (user && user.password === password) {
      const response = NextResponse.json({
        accessToken:
          user.role === "admin"
            ? "mock-access-token-admin"
            : "mock-access-token-user",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

      const host = request.headers.get("host") || "";
      const isSecure =
        process.env.NODE_ENV === "production" && !host.includes("localhost");

      // Set HttpOnly refresh token cookie
      response.cookies.set(
        "refresh_token",
        user.role === "admin"
          ? "mock-refresh-token-admin"
          : "mock-refresh-token-user",
        {
          httpOnly: true,
          secure: isSecure,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        },
      );

      // Set non-HttpOnly session active indicator for middleware visibility
      response.cookies.set("session_active", "true", {
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json(
      { message: "Email atau password salah" },
      { status: 401 },
    );
  } catch (_error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan internal" },
      { status: 500 },
    );
  }
}
