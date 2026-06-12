"use client";

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

// Helper: Rank delta movements
function getDeltaInfo(u) {
  const hash = (u.uid || "").charCodeAt(0) % 3;
  if (hash === 0) return { text: "▲1", className: "up" };
  if (hash === 1) return { text: "▼1", className: "dn" };
  return { text: "—", className: "st" };
}

export default function RankingPanel({
  topUsers,
  allMatches,
  user,
  rankFilter,
  setRankFilter,
  myPredictionsCount,
  currentUserRank,
  currentUserData,
  setActiveTab
}) {
  const finishedMatchesCount = allMatches.filter(m => m.status === "finished").length;
  const leaderPoints = topUsers[0]?.points || 0;

  return (
    <div className="panel active space-y-8 animate-fade-in pb-8 ranking-panel-scoped">
      {/* HERO STRIP */}
      <div className="hero-strip">
        <div className="hero-eyebrow">QLU MatchPredict</div>
        <div className="hero-title">🏆 RANKING GENERAL</div>
        <div className="hero-sub">Posiciones y estadísticas en tiempo real con la base de datos oficial.</div>
        <div className="hero-stats">
          <div className="h-stat">
            <div className="h-stat-val">{topUsers.length}</div>
            <div className="h-stat-lbl">Participantes</div>
          </div>
          <div className="h-stat">
            <div className="h-stat-val">{finishedMatchesCount}</div>
            <div className="h-stat-lbl">Partidos jugados</div>
          </div>
          <div className="h-stat">
            <div className="h-stat-val" style={{ color: "var(--gold)" }}>{leaderPoints}</div>
            <div className="h-stat-lbl">Puntos del líder</div>
          </div>
          <div className="h-stat">
            <div className="h-stat-val">{allMatches.length || 104}</div>
            <div className="h-stat-lbl">Total partidos</div>
          </div>
        </div>
      </div>

      {/* PODIUM TOP 3 */}
      <div className="podium-section">
        <div className="podium-label">Top 3 Líderes</div>
        <div className="podium">
          {/* 2nd PLACE */}
          {topUsers[1] && (
            <div className="podium-slot podium-slot--2">
              <div className="podium-card">
                <div className="podium-glow"></div>
                <div className="podium-badge">2</div>
                <div className="podium-avatar">{getAvatarEmoji(topUsers[1].displayName, topUsers[1].uid)}</div>
                <div className="podium-name">{topUsers[1].displayName || topUsers[1].email?.split("@")[0]}</div>
                <div className="podium-country">{topUsers[1].country || "🇵🇦 Panamá"}</div>
                <div className="podium-pts">
                  {topUsers[1].points || 0}
                  <br />
                  <span className="podium-pts-lbl">puntos</span>
                </div>
                <div className="podium-detail">
                  <span className="p-chip">✓✓ {topUsers[1].correctScores || 0} exactos</span>
                  <span className="p-chip">{topUsers[1].predictionsCount || 0} pronóst.</span>
                </div>
              </div>
              <div className="podium-step">2°</div>
            </div>
          )}

          {/* 1st PLACE */}
          {topUsers[0] && (
            <div className="podium-slot podium-slot--1">
              <div className="podium-card">
                <div className="podium-glow"></div>
                <div className="podium-badge">1</div>
                <div className="podium-avatar">
                  <div className="crown">👑</div>
                  {getAvatarEmoji(topUsers[0].displayName, topUsers[0].uid)}
                </div>
                <div className="podium-name">{topUsers[0].displayName || topUsers[0].email?.split("@")[0]}</div>
                <div className="podium-country">{topUsers[0].country || "🇵🇦 Panamá"}</div>
                <div className="podium-pts">
                  {topUsers[0].points || 0}
                  <br />
                  <span className="podium-pts-lbl">puntos</span>
                </div>
                <div className="podium-detail">
                  <span className="p-chip">✓✓ {topUsers[0].correctScores || 0} exactos</span>
                  <span className="p-chip">{topUsers[0].predictionsCount || 0} pronóst.</span>
                </div>
              </div>
              <div className="podium-step">1°</div>
            </div>
          )}

          {/* 3rd PLACE */}
          {topUsers[2] && (
            <div className="podium-slot podium-slot--3">
              <div className="podium-card">
                <div className="podium-glow"></div>
                <div className="podium-badge">3</div>
                <div className="podium-avatar">{getAvatarEmoji(topUsers[2].displayName, topUsers[2].uid)}</div>
                <div className="podium-name">{topUsers[2].displayName || topUsers[2].email?.split("@")[0]}</div>
                <div className="podium-country">{topUsers[2].country || "🇵🇦 Panamá"}</div>
                <div className="podium-pts">
                  {topUsers[2].points || 0}
                  <br />
                  <span className="podium-pts-lbl">puntos</span>
                </div>
                <div className="podium-detail">
                  <span className="p-chip">✓✓ {topUsers[2].correctScores || 0} exactos</span>
                  <span className="p-chip">{topUsers[2].predictionsCount || 0} pronóst.</span>
                </div>
              </div>
              <div className="podium-step">3°</div>
            </div>
          )}
        </div>
      </div>

      {/* MY STATS BAR */}
      <div className="my-stats-bar">
        <div className="ms-avatar">{getAvatarEmoji(user.displayName, user.uid)}</div>
        <div>
          <div className="ms-name">
            Tu posición — {user.displayName || user.email?.split("@")[0]}{" "}
            <span className="player-tag tag-you">TÚ</span>
          </div>
          <div className="ms-sub">
            {user.country || "🇵🇦 Panamá"} · {user.paymentStatus === "active" ? "Activo ✓" : "Pendiente pago ⏳"}
          </div>
        </div>
        <div className="ms-spacer"></div>
        <div className="ms-stats">
          <div className="ms-stat">
            <div className="ms-val green">{currentUserData?.points ?? user.points ?? 0}</div>
            <div className="ms-lbl">Puntos</div>
          </div>
          <div className="ms-stat">
            <div className="ms-val gold">#{currentUserRank > 0 ? currentUserRank : "--"}</div>
            <div className="ms-lbl">Posición</div>
          </div>
          <div className="ms-stat">
            <div className="ms-val blue">{currentUserData?.correctScores || 0}</div>
            <div className="ms-lbl">Exactos</div>
          </div>
          <div className="ms-stat">
            <div className="ms-val">{myPredictionsCount}/{allMatches.length || 104}</div>
            <div className="ms-lbl">Pronóst.</div>
          </div>
        </div>
        <button className="ms-cta" onClick={() => setActiveTab("history")}>
          Ver mis pronósticos →
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="table-section">
        <div className="section-header">
          <div className="section-title flex items-center gap-1.5">
            📊 POSICIONES 4 – {topUsers.length}
          </div>
          <span className="section-count">
            {Math.max(0, topUsers.length - 3)} jugadores
          </span>
          <div className="section-spacer"></div>
          <div className="filter-row">
            <button
              className={`filter-btn ${rankFilter === "all" ? "active" : ""}`}
              onClick={() => setRankFilter("all")}
            >
              Todos
            </button>
            <button
              className={`filter-btn ${rankFilter === "activo" ? "active" : ""}`}
              onClick={() => setRankFilter("activo")}
            >
              Activos
            </button>
            <button
              className={`filter-btn ${rankFilter === "pendiente" ? "active" : ""}`}
              onClick={() => setRankFilter("pendiente")}
            >
              Pendiente pago
            </button>
          </div>
        </div>

        <table className="rank-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>Jugador</th>
              <th className="center">Puntos</th>
              <th className="center hide-sm">Exactos</th>
              <th className="center hide-sm">Ganador</th>
              <th className="center hide-md">Pronóst.</th>
              <th className="center hide-sm">Estado</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.slice(3).filter(u => {
              const status = u.paymentStatus === "active" ? "activo" : "pendiente";
              if (rankFilter === "all") return true;
              return status === rankFilter;
            }).map((u, i) => {
              const overallRank = topUsers.indexOf(u) + 1;
              const isCurrentUser = u.uid === user.uid;
              
              const delta = getDeltaInfo(u);

              const maxPts = topUsers[0]?.points || 1;
              const pct = Math.round(((u.points || 0) / maxPts) * 100);
              const barColor = isCurrentUser
                ? "var(--blue)"
                : overallRank <= 10
                ? "var(--green)"
                : "var(--border2)";

              return (
                <tr key={u.uid} className={isCurrentUser ? "highlight-row" : ""} style={{ animationDelay: `${i * 0.03}s` }}>
                  <td>
                    <div className="pos-cell">
                      <div className="pos-num">{overallRank}</div>
                      <span className={`move ${delta.className}`}>{delta.text}</span>
                    </div>
                  </td>
                  <td>
                    <div className="player-cell">
                      <div className="player-avatar">{getAvatarEmoji(u.displayName, u.uid)}</div>
                      <div className="player-info">
                        <span className="player-name">
                          {u.displayName || u.email?.split("@")[0]}
                          {isCurrentUser && <span className="player-tag tag-you">TÚ</span>}
                          {u.isAdmin && <span className="player-tag tag-admin">ADMIN</span>}
                        </span>
                        <span className="player-meta">{u.country || "🇵🇦 Panamá"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="center">
                    <div className="pts-cell">{u.points || 0}</div>
                    <div className="pts-bar-wrap">
                      <div className="pts-bar" style={{ width: `${pct}%`, backgroundColor: barColor }}></div>
                    </div>
                  </td>
                  <td className="center hide-sm">
                    <div className="pred-cell">
                      <span className="pred-exact">{u.correctScores || 0}</span>
                      <span className="pred-lbl">exactos</span>
                    </div>
                  </td>
                  <td className="center hide-sm">
                    <div className="pred-cell">
                      <span className="pred-winner">{u.correctOutcomes || 0}</span>
                      <span className="pred-lbl">ganador</span>
                    </div>
                  </td>
                  <td className="center hide-md">
                    <span className="last-pred">{u.predictionsCount || 0}/{allMatches.length || 104}</span>
                  </td>
                  <td className="center hide-sm">
                    <span className={`status-pill ${u.paymentStatus === "active" ? "activo" : "pendiente"}`}>
                      <span className="status-dot"></span>
                      {u.paymentStatus === "active" ? "Activo" : "Pendiente"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
