import { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";

interface ThemeProviderProps {
  children: JSX.Element | JSX.Element[];
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Verificar preferencia del sistema
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    setTheme(storedTheme || systemPreference);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <div data-theme={theme}>
      {typeof children === "function" ? children({ theme, toggleTheme }) : children}
    </div>
  );
} 