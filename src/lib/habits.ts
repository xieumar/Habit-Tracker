import type { Habit } from "@/types/habit";

/**
 * Toggles the completion of a habit for a specific date.
 * - if the date is not in completions, adds it
 * - if the date is already in completions, removes it
 * - returns a new Habit object (does not mutate)
 * - guarantees no duplicate dates
 */
export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const existing = new Set(habit.completions);

  if (existing.has(date)) {
    existing.delete(date);
  } else {
    existing.add(date);
  }

  return {
    ...habit,
    completions: [...existing],
  };
}