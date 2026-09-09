export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthSession {
  user: User | null;
  accessToken: string | null;
}
