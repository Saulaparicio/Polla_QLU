"use client";

import { Loader2, Lock } from "lucide-react";
import Flag from "@/components/Flag";
import { TEAM_ISO_CODES } from "@/lib/teamsData";
import { formatDateEs, formatTime12h } from "@/lib/dateUtils";
import Countdown from "@/components/Countdown";

// Component: Timer Badge styling
function TimerBadge({ match, isSaved }) {
  const matchDate = new Date(`${match.date}T${match.time}:00`);
  const now = new Date();
  const isStarted = now >= matchDate;
  const effectiveStatus = (match.status === "scheduled" && isStarted) ? "live" : match.status;

  if (effectiveStatus === "predicting") {
    return <span className="mc-timer t-ok" style={{ borderColor: "var(--green)", color: "var(--green)" }}>⏱ ¡Pronóstico Abierto!</span>;
  }
  if (effectiveStatus === "finished") {
    return <span className="mc-timer t-lock">🔒 Finalizado</span>;
  }
  if (effectiveStatus === "live") {
    return (
      <span className="mc-timer t-hot">
        <span className="lpip"></span>EN VIVO
      </span>
    );
  }

  const diffMs = matchDate - now;

  if (diffMs <= 15 * 60 * 1000) {
    return <span className="mc-timer t-lock">🔒 Cerrado</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1 select-none">
      {isSaved && <span className="mc-timer t-done" style={{ margin: 0 }}>✓ Guardado</span>}
      <span className="mc-timer t-ok" style={{ margin: 0, display: "inline-flex", alignItems: "center", minHeight: "22px" }}>
        <Countdown date={match.date} time={match.time} />
      </span>
    </div>
  );
}

// Helper: History Outcomes
function getHistoryDetails(pred, match) {
  const realHome = match.result?.homeScore;
  const realAway = match.result?.awayScore;
  
  if (!pred) {
    return {
      text: `Sin pronóstico · Real: ${realHome} – ${realAway}`,
      color: "var(--red)",
      badgeClass: "rb-miss",
      badgeText: "0 pts",
      topBadgeClass: "rb-miss",
      topBadgeText: "✗ 0 pts — Sin punto"
    };
  }

  const pHome = pred.homeScore;
  const pAway = pred.awayScore;
  const points = pred.points || 0;

  if (points >= 10) {
    return {
      text: `Tu pronóstico: ${pHome} – ${pAway} · Real: ${realHome} – ${realAway} ✓`,
      color: "var(--green)",
      badgeClass: "rb-exact",
      badgeText: `+${points} pts`,
      topBadgeClass: "rb-exact",
      topBadgeText: `🎯 +${points} pts — Exacto`
    };
  } else if (points >= 5) {
    return {
      text: `Tu pronóstico: ${pHome} – ${pAway} · Real: ${realHome} – ${realAway} ✓`,
      color: "var(--gold)",
      badgeClass: "rb-diff",
      badgeText: `+${points} pts`,
      topBadgeClass: "rb-diff",
      topBadgeText: `📊 +${points} pts — Acertado`
    };
  } else if (points > 0) {
    return {
      text: `Tu pronóstico: ${pHome} – ${pAway} · Real: ${realHome} – ${realAway} (Aproximación)`,
      color: "var(--blue)",
      badgeClass: "rb-win",
      badgeText: `+${points} pts`,
      topBadgeClass: "rb-win",
      topBadgeText: `✅ +${points} pts — Consolación`
    };
  } else {
    return {
      text: `Tu pronóstico: ${pHome} – ${pAway} · Real: ${realHome} – ${realAway} ✗`,
      color: "var(--red)",
      badgeClass: "rb-miss",
      badgeText: "0 pts",
      topBadgeClass: "rb-miss",
      topBadgeText: "✗ 0 pts — Sin punto"
    };
  }
}

export default function MatchCard({
  match,
  predictions,
  savingId,
  successId,
  user,
  handleInputChange,
  handleSavePrediction,
  setPredictions
}) {
  const matchDate = new Date(`${match.date}T${match.time}:00`);
  const now = new Date();
  const isStarted = now >= matchDate;
  const effectiveStatus = (match.status === "scheduled" && isStarted) ? "live" : match.status;

  const isLocked = effectiveStatus === "live" || effectiveStatus === "finished";
  const isPredictionLocked = effectiveStatus === "predicting" ? false : (isLocked || (matchDate - now <= 15 * 60 * 1000));

  const currentPred = predictions[match.id] || { homeScore: "", awayScore: "", advancingTeamId: "", saved: false };

  // Official results display value when locked
  const homeDisplayValue = isLocked 
    ? (match.result?.homeScore !== undefined && match.result?.homeScore !== null && !isNaN(match.result.homeScore) ? match.result.homeScore : "–")
    : currentPred.homeScore;

  const awayDisplayValue = isLocked 
    ? (match.result?.awayScore !== undefined && match.result?.awayScore !== null && !isNaN(match.result.awayScore) ? match.result.awayScore : "–")
    : currentPred.awayScore;

  const predObj = currentPred.saved ? currentPred : null;
  const details = effectiveStatus === "finished" ? getHistoryDetails(predObj, match) : null;

  return (
    <div 
      id={`match-${match.id}`}
      className={`match-card ${effectiveStatus === "finished" ? "locked" : ""} ${currentPred.saved && (effectiveStatus === "scheduled" || effectiveStatus === "predicting") ? "saved" : ""}`}
    >
      <div className="mc-top">
        <span className="mc-meta">
          {match.group ? (match.group.toLowerCase().startsWith("grupo") ? match.group : `Grupo ${match.group}`) : match.stage || "Fase de Grupos"} · P{match.matchNumber} · {formatDateEs(match.date)} @ {formatTime12h(match.time)} · {match.venue}
        </span>
        <TimerBadge match={match} isSaved={currentPred.saved} />
      </div>
      
      <div className="mc-body">
        <div className="team">
          <Flag code={TEAM_ISO_CODES[match.homeTeamId]} size={36} className="tf" />
          <div>
            <div className="tn">{match.homeTeam}</div>
            <div className="tc">{match.homeTeamId}</div>
          </div>
        </div>

        <div className="score-pair">
          {isLocked ? (
            <div className={`si flex items-center justify-center font-bold select-none cursor-default ${
              effectiveStatus === "live" 
                ? "border-rose-500/40 text-rose-400 bg-rose-500/5 shadow-[0_0_12px_rgba(244,63,94,0.2)] animate-pulse"
                : "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
            }`}>
              {homeDisplayValue}
            </div>
          ) : (
            <input 
              type="number"
              min="0"
              max="20"
              disabled={currentPred.saved || isPredictionLocked || user.paymentStatus !== "active"}
              value={currentPred.homeScore}
              onChange={(e) => handleInputChange(match.id, "homeScore", e.target.value)}
              placeholder="–"
              className={`si ${currentPred.saved ? "saved-val" : ""}`}
            />
          )}
          <span className="sv-sep">:</span>
          {isLocked ? (
            <div className={`si flex items-center justify-center font-bold select-none cursor-default ${
              effectiveStatus === "live" 
                ? "border-rose-500/40 text-rose-400 bg-rose-500/5 shadow-[0_0_12px_rgba(244,63,94,0.2)] animate-pulse"
                : "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
            }`}>
              {awayDisplayValue}
            </div>
          ) : (
            <input 
              type="number"
              min="0"
              max="20"
              disabled={currentPred.saved || isPredictionLocked || user.paymentStatus !== "active"}
              value={currentPred.awayScore}
              onChange={(e) => handleInputChange(match.id, "awayScore", e.target.value)}
              placeholder="–"
              className={`si ${currentPred.saved ? "saved-val" : ""}`}
            />
          )}
        </div>

        <div className="team away">
          <Flag code={TEAM_ISO_CODES[match.awayTeamId]} size={36} className="tf" />
          <div>
            <div className="tn">{match.awayTeam}</div>
            <div className="tc">{match.awayTeamId}</div>
          </div>
        </div>
      </div>

      {match.stage && match.stage !== "Group Stage" && match.stage !== "Fase de Grupos" && currentPred.homeScore !== "" && currentPred.awayScore !== "" && currentPred.homeScore === currentPred.awayScore && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "10px 0", fontSize: "0.8rem", background: "rgba(255,255,255,0.03)", padding: "8px", borderRadius: "6px" }}>
          <span style={{ color: "var(--muted)" }}>Avanza en penales:</span>
          <select
            value={currentPred.advancingTeamId || ""}
            disabled={currentPred.saved || isPredictionLocked || user.paymentStatus !== "active"}
            onChange={(e) => handleInputChange(match.id, "advancingTeamId", e.target.value)}
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border2)", color: "white", padding: "2px 6px", borderRadius: "4px", outline: "none" }}
          >
            <option value="">Selecciona...</option>
            <option value={match.homeTeamId}>{match.homeTeam}</option>
            <option value={match.awayTeamId}>{match.awayTeam}</option>
          </select>
        </div>
      )}

      <div className="mc-foot">
        {user.paymentStatus !== "active" ? (
          <span className="text-[var(--amber)] font-bold flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 inline" /> Requiere Cuenta Activa
          </span>
        ) : effectiveStatus === "live" ? (
          <>
            <span className="mc-status text-[var(--fg-dim)] font-semibold">
              Tu pronóstico: <strong className="text-[var(--fg)]">{currentPred.homeScore !== "" ? `${currentPred.homeScore} – ${currentPred.awayScore}` : "Sin pronosticar"}</strong>
            </span>
            <span className="result-badge rb-pend">
              En Vivo
            </span>
          </>
        ) : effectiveStatus === "finished" ? (
          <>
            <span className="mc-status text-[var(--fg-dim)] font-semibold" style={{ color: details.color }}>
              {details.text}
            </span>
            <span className={`result-badge ${details.badgeClass}`}>
              {details.badgeText}
            </span>
          </>
        ) : (
          <>
            <span className={`mc-status ${currentPred.saved ? "ok" : ""}`}>
              {currentPred.saved ? `✓ Guardado · ${currentPred.homeScore} – ${currentPred.awayScore}` : "Sin pronosticar"}
            </span>

            {user.paymentStatus === "active" && (
              <div className="mc-actions">
                {currentPred.saved ? (
                  <>
                    <button 
                      onClick={() => {
                        setPredictions((prev) => ({
                          ...prev,
                          [match.id]: {
                            ...prev[match.id],
                            saved: false
                          }
                        }));
                      }}
                      className="btn-edit"
                      disabled={isPredictionLocked}
                    >
                      Editar
                    </button>
                    <button className="btn-save" disabled>
                      ✓ Guardado
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleSavePrediction(match.id)}
                    disabled={savingId === match.id || isPredictionLocked || currentPred.homeScore === "" || currentPred.awayScore === ""}
                    className="btn-save"
                  >
                    {savingId === match.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      "Guardar Pronóstico"
                    )}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
