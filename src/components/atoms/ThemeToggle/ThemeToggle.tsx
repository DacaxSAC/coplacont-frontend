import { useContext } from "react";
import { ThemeContext } from "@/shared/context/ThemeProvider";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  if (!theme || !toggleTheme) {
    return null;
  }

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};
