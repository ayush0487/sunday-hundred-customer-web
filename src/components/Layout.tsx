import { ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";

export function Layout({ children }: { children: ReactNode }) {
  // Default to dark theme
  useEffect(() => {
    if (!document.documentElement.classList.contains("dark") && !document.documentElement.classList.contains("light-set")) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
