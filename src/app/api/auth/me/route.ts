import { NextResponse } from "next/server";
import { mockUsersStore, tokenToEmail } from "../mock-store";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  const email = token ? tokenToEmail.get(token) : null;
  const user = email ? mockUsersStore.get(email) : null;

  if (user) {
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  // Fallback for custom or testing authorization headers that don't match the exact map keys
  if (authHeader?.startsWith("Bearer mock-access-token")) {
    const defaultAdmin = mockUsersStore.get("user@example.com");
    if (defaultAdmin) {
      return NextResponse.json({
        id: defaultAdmin.id,
        name: defaultAdmin.name,
        email: defaultAdmin.email,
        role: defaultAdmin.role,
      });
    }
  }

  return NextResponse.json(
    { message: "Token tidak valid atau kadaluarsa" },
    { status: 401 },
  );
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const currentEmail = token ? tokenToEmail.get(token) : null;
    const user = currentEmail ? mockUsersStore.get(currentEmail) : null;

    if (!user || !currentEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await request.json();
    if (!name || !email) {
      return NextResponse.json(
        { message: "Nama dan email wajib diisi" },
        { status: 400 },
      );
    }

    const newEmailKey = email.toLowerCase();
    if (newEmailKey !== currentEmail && mockUsersStore.has(newEmailKey)) {
      return NextResponse.json(
        { message: "Email sudah digunakan oleh pengguna lain" },
        { status: 409 },
      );
    }

    // Update in-memory DB
    mockUsersStore.delete(currentEmail);
    const updatedUser = { ...user, name, email: newEmailKey };
    mockUsersStore.set(newEmailKey, updatedUser);

    // Re-map token to new email
    if (token) {
      tokenToEmail.set(token, newEmailKey);
      // If updating email, also update any corresponding refresh token mapping if any
      const refreshToken = token.replace("access", "refresh");
      tokenToEmail.set(refreshToken, newEmailKey);
    }

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (_error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan internal" },
      { status: 500 },
    );
  }
}
