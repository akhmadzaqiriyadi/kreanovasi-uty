import { NextResponse } from "next/server";
import { mockUsersStore, tokenToEmail } from "../mock-store";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    const emailKey = email.toLowerCase();
    if (mockUsersStore.has(emailKey)) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 },
      );
    }

    // Simulate slight processing delay (realistic UX)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newId = String(mockUsersStore.size + 1);
    mockUsersStore.set(emailKey, {
      id: newId,
      name,
      email: emailKey,
      role: "user",
      password,
    });

    const accessToken = `mock-access-token-${newId}-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${newId}-${Date.now()}`;

    tokenToEmail.set(accessToken, emailKey);
    tokenToEmail.set(refreshToken, emailKey);

    return NextResponse.json(
      { message: "Registrasi berhasil", accessToken, refreshToken },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan internal" },
      { status: 500 },
    );
  }
}
