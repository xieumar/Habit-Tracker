import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "@/lib/habit";
import type { Habit } from "@/types/habit";

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "test-id",
    userId: "user-1",
    name: "Drink Water",
    description: "",
    frequency: "daily",
    createdAt: "2024-01-01T00:00:00.000Z",
    completions: [],
    ...overrides,
  };
}

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const habit = makeHabit({ completions: [] });
    const result = toggleHabitCompletion(habit, "2024-06-15");
    expect(result.completions).toContain("2024-06-15");
    expect(result.completions).toHaveLength(1);
  });

  it("removes a completion date when the date already exists", () => {
    const habit = makeHabit({ completions: ["2024-06-15", "2024-06-14"] });
    const result = toggleHabitCompletion(habit, "2024-06-15");
    expect(result.completions).not.toContain("2024-06-15");
    expect(result.completions).toContain("2024-06-14");
  });

  it("does not mutate the original habit object", () => {
    const habit = makeHabit({ completions: ["2024-06-14"] });
    const originalCompletions = [...habit.completions];
    toggleHabitCompletion(habit, "2024-06-15");
    expect(habit.completions).toEqual(originalCompletions);
  });

  it("does not return duplicate completion dates", () => {
    // Even if somehow the input already has duplicates, result must not
    const habit = makeHabit({
      completions: ["2024-06-15", "2024-06-15", "2024-06-14"],
    });
    // toggling an existing date removes it
    const result = toggleHabitCompletion(habit, "2024-06-15");
    expect(result.completions).not.toContain("2024-06-15");

    // Adding a new date should not create duplicates
    const habit2 = makeHabit({ completions: ["2024-06-14"] });
    const result2 = toggleHabitCompletion(habit2, "2024-06-15");
    const unique = new Set(result2.completions);
    expect(unique.size).toBe(result2.completions.length);
  });
});