export interface UTYProgram {
  id: string;
  name: string;
  degree: "D3" | "D4" | "S1" | "S2" | "S3";
  fullName: string;
  facultyId: "fst" | "fbh" | "pasca";
  facultyName: string;
}

export interface UTYFaculty {
  id: "fst" | "fbh" | "pasca";
  name: string;
  code: string;
  programs: UTYProgram[];
}

export const UTY_FACULTIES: UTYFaculty[] = [
  {
    id: "fst",
    name: "Fakultas Sains & Teknologi",
    code: "FST",
    programs: [
      {
        id: "fst-inf",
        name: "Informatika",
        degree: "S1",
        fullName: "S1 Informatika",
        facultyId: "fst",
        facultyName: "Fakultas Sains & Teknologi",
      },
      {
        id: "fst-si",
        name: "Sistem Informasi",
        degree: "S1",
        fullName: "S1 Sistem Informasi",
        facultyId: "fst",
        facultyName: "Fakultas Sains & Teknologi",
      },
      {
        id: "fst-sd",
        name: "Sains Data",
        degree: "S1",
        fullName: "S1 Sains Data",
        facultyId: "fst",
        facultyName: "Fakultas Sains & Teknologi",
      },
      {
        id: "fst-im",
        name: "Informatika Medis",
        degree: "S1",
        fullName: "S1 Informatika Medis",
        facultyId: "fst",
        facultyName: "Fakultas Sains & Teknologi",
      },
      {
        id: "fst-te",
        name: "Teknik Elektro",
        degree: "S1",
        fullName: "S1 Teknik Elektro",
        facultyId: "fst",
        facultyName: "Fakultas Sains & Teknologi",
      },
      {
        id: "fst-ti",
        name: "Teknik Industri",
        degree: "S1",
        fullName: "S1 Teknik Industri",
        facultyId: "fst",
        facultyName: "Fakultas Sains & Teknologi",
      },
      {
        id: "fst-ts",
        name: "Teknik Sipil",
        degree: "S1",
        fullName: "S1 Teknik Sipil",
        facultyId: "fst",
        facultyName: "Fakultas Sains & Teknologi",
      },
      {
        id: "fst-tk",
        name: "Teknik Komputer",
        degree: "S1",
        fullName: "S1 Teknik Komputer",
        facultyId: "fst",
        facultyName: "Fakultas Sains & Teknologi",
      },
      {
        id: "fst-ars",
        name: "Arsitektur",
        degree: "S1",
        fullName: "S1 Arsitektur",
        facultyId: "fst",
        facultyName: "Fakultas Sains & Teknologi",
      },
      {
        id: "fst-pwk",
        name: "Perencanaan Wilayah & Kota",
        degree: "S1",
        fullName: "S1 Perencanaan Wilayah & Kota",
        facultyId: "fst",
        facultyName: "Fakultas Sains & Teknologi",
      },
      {
        id: "fst-d3si",
        name: "Sistem Informasi (D3)",
        degree: "D3",
        fullName: "D3 Sistem Informasi",
        facultyId: "fst",
        facultyName: "Fakultas Sains & Teknologi",
      },
    ],
  },
  {
    id: "fbh",
    name: "Fakultas Bisnis & Humaniora",
    code: "FBH",
    programs: [
      {
        id: "fbh-man",
        name: "Manajemen",
        degree: "S1",
        fullName: "S1 Manajemen",
        facultyId: "fbh",
        facultyName: "Fakultas Bisnis & Humaniora",
      },
      {
        id: "fbh-akt",
        name: "Akuntansi",
        degree: "S1",
        fullName: "S1 Akuntansi",
        facultyId: "fbh",
        facultyName: "Fakultas Bisnis & Humaniora",
      },
      {
        id: "fbh-psi",
        name: "Psikologi",
        degree: "S1",
        fullName: "S1 Psikologi",
        facultyId: "fbh",
        facultyName: "Fakultas Bisnis & Humaniora",
      },
      {
        id: "fbh-ilkom",
        name: "Ilmu Komunikasi",
        degree: "S1",
        fullName: "S1 Ilmu Komunikasi",
        facultyId: "fbh",
        facultyName: "Fakultas Bisnis & Humaniora",
      },
      {
        id: "fbh-hi",
        name: "Ilmu Hubungan Internasional",
        degree: "S1",
        fullName: "S1 Ilmu Hubungan Internasional",
        facultyId: "fbh",
        facultyName: "Fakultas Bisnis & Humaniora",
      },
      {
        id: "fbh-sas",
        name: "Sastra Inggris",
        degree: "S1",
        fullName: "S1 Sastra Inggris",
        facultyId: "fbh",
        facultyName: "Fakultas Bisnis & Humaniora",
      },
      {
        id: "fbh-bk",
        name: "Bimbingan & Konseling",
        degree: "S1",
        fullName: "S1 Bimbingan & Konseling",
        facultyId: "fbh",
        facultyName: "Fakultas Bisnis & Humaniora",
      },
      {
        id: "fbh-pti",
        name: "Pendidikan Teknologi Informasi",
        degree: "S1",
        fullName: "S1 Pendidikan Teknologi Informasi",
        facultyId: "fbh",
        facultyName: "Fakultas Bisnis & Humaniora",
      },
      {
        id: "fbh-pbi",
        name: "Pendidikan Bahasa Inggris",
        degree: "S1",
        fullName: "S1 Pendidikan Bahasa Inggris",
        facultyId: "fbh",
        facultyName: "Fakultas Bisnis & Humaniora",
      },
      {
        id: "fbh-d4par",
        name: "Destinasi Pariwisata",
        degree: "D4",
        fullName: "D4 Destinasi Pariwisata",
        facultyId: "fbh",
        facultyName: "Fakultas Bisnis & Humaniora",
      },
      {
        id: "fbh-d3akt",
        name: "Akuntansi (D3)",
        degree: "D3",
        fullName: "D3 Akuntansi",
        facultyId: "fbh",
        facultyName: "Fakultas Bisnis & Humaniora",
      },
    ],
  },
  {
    id: "pasca",
    name: "Program Pascasarjana",
    code: "PASCA",
    programs: [
      {
        id: "pasca-mti",
        name: "Magister Teknologi Informasi",
        degree: "S2",
        fullName: "S2 Magister Teknologi Informasi",
        facultyId: "pasca",
        facultyName: "Program Pascasarjana",
      },
      {
        id: "pasca-mm",
        name: "Magister Manajemen",
        degree: "S2",
        fullName: "S2 Magister Manajemen",
        facultyId: "pasca",
        facultyName: "Program Pascasarjana",
      },
      {
        id: "pasca-dim",
        name: "Doktor Ilmu Manajemen",
        degree: "S3",
        fullName: "S3 Doktor Ilmu Manajemen",
        facultyId: "pasca",
        facultyName: "Program Pascasarjana",
      },
    ],
  },
];

export const UTY_PROGRAMS: UTYProgram[] = UTY_FACULTIES.flatMap(
  (faculty) => faculty.programs,
);

export const studyPrograms: string[] = UTY_PROGRAMS.map((p) => p.fullName);

const LEGACY_PRODI_MAP: Record<string, string> = {
  Informatika: "S1 Informatika",
  "Sistem Informasi": "S1 Sistem Informasi",
  "Teknologi Informasi": "S1 Pendidikan Teknologi Informasi",
  "Teknik Elektro": "S1 Teknik Elektro",
  "Teknik Sipil": "S1 Teknik Sipil",
  "Teknik Industri": "S1 Teknik Industri",
  Arsitektur: "S1 Arsitektur",
  Manajemen: "S1 Manajemen",
  Akuntansi: "S1 Akuntansi",
  "Ilmu Komunikasi": "S1 Ilmu Komunikasi",
  Psikologi: "S1 Psikologi",
  "Hubungan Internasional": "S1 Ilmu Hubungan Internasional",
  "Ilmu Hubungan Internasional": "S1 Ilmu Hubungan Internasional",
  "Sastra Inggris": "S1 Sastra Inggris",
  "Sains Data": "S1 Sains Data",
  "Informatika Medis": "S1 Informatika Medis",
  "Teknik Komputer": "S1 Teknik Komputer",
  "Perencanaan Wilayah dan Kota": "S1 Perencanaan Wilayah & Kota",
  "Perencanaan Wilayah & Kota": "S1 Perencanaan Wilayah & Kota",
  "Bimbingan dan Konseling": "S1 Bimbingan & Konseling",
  "Bimbingan & Konseling": "S1 Bimbingan & Konseling",
  "Pendidikan Teknologi Informasi": "S1 Pendidikan Teknologi Informasi",
  "Pendidikan Bahasa Inggris": "S1 Pendidikan Bahasa Inggris",
  "Destinasi Pariwisata": "D4 Destinasi Pariwisata",
  "Magister Manajemen": "S2 Magister Manajemen",
  "Magister Teknologi Informasi": "S2 Magister Teknologi Informasi",
  "Doktor Ilmu Manajemen": "S3 Doktor Ilmu Manajemen",
};

/**
 * Normalizes legacy prodi names without degree prefix to standard UTY prodi full names.
 */
export function normalizeUtyProdi(input?: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (LEGACY_PRODI_MAP[trimmed]) {
    return LEGACY_PRODI_MAP[trimmed];
  }
  return trimmed;
}

/**
 * Checks if a string matches any official UTY study program.
 */
export function isOfficialUtyProgram(name?: string): boolean {
  if (!name) return false;
  const normalized = normalizeUtyProdi(name);
  return studyPrograms.includes(normalized);
}

/**
 * Finds the faculty corresponding to a program name.
 */
export function getFacultyByProgram(
  programName?: string,
): UTYFaculty | undefined {
  if (!programName) return undefined;
  const normalized = normalizeUtyProdi(programName);
  return UTY_FACULTIES.find((f) =>
    f.programs.some((p) => p.fullName === normalized || p.name === programName),
  );
}
