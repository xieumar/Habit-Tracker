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

  const completionRate = habits.length > 0 
    ? Math.round((habits.filter(h => h.completions.includes(today)).length / habits.length) * 100) 
    : 0;

  return (
    <div data-testid="dashboard-page" className="bg-[#f8f1eb] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="relative flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#d4b9a1]">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search habits or goals..." 
              className="w-full bg-white/60 border-none rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-brand-orange/20 text-[#6d5b4b] placeholder:text-[#d4b9a1] shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[#6d5b4b]">
              <button className="p-2.5 bg-white/60 rounded-xl hover:bg-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2.5 bg-white/60 rounded-xl hover:bg-white transition-colors">
                <Calendar className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-10 w-[1px] bg-[#e6d5c5] hidden md:block" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#4a3a2e]">Hello, {session?.email?.split('@')[0] ?? "Alex"}</p>
                <p className="text-[10px] font-bold text-[#b89a81] uppercase tracking-wider">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-11 h-11 rounded-2xl bg-brand-orange flex items-center justify-center text-white font-bold shadow-lg shadow-brand-orange/20 hover:scale-105 transition-transform"
                title="Sign Out"
              >
                {session?.email?.charAt(0).toUpperCase() ?? "U"}
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          
          {/* Main Content: Habits */}
          <main className="space-y-10">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#4a3a2e]">Today's Focus</h2>
                <button 
                  onClick={() => setShowForm(true)}
                  className="text-xs font-bold text-brand-orange hover:underline uppercase tracking-wider flex items-center gap-1"
                >
                  <Plus size={14} strokeWidth={3} /> Log New Habit
                </button>
              </div>

              <HabitList 
                habits={habits}
                today={today}
                onToggle={handleToggle}
                onEdit={setEditingHabit}
                onDelete={handleDelete}
              />
            </div>

            {/* Inspiration Banner */}
            <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-xl group">
              <img 
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                alt="Forest background"
              />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="mb-4">
                  <svg className="w-8 h-8 text-white/40" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H7.1c.5-2.2 2.5-4 4.9-4V8H10zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6.9c.5-2.2 2.5-4 4.9-4V8h-2z" />
                  </svg>
                </div>
                <blockquote className="text-2xl font-medium text-white max-w-xl leading-relaxed">
                  "The secret of your future is hidden in your daily routine."
                </blockquote>
                <cite className="text-white/60 text-sm font-bold mt-2 block not-italic">— Mike Murdock</cite>
              </div>
            </div>
          </main>

          {/* Sidebar Stats Area */}
          <aside className="space-y-6">
            {/* Daily Score */}
            <div className="bg-[#ede1d5] rounded-[2.5rem] p-8 text-center shadow-sm">
              <h3 className="text-sm font-bold text-[#4a3a2e] uppercase tracking-widest mb-8">Daily Score</h3>
              <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="#f8f1eb" strokeWidth="16" fill="transparent" />
                  <circle 
                    cx="96" cy="96" r="80" stroke="#e85d2f" strokeWidth="16" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - completionRate / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-[#4a3a2e]">{completionRate}%</span>
                  <span className="text-[10px] font-bold text-[#b89a81] uppercase tracking-widest">Progress</span>
                </div>
              </div>
              <p className="text-sm font-medium text-[#6d5b4b] leading-relaxed">
                {completionRate === 100 
                  ? "You've hit your daily peak! Keep the momentum going." 
                  : `You're ${habits.length - habits.filter(h => h.completions.includes(today)).length} habits away from hitting your daily peak!`}
              </p>
            </div>

            {/* Next Reward */}
            <div className="bg-[#ede1d5] rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-[#4a3a2e] uppercase tracking-widest">Next Reward</h3>
                <div className="w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center text-brand-orange">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 flex items-center gap-4 mb-4 shadow-sm">
                <div className="w-12 h-12 bg-[#f8f1eb] rounded-xl flex items-center justify-center text-brand-orange">
                  <Sun size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#4a3a2e]">Premium Coffee Bean</p>
                  <div className="h-1.5 w-full bg-[#f8f1eb] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-brand-orange w-3/4 rounded-full" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-bold text-[#b89a81] uppercase tracking-widest text-center">150 / 200 XP points until unlock</p>
            </div>

            {/* Week Overview */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-sm font-bold text-[#4a3a2e] uppercase tracking-widest mb-6">Week Overview</h3>
              <div className="flex justify-between items-end gap-2 h-12">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${i < 5 ? 'bg-brand-orange/20' : 'bg-[#f8f1eb]'} ${i === 2 ? 'bg-brand-orange/80' : ''}`} />
                    <span className="text-[10px] font-bold text-[#b89a81]">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Action Button for Mobile */}
            <button 
              onClick={() => setShowForm(true)}
              className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-orange text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-40"
              data-testid="create-habit-button"
            >
              <Plus size={28} />
            </button>
          </aside>
        </div>
      </div>

      {showForm || editingHabit ? (
        <HabitForm
          initial={editingHabit || undefined}
          onSave={editingHabit ? handleEdit : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingHabit(null);
          }}
        />
      ) : null}
    </div>
  );
}