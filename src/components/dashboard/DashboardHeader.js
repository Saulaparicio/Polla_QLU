"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

// Helper: Deterministic Avatar Emoji
function getAvatarEmoji(name, uid) {
  const n = (name || "").toLowerCase();
  if (n.includes("leon")) return "🦁";
  if (n.includes("agui")) return "🦅";
  if (n.includes("pintor") || n.includes("pitero")) return "🐆";
  if (n.includes("delfin")) return "🐬";
  if (n.includes("zorro")) return "🦊";
  if (n.includes("tú") || n.includes("tu") || n.includes("aquí")) return "⚡";

  const key = uid || name || "default";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const emojis = ["🦁", "🦅", "🐆", "🐬", "🦊", "🐯", "🐼", "🐻", "🐨", "🐺", "🦖", "🐉", "🦈", "🐙", "🐵", "🦄"];
  const index = Math.abs(hash) % emojis.length;
  return emojis[index];
}

export default function DashboardHeader({
  activeTab,
  setActiveTab,
  user,
  userRank,
  todayMatchesCount,
  logout,
  router
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <Link href="/dashboard" className="h-logo">
        <span className="h-logo-icon">⚽</span>
        <span className="h-logo-text">PRODE<em>26</em></span>
      </Link>
      <div className="h-divider"></div>
      <div className="h-tabs">
        <button 
          onClick={() => setActiveTab("today")}
          className={`h-tab ${activeTab === "today" ? "active" : ""}`}
        >
          Hoy {todayMatchesCount > 0 && <span className="tab-badge">{todayMatchesCount}</span>}
        </button>
        <button 
          onClick={() => setActiveTab("upcoming")}
          className={`h-tab ${activeTab === "upcoming" ? "active" : ""}`}
        >
          Próximos
        </button>
        <Link href="/calendar" className="h-tab">
          Calendario
        </Link>
        <button 
          onClick={() => setActiveTab("history")}
          className={`h-tab ${activeTab === "history" ? "active" : ""}`}
        >
          Mis Pronósticos
        </button>
        <button 
          onClick={() => setActiveTab("ranking")}
          className={`h-tab ${activeTab === "ranking" ? "active" : ""}`}
        >
          Ranking
        </button>
      </div>
      <div className="h-user">
        {user.isAdmin && (
          <Link 
            href="/admin" 
            className="text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-500 px-3 py-1.5 rounded hover:bg-amber-500/20 font-bold transition-all"
            style={{ marginRight: 6 }}
          >
            🛠 Admin
          </Link>
        )}
        <div className="h-points">
          <span className="h-points-val">{user.points || 0}</span>
          <span className="h-points-lbl">pts</span>
        </div>
        <div className="h-rank">
          <span className="h-rank-label">Rank</span>
          <span className="h-rank-val">{userRank}</span>
        </div>
        <div className="h-avatar">{getAvatarEmoji(user.displayName, user.uid)}</div>
        <span className="h-alias">@{user.displayName || user.email?.split("@")[0]}</span>
        
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200 cursor-pointer mr-2 ml-1"
          title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <svg className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="18.36" x2="5.64" y2="19.78"></line>
              <line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>

        <button 
          onClick={async () => {
            if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
              await logout();
              router.push("/");
            }
          }}
          className="text-xs text-[#5E7A9E] hover:text-red-400 font-bold ml-2 transition-colors cursor-pointer border border-[#1C2E48] hover:border-red-500/20 bg-transparent px-2.5 py-1.5 rounded-md"
        >
          Salir
        </button>
      </div>
    </header>
  );
}
