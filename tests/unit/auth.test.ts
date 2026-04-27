import { describe, it, expect, beforeEach } from "vitest";
import { signUp, logIn, logOut } from "@/lib/auth";
import { getSession } from "@/lib/storage";

if (typeof crypto === "undefined") {
  (global as any).crypto = {
    randomUUID: () => "test-uuid-" + Math.random(),
  };
}

describe("auth utility", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("successfully signs up a new user", () => {
    const result = signUp("test@example.com", "password");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.session.email).toBe("test@example.com");
    }
    expect(getSession()?.email).toBe("test@example.com");
  });

  it("fails to sign up a duplicate user", () => {
    signUp("test@example.com", "password");
    const result = signUp("test@example.com", "other");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("User already exists");
    }
  });

  it("successfully logs in", () => {
    signUp("test@example.com", "password");
    saveSession(null); // logout
    
    const result = logIn("test@example.com", "password");
    expect(result.success).toBe(true);
    expect(getSession()?.email).toBe("test@example.com");
  });

  it("fails login with wrong credentials", () => {
    signUp("test@example.com", "password");
    const result = logIn("test@example.com", "wrong");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid email or password");
    }
  });

  it("successfully logs out", () => {
    signUp("test@example.com", "password");
    expect(getSession()).not.toBeNull();
    logOut();
    expect(getSession()).toBeNull();
  });
});

// Helper for logout test
function saveSession(data: any) {
    localStorage.setItem("habit-tracker-session", JSON.stringify(data));
}
