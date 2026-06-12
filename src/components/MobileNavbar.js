"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function MobileNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const tab = searchParams?.get("tab");

  const navItems = [
    { name: "Home", href: "/dashboard", icon: "home" },
    { name: "Calendar", href: "/calendar", icon: "calendar_today" },
    { name: "Ranking", href: "/dashboard?tab=ranking", icon: "leaderboard" },
    { name: "Rules", href: "/rules", icon: "gavel" },
  ];

  if (user?.isAdmin) {
    navItems.push({ name: "Admin", href: "/admin", icon: "shield" });
  }

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" && tab !== "ranking";
    }
    if (href === "/dashboard?tab=ranking") {
      return pathname === "/dashboard" && tab === "ranking";
    }
    return pathname.startsWith(href);
  };

  if (pathname === "/" || pathname === "/leaderboard" || pathname === "/dashboard" || pathname === "/matches" || pathname === "/calendar" || pathname.startsWith("/admin") || !user) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-6 bg-surface/90 backdrop-blur-2xl border-t border-white/20 z-50">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 active:scale-90 ${
              active
                ? "bg-primary/20 text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span className="text-[10px] uppercase tracking-wider mt-1 font-mono">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
