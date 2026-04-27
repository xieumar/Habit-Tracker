import { describe, it, expect, beforeEach } from "vitest";
import { 
  getUsers, 
  saveUsers, 
  getSession, 
  saveSession, 
  getHabits, 
  saveHabits, 
  getHabitsForUser 
} from "@/lib/storage";
import type { User, Session } from "@/types/auth";
import type { Habit } from "@/types/habit";

describe("storage utility", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("handles user persistence", () => {
    const users: User[] = [{ id: "1", email: "a@b.com", password: "p", createdAt: "now" }];
    saveUsers(users);
    expect(getUsers()).toEqual(users);
  });

  it("handles session persistence", () => {
    const session: Session = { userId: "1", email: "a@b.com" };
    saveSession(session);
    expect(getSession()).toEqual(session);
    saveSession(null);
    expect(getSession()).toBeNull();
  });

  it("handles habit persistence and filtering", () => {
    const habits: Habit[] = [
      { id: "h1", userId: "u1", name: "H1", description: "", frequency: "daily", createdAt: "now", completions: [] },
      { id: "h2", userId: "u2", name: "H2", description: "", frequency: "daily", createdAt: "now", completions: [] },
    ];
    saveHabits(habits);
    expect(getHabits()).toEqual(habits);
    expect(getHabitsForUser("u1")).toHaveLength(1);
    expect(getHabitsForUser("u1")[0].id).toBe("h1");
    expect(getHabitsForUser("non-existent")).toHaveLength(0);
  });

  it("returns empty arrays/null for missing keys", () => {
    expect(getUsers()).toEqual([]);
    expect(getSession()).toBeNull();
    expect(getHabits()).toEqual([]);
  });
});
