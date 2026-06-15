"use client";

import React, { useState, useEffect } from "react";

export default function NotifPanel({
  missingPredictionsList,
  matches,
  rules,
  notifHistory,
  onSendNotif,
  activePanel,
  loading,
  renderTeamFlag
}) {
  const [checkedMatches, setCheckedMatches] = useState({});
  const [notifChannel, setNotifChannel] = useState("email");
  const [notifRecipients, setNotifRecipients] = useState("missing");
  const [notifSubject, setNotifSubject] = useState("¡No te pierdas los partidos de mañana!");
  const [notifBody, setNotifBody] = useState(
    `Hola {nombre},\n\nTe escribimos porque aún no has ingresado tus pronósticos para:\n\n{partidos_pendientes}\n\nTienes tiempo hasta {tiempo_cierre} para completarlos.\n\n¡Buena suerte!\nEquipo Polla Mundialista`
  );

  // Sync checked matches when the missingPredictionsList loads
  useEffect(() => {
    const initialChecked = {};
    missingPredictionsList.forEach((m) => {
      initialChecked[m.id] = false;
    });
    setCheckedMatches(initialChecked);
  }, [missingPredictionsList]);

  if (activePanel !== "notif") return null;

  const handleToggleMatchSelect = (mId) => {
    setCheckedMatches((prev) => ({ ...prev, [mId]: !prev[mId] }));
  };

  const handleSelectAllMatches = (val) => {
    const updated = {};
    missingPredictionsList.forEach((m) => {
      updated[m.id] = val;
    });
    setCheckedMatches(updated);
  };

  const handleSendNotifClick = () => {
    const selectedMatchIds = Object.keys(checkedMatches).filter((id) => checkedMatches[id]);
    if (selectedMatchIds.length === 0) {
      alert("Por favor selecciona al menos un partido de la lista.");
      return;
    }
    onSendNotif({
      selectedMatchIds,
      channel: notifChannel,
      recipients: notifRecipients,
      subject: notifSubject,
      body: notifBody
    });
  };

  const handleSendAllNotifsClick = () => {
    // Select all first
    const updated = {};
    missingPredictionsList.forEach((m) => {
      updated[m.id] = true;
    });
    setCheckedMatches(updated);

    // Call send
    const selectedMatchIds = missingPredictionsList.map((m) => m.id);
    if (selectedMatchIds.length === 0) {
      alert("No hay partidos con predicciones faltantes para enviar recordatorios.");
      return;
    }
    onSendNotif({
      selectedMatchIds,
      channel: notifChannel,
      recipients: notifRecipients,
      subject: notifSubject,
      body: notifBody
    });
  };

  const handlePreviewNotif = () => {
    const selectedMatchIds = Object.keys(checkedMatches).filter((id) => checkedMatches[id]);
    const selectedList = matches.filter((m) => selectedMatchIds.includes(m.id));
    const pendingText =
      selectedList.length > 0
        ? selectedList.map((m) => `• ${m.homeTeam} vs ${m.awayTeam} (${m.time})`).join("\n")
        : "• México vs Bolivia (12:00)\n• Brasil vs Costa Rica (21:00) (Muestra)";

    const previewMsg = notifBody
      .replace(/{nombre}/g, "Carlos G.")
      .replace(/{partidos_pendientes}/g, pendingText)
      .replace(
        /{tiempo_cierre}/g,
        `${rules.closeHours || 1} hora${(rules.closeHours || 1) > 1 ? "s" : ""} antes del partido`
      );

    alert(`Vista Previa del Mensaje:\n\nAsunto: ${notifSubject}\n-----------------------------------\n${previewMsg}`);
  };

  const selectedCount = Object.keys(checkedMatches).filter((id) => checkedMatches[id]).length;

  return (
    <section className="panel on">
      <div className="ph">
        <div>
          <div className="pt" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            Notificaciones
          </div>
          <div className="ps">Recordatorios a participantes con pronósticos pendientes</div>
        </div>
        <button className="btn btn-p" onClick={handleSendAllNotifsClick} type="button" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Enviar todos
        </button>
      </div>

      <div className="card">
        <div className="ct">Partidos con pronósticos faltantes</div>

        {loading ? (
          <div>Cargando...</div>
        ) : missingPredictionsList.length === 0 ? (
          <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>
            No hay partidos pendientes sin pronósticos.
          </div>
        ) : (
          <div id="nmList">
            {missingPredictionsList.map((m) => (
              <div className="nm" key={m.id}>
                <input
                  type="checkbox"
                  className="nchk"
                  checked={!!checkedMatches[m.id]}
                  onChange={() => handleToggleMatchSelect(m.id)}
                  aria-label={`Seleccionar partido ${m.homeTeam} vs ${m.awayTeam}`}
                />
                <div className="nmt" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {renderTeamFlag(m.homeTeamId, 18)}
                  <span>{m.homeTeam}</span>
                  <span style={{ color: "var(--muted)", fontWeight: "normal" }}>vs</span>
                  {renderTeamFlag(m.awayTeamId, 18)}
                  <span>{m.awayTeam}</span>
                </div>
                <div className="nmc">
                  <span style={{ color: "var(--muted)", fontSize: ".8125rem" }}>
                    {m.date} · {m.time}
                  </span>
                  <span className="miss" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    {m.missing} sin pronóstico
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="fx gap8 fxc" style={{ marginTop: "16px", flexWrap: "wrap" }}>
          <button
            className="btn btn-o btn-sm"
            onClick={() => handleSelectAllMatches(true)}
            type="button"
          >
            Seleccionar todos
          </button>
          <button
            className="btn btn-o btn-sm"
            onClick={() => handleSelectAllMatches(false)}
            type="button"
          >
            Deseleccionar
          </button>
          <span className="ml" style={{ color: "var(--muted)", fontSize: ".8125rem", alignSelf: "center" }}>
            <span id="selCount">{selectedCount}</span> partidos seleccionados
          </span>
        </div>
      </div>

      <div className="card">
        <div className="ct">Redactar mensaje</div>
        <div className="fr">
          <div className="fg">
            <label className="fl" htmlFor="nch">Canal de envío</label>
            <select
              className="fsel"
              id="nch"
              value={notifChannel}
              onChange={(e) => setNotifChannel(e.target.value)}
            >
              <option value="email">Correo electrónico</option>
              <option value="wa">WhatsApp</option>
              <option value="both">Correo y WhatsApp</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl" htmlFor="nrec">Destinatarios</label>
            <select
              className="fsel"
              id="nrec"
              value={notifRecipients}
              onChange={(e) => setNotifRecipients(e.target.value)}
            >
              <option value="missing">Sin pronósticos pendientes</option>
              <option value="pending_pay">Pago pendiente</option>
              <option value="active">Todos los activos</option>
            </select>
          </div>
        </div>
        <div className="fg">
          <label className="fl" htmlFor="nsub">Asunto</label>
          <input
            type="text"
            className="fi"
            id="nsub"
            value={notifSubject}
            onChange={(e) => setNotifSubject(e.target.value)}
          />
        </div>
        <div className="fg">
          <label className="fl" htmlFor="nbody">Mensaje</label>
          <textarea
            className="fta"
            id="nbody"
            value={notifBody}
            onChange={(e) => setNotifBody(e.target.value)}
          />
        </div>
        <div className="fx gap8 fxc wrap" style={{ marginTop: "16px" }}>
          <button className="btn btn-o btn-sm" onClick={handlePreviewNotif} type="button" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Vista previa
          </button>
          <button
            className="btn btn-p"
            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}
            onClick={handleSendNotifClick}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Enviar recordatorio
          </button>
        </div>
      </div>

      <div className="card">
        <div className="ct">Historial de envíos</div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Destinatarios</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {notifHistory.map((nh, i) => (
                <tr key={nh.id || i}>
                  <td>{nh.date}</td>
                  <td>{nh.type}</td>
                  <td>{nh.recipients}</td>
                  <td>
                    <span className="bx bx-g">{nh.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
