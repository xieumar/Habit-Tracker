/**
 * Validates a habit name.
 * - trims the input
 * - rejects empty values
 * - rejects values longer than 60 characters
 * - returns the normalized trimmed value when valid
 */
export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { valid: false, value: trimmed, error: "Habit name is required" };
  }

  if (trimmed.length > 60) {
    return {
      valid: false,
      value: trimmed,
      error: "Habit name must be 60 characters or fewer",
    };
  }

  return { valid: true, value: trimmed, error: null };
}