"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const tab = searchParams?.get("tab");

  if (pathname === "/" || pathname === "/leaderboard" || pathname === "/dashboard" || pathname === "/matches" || pathname === "/calendar" || pathname === "/predictions" || pathname === "/faq" || pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return null;
  }

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

  return (
    <aside className="h-screen w-64 hidden md:flex flex-col sticky top-0 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-r border-white/10 py-12 px-4 z-50">
      <div className="mb-10">
        <Link href="/" className="hover:opacity-90 transition-all">
          <h1 className="text-2xl font-black text-primary leading-none tracking-tight">Polla Mundialista</h1>
          <p className="text-xs text-on-surface-variant mt-1 font-semibold">Quiniela del Mundial</p>
        </Link>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active
                  ? "text-primary font-bold border-r-4 border-primary bg-white/5"
                  : "text-on-surface-variant hover:bg-white/5 hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mb-6">
        <Link href="/predictions" className="block w-full">
          <button className="w-full py-3.5 bg-primary text-on-primary font-extrabold rounded-xl active:scale-95 duration-150 shadow-[0_0_20px_rgba(255,189,95,0.2)] hover:brightness-110 cursor-pointer text-center text-sm transition-all">
            New Prediction
          </button>
        </Link>
      </div>

      <div className="flex flex-col gap-1 border-t border-white/10 pt-6">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
            isActive("/settings")
              ? "text-primary font-bold"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-sm">settings</span>
          <span className="text-xs font-semibold">Settings</span>
        </Link>
        <Link
          href="/support"
          className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
            isActive("/support")
              ? "text-primary font-bold"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-sm">help</span>
          <span className="text-xs font-semibold">Support</span>
        </Link>
      </div>
    </aside>
  );
}
