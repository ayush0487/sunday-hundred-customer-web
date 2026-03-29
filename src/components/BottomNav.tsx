import { Home, Grid3X3, Bookmark, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const items = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Grid3X3, label: "Categories", path: "/categories" },
  // { icon: Bookmark, label: "Saved", path: "/profile" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const { pathname } = useRouter();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={`${item.path}-${item.label}`}
              href={item.path}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
