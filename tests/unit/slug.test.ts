import { describe, it, expect } from "vitest";
import { getHabitSlug } from "@/lib/slug";

describe("getHabitSlug", () => {
  it("returns lowercase hyphenated slug for a basic habit name", () => {
    expect(getHabitSlug("Drink Water")).toBe("drink-water");
    expect(getHabitSlug("Read Books")).toBe("read-books");
    expect(getHabitSlug("Exercise")).toBe("exercise");
  });

  it("trims outer spaces and collapses repeated internal spaces", () => {
    expect(getHabitSlug("  Drink Water  ")).toBe("drink-water");
    expect(getHabitSlug("Read   Books")).toBe("read-books");
    expect(getHabitSlug("  Go   for   a   Walk  ")).toBe("go-for-a-walk");
  });

  it("removes non alphanumeric characters except hyphens", () => {
    expect(getHabitSlug("Drink 8 glasses!")).toBe("drink-8-glasses");
    expect(getHabitSlug("Read (books)")).toBe("read-books");
    expect(getHabitSlug("100% effort")).toBe("100-effort");
    expect(getHabitSlug("No sugar & caffeine")).toBe("no-sugar--caffeine");
  });
});