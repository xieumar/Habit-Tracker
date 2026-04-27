/**
 * Converts a habit name into a stable URL/test-id slug.
 * - converts to lowercase
 * - trims outer whitespace
 * - collapses internal spaces to single hyphens
 * - removes non-alphanumeric characters except hyphens
 */
export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}