"use client";

import React from "react";

export default function MarcadoresPanel({
  matches,
  loading,
  scores,
  setScores,
  statuses,
  setStatuses,
  updatingMatchId,
  marcadoresFilter,
  setMarcadoresFilter,
  onUpdateMatch,
  onRunEngine,
  engineState,
  lastCalcTime,
  lastCalcMatchesCount,
  engineLogs,
  showLogsConsole,
  setShowLogsConsole,
  renderTeamFlag,
  getTodayDateString,
  showToast
}) {
  const finishedCount = matches.filter((m) => m.status === "finished").length;
  const liveCount = matches.filter((m) => m.status === "live").length;
  const totalMatchesCount = matches.length;
  const todayDateStr = getTodayDateString();
  const pendingTodayCount = matches.filter(
    (m) => m.status === "scheduled" && m.date === todayDateStr
  ).length;

  const getFilteredMarcadores = () => {
    if (marcadoresFilter === "today") {
      return matches.filter((m) => m.date === todayDateStr);
    }
    return matches;
  };

  const filteredMatches = getFilteredMarcadores();

  return (
    <section className="panel on">
      <div className="ph">
        <div>
          <div className="pt" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <line x1="3" x2="21" y1="9" y2="9"/>
              <line x1="9" x2="9" y1="21" y2="9"/>
            </svg>
            Marcadores
          </div>
          <div className="ps">Ingresa resultados oficiales al finalizar cada partido</div>
        </div>
        <div className="fx gap8 wrap">
          <button
            className={`btn btn-o btn-sm ${marcadoresFilter === "all" ? "active" : ""}`}
            style={{ borderColor: marcadoresFilter === "all" ? "var(--green)" : "" }}
            onClick={() => {
              setMarcadoresFilter("all");
              showToast(
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
                "Mostrando todos los partidos"
              );
            }}
            type="button"
          >
            Todos
          </button>
          <button
            className={`btn btn-o btn-sm ${marcadoresFilter === "today" ? "active" : ""}`}
            style={{ borderColor: marcadoresFilter === "today" ? "var(--green)" : "" }}
            onClick={() => {
              setMarcadoresFilter("today");
              showToast(
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
                "Filtrando: hoy"
              );
            }}
            type="button"
          >
            Hoy
          </button>
          <button
            className="btn btn-y btn-sm"
            onClick={() => onRunEngine()}
            disabled={engineState === "running"}
            type="button"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Calcular Puntos
          </button>
        </div>
      </div>

      <div className="stats">
        <div className="sbox">
          <div className="sv" style={{ color: "var(--muted)" }}>{pendingTodayCount}</div>
          <div className="sl">Pendientes hoy</div>
        </div>
        <div className="sbox">
          <div className="sv" style={{ color: "var(--green)" }}>{finishedCount}</div>
          <div className="sl">Finalizados</div>
        </div>
        <div className="sbox">
          <div className="sv" style={{ color: "var(--amber)" }}>{liveCount}</div>
          <div className="sl">En vivo</div>
        </div>
        <div className="sbox">
          <div className="sv" style={{ color: "var(--blue)" }}>{totalMatchesCount}</div>
          <div className="sl">Total partidos</div>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-8">Cargando partidos...</div>
      ) : filteredMatches.length === 0 ? (
        <div className="card text-center py-8">
          {marcadoresFilter === "today"
            ? `No hay partidos programados para hoy (${todayDateStr}). Filtra por "Todos" para editarlos.`
            : "No se encontraron partidos."}
        </div>
      ) : (
        <div className="card">
          <div className="ct">
            {marcadoresFilter === "today" ? `Partidos de hoy — ${todayDateStr}` : "Todos los partidos"}
          </div>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Local</th>
                  <th>Marcador</th>
                  <th>Visitante</th>
                  <th>Fecha/Hora</th>
                  <th>Sede</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.map((m) => {
                  const isUpdating = updatingMatchId === m.id;
                  const currentStatus = statuses[m.id] || "scheduled";
                  const homeVal = scores[m.id]?.homeScore ?? "";
                  const awayVal = scores[m.id]?.awayScore ?? "";

                  return (
                    <tr key={m.id}>
                      <td>
                        <div className="ti">
                          {renderTeamFlag(m.homeTeamId, 20)}
                          <span className="tn">{m.homeTeam}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div className="sw">
                            <input
                              type="number"
                              className="si"
                              min="0"
                              max="30"
                              placeholder="0"
                              disabled={currentStatus === "scheduled"}
                              value={homeVal}
                              onChange={(e) => {
                                const val = e.target.value;
                                setScores((prev) => ({
                                  ...prev,
                                  [m.id]: {
                                    ...prev[m.id],
                                    homeScore: val === "" ? "" : parseInt(val, 10)
                                  }
                                }));
                              }}
                              aria-label={`Goles local para ${m.homeTeam}`}
                            />
                            <span className="ss">–</span>
                            <input
                              type="number"
                              className="si"
                              min="0"
                              max="30"
                              placeholder="0"
                              disabled={currentStatus === "scheduled"}
                              value={awayVal}
                              onChange={(e) => {
                                const val = e.target.value;
                                setScores((prev) => ({
                                  ...prev,
                                  [m.id]: {
                                    ...prev[m.id],
                                    awayScore: val === "" ? "" : parseInt(val, 10)
                                  }
                                }));
                              }}
                              aria-label={`Goles visitante para ${m.awayTeam}`}
                            />
                          </div>
                          {m.stage && m.stage !== "Group Stage" && m.stage !== "Fase de Grupos" && currentStatus !== "scheduled" && (
                            <div style={{ marginTop: "6px" }}>
                              <select
                                className="fsel"
                                style={{ padding: "2px 6px", fontSize: ".7rem", minWidth: "110px", width: "auto", background: "var(--surface3)" }}
                                value={scores[m.id]?.advancingTeamId || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setScores((prev) => ({
                                    ...prev,
                                    [m.id]: {
                                      ...prev[m.id],
                                      advancingTeamId: val
                                    }
                                  }));
                                }}
                                aria-label="Seleccionar equipo que avanza"
                              >
                                <option value="">Avanza...</option>
                                <option value={m.homeTeamId}>{m.homeTeam}</option>
                                <option value={m.awayTeamId}>{m.awayTeam}</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="ti">
                          {renderTeamFlag(m.awayTeamId, 20)}
                          <span className="tn">{m.awayTeam}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--muted)", fontSize: ".8125rem" }}>
                        {m.date} · {m.time}
                      </td>
                      <td style={{ color: "var(--muted)", fontSize: ".8125rem" }}>
                        {m.venue}
                      </td>
                      <td>
                        <select
                          className="fsel"
                          style={{ padding: "4px 8px", width: "auto", fontSize: ".8rem" }}
                          value={currentStatus}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStatuses((prev) => ({ ...prev, [m.id]: val }));
                          }}
                          aria-label={`Estado del partido ${m.homeTeam} vs ${m.awayTeam}`}
                        >
                          <option value="scheduled">Pendiente</option>
                          <option value="live">En vivo</option>
                          <option value="finished">Finalizado</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-g btn-sm"
                          disabled={isUpdating}
                          onClick={() => onUpdateMatch(m.id)}
                          type="button"
                        >
                          {isUpdating ? "..." : "Guardar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card mt">
        <div className="ct">Motor de puntuación</div>
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
            <div style={{ fontWeight: 600, fontSize: ".9375rem" }}>
              Estado: <span>{engineState === "running" ? "Ejecutando..." : engineState === "completed" ? "Completado" : "Inactivo"}</span>
            </div>
            <div style={{ fontSize: ".8125rem", color: "var(--muted)" }}>
              Último cálculo: <span>{lastCalcTime} · {lastCalcMatchesCount} partidos</span>
            </div>
          </div>
          <div className="ml fx gap8">
            <button
              className="btn btn-o btn-sm"
              onClick={() => setShowLogsConsole(!showLogsConsole)}
              type="button"
            >
              {showLogsConsole ? "Ocultar log" : "Ver log"}
            </button>
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
              {engineState === "running" ? "Procesando..." : "Ejecutar"}
            </button>
          </div>
        </div>

        {showLogsConsole && (
          <div style={{ marginTop: "10px" }}>
            <div className="log" role="log">
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
        )}
      </div>
    </section>
  );
}
