"use client";

import React from "react";

export default function AdminSidebar({
  activePanel,
  setActivePanel,
  sidebarOpen,
  setSidebarOpen,
  missingNotifCount,
  onLogout,
  theme,
  onToggleTheme
}) {
  const menuItems = [
    { 
      id: "marcadores", 
      label: "Marcadores", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <line x1="3" x2="21" y1="9" y2="9"/>
          <line x1="9" x2="9" y1="21" y2="9"/>
        </svg>
      ) 
    },
    { 
      id: "reglas", 
      label: "Reglas", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="12" y2="12"/>
          <line x1="4" x2="20" y1="6" y2="6"/>
          <line x1="4" x2="20" y1="18" y2="18"/>
        </svg>
      ) 
    },
    { 
      id: "calendario", 
      label: "Calendario", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
      ) 
    },
    { 
      id: "ranking", 
      label: "Ranking", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/>
          <path d="M12 2a6 6 0 0 1 6 6v3.34a6 6 0 0 1-3.62 5.5l-2.38.83-2.38-.83A6 6 0 0 1 6 11.34V8a6 6 0 0 1 6-6z"/>
        </svg>
      ) 
    },
    { 
      id: "notif", 
      label: "Notificaciones", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
      ), 
      badge: missingNotifCount > 0 ? missingNotifCount : null 
    },
    { 
      id: "motor", 
      label: "Motor de Puntos", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="16" x="4" y="4" rx="2"/>
          <rect width="6" height="6" x="9" y="9"/>
          <path d="M9 1v3"/>
          <path d="M15 1v3"/>
          <path d="M9 20v3"/>
          <path d="M15 20v3"/>
          <path d="M20 9h3"/>
          <path d="M20 15h3"/>
          <path d="M1 9h3"/>
          <path d="M1 15h3"/>
        </svg>
      ) 
    },
  ];

  return (
    <nav className={`sidebar ${sidebarOpen ? "open" : ""}`} id="sidebar">
      <div className="sb-head">
        <div className="sb-logo">Polla <em>Mundialista</em></div>
        <span className="sb-adm">ADMIN</span>
      </div>
      
      <div className="sb-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sb-btn ${activePanel === item.id ? "active" : ""}`}
            onClick={() => {
              setActivePanel(item.id);
              setSidebarOpen(false);
            }}
            type="button"
          >
            <span className="sb-ico">{item.icon}</span>
            {item.label}
            {item.badge !== null && <span className="sb-cnt">{item.badge}</span>}
          </button>
        ))}
      </div>

      <div className="sb-foot">
        {/* Theme Toggle Button */}
        <button 
          onClick={onToggleTheme} 
          className="sb-btn" 
          style={{ 
            marginBottom: "12px", 
            border: "1px solid var(--border)", 
            justifyContent: "center",
            background: "var(--sb-hover-bg)"
          }}
          type="button"
        >
          <span className="sb-ico">
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </span>
          {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
        </button>

        <div className="sb-user">
          <div className="sb-av" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--purple)" }}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <polyline points="16 11 18 13 22 9"/>
            </svg>
          </div>
          <div>
            <div className="sb-name">Super Admin</div>
            <div className="sb-role">Organizador</div>
          </div>
          <button className="logout" onClick={onLogout} type="button">Salir</button>
        </div>
      </div>
    </nav>
  );
}
