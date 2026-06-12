"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Trophy, Calendar, Shield, LogOut, LogIn, User, Sparkles } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: "Partidos", href: "/matches", icon: Calendar },
    { name: "Pronósticos", href: "/predictions", icon: Trophy, authRequired: true },
    { name: "Ranking", href: "/dashboard", icon: Trophy },
  ];

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-surface-lowest/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-white text-lg tracking-wider hover:opacity-90 transition">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-orange-500 shadow-lg shadow-primary/20">
            <Trophy className="h-5 w-5 text-surface-lowest stroke-[2.5]" />
          </div>
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent font-extrabold uppercase">
            Polla <span className="text-primary font-extrabold">Digital</span>
          </span>
        </Link>
 
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            if (item.authRequired && !user) return null;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "text-primary drop-shadow-[0_0_8px_rgba(255,189,95,0.4)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 ${
                isActive("/admin")
                  ? "text-primary drop-shadow-[0_0_8px_rgba(255,189,95,0.4)]"
                  : "text-zinc-400 hover:text-primary"
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>
 
        {/* Auth / User Control */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* User Points Badge */}
              <div className="flex items-center gap-1.5 rounded-full bg-surface-low border border-primary/30 px-3.5 py-1 text-xs font-bold text-primary font-mono shadow-inner">
                <Sparkles className="h-3 w-3 animate-pulse text-primary" />
                <span>{user.points || 0} Pts</span>
              </div>
 
              {/* User Menu */}
              <div className="flex items-center gap-2 group relative">
                <div className="flex items-center gap-2 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-surface-high/50 transition border border-transparent hover:border-white/5">
                  <div className="h-7 w-7 rounded-full bg-surface-high flex items-center justify-center border border-zinc-700">
                    <User className="h-4 w-4 text-zinc-300" />
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold text-zinc-200">
                    {user.displayName}
                  </span>
                </div>
                
                <button
                  onClick={logout}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-surface-high/50 rounded-lg transition"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-orange-500 text-surface-lowest hover:opacity-90 px-4 py-2 text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 transition duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <LogIn className="h-4 w-4" />
                <span>Ingresar</span>
              </Link>
            </div>
          )}
        </div>
      </div>
 
      {/* Mobile Nav Bar */}
      <div className="flex md:hidden border-t border-white/5 bg-surface-lowest/90 px-4 py-2 justify-around">
        {navItems.map((item) => {
          if (item.authRequired && !user) return null;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center text-[10px] font-medium transition-all ${
                active ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <item.icon className="h-5 w-5 mb-0.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
        {user?.isAdmin && (
          <Link
            href="/admin"
            className={`flex flex-col items-center text-[10px] font-medium transition-all ${
              isActive("/admin") ? "text-primary" : "text-zinc-500 hover:text-primary"
            }`}
          >
            <Shield className="h-5 w-5 mb-0.5" />
            <span>Admin</span>
          </Link>
        )}
      </div>
    </header>
  );
}

