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
      className="fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 bg-[var(--cy-bg-card)] border border-[var(--cy-border-strong)] text-[var(--cy-text)] hover:shadow-xl"
      style={{ backdropFilter: "blur(12px)" }}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[#ff6b35]" />
      ) : (
        <Moon className="w-5 h-5 text-[#ff6b35]" />
      )}
    </button>
  );
}
