"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

// Helper: Deterministic Avatar Emoji or Custom Selection
function getAvatarEmoji(name, uid, customAvatar = null) {
  if (customAvatar) {
    if (customAvatar.startsWith("data:image/")) {
      return (
        <img 
          src={customAvatar} 
          alt="Avatar" 
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }} 
        />
      );
    }
    return customAvatar;
  }
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

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const handleTabClick = (tabId) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    } else {
      router.push(`/dashboard?tab=${tabId}`);
    }
  };

  const handleSelectAvatar = async (emoji) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        avatar: emoji
      });
      // Refresh local user state using window location reload or context refresh if we can.
      // Since refreshUser is not in the props, we can trigger window.location.reload() to pull latest firestore data.
      window.location.reload();
    } catch (err) {
      console.error("Error setting custom avatar:", err);
    } finally {
      setShowAvatarMenu(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen supera el límite de 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result;
        // The getAvatarEmoji checks if customAvatar is a base64 string or an emoji. Let's see.
        // We will render it inside getAvatarEmoji. Let's check how we render base64 or emoji in getAvatarEmoji helper.
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          avatar: base64String
        });
        window.location.reload();
      } catch (err) {
        console.error("Error uploading profile photo:", err);
      } finally {
        setShowAvatarMenu(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className="app-header">
      <Link href="/dashboard" className="h-logo">
        <span className="h-logo-icon">⚽</span>
        <span className="h-logo-text">Polla <em>Mundialista</em></span>
      </Link>
      <div className="h-divider"></div>
      <div className="h-tabs">
        <button 
          onClick={() => handleTabClick("today")}
          className={`h-tab ${activeTab === "today" ? "active" : ""}`}
        >
          🔥 Hoy {todayMatchesCount > 0 && <span className="tab-badge">{todayMatchesCount}</span>}
        </button>
        <button 
          onClick={() => handleTabClick("upcoming")}
          className={`h-tab ${activeTab === "upcoming" ? "active" : ""}`}
        >
          ⏳ Próximos
        </button>
        <Link href="/calendar" className={`h-tab ${activeTab === "calendar" ? "active" : ""}`}>
          📅 Calendario
        </Link>
        <button 
          onClick={() => handleTabClick("history")}
          className={`h-tab ${activeTab === "history" || activeTab === "predictions" ? "active" : ""}`}
        >
          📝 Mis Pronósticos
        </button>
        <button 
          onClick={() => handleTabClick("ranking")}
          className={`h-tab ${activeTab === "ranking" ? "active" : ""}`}
        >
          🏆 Ranking
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
          <span className="h-rank-val">{userRank || "-"}</span>
        </div>
        
        {/* Interactive Avatar with Selector dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            className="h-avatar hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center justify-center"
            style={{ border: "none", background: "rgba(255,255,255,0.05)", outline: "none" }}
            title="Cambiar avatar"
          >
            {getAvatarEmoji(user.displayName, user.uid, user.avatar)}
          </button>
          
          {showAvatarMenu && (
            <div 
              style={{ 
                position: "absolute", 
                top: "100%", 
                right: 0, 
                marginTop: "8px", 
                background: "var(--glass-bg, #112036)", 
                border: "1px solid var(--glass-border, rgba(255,255,255,0.1))", 
                borderRadius: "8px", 
                padding: "10px", 
                zIndex: 100, 
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)", 
                width: "220px" 
              }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "var(--muted)", marginBottom: "8px", textAlign: "center" }}>Elige tu Avatar Emoji</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", maxHeight: "150px", overflowY: "auto", padding: "2px" }}>
                {["🦁", "🦅", "🐆", "🐬", "🦊", "🐯", "🐼", "🐻", "🐨", "🐺", "🦖", "🐉", "🦈", "🐙", "🐵", "🦄", "⚡", "⚽", "🏆", "🔥", "👑", "🍕", "🍔", "🌮", "👽", "🤖", "🤠", "😎"].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleSelectAvatar(emoji)}
                    style={{ fontSize: "1.25rem", padding: "4px", background: emoji === user.avatar ? "rgba(0, 230, 118, 0.15)" : "transparent", border: emoji === user.avatar ? "1px solid var(--green)" : "none", borderRadius: "6px", cursor: "pointer" }}
                    className="hover:bg-white/10 active:scale-90 transition-all"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div style={{ margin: "8px 0", height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
              <label 
                style={{ 
                  display: "block", 
                  textAlign: "center", 
                  fontSize: "0.7rem", 
                  fontWeight: "bold", 
                  color: "var(--green)", 
                  cursor: "pointer", 
                  padding: "4px" 
                }}
                className="hover:underline"
              >
                📷 Subir foto de perfil
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: "none" }} 
                  onChange={handlePhotoUpload} 
                />
              </label>
            </div>
          )}
        </div>
        
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
