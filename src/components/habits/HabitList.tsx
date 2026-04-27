"use client";

import type { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";

interface HabitListProps {
  habits: Habit[];
  today: string;
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export default function HabitList({
  habits,
  today,
  onToggle,
  onEdit,
  onDelete,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="text-center py-12 px-6 border-2 border-dashed border-border rounded-[2rem]"
      >
        <p className="text-lg font-bold text-foreground mb-2">No habits yet</p>
        <p className="text-sm text-muted-text mb-6">Create your first positive ritual.</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitCard
            habit={habit}
            today={today}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
