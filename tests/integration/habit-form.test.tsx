import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { saveSession, saveHabits, saveUsers } from "@/lib/storage";
import type { Habit } from "@/types/habit";
import type { Session } from "@/types/auth";

if (typeof crypto === "undefined") {
  (global as any).crypto = {
    randomUUID: () => "test-uuid-" + Math.random(),
  };
}

// Mock next/navigation
const mockRouter = {
  replace: vi.fn(),
  push: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

import DashboardPage from "@/app/dashboard/page";

const FIXED_TODAY = "2024-06-15";

function seedSession(): Session {
  const session: Session = { userId: "user-1", email: "test@example.com" };
  saveSession(session);
  saveUsers([
    {
      id: "user-1",
      email: "test@example.com",
      password: "pw",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  ]);
  return session;
}

function seedHabit(overrides: Partial<Habit> = {}): Habit {
  const habit: Habit = {
    id: "habit-1",
    userId: "user-1",
    name: "Drink Water",
    description: "Stay hydrated",
    frequency: "daily",
    createdAt: "2024-01-01T00:00:00.000Z",
    completions: [],
    ...overrides,
  };
  saveHabits([habit]);
  return habit;
}

// Override Date to a fixed value so "today" is deterministic
beforeEach(() => {
  localStorage.clear();
  mockRouter.replace.mockClear();
  mockRouter.push.mockClear();

  const fixedDate = new Date("2024-06-15T12:00:00.000Z");
  vi.setSystemTime(fixedDate);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("habit form", () => {
  it("shows a validation error when habit name is empty", async () => {
    seedSession();
    const user = userEvent.setup();
    render(<DashboardPage />);

    // Open form
    const createBtn = await screen.findByRole("button", { name: /Log New Habit/i });
    await user.click(createBtn);

    // Submit empty name
    const saveBtn = screen.getByTestId("habit-save-button");
    await user.click(saveBtn);

    expect(await screen.findByText("Habit name is required")).toBeInTheDocument();
  });

  it("creates a new habit and renders it in the list", async () => {
    seedSession();
    const user = userEvent.setup();
    render(<DashboardPage />);

    const createBtn = await screen.findByRole("button", { name: /Log New Habit/i });
    await user.click(createBtn);

    await user.type(screen.getByTestId("habit-name-input"), "Drink Water");
    await user.type(
      screen.getByTestId("habit-description-input"),
      "Stay hydrated"
    );
    await user.click(screen.getByTestId("habit-save-button"));

    expect(
      await screen.findByTestId("habit-card-drink-water")
    ).toBeInTheDocument();
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const original = seedHabit();
    seedSession();
    const user = userEvent.setup();
    render(<DashboardPage />);

    const editBtn = await screen.findByTestId("habit-edit-drink-water");
    await user.click(editBtn);

    const nameInput = screen.getByTestId("habit-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Drink More Water");
    await user.click(screen.getByTestId("habit-save-button"));

    expect(
      await screen.findByTestId("habit-card-drink-more-water")
    ).toBeInTheDocument();
    // Original card is gone
    expect(screen.queryByTestId("habit-card-drink-water")).not.toBeInTheDocument();

    // Immutable fields preserved in storage
    const { getHabits } = await import("@/lib/storage");
    const habits = getHabits();
    const updated = habits.find((h) => h.id === original.id);
    expect(updated?.id).toBe(original.id);
    expect(updated?.userId).toBe(original.userId);
    expect(updated?.createdAt).toBe(original.createdAt);
    expect(updated?.completions).toEqual(original.completions);
  });

  it("deletes a habit only after explicit confirmation", async () => {
    seedHabit();
    seedSession();
    const user = userEvent.setup();
    render(<DashboardPage />);

    const deleteBtn = await screen.findByTestId("habit-delete-drink-water");
    await user.click(deleteBtn);

    // Habit should still be visible (confirmation not yet given)
    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-delete-button")).toBeInTheDocument();

    // Now confirm
    await user.click(screen.getByTestId("confirm-delete-button"));

    expect(
      screen.queryByTestId("habit-card-drink-water")
    ).not.toBeInTheDocument();
  });

  it("toggles completion and updates the streak display", async () => {
    seedHabit({ completions: [] });
    seedSession();
    const user = userEvent.setup();
    render(<DashboardPage />);

    const streakEl = await screen.findByTestId("habit-streak-drink-water");
    expect(streakEl).toHaveTextContent("0");

    const completeBtn = screen.getByTestId("habit-complete-drink-water");
    await user.click(completeBtn);

    // Streak should now be 1
    await waitFor(() => {
      expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent("1");
    });

    // Toggle off
    await user.click(screen.getByTestId("habit-complete-drink-water"));

    await waitFor(() => {
      expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent("0");
    });
  });
});