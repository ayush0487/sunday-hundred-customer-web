import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5 text-foreground" />}
    </button>
  );
}
