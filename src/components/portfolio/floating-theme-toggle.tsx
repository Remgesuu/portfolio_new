"use client";

import { useTheme } from "./theme-provider";
import styles from "./floating-theme-toggle.module.css";

export function FloatingThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  const getIcon = () => {
    if (theme === "system") {
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M9 5V9L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (theme === "light") {
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 1.5V3M9 15V16.5M16.5 9H15M3 9H1.5M14.3 3.7L13.2 4.8M4.8 13.2L3.7 14.3M14.3 14.3L13.2 13.2M4.8 4.8L3.7 3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M15.5 10.5C14.5 13.5 11.5 15.5 8 15C4.5 14.5 2 11.5 2.5 8C3 4.5 6 2 9.5 2.5C7 4 6.5 7.5 8.5 10C10.5 12.5 14 12.5 15.5 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const getLabel = () => {
    if (theme === "system") return "Auto";
    if (theme === "light") return "Light";
    return "Dark";
  };

  return (
    <button
      onClick={cycleTheme}
      className={styles.button}
      aria-label={`Current theme: ${getLabel()}. Click to change theme.`}
      type="button"
    >
      {getIcon()}
      <span className={styles.label}>{getLabel()}</span>
    </button>
  );
}
