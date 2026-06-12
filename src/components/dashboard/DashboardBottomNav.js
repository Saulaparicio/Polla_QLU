"use client";

import { useTheme } from "@/context/ThemeContext";

export default function DashboardBottomNav({
  activeTab,
  setActiveTab,
  upcomingMatchesCount,
  router
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bottom-nav">
      <button 
        onClick={() => setActiveTab("today")}
        className={`bnav-item ${activeTab === "today" ? "active" : ""}`}
      >
        <span className="bnav-icon">⚽</span>
        <span>Hoy</span>
      </button>
      <button 
        onClick={() => setActiveTab("upcoming")}
        className={`bnav-item ${activeTab === "upcoming" ? "active" : ""}`}
      >
        <span className="bnav-icon">📅</span>
        <span>Próximos</span>
        {upcomingMatchesCount > 0 && (
          <span className="bnav-badge">{upcomingMatchesCount}</span>
        )}
      </button>
      <button 
        onClick={() => router.push("/calendar")} // Wait, let's verify if the calendar path is "/calendar" or "/matches"
        className="bnav-item"
      >
        <span className="bnav-icon">🗓️</span>
        <span>Calendario</span>
      </button>
      <button 
        onClick={() => setActiveTab("history")}
        className={`bnav-item ${activeTab === "history" ? "active" : ""}`}
      >
        <span className="bnav-icon">📋</span>
        <span>Historial</span>
      </button>
      <button 
        onClick={() => setActiveTab("ranking")}
        className={`bnav-item ${activeTab === "ranking" ? "active" : ""}`}
      >
        <span className="bnav-icon">🏆</span>
        <span>Ranking</span>
      </button>
      <button 
        onClick={toggleTheme}
        className="bnav-item"
        aria-label="Toggle Theme"
      >
        <span className="bnav-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
        <span>{theme === "dark" ? "Claro" : "Oscuro"}</span>
      </button>
    </nav>
  );
}
