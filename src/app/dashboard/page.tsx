"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Sun, Search, Bell, Calendar, Plus, TrendingUp,
  LayoutDashboard, ListTodo, BarChart3, Users, Settings
} from "lucide-react";
import type { Habit } from "@/types/habit";
import HabitForm from "@/components/habits/HabitForm";
import HabitList from "@/components/habits/HabitList";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { getHabitsForUser, saveHabits, getHabits } from "@/lib/storage";
import { logOut } from "@/lib/auth";
import { toggleHabitCompletion } from "@/lib/habits"; 

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {(session) => <DashboardContent session={session} />}
    </ProtectedRoute>
  );
}

function DashboardContent({ session }: { session: any }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [today] = useState(getToday);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    setHabits(getHabitsForUser(session.userId));
  }, [session.userId]);

  const persistHabits = useCallback(
    (updated: Habit[]) => {
      const all = getHabits().filter((h) => h.userId !== session.userId);
      saveHabits([...all, ...updated]);
      setHabits(updated);
    },
    [session.userId]
  );

  function handleCreate(data: { name: string; description: string; frequency: "daily" }) {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name: data.name,
      description: data.description,
      frequency: "daily",
      createdAt: new Date().toISOString(),
      completions: [],
    };
    persistHabits([...habits, newHabit]);
    setShowForm(false);
  }

  function handleEdit(data: { name: string; description: string; frequency: "daily" }) {
    if (!editingHabit) return;
    const updated = habits.map((h) =>
      h.id === editingHabit.id
        ? { ...editingHabit, name: data.name, description: data.description }
        : h
    );
    persistHabits(updated);
    setEditingHabit(null);
  }

  function handleDelete(habit: Habit) {
    persistHabits(habits.filter((h) => h.id !== habit.id));
  }

  function handleToggle(habit: Habit) {
    const updated = habits.map((h) =>
      h.id === habit.id ? toggleHabitCompletion(h, today) : h
    );
    persistHabits(updated);
  }

  function handleLogout() {
    logOut();
    window.location.href = "/login";
  }

  const activeForm = showForm || editingHabit !== null;

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-background font-sans flex">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-background border-r border-border p-6 z-20">
        <div className="flex flex-col gap-1 mb-12">
          <div className="text-brand-orange font-bold text-2xl flex items-center gap-2">
            Sunrise Habits
          </div>
          <p className="text-[10px] text-muted-text uppercase tracking-widest font-bold">Rise and shine</p>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard" },
            { icon: ListTodo, label: "Habits", active: true },
            { icon: BarChart3, label: "Statistics" },
            { icon: Users, label: "Community" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                item.active
                  ? "bg-brand-orange/10 text-brand-orange border-r-4 border-brand-orange"
                  : "text-muted-text hover:bg-black/5 hover:text-foreground"
              }`}
            >
              <item.icon size={20} strokeWidth={2.5} />
              {item.label}
            </button>
          ))}
        </nav>

        <button
          data-testid="create-habit-button"
          onClick={() => setShowForm(true)}
          className="mt-auto w-full bg-brand-orange text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-brand-orange/20 hover:bg-[#E78C4B] transition active:scale-95"
        >
          Log New Habit
        </button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col lg:pl-64 relative min-w-0">

        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b lg:border-none border-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between lg:justify-end gap-6">

            <div className="lg:hidden flex items-center gap-2 text-brand-orange font-bold text-xl tracking-tight">
              <Sun strokeWidth={2.5} />
              HabitFlow
            </div>

            <div className="hidden lg:flex flex-1 max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text w-4 h-4" />
              <input
                type="text"
                placeholder="Search habits..."
                className="w-full bg-card border border-border rounded-full py-2.5 pl-11 pr-4 text-sm text-foreground focus:outline-none focus:border-brand-orange transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 lg:gap-5 text-muted-text">
              <button className="hidden lg:block hover:text-foreground transition"><Bell size={20} /></button>
              <button className="hidden lg:block hover:text-foreground transition"><Calendar size={20} /></button>
              <button
                data-testid="auth-logout-button"
                onClick={handleLogout}
                title="Log Out"
                className="w-10 h-10 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground font-bold hover:bg-black/5 transition cursor-pointer"
              >
                {session?.email?.charAt(0).toUpperCase() ?? "U"}
              </button>
            </div>
          </div>
        </header>

        <main className="w-full max-w-md lg:max-w-5xl mx-auto px-6 py-4 lg:py-8 space-y-8 flex-1">

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-muted-text text-sm font-medium mb-1">
                {new Date(today + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "long", month: "short", day: "numeric",
                })}
              </p>
              <h1 className="text-3xl font-bold text-foreground">Today's Focus</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              aria-label="New habit"
              className="lg:hidden shrink-0 flex items-center gap-1.5 bg-brand-orange text-white px-4 py-2.5 rounded-2xl font-bold shadow-lg hover:bg-[#E78C4B] transition active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} /> New
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-[2rem] p-5 border border-border flex flex-col justify-between h-36 lg:h-40 shadow-sm">
              <TrendingUp className="text-brand-orange w-6 h-6" />
              <div>
                <p className="text-xs text-muted-text font-bold uppercase tracking-wider mb-1">Daily Score</p>
                <p className="text-2xl font-bold text-foreground">84%</p>
              </div>
            </div>
            <div className="bg-brand-orange rounded-[2rem] p-5 text-white flex flex-col justify-between h-36 lg:h-40 shadow-lg shadow-brand-orange/20">
              <Sun className="w-6 h-6 text-white" />
              <div>
                <p className="text-xs text-white/80 font-bold uppercase tracking-wider mb-1">Next Reward</p>
                <p className="text-2xl font-bold">Level 4</p>
              </div>
            </div>
            <div className="hidden lg:flex bg-card rounded-[2rem] p-5 border border-border flex-col justify-between h-40 shadow-sm">
              <ListTodo className="text-brand-orange w-6 h-6" />
              <div>
                <p className="text-xs text-muted-text font-bold uppercase tracking-wider mb-1">Active Habits</p>
                <p className="text-2xl font-bold text-foreground">{habits.length}</p>
              </div>
            </div>
            <div className="hidden lg:flex bg-card rounded-[2rem] p-5 border border-border flex-col justify-between h-40 shadow-sm">
              <Calendar className="text-brand-orange w-6 h-6" />
              <div>
                <p className="text-xs text-muted-text font-bold uppercase tracking-wider mb-1">Perfect Days</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
            </div>
          </div>

          <HabitList 
            habits={habits}
            today={today}
            onToggle={handleToggle}
            onEdit={(h) => setEditingHabit(h)}
            onDelete={handleDelete}
          />

          <div className="relative rounded-[2rem] overflow-hidden h-40 lg:h-56 shadow-sm border border-border group">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"
              alt="Meditation"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 lg:p-8 flex items-end">
              <p className="text-white font-bold text-lg lg:text-2xl leading-tight w-3/4">
                "Small steps everyday lead to big results."
              </p>
            </div>
          </div>

        </main>
      </div>

      {activeForm && (
        <HabitForm
          initial={editingHabit || undefined}
          onSave={editingHabit ? handleEdit : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingHabit(null);
          }}
        />
      )}
    </div>
  );
}