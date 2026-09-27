import { describe, expect, it } from "bun:test";
import { mapBackendUserToProfile } from "./use-auth-mutations";
import type { BackendUser } from "@/types/auth";

describe("mapBackendUserToProfile", () => {
  it("maps mahasiswa user correctly", () => {
    const backendUser: BackendUser = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Budi Santoso",
      email: "budi@students.uty.ac.id",
      role: "mahasiswa",
      is_verified: true,
      permissions: ["bookings:create"],
    };

    const profile = mapBackendUserToProfile(backendUser, {
      idNumber: "5210411999",
      affiliation: "Informatika",
      prodi: "Informatika",
    });

    expect(profile.name).toBe("Budi Santoso");
    expect(profile.email).toBe("budi@students.uty.ac.id");
    expect(profile.role).toBe("mahasiswa");
    expect(profile.roleLabel).toBe("Mahasiswa Aktif UTY");
    expect(profile.idNumber).toBe("5210411999");
    expect(profile.idLabel).toBe("NPM");
    expect(profile.npm).toBe("5210411999");
    expect(profile.prodi).toBe("Informatika");
  });

  it("maps dosen / manager user correctly", () => {
    const backendUser: BackendUser = {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Dr. Bambang Sutrisno",
      email: "bambang@uty.ac.id",
      role: "dosen",
      is_verified: true,
      permissions: ["bookings:create", "rooms:manage"],
    };

    const profile = mapBackendUserToProfile(backendUser, {
      idNumber: "0514088201",
      affiliation: "Fakultas Sains & Teknologi",
    });

    expect(profile.role).toBe("dosen");
    expect(profile.roleLabel).toBe("Dosen / Tenaga Pendidik");
    expect(profile.idLabel).toBe("NIDN / NIK");
    expect(profile.idNumber).toBe("0514088201");
  });

  it("maps umum / non-civitas user correctly", () => {
    const backendUser: BackendUser = {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "Hendri Pratama",
      email: "hendri@mitra.com",
      role: "umum",
      is_verified: true,
      permissions: [],
    };

    const profile = mapBackendUserToProfile(backendUser, {
      idNumber: "3404011205940003",
      affiliation: "PT Kreasi Digital Jogja",
    });

    expect(profile.role).toBe("umum");
    expect(profile.roleLabel).toBe("Non-Civitas / Mitra");
    expect(profile.idLabel).toBe("NIK KTP");
    expect(profile.idNumber).toBe("3404011205940003");
    expect(profile.npm).toBeUndefined();
  });

  it("maps admin user correctly", () => {
    const backendUser: BackendUser = {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "System Administrator",
      email: "admin@gozaq.com",
      role: "admin",
      is_verified: true,
      permissions: ["*"],
    };

    const profile = mapBackendUserToProfile(backendUser);

    expect(profile.name).toBe("System Administrator");
    expect(profile.email).toBe("admin@gozaq.com");
    expect(profile.role).toBe("admin");
    expect(profile.roleLabel).toBe("System Administrator");
    expect(profile.idLabel).toBe("Admin ID");
    expect(profile.npm).toBeUndefined();
    expect(profile.affiliation).toBe("Pengelola UTY Creative Hub");
  });
});
