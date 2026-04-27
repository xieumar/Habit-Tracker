"use client";

import { useState, FormEvent, useEffect } from "react";
import { X, Settings, Edit2, Calendar as CalendarIcon, Bell } from "lucide-react";
import type { Habit } from "@/types/habit";
import { validateHabitName } from "@/lib/validators";

interface HabitFormProps {
  initial?: Habit;
  onSave: (data: { name: string; description: string; frequency: "daily" }) => void;
  onCancel: () => void;
}

export default function HabitForm({ initial, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [nameError, setNameError] = useState<string | null>(null);

  // Prevent background scrolling when form is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateHabitName(name);

    if (!validation.valid) {
      setNameError(validation.error);
      return;
    }

    setNameError(null);
    onSave({ name: validation.value, description: description.trim(), frequency: "daily" });
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-0 lg:p-6 animate-in fade-in duration-200">
      
      {/* Container: 
        - Mobile: Full viewport height (100dvh).
        - Desktop: Max height accounts for padding (calc(100vh - 3rem)).
        - overflow-hidden ensures the border radius stays clean while the inside scrolls.
      */}
      <div className="w-full h-[100dvh] lg:h-auto lg:max-h-[calc(100vh-3rem)] lg:max-w-md bg-background flex flex-col lg:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        
        {/* Top Bar (Pinned to top) */}
        <div className="px-6 py-5 flex-shrink-0 flex items-center justify-between border-b lg:border-none border-border bg-background lg:pt-6">
          <button onClick={onCancel} className="flex items-center gap-2 text-brand-orange lg:text-foreground font-bold text-lg lg:hover:text-brand-orange transition-colors">
            <X size={24} strokeWidth={2.5} />
            <span className="lg:hidden">HabitFlow</span>
          </button>
          <button className="text-muted-text hover:text-foreground transition-colors">
            <Settings size={24} />
          </button>
        </div>

        {/* Content Area (Scrollable part) */}
        <div className="p-6 pt-2 lg:pt-0 flex-1 overflow-y-auto space-y-8 bg-background">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {initial ? "Edit Habit" : "Create Habit"}
            </h2>
            <p className="text-muted-text text-sm">
              Small steps lead to great changes. Define your next positive ritual.
            </p>
          </div>

          <form id="habit-form" data-testid="habit-form" onSubmit={handleSubmit} noValidate className="space-y-6">
            
            {/* Habit Name */}
            <div>
              <label className="block text-xs font-bold text-muted-text uppercase tracking-wider mb-2 ml-1">
                Habit Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  className="w-full bg-card border border-border rounded-2xl py-4 pl-5 pr-12 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all placeholder:text-muted-text/50 font-medium"
                  placeholder="e.g., Morning Meditation"
                  maxLength={80}
                  autoFocus
                  data-testid="habit-name-input"
                />
                <Edit2 className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-orange w-5 h-5 pointer-events-none" />
              </div>
              {nameError && (
                <p className="mt-2 text-xs font-semibold text-red-500 ml-1">{nameError}</p>
              )}
            </div>

            {/* Fake Frequency Toggle */}
            <div>
              <label className="block text-xs font-bold text-muted-text uppercase tracking-wider mb-2 ml-1">
                Frequency
              </label>
              <div className="grid grid-cols-2 gap-3" data-testid="habit-frequency-select">
                <button type="button" className="py-4 border-2 border-brand-orange bg-brand-orange/5 text-brand-orange font-bold rounded-2xl flex flex-col items-center gap-1">
                  <CalendarIcon size={20} />
                  Daily
                </button>
                <button type="button" className="py-4 border border-border bg-card text-muted-text font-bold rounded-2xl flex flex-col items-center gap-1 cursor-not-allowed opacity-60">
                  <CalendarIcon size={20} />
                  Weekly
                </button>
              </div>
            </div>

            {/* Description / Notes */}
            <div>
              <label className="block text-xs font-bold text-muted-text uppercase tracking-wider mb-2 ml-1">
                Reminder Notes
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 text-muted-text pointer-events-none">
                  <Bell size={20} />
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-5 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all placeholder:text-muted-text/50 font-medium resize-none"
                  placeholder="Any details or specific times?"
                  data-testid="habit-description-input"
                />
              </div>
            </div>

            {/* Inspirational Bottom image */}
            <div className="relative rounded-2xl overflow-hidden h-28 lg:h-32 border border-border shadow-sm hidden sm:block shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" 
                alt="Zen Garden" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
                <p className="text-white font-bold text-sm leading-tight text-center w-full">
                  "The secret of your future is hidden in your daily routine."
                </p>
              </div>
            </div>

          </form>
        </div>

        {/* Bottom Actions (Pinned to bottom) */}
        <div className="p-6 pt-4 flex-shrink-0 bg-background border-t border-border grid grid-cols-2 gap-4 pb-safe">
          <button
            type="button"
            onClick={onCancel}
            className="py-4 bg-card border border-border rounded-2xl font-bold text-foreground shadow-sm hover:bg-black/5 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="habit-form"
            data-testid="habit-save-button"
            className="py-4 bg-brand-orange text-white rounded-2xl font-bold shadow-lg shadow-brand-orange/20 hover:bg-[#E78C4B] transition active:scale-95"
          >
            Save Habit
          </button>
        </div>

      </div>
    </div>
  );
}