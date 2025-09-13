"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function DarkModeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button 
        className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${className}`}
        disabled
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5 bg-muted-foreground/20 rounded animate-pulse" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        group relative w-10 h-10 rounded-lg
        bg-background border border-border 
        hover:bg-muted hover:border-muted-foreground/20
        focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        transition-all duration-200 ease-in-out
        flex items-center justify-center
        ${className}
      `}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun
          className={`
            absolute inset-0 w-5 h-5 text-muted-foreground
            transition-all duration-300 ease-in-out
            ${isDark 
              ? 'opacity-0 rotate-90 scale-50' 
              : 'opacity-100 rotate-0 scale-100'
            }
          `}
        />
        
        {/* Moon Icon */}
        <Moon
          className={`
            absolute inset-0 w-5 h-5 text-muted-foreground
            transition-all duration-300 ease-in-out
            ${isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-50'
            }
          `}
        />
      </div>
      
      {/* Tooltip */}
      <span className="
        absolute -bottom-8 left-1/2 -translate-x-1/2
        px-2 py-1 rounded bg-foreground text-background text-xs font-medium
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none whitespace-nowrap
      ">
        {isDark ? "Modo claro" : "Modo oscuro"}
      </span>
    </button>
  );
}