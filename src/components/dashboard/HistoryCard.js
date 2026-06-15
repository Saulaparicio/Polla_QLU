"use client";

import Flag from "@/components/Flag";
import { TEAM_ISO_CODES } from "@/lib/teamsData";
import { formatDateEs, formatTime12h } from "@/lib/dateUtils";

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

function getHistoryInputStyle(points) {
  if (points >= 10) {
    return { borderColor: "rgba(0,230,118,0.5)", color: "var(--green)" };
  } else if (points >= 5) {
    return { borderColor: "rgba(255,215,0,0.4)", color: "var(--gold)" };
  } else if (points > 0) {
    return { borderColor: "rgba(91,141,239,0.4)", color: "var(--blue)" };
  } else if (points === 0) {
    return { borderColor: "rgba(255,82,82,0.3)", color: "var(--red)" };
  }
  return {};
}

export default function HistoryCard({ match, predictions }) {
  const pred = predictions[match.id];
  const realHome = match.result?.homeScore;
  const realAway = match.result?.awayScore;
  const points = pred ? pred.points : null;

  const details = getHistoryDetails(pred, match);
  const inputStyle = getHistoryInputStyle(points);

  return (
    <div id={`match-${match.id}`} className="match-card">
      <div className="mc-top">
        <span className="mc-meta">
          {match.group ? (match.group.toLowerCase().startsWith("grupo") ? match.group : `Grupo ${match.group}`) : match.stage || "Fase de Grupos"} · P{match.matchNumber} · {formatDateEs(match.date)} @ {formatTime12h(match.time)} · {match.venue}
        </span>
        <span className={`result-badge ${details.topBadgeClass}`}>
          {details.topBadgeText}
        </span>
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
          <input 
            type="number"
            disabled
            value={realHome !== null && realHome !== undefined ? realHome : ""}
            className="si"
            style={inputStyle}
            placeholder="–"
          />
          <span className="sv-sep">:</span>
          <input 
            type="number"
            disabled
            value={realAway !== null && realAway !== undefined ? realAway : ""}
            className="si"
            style={inputStyle}
            placeholder="–"
          />
        </div>

        <div className="team away">
          <Flag code={TEAM_ISO_CODES[match.awayTeamId]} size={36} className="tf" />
          <div>
            <div className="tn">{match.awayTeam}</div>
            <div className="tc">{match.awayTeamId}</div>
          </div>
        </div>
      </div>

      {match.stage && match.stage !== "Group Stage" && match.stage !== "Fase de Grupos" && pred && pred.homeScore === pred.awayScore && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "10px 0", fontSize: "0.8rem", color: "var(--muted)" }}>
          <span>Avanza pronosticado:</span>
          <strong style={{ color: "white" }}>
            {pred.advancingTeamId === match.homeTeamId ? match.homeTeam : (pred.advancingTeamId === match.awayTeamId ? match.awayTeam : "Ninguno")}
          </strong>
          {match.result?.advancingTeamId && (
            <>
              <span style={{ padding: "0 4px" }}>·</span>
              <span>Real:</span>
              <strong style={{ color: pred.advancingTeamId === match.result.advancingTeamId ? "var(--green)" : "var(--red)" }}>
                {match.result.advancingTeamId === match.homeTeamId ? match.homeTeam : match.awayTeam}
              </strong>
            </>
          )}
        </div>
      )}

      <div className="mc-foot">
        <span className="mc-status" style={{ color: details.color }}>
          {details.text}
        </span>
        <span className={`result-badge ${details.badgeClass}`}>
          {details.badgeText}
        </span>
      </div>
    </div>
  );
}
