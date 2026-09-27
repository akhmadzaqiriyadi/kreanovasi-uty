import { describe, expect, it } from "bun:test";
import { PERMISSIONS } from "./use-permission";

describe("Permissions Constant", () => {
  it("defines standard granular PBAC permissions", () => {
    expect(PERMISSIONS.USERS_READ).toBe("users:read");
    expect(PERMISSIONS.USERS_CREATE).toBe("users:create");
    expect(PERMISSIONS.USERS_UPDATE).toBe("users:update");
    expect(PERMISSIONS.USERS_DELETE).toBe("users:delete");
    expect(PERMISSIONS.ROLES_READ).toBe("roles:read");
    expect(PERMISSIONS.ROLES_MANAGE).toBe("roles:manage");
    expect(PERMISSIONS.AUDIT_READ).toBe("audit:read");
    expect(PERMISSIONS.UPLOADS_CREATE).toBe("uploads:create");
  });
});
