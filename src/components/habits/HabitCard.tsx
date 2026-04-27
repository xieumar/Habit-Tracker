"use client";

import { useState } from "react";
import type { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { Check, Plus, Edit3, Trash2, Droplets, Flame } from "lucide-react";

interface HabitCardProps {
  habit: Habit;
  today: string;
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export default function HabitCard({
  habit,
  today,
  onToggle,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const completed = habit.completions.includes(today);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`relative rounded-[2rem] p-5 transition-all duration-300 flex items-center gap-4 ${
        completed
          ? "bg-black/5 border border-transparent opacity-80"
          : "bg-card shadow-sm border border-border"
      }`}
    >
      {/* Icon Badge */}
      <div 
        className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          completed ? "bg-black/5 text-muted-text" : "bg-brand-orange/15 text-brand-orange"
        }`}
      >
        {streak > 5 ? <Flame strokeWidth={2.5} /> : <Droplets strokeWidth={2.5} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-1">
        <h3
          className={`font-bold text-[1.1rem] truncate mb-1 transition-colors ${
            completed ? "text-muted-text line-through decoration-muted-text/50" : "text-foreground"
          }`}
        >
          {habit.name}
        </h3>
        
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-text">
          <span className="flex items-center gap-1" data-testid={`habit-streak-${slug}`}>
            <Flame size={14} className={streak > 0 && !completed ? "text-brand-orange" : ""} />
            {streak} day streak
          </span>
        </div>

        {/* Edit / Delete Controls (Appear subtly under text) */}
        <div className="flex items-center gap-3 mt-2.5">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDelete(habit)}
                data-testid="confirm-delete-button"
                className="px-3 py-1 bg-red-500 text-white text-[10px] uppercase tracking-wider font-bold rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1 bg-black/5 text-foreground text-[10px] uppercase tracking-wider font-bold rounded-lg"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => onEdit(habit)} 
                data-testid={`habit-edit-${slug}`}
                className="text-muted-text/60 hover:text-brand-orange transition-colors"
              >
                <Edit3 size={16} />
              </button>
              <button 
                onClick={() => setConfirmDelete(true)} 
                data-testid={`habit-delete-${slug}`}
                className="text-muted-text/60 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Action Toggle */}
      <button
        onClick={() => onToggle(habit)}
        data-testid={`habit-complete-${slug}`}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          completed
            ? "bg-muted-text text-white shadow-inner"
            : "border-[2.5px] border-brand-orange text-brand-orange hover:bg-brand-orange/10"
        }`}
      >
        {completed ? <Check size={28} strokeWidth={3} /> : <Plus size={28} strokeWidth={3} />}
      </button>
    </article>
  );
}