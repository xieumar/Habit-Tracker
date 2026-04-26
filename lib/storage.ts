import type { User, Session } from "@/types/auth";
import type { Habit } from "@/types/habit";

export const STORAGE_KEYS = {
  USERS: "habit-tracker-users",
  SESSION: "habit-tracker-session",
  HABITS: "habit-tracker-habits",
} as const;

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw || raw === "null") return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null): void {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}


export function getHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    return raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

export function getHabitsForUser(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId);
}