import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        backgroundColor: isDark ? "#1a1a1a" : "#111827",
        border: isDark ? "2px solid rgba(255,255,255,0.15)" : "2px solid rgba(0,0,0,0.1)",
        boxShadow: isDark
          ? "0 4px 20px rgba(0,0,0,0.5)"
          : "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-[#ff6b35]" />
      ) : (
        <Moon className="w-6 h-6 text-white" />
      )}
    </button>
  );
}
