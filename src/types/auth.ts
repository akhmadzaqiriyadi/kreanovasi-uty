export interface ApiEnvelope<T = unknown> {
  success: boolean;
  status_code: number;
  message: string;
  error_code?: string;
  timestamp?: string;
  data?: T;
  errors?: unknown;
}

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: string;
  id_number?: string;
  affiliation?: string;
  is_verified: boolean;
  verified_at?: string;
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

export interface BackendAuthResponse {
  access_token: string;
  refresh_token: string;
  user: BackendUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
  id_number?: string;
  affiliation?: string;
}

export interface UpdateProfilePayload {
  name: string;
  affiliation?: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role: "mahasiswa" | "dosen" | "umum" | "admin";
  roleLabel: string;
  idNumber: string;
  idLabel: string;
  affiliation: string;
  npm?: string;
  prodi?: string;
  avatarUrl: string;
  permissions?: string[];
}
