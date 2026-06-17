"use client";

import React, { useState } from "react";

export default function PronosticosPanel({
  usersList,
  matches,
  predictionsList,
  renderTeamFlag,
  activePanel,
  loading
}) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [predictionFilter, setPredictionFilter] = useState("all"); // 'all', 'exact', 'partial', 'incorrect', 'pending'
  const [searchQuery, setSearchQuery] = useState("");

  if (activePanel !== "pronosticos") return null;

  // Filter users by search query
  const filteredUsers = usersList.filter(u => {
    const q = searchQuery.toLowerCase();
    const displayName = (u.displayName || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return displayName.includes(q) || email.includes(q);
  });

  const selectedUser = usersList.find(u => u.id === selectedUserId);

  // Get predictions for selected user
  const userPredictions = selectedUserId
    ? predictionsList.filter(p => p.userId === selectedUserId)
    : [];

  // Match predictions with match details
  const predictionsWithMatchDetails = userPredictions.map(pred => {
    const match = matches.find(m => m.id === pred.matchId);
    return {
      pred,
      match
    };
  }).filter(item => item.match !== undefined);

  // Filter predictions by selected status
  const filteredPredictions = predictionsWithMatchDetails.filter(item => {
    const { pred, match } = item;
    
    // Check if match is finished
    const isFinished = match.status === "finished";
    
    if (predictionFilter === "all") return true;
    if (predictionFilter === "pending") {
      return match.status !== "finished";
    }
    
    if (!isFinished) return false;
    
    const pts = pred.points || 0;
    if (predictionFilter === "exact") {
      // 3 points (exact score or draw exact)
      return pts === 3 || pts === 13; // 13 if it has knockout advancement bonus (+10)
    }
    if (predictionFilter === "partial") {
      // 1 or 2 points (or 11 or 12 in knockout)
      return pts === 1 || pts === 2 || pts === 11 || pts === 12;
    }
    if (predictionFilter === "incorrect") {
      return pts === 0 || pts === 10; // 10 if they only got the advancing team (+10)
    }
    return true;
  }).sort((a, b) => (a.match.matchNumber || 0) - (b.match.matchNumber || 0));

  // Count helper for predictions status
  const getFilterCounts = () => {
    let exact = 0;
    let partial = 0;
    let incorrect = 0;
    let pending = 0;

    predictionsWithMatchDetails.forEach(item => {
      const { pred, match } = item;
      if (match.status !== "finished") {
        pending++;
      } else {
        const pts = pred.points || 0;
        if (pts === 3 || pts === 13) exact++;
        else if (pts === 1 || pts === 2 || pts === 11 || pts === 12) partial++;
        else incorrect++;
      }
    });

    return { exact, partial, incorrect, pending, total: predictionsWithMatchDetails.length };
  };

  const counts = getFilterCounts();

  return (
    <section className="panel on">
      <div className="ph">
        <div>
          <div className="pt" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            Pronósticos de Usuarios
          </div>
          <div className="ps">Inspecciona y revisa detalladamente las predicciones de cada jugador</div>
        </div>
      </div>

      <div className="fr" style={{ gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
        {/* LEFT COLUMN: User selection list */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "14px", height: "fit-content", maxHeight: "80vh" }}>
          <div className="ct" style={{ marginBottom: "5px" }}>👥 Buscar Jugador</div>
          
          <div className="sr">
            <span className="sico" style={{ display: "flex", alignItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
            <input
              type="text"
              className="si2"
              placeholder="Filtrar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filtrar por nombre"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", maxHeight: "400px", paddingRight: "4px" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--muted)", fontSize: "0.85rem" }}>Cargando jugadores...</div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--muted)", fontSize: "0.85rem" }}>No se encontraron usuarios</div>
            ) : (
              filteredUsers.map(u => {
                const isSelected = u.id === selectedUserId;
                const alias = u.displayName || u.email.split("@")[0];
                return (
                  <button
                    key={u.id}
                    className={`sb-btn ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setPredictionFilter("all");
                    }}
                    style={{ 
                      padding: "8px 12px", 
                      border: "1px solid var(--border)", 
                      background: isSelected ? "var(--surface2)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "left"
                    }}
                    type="button"
                  >
                    <div className="uc" style={{ gap: "8px" }}>
                      <div className="uav" style={{ width: "26px", height: "26px", fontSize: "0.8rem", background: "var(--surface3)" }}>
                        {u.avatar && !u.avatar.startsWith("data:image/") ? u.avatar : "👤"}
                      </div>
                      <div>
                        <div className="un" style={{ fontSize: "0.8rem", fontWeight: 600, color: isSelected ? "var(--fg)" : "var(--fg-dim)" }}>@{alias}</div>
                        <div className="ue" style={{ fontSize: "0.68rem" }}>{u.points || 0} pts</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                      {predictionsList.filter(p => p.userId === u.id && p.homeScore !== "").length} pred.
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Predictions display */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {!selectedUserId ? (
            <div className="card text-center" style={{ padding: "40px 20px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🔍</div>
              <h3 style={{ color: "var(--fg)", fontSize: "1.1rem" }}>Selecciona un jugador</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginTop: "4px" }}>Elige un participante de la lista izquierda para inspeccionar sus predicciones.</p>
            </div>
          ) : (
            <>
              {/* User overview stats */}
              <div className="card" style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                <div className="uc" style={{ gap: "12px" }}>
                  <div className="uav" style={{ width: "48px", height: "48px", fontSize: "1.6rem", background: "var(--surface2)", border: "2px solid var(--border2)" }}>
                    {selectedUser?.avatar && !selectedUser.avatar.startsWith("data:image/") ? selectedUser.avatar : "👤"}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>@{selectedUser?.displayName || selectedUser?.email.split("@")[0]}</h3>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{selectedUser?.email} · {selectedUser?.country || "🇵🇦 Panamá"}</p>
                  </div>
                </div>

                <div className="stats" style={{ margin: 0, display: "flex", gap: "12px" }}>
                  <div className="sbox" style={{ padding: "10px 14px", minWidth: "80px", textAlign: "center" }}>
                    <div className="sv" style={{ fontSize: "1.5rem", color: "var(--gold)" }}>{selectedUser?.points || 0}</div>
                    <div className="sl" style={{ fontSize: "0.6rem" }}>Puntos</div>
                  </div>
                  <div className="sbox" style={{ padding: "10px 14px", minWidth: "80px", textAlign: "center" }}>
                    <div className="sv" style={{ fontSize: "1.5rem", color: "var(--green)" }}>{selectedUser?.correctScores || 0}</div>
                    <div className="sl" style={{ fontSize: "0.6rem" }}>Exactos</div>
                  </div>
                  <div className="sbox" style={{ padding: "10px 14px", minWidth: "80px", textAlign: "center" }}>
                    <div className="sv" style={{ fontSize: "1.5rem", color: "var(--blue)" }}>{counts.total}</div>
                    <div className="sl" style={{ fontSize: "0.6rem" }}>Predicciones</div>
                  </div>
                </div>
              </div>

              {/* Filters bar */}
              <div className="card" style={{ padding: "12px 16px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", marginRight: "4px" }}>FILTRAR:</span>
                <button
                  className={`btn btn-sm ${predictionFilter === "all" ? "btn-p" : "btn-o"}`}
                  onClick={() => setPredictionFilter("all")}
                  type="button"
                >
                  Todos ({counts.total})
                </button>
                <button
                  className={`btn btn-sm ${predictionFilter === "exact" ? "btn-g" : "btn-o"}`}
                  onClick={() => setPredictionFilter("exact")}
                  type="button"
                >
                  🎯 Exactos ({counts.exact})
                </button>
                <button
                  className={`btn btn-sm ${predictionFilter === "partial" ? "btn-p" : "btn-o"}`}
                  onClick={() => setPredictionFilter("partial")}
                  type="button"
                  style={predictionFilter === "partial" ? { backgroundColor: "var(--blue)", color: "#fff" } : {}}
                >
                  ⚖️ Diferencia/Ganador ({counts.partial})
                </button>
                <button
                  className={`btn btn-sm ${predictionFilter === "incorrect" ? "btn-d" : "btn-o"}`}
                  onClick={() => setPredictionFilter("incorrect")}
                  type="button"
                >
                  ❌ Incorrectos ({counts.incorrect})
                </button>
                <button
                  className={`btn btn-sm ${predictionFilter === "pending" ? "btn-y" : "btn-o"}`}
                  onClick={() => setPredictionFilter("pending")}
                  type="button"
                >
                  ⏳ Pendientes ({counts.pending})
                </button>
              </div>

              {/* Predictions list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredPredictions.length === 0 ? (
                  <div className="card text-center" style={{ padding: "30px 10px", color: "var(--muted)" }}>
                    No hay predicciones en esta categoría.
                  </div>
                ) : (
                  filteredPredictions.map(({ pred, match }) => {
                    const isFinished = match.status === "finished";
                    const isLive = match.status === "live";
                    const pts = pred.points || 0;
                    
                    let badgeClass = "bx-a";
                    let badgeLabel = "Pendiente";
                    
                    if (isFinished) {
                      if (pts === 3 || pts === 13) {
                        badgeClass = "bx-g";
                        badgeLabel = `🎯 Exacto (${pts} pts)`;
                      } else if (pts === 1 || pts === 2 || pts === 11 || pts === 12) {
                        badgeClass = "bx-b";
                        badgeLabel = `⚖️ Acierto (${pts} pts)`;
                      } else {
                        badgeClass = "bx-r";
                        badgeLabel = `❌ Error (${pts} pts)`;
                      }
                    } else if (isLive) {
                      badgeClass = "bx-p";
                      badgeLabel = "⚡ En Vivo";
                    }

                    return (
                      <div key={pred.id} className="card" style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                          <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Partido {match.matchNumber} · {match.stage || "Fase de grupos"} · {match.date} {match.time}
                          </span>
                          <span className={`bx ${badgeClass}`} style={{ fontSize: "0.7rem" }}>{badgeLabel}</span>
                        </div>

                        <div className="sw" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr", gap: "10px", alignItems: "center" }}>
                          {/* Home Team */}
                          <div className="ti" style={{ justifyContent: "flex-end" }}>
                            <span className="tn" style={{ fontWeight: 600 }}>{match.homeTeam}</span>
                            {renderTeamFlag(match.homeTeamId, 24)}
                          </div>

                          {/* Prediction display VS actual score */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: "500" }}>Pred:</span>
                              <strong style={{ fontSize: "1.1rem", color: "var(--fg)" }}>
                                {pred.homeScore} - {pred.awayScore}
                              </strong>
                            </div>
                            
                            {(isFinished || isLive) && match.result && (
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(0,0,0,0.15)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                                <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Real:</span>
                                <strong style={{ fontSize: "0.85rem", color: "var(--green)" }}>
                                  {match.result.homeScore} - {match.result.awayScore}
                                </strong>
                              </div>
                            )}
                          </div>

                          {/* Away Team */}
                          <div className="ti" style={{ justifyContent: "flex-start" }}>
                            {renderTeamFlag(match.awayTeamId, 24)}
                            <span className="tn" style={{ fontWeight: 600 }}>{match.awayTeam}</span>
                          </div>
                        </div>

                        {/* Knockout stage advancing team prediction */}
                        {(match.stage && match.stage !== "Group Stage" && match.stage !== "Fase de Grupos") && (
                          <div style={{ marginTop: "12px", background: "var(--surface2)", borderRadius: "var(--r-s)", padding: "8px 12px", fontSize: "0.75rem", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "var(--muted)" }}>Avanza de ronda:</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              {pred.advancingTeamId ? (
                                <>
                                  {renderTeamFlag(pred.advancingTeamId, 16)}
                                  <strong style={{ color: "var(--fg)" }}>{pred.advancingTeamId}</strong>
                                  {isFinished && match.result && (
                                    <span>
                                      {match.result.advancingTeamId === pred.advancingTeamId ? " ✅ (+10 pts)" : " ❌"}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span style={{ color: "var(--muted)", fontStyle: "italic" }}>Sin elección</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
