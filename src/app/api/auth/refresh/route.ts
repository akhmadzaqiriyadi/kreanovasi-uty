import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { mockUsersStore, tokenToEmail } from "../mock-store";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken && tokenToEmail.has(refreshToken)) {
    const email = tokenToEmail.get(refreshToken);
    const user = email ? mockUsersStore.get(email) : null;

    if (user) {
      return NextResponse.json({
        accessToken:
          user.role === "admin"
            ? "mock-access-token-admin"
            : "mock-access-token-user",
      });
    }
  }

  // Fallback for default testing tokens
  if (refreshToken === "mock-refresh-token-admin") {
    return NextResponse.json({
      accessToken: "mock-access-token-admin",
    });
  }
  if (refreshToken === "mock-refresh-token-user") {
    return NextResponse.json({
      accessToken: "mock-access-token-user",
    });
  }
  if (refreshToken === "mock-refresh-token-active") {
    return NextResponse.json({
      accessToken: "mock-access-token-admin",
    });
  }

  return NextResponse.json(
    { message: "Sesi telah berakhir atau tidak valid" },
    { status: 401 },
  );
}
