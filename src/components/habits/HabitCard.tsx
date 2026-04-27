"use client";

import { useState } from "react";
import type { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { Check, Plus, Edit3, Trash2, Droplets, Flame, Sun } from "lucide-react";

import ConfirmationModal from "@/components/shared/ConfirmationModal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const completed = habit.completions.includes(today);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`group relative rounded-[2.5rem] p-6 transition-all duration-500 flex flex-col sm:flex-row sm:items-center gap-6 ${
        completed
          ? "bg-[#e6d5c5] shadow-inner"
          : "bg-[#ede1d5] shadow-sm hover:shadow-md hover:bg-[#e6d5c5]/80"
      }`}
    >
      {/* Icon Badge */}
      <div 
        className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
          completed 
            ? "bg-white text-brand-orange" 
            : "bg-white text-[#d4b9a1] group-hover:text-brand-orange shadow-sm"
        }`}
      >
        {habit.name.toLowerCase().includes('hydrate') || habit.name.toLowerCase().includes('water') ? (
          <Droplets size={28} strokeWidth={2.5} />
        ) : habit.name.toLowerCase().includes('meditate') || habit.name.toLowerCase().includes('zen') ? (
          <Sun size={28} strokeWidth={2.5} />
        ) : (
          <Flame size={28} strokeWidth={2.5} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3
            className={`font-bold text-lg truncate transition-colors ${
              completed ? "text-[#6d5b4b]" : "text-[#4a3a2e]"
            }`}
          >
            {habit.name}
          </h3>
          
          {/* Subtle Controls */}
          <div className="lg:opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
            <button 
              onClick={() => onEdit(habit)} 
              data-testid={`habit-edit-${slug}`}
              className="p-1.5 text-[#b89a81] hover:text-brand-orange transition-colors"
            >
              <Edit3 size={14} />
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)} 
              data-testid={`habit-delete-${slug}`}
              className="p-1.5 text-[#b89a81] hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        
        <p className="text-xs font-bold text-[#b89a81] uppercase tracking-wider mb-2">
          {habit.description || `Goal: ${habit.frequency === 'daily' ? 'Once' : 'Multiple times'} / Day`}
        </p>

        <div className="flex items-center gap-2 text-[10px] font-bold text-brand-orange uppercase tracking-widest">
          <Flame size={12} className={streak > 0 ? "fill-brand-orange" : ""} />
          <span data-testid={`habit-streak-${slug}`}>{streak} Day Streak</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onToggle(habit)}
        data-testid={`habit-complete-${slug}`}
        className={`px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-500 whitespace-nowrap ${
          completed
            ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20"
            : "bg-white text-[#4a3a2e] hover:bg-brand-orange hover:text-white shadow-sm"
        }`}
      >
        {completed ? (
          <>
            <Check size={18} strokeWidth={3} />
            Completed
          </>
        ) : (
          <>
            <Plus size={18} strokeWidth={3} />
            {habit.name.toLowerCase().includes('hydrate') ? 'Log Intake' : 'Mark Done'}
          </>
        )}
      </button>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(habit);
          setShowDeleteModal(false);
        }}
        title="Delete Habit"
        message={`Are you sure you want to delete "${habit.name}"? This action cannot be undone and you will lose your streak.`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </article>
  );
}