/**
 * Calculates the current consecutive streak for a habit.
 *
 * Rules:
 * - completions contains YYYY-MM-DD strings
 * - duplicates are removed before calculating
 * - sorted by date before logic
 * - if today is not completed, streak is 0
 * - if today is completed, count consecutive calendar days backwards from today
 */
export function calculateCurrentStreak(
  completions: string[],
  today?: string
): number {
  const todayStr = today ?? new Date().toISOString().slice(0, 10);

  // Deduplicate and sort descending
  const unique = [...new Set(completions)].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (!unique.includes(todayStr)) return 0;

  let streak = 0;
  let current = new Date(todayStr + "T00:00:00Z");

  for (const date of unique) {
    const expected = current.toISOString().slice(0, 10);
    if (date === expected) {
      streak++;
      current = new Date(current.getTime() - 86400000); // go back 1 day
    } else {
      break;
    }
  }

  return streak;
}