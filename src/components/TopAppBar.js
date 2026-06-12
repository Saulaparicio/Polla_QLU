"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";

export default function TopAppBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [rank, setRank] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchRank() {
      if (!user) return;
      try {
        const q = query(collection(db, "users"), orderBy("points", "desc"));
        const querySnapshot = await getDocs(q);
        let index = 1;
        querySnapshot.forEach((doc) => {
          if (doc.id === user.uid) {
            setRank(index);
          }
          index++;
        });
      } catch (error) {
        console.error("Error fetching user rank:", error);
      }
    }
    fetchRank();
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/calendar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      await logout();
      router.push("/auth");
    }
  };

  if (pathname === "/" || pathname === "/leaderboard" || pathname === "/dashboard" || pathname === "/matches" || pathname === "/calendar" || pathname.startsWith("/admin") || !user) return null;

  // Let's use a nice dynamic placeholder avatar if they don't have one
  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="flex justify-between items-center w-full px-6 md:px-12 py-4 sticky top-0 z-40 bg-surface/60 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-4">
        {/* Clickable Profile Avatar that leads to settings */}
        <div 
          onClick={() => router.push("/settings")}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary shadow-[0_0_10px_rgba(255,189,95,0.3)] bg-surface-high flex items-center justify-center font-bold text-primary cursor-pointer hover:scale-105 transition-all"
        >
          {user.photoURL ? (
            <img alt="User profile avatar" src={user.photoURL} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-black tracking-wider">{initials}</span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary leading-tight">¡Hola, {user.displayName || "Usuario"}!</h2>
          <div className="flex gap-4 mt-0.5">
            <span className="text-xs font-mono font-semibold text-primary glow-text">
              Points: {user.points !== undefined ? user.points.toLocaleString() : "0"}
            </span>
            <span className="text-xs font-mono font-semibold text-on-surface-variant">
              Rank: #{rank ? rank : "--"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center bg-surface-container rounded-full px-4 py-2 border border-white/10 focus-within:border-primary/50 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant mr-2 text-xl select-none">search</span>
          <input 
            className="bg-transparent border-none outline-none focus:ring-0 text-on-surface text-sm placeholder:text-on-surface-variant/40 w-60" 
            placeholder="Search matches..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-all text-xs font-bold cursor-pointer"
          title="Cerrar Sesión"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span className="hidden md:inline">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
}
