"use client";

import React from "react";

export default function MotorPanel({
  matches,
  predictionsList,
  usersList,
  engineState,
  lastCalcTime,
  lastCalcMatchesCount,
  engineLogs,
  onRunEngine,
  activePanel,
  renderTeamFlag
}) {
  if (activePanel !== "motor") return null;

  const finishedCount = matches.filter((m) => m.status === "finished").length;
  const liveCount = matches.filter((m) => m.status === "live").length;
  const scheduledCount = matches.filter((m) => m.status === "scheduled").length;
  const totalPointsDistributed = usersList.reduce((acc, u) => acc + (u.points || 0), 0);

  const finishedMatchesReverse = matches
    .filter((m) => m.status === "finished")
    .slice(-6)
    .reverse();

  return (
    <section className="panel on">
      <div className="ph">
        <div>
          <div className="pt" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            Motor de Puntos
          </div>
          <div className="ps">Estado del cálculo de puntajes por partido</div>
        </div>
        <button
          className="btn btn-y"
          disabled={engineState === "running"}
          onClick={() => onRunEngine()}
          type="button"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Ejecutar motor
        </button>
      </div>

      <div className="stats">
        <div className="sbox">
          <div className="sv" style={{ color: "var(--green)" }}>{finishedCount}</div>
          <div className="sl">Calculados</div>
        </div>
        <div className="sbox">
          <div className="sv" style={{ color: "var(--muted)" }}>{scheduledCount + liveCount}</div>
          <div className="sl">Pendientes</div>
        </div>
        <div className="sbox">
          <div className="sv" style={{ color: "var(--blue)" }}>{predictionsList.length}</div>
          <div className="sl">Predicciones</div>
        </div>
        <div className="sbox">
          <div className="sv" style={{ color: "var(--gold)" }}>{totalPointsDistributed}</div>
          <div className="sl">Pts distribuidos</div>
        </div>
      </div>

      <div className="card">
        <div className="ct">Estado del motor</div>
        <div className="ms">
          <div
            className={`mdot ${
              engineState === "running"
                ? "run"
                : engineState === "completed"
                ? "done"
                : "idle"
            }`}
          />
          <div>
            <div style={{ fontWeight: 600 }}>
              {engineState === "running"
                ? "Ejecutando motor de puntos..."
                : engineState === "completed"
                ? "Motor completado — última ejecución OK"
                : "Motor inactivo — listo para ejecución"}
            </div>
            <div style={{ fontSize: ".8125rem", color: "var(--muted)", marginTop: "2px" }}>
              Último cálculo: {lastCalcTime} · {lastCalcMatchesCount} partidos procesados
            </div>
          </div>
          <div className="ml">
            <button
              className="btn btn-y btn-sm"
              disabled={engineState === "running"}
              onClick={() => onRunEngine()}
              type="button"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              {engineState === "completed" ? "Re-ejecutar" : "Ejecutar"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: "12px" }}>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: "6px" }}>
            Progreso global ({finishedCount} / {matches.length} partidos finalizados)
          </div>
          <div className="pb font-mono">
            <div
              className="pf"
              style={{
                width: `${matches.length > 0 ? (finishedCount / matches.length) * 100 : 0}%`
              }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="ct">Últimos partidos calculados</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Partido</th>
                <th>Resultado</th>
                <th>Predicciones</th>
                <th>Exactos</th>
                <th>Pts asignados</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {finishedMatchesReverse.map((m) => {
                const mPreds = predictionsList.filter((p) => p.matchId === m.id);
                const exactsCount = mPreds.filter(
                  (p) =>
                    p.homeScore === m.result?.homeScore && p.awayScore === m.result?.awayScore
                ).length;
                const sumPts = mPreds.reduce((acc, p) => acc + (p.points || 0), 0);

                return (
                  <tr key={m.id}>
                    <td>
                      <div className="ti">
                        {renderTeamFlag(m.homeTeamId, 20)}
                        <span className="tn">{m.homeTeam}</span>
                        <span style={{ color: "var(--muted)", padding: "0 4px" }}>vs</span>
                        {renderTeamFlag(m.awayTeamId, 20)}
                        <span className="tn">{m.awayTeam}</span>
                      </div>
                    </td>
                    <td>
                      <strong>
                        {m.result?.homeScore} – {m.result?.awayScore}
                      </strong>
                    </td>
                    <td>{mPreds.length}</td>
                    <td>
                      <span className="bx bx-g">{exactsCount}</span>
                    </td>
                    <td>
                      <span style={{ color: "var(--gold)" }}>+{sumPts}</span>
                    </td>
                    <td>
                      <span className="bx bx-g">Calculado</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="ct">Log del motor</div>
        <div className="log" id="engineLog" role="log">
          {engineLogs.map((log, i) => (
            <div key={i}>
              {log.type === "ok" && <span style={{ color: "var(--green)" }}>[OK]</span>}
              {log.type === "info" && <span style={{ color: "var(--blue)" }}>[INF]</span>}
              {log.type === "muted" && <span style={{ color: "var(--muted)" }}>[LOG]</span>}
              {log.type === "err" && <span style={{ color: "var(--red)" }}>[ERR]</span>}
              {` ${log.time} — ${log.text}`}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
