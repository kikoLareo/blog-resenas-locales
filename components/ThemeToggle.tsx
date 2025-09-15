"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ThemeToggle({ 
  className = "", 
  variant = 'default',
  size = 'md',
  showLabel = false 
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost" 
        size={size}
        className={className}
        disabled
      >
        <div className="h-4 w-4 animate-pulse bg-neutral-300 rounded" />
        {showLabel && <span className="sr-only">Cambiando tema...</span>}
      </Button>
    );
  }

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-all duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${className}`}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
        ) : (
          <Moon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
        )}
      </button>
    );
  }

  if (variant === 'floating') {
    return (
      <button
        onClick={toggleTheme}
        className={`fixed bottom-6 right-6 z-50 p-3 bg-saffron-500 hover:bg-saffron-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${className}`}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {isDark ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleTheme}
      className={`transition-all duration-300 ${className}`}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <Moon className="h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
      {showLabel && (
        <span className="ml-2">
          {isDark ? 'Modo claro' : 'Modo oscuro'}
        </span>
      )}
    </Button>
  );
}
