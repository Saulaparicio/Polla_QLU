"use client";

import { Loader2, Sparkles, Check, Copy } from "lucide-react";
import Flag from "@/components/Flag";
import { TEAM_ISO_CODES } from "@/lib/teamsData";

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

// Helper: Rank delta movements
function getDeltaInfo(u) {
  const hash = (u.uid || "").charCodeAt(0) % 3;
  if (hash === 0) return { text: "▲1", className: "up" };
  if (hash === 1) return { text: "▼1", className: "dn" };
  return { text: "—", className: "st" };
}

export default function DashboardSidebar({
  activeTab,
  topUsers,
  user,
  stats,
  myPredictionsCount,
  effectiveness,
  userRank,
  togglePayStatus,
  handlePayUpload,
  uploadingReceipt,
  copyReferral,
  copied,
  setActiveTab,
  matches = []
}) {
  const top5 = topUsers.slice(0, 5);
  const myRankIndex = topUsers.findIndex((u) => u.uid === user.uid);
  const myRank = myRankIndex !== -1 ? myRankIndex + 1 : null;
  const isMeInTop5 = myRank !== null && myRank <= 5;

  // Filter for the 4 most recently finished matches
  const recentFinishedMatches = matches
    .filter(m => m.status === "finished")
    .sort((a, b) => (b.matchNumber || 0) - (a.matchNumber || 0))
    .slice(0, 4);

  const renderLeaderboardRow = (u, index) => {
    const isMe = u.uid === user.uid;
    const rank = index + 1;
    const alias = u.displayName || u.email?.split("@")[0] || "Usuario";
    const points = u.points || 0;
    const emoji = getAvatarEmoji(u.displayName, u.uid, u.avatar);
    const delta = getDeltaInfo(u);

    let rankClass = "rkN";
    if (rank === 1) rankClass = "rk1";
    else if (rank === 2) rankClass = "rk2";
    else if (rank === 3) rankClass = "rk3";

    return (
      <div key={u.uid} className={`lb-row ${isMe ? "me" : ""}`}>
        <div className={`rk ${rankClass}`}>{rank}</div>
        <div className="lb-avt">{emoji}</div>
        <div className="lb-info">
          <div className="lb-alias">@{alias}</div>
          <div className="lb-sub">{isMe ? "Tú" : "Participante"} · {points} pts totales</div>
        </div>
        <div className={`lb-delta ${delta.className}`}>{delta.text}</div>
        <div className="lb-pts">
          <div className="lb-pts-v" style={isMe ? { color: "var(--green)" } : {}}>{points}</div>
          <div className="lb-pts-l">pts</div>
        </div>
      </div>
    );
  };

  return (
    <aside className={`sidebar ${activeTab === "ranking" ? "mob-visible" : ""}`} id="sidebar">
      {/* LEADERBOARD (Hide on ranking tab since the main panel displays the full table) */}
      {activeTab !== "ranking" && (
        <div className="card">
          <div className="card-head">
            <span className="card-title">🏆 Tabla General</span>
            <span className="live-badge"><span className="lpip"></span>EN VIVO</span>
          </div>
          
          {top5.map((u, index) => renderLeaderboardRow(u, index))}

          {!isMeInTop5 && myRank !== null && (
            <>
              {myRank > 6 && (
                <div style={{ padding: "6px 18px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
                  <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                    ·· {myRank - 6} {myRank - 6 === 1 ? "posición" : "posiciones"} ··
                  </span>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
                </div>
              )}
              {renderLeaderboardRow(topUsers[myRankIndex], myRankIndex)}
            </>
          )}

          <div className="lb-foot">
            <button 
              onClick={() => setActiveTab("ranking")} 
              style={{ 
                display: "block", 
                width: "100%", 
                textAlign: "center", 
                fontSize: "0.8125rem", 
                color: "var(--muted)", 
                background: "none", 
                border: "none", 
                padding: 4, 
                cursor: "pointer" 
              }}
            >
              Ver los {stats.users} participantes →
            </button>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="card animate-fade-in">
        <div className="card-head">
          <span className="card-title">📊 Mis estadísticas</span>
          <span className="card-action">Mundial 2026</span>
        </div>
        <div className="stats-grid">
          <div className="stat-cell">
            <div className="stat-cell-val stat-accent-green">{user.points || 0}</div>
            <div className="stat-cell-lbl">Puntos totales</div>
          </div>
          <div className="stat-cell">
            <div className="stat-cell-val">{userRank}</div>
            <div className="stat-cell-lbl">Posición global</div>
          </div>
          <div className="stat-cell">
            <div className="stat-cell-val stat-accent-gold">{user.correctScores || 0}</div>
            <div className="stat-cell-lbl">Exactos (3 pts)</div>
          </div>
          <div className="stat-cell">
            <div className="stat-cell-val stat-accent-blue">{user.correctOutcomes || 0}</div>
            <div className="stat-cell-lbl">Ganadores (+1-2)</div>
          </div>
        </div>
        <div className="progress-row">
          <div className="progress-label">
            <span>Pronósticos enviados</span>
            <strong>{myPredictionsCount} / {stats.matches || 104}</strong>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(myPredictionsCount / (stats.matches || 104)) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="progress-row" style={{ borderTop: "none", paddingTop: 0 }}>
          <div className="progress-label">
            <span>Efectividad</span>
            <strong style={{ color: "var(--green)" }}>{effectiveness}%</strong>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${effectiveness}%`, 
                background: "linear-gradient(90deg, var(--green), var(--gold))" 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* PAYMENT STATUS CARD */}
      <div className="card animate-fade-in" id="payment-card">
        <div className="card-head">
          <span className="card-title">💳 Estado de cuenta</span>
          <button 
            onClick={togglePayStatus}
            className="card-action"
            style={{ border: "none", background: "none", fontFamily: "inherit", cursor: "pointer" }}
          >
            Cambiar estado
          </button>
        </div>

        {user.paymentStatus === "active" && (
          <div className="pay-status">
            <span className="status-icon">✅</span>
            <div className="status-info">
              <div className="status-title">Cuenta activa</div>
              <div className="status-desc">Inscripción verificada · Torneo completo</div>
            </div>
            <span className="status-badge badge-active">ACTIVO</span>
          </div>
        )}

        {user.paymentStatus === "pending" && (
          <div className="pay-status">
            <span className="status-icon">⏳</span>
            <div className="status-info">
              <div className="status-title">En revisión</div>
              <div className="status-desc">Activaremos tu cuenta en menos de 24 horas.</div>
            </div>
            <span className="status-badge badge-pending">PENDIENTE</span>
          </div>
        )}

        {(!user.paymentStatus || user.paymentStatus === "unpaid") && (
          <>
            <div className="pay-status">
              <span className="status-icon">❌</span>
              <div className="status-info">
                <div className="status-title">Cuenta inactiva</div>
                <div className="status-desc">Debes subir tu comprobante de Yappy.</div>
              </div>
              <span 
                className="status-badge badge-pending" 
                style={{ 
                  backgroundColor: "rgba(255,82,82,0.12)", 
                  color: "var(--red)", 
                  borderColor: "rgba(255,82,82,0.25)" 
                }}
              >
                INACTIVO
              </span>
            </div>
            
            <div style={{ padding: "0 18px 16px" }}>
              <div 
                style={{ 
                  backgroundColor: "var(--surface2)", 
                  border: "1px solid var(--border2)", 
                  borderRadius: "var(--r-m)", 
                  padding: "14px", 
                  fontSize: "0.75rem", 
                  marginBottom: "12px" 
                }}
              >
                <div style={{ color: "var(--muted)", fontWeight: "bold", marginBottom: "4px" }}>Enviar B/.10 por Yappy al:</div>
                <div style={{ color: "var(--fg)", fontWeight: "bold", fontSize: "0.9375rem" }}>+507 6214-9386</div>
                <div style={{ color: "var(--muted)", marginTop: "2px" }}>Polla Mundialista</div>
              </div>

              <div 
                onClick={() => document.getElementById("receipt-file").click()}
                className="upload-compact"
              >
                <div className="upload-compact-title">📎 Adjuntar comprobante Yappy</div>
                <div className="upload-compact-hint">PNG, JPG · B/. 10 · Se activa en 24h</div>
              </div>
              <input 
                type="file" 
                id="receipt-file" 
                style={{ display: "none" }} 
                accept="image/*"
                onChange={handlePayUpload}
              />

              {uploadingReceipt && (
                <div 
                  style={{ 
                    marginTop: 10, 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 8, 
                    padding: "10px 14px", 
                    background: "rgba(255,255,255,0.05)", 
                    borderRadius: "var(--r-s)", 
                    fontSize: "0.8125rem" 
                  }}
                >
                  <Loader2 className="w-4 h-4 animate-spin text-[#00E676]" />
                  <span className="text-zinc-300">Subiendo comprobante...</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* INVITE FRIENDS */}
      <div 
        className="card animate-fade-in" 
        style={{ 
          padding: "16px 18px", 
          background: "linear-gradient(135deg, rgba(0,230,118,0.05) 0%, transparent 100%)" 
        }}
      >
        <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--green)", display: "flex", alignItems: "center", gap: 6, marginBottom: "6px" }}>
          <Sparkles className="w-4 h-4" /> Invitar amigos
        </h4>
        <p style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "14px" }}>
          Comparte tu enlace de referido para competir con amigos en tu liga privada.
        </p>
        <button 
          onClick={copyReferral}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 6, 
            fontSize: "0.75rem", 
            fontWeight: 700, 
            color: "var(--green)", 
            backgroundColor: "transparent", 
            border: "none", 
            cursor: "pointer", 
            padding: 0 
          }}
        >
          <span>{copied ? "¡Enlace Copiado!" : "Copiar Enlace Referido"}</span>
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

       {/* RECENT RESULTS WIDGET */}
      {recentFinishedMatches.length > 0 && (
        <div className="card animate-fade-in">
          <div className="card-head">
            <span className="card-title">⚽ Resultados Recientes</span>
            <span className="card-action">Últimos partidos</span>
          </div>
          <div style={{ padding: "0 18px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentFinishedMatches.map((m) => {
              const homeCode = TEAM_ISO_CODES[m.homeTeamId];
              const awayCode = TEAM_ISO_CODES[m.awayTeamId];
              return (
                <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "var(--surface2)", borderRadius: "var(--r-s)", border: "1px solid var(--border2)" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                    <Flag code={homeCode} size={20} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--fg)" }}>{m.homeTeamId}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.2)", padding: "2px 8px", borderRadius: "4px" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: "bold", color: "var(--green)" }}>{m.result?.homeScore}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>:</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "bold", color: "var(--green)" }}>{m.result?.awayScore}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "end", gap: "8px" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--fg)" }}>{m.awayTeamId}</span>
                    <Flag code={awayCode} size={20} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FAQ LINK */}
      <div className="card text-center" style={{ padding: "14px", marginTop: "12px", border: "1px solid var(--border)", display: "flex", justifyContent: "center" }}>
        <a 
          href="/faq" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ fontSize: "0.8125rem", color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 600 }}
          className="hover:text-white transition-colors"
        >
          ℹ️ Ver Reglamento y FAQ →
        </a>
      </div>
    </aside>
  );
}
