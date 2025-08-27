import { useContext } from "react";
import styles from "./ThemeToggle.module.scss";
import { ThemeContext } from "@/shared/context/ThemeContext";
import { Logo } from "@/components";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  if (!theme || !toggleTheme) {
    return null;
  }

  return (
    <div className={styles.themeToggle} onClick={toggleTheme}>
      <span className={styles.themeToggle__label}>Tema de color</span>
      <div className={styles.themeToggle__icons}>
        <Logo src="/assets/sidebar/sun.svg" size={24} />
        <Logo src="/assets/sidebar/moon.svg" size={24} />
      </div>
    </div>
  );
};
