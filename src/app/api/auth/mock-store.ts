export interface MockDBUser {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

export const mockUsersStore = new Map<string, MockDBUser>([
  [
    "user@example.com",
    {
      id: "1",
      name: "Jekz Dev",
      email: "user@example.com",
      role: "admin",
      password: "password123",
    },
  ],
  [
    "guest@example.com",
    {
      id: "2",
      name: "Guest User",
      email: "guest@example.com",
      role: "user",
      password: "password123",
    },
  ],
]);

export const tokenToEmail = new Map<string, string>([
  ["mock-access-token-admin", "user@example.com"],
  ["mock-access-token-user", "guest@example.com"],
  ["mock-refresh-token-admin", "user@example.com"],
  ["mock-refresh-token-user", "guest@example.com"],
]);
