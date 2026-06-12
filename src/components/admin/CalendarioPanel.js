"use client";

import React, { useState } from "react";

export default function CalendarioPanel({
  matches,
  loading,
  renderTeamFlag,
  activePanel,
  showToast
}) {
  const [calendarSearch, setCalendarSearch] = useState("");
  const [calendarPhaseFilter, setCalendarPhaseFilter] = useState("all");
  const [calendarPhaseTitle, setCalendarPhaseTitle] = useState("Todos los partidos");

  if (activePanel !== "calendario") return null;

  const getMatchPhase = (matchNumber) => {
    if (matchNumber <= 72) return "grupos";
    if (matchNumber <= 88) return "r32";
    if (matchNumber <= 96) return "r16";
    if (matchNumber <= 100) return "qf";
    if (matchNumber <= 102) return "sf";
    return "final";
  };

  const getFilteredCalendar = () => {
    let list = matches;
    if (calendarPhaseFilter !== "all") {
      list = list.filter((m) => getMatchPhase(m.matchNumber) === calendarPhaseFilter);
    }
    if (calendarSearch.trim()) {
      const q = calendarSearch.toLowerCase();
      list = list.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(q) ||
          m.awayTeam.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q) ||
          (m.group && m.group.toLowerCase().includes(q))
      );
    }
    return list;
  };

  const handleGoPhase = (phaseId, label) => {
    setCalendarPhaseFilter(phaseId);
    setCalendarPhaseTitle(label);
    if (showToast) {
      showToast(
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
        `Filtrando: ${label}`,
        ""
      );
    }
  };

  const filteredMatches = getFilteredCalendar();

  return (
    <section className="panel on">
      <div className="ph">
        <div>
          <div className="pt" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
            Calendario
          </div>
          <div className="ps">104 partidos — gestión de estados y visualización rápida</div>
        </div>
        <div className="sr" style={{ width: "210px", display: "flex", alignItems: "center" }}>
          <span className="sico" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </span>
          <input
            type="text"
            className="si2"
            placeholder="Buscar selección…"
            value={calendarSearch}
            onChange={(e) => setCalendarSearch(e.target.value)}
            aria-label="Buscar selección en calendario"
          />
        </div>
      </div>
      
      <div className="fx gap8 wrap" style={{ marginBottom: "16px" }}>
        <button
          className={`btn btn-o btn-sm ${calendarPhaseFilter === "all" ? "active" : ""}`}
          style={{ borderColor: calendarPhaseFilter === "all" ? "var(--green)" : "" }}
          onClick={() => handleGoPhase("all", "Todos los partidos")}
          type="button"
        >
          Todos
        </button>
        <button
          className={`btn btn-o btn-sm ${calendarPhaseFilter === "grupos" ? "active" : ""}`}
          style={{ borderColor: calendarPhaseFilter === "grupos" ? "var(--green)" : "" }}
          onClick={() => handleGoPhase("grupos", "Fase de Grupos (72)")}
          type="button"
        >
          Grupos (72)
        </button>
        <button
          className={`btn btn-o btn-sm ${calendarPhaseFilter === "r32" ? "active" : ""}`}
          style={{ borderColor: calendarPhaseFilter === "r32" ? "var(--green)" : "" }}
          onClick={() => handleGoPhase("r32", "Ronda 32 (16)")}
          type="button"
        >
          Ronda 32 (16)
        </button>
        <button
          className={`btn btn-o btn-sm ${calendarPhaseFilter === "r16" ? "active" : ""}`}
          style={{ borderColor: calendarPhaseFilter === "r16" ? "var(--green)" : "" }}
          onClick={() => handleGoPhase("r16", "Octavos (8)")}
          type="button"
        >
          Octavos (8)
        </button>
        <button
          className={`btn btn-o btn-sm ${calendarPhaseFilter === "qf" ? "active" : ""}`}
          style={{ borderColor: calendarPhaseFilter === "qf" ? "var(--green)" : "" }}
          onClick={() => handleGoPhase("qf", "Cuartos (4)")}
          type="button"
        >
          Cuartos (4)
        </button>
        <button
          className={`btn btn-o btn-sm ${calendarPhaseFilter === "sf" ? "active" : ""}`}
          style={{ borderColor: calendarPhaseFilter === "sf" ? "var(--green)" : "" }}
          onClick={() => handleGoPhase("sf", "Semifinales (2)")}
          type="button"
        >
          Semis (2)
        </button>
        <button
          className={`btn btn-o btn-sm ${calendarPhaseFilter === "final" ? "active" : ""}`}
          style={{ borderColor: calendarPhaseFilter === "final" ? "var(--green)" : "" }}
          onClick={() => handleGoPhase("final", "Gran Final / 3er Puesto")}
          type="button"
        >
          Final
        </button>
      </div>

      {loading ? (
        <div className="card text-center py-8">Cargando calendario...</div>
      ) : (
        <div className="card">
          <div className="ct" id="calTitle">
            {calendarPhaseTitle}
          </div>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Local</th>
                  <th>Marcador</th>
                  <th>Visitante</th>
                  <th>Fecha</th>
                  <th>Sede</th>
                  <th>Grupo/Fase</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.map((m, index) => {
                  const statusLabel =
                    m.status === "finished"
                      ? "Finalizado"
                      : m.status === "live"
                      ? "En vivo"
                      : "Pendiente";
                  const statusClass =
                    m.status === "finished"
                      ? "bx-g"
                      : m.status === "live"
                      ? "bx-b"
                      : "bx-a";
                  return (
                    <tr key={m.id}>
                      <td style={{ color: "var(--muted)" }}>{m.matchNumber || index + 1}</td>
                      <td>
                        <div className="ti">
                          {renderTeamFlag(m.homeTeamId, 20)}
                          <span className="tn">{m.homeTeam}</span>
                        </div>
                      </td>
                      <td>
                        <div className="sw">
                          <input
                            type="number"
                            className="si"
                            style={{ height: "30px", fontSize: ".9rem" }}
                            disabled
                            value={m.result?.homeScore ?? ""}
                            placeholder="–"
                            aria-label={`Goles local final ${m.homeTeam}`}
                          />
                          <span className="ss">–</span>
                          <input
                            type="number"
                            className="si"
                            style={{ height: "30px", fontSize: ".9rem" }}
                            disabled
                            value={m.result?.awayScore ?? ""}
                            placeholder="–"
                            aria-label={`Goles visitante final ${m.awayTeam}`}
                          />
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
                        <span className="bx bx-p" style={{ fontSize: ".7rem" }}>
                          {m.group || m.stage || "K.O."}
                        </span>
                      </td>
                      <td>
                        <span className={`bx ${statusClass}`}>{statusLabel}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
