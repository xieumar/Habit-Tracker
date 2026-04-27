"use client";

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 flex flex-col items-center justify-center bg-background"
      aria-label="Loading Habit Tracker"
    >
      {/* Animated rings / Sun effect */}
      <div className="relative flex items-center justify-center mb-8">
        <span className="absolute inline-block w-24 h-24 rounded-full border-2 border-brand-orange opacity-20 animate-ping" />
        <span className="absolute inline-block w-16 h-16 rounded-full border-2 border-brand-orange opacity-40" />
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-orange text-background shadow-sunrise">
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
        </span>
      </div>

      <h1 className="font-sans text-4xl font-bold tracking-tight text-foreground">
        Habit Tracker
      </h1>
      <p className="mt-2 font-sans text-sm text-muted-text tracking-widest uppercase">
        Rise and shine
      </p>

      {/* Loading dots */}
      <div className="mt-12 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-brand-orange"
            style={{
              animation: "bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}