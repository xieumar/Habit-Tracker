import { describe, it, expect } from "vitest";
import { validateHabitName } from "@/lib/validators";

describe("validateHabitName", () => {
  it("returns an error when habit name is empty", () => {
    expect(validateHabitName("")).toMatchObject({
      valid: false,
      error: "Habit name is required",
    });
    expect(validateHabitName("   ")).toMatchObject({
      valid: false,
      error: "Habit name is required",
    });
  });

  it("returns an error when habit name exceeds 60 characters", () => {
    const longName = "a".repeat(61);
    expect(validateHabitName(longName)).toMatchObject({
      valid: false,
      error: "Habit name must be 60 characters or fewer",
    });
  });

  it("returns a trimmed value when habit name is valid", () => {
    expect(validateHabitName("  Drink Water  ")).toMatchObject({
      valid: true,
      value: "Drink Water",
      error: null,
    });
    expect(validateHabitName("Exercise")).toMatchObject({
      valid: true,
      value: "Exercise",
      error: null,
    });
    // Exactly 60 characters should be valid
    const exactly60 = "a".repeat(60);
    expect(validateHabitName(exactly60)).toMatchObject({
      valid: true,
      value: exactly60,
      error: null,
    });
  });
});