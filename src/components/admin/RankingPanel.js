"use client";

import React, { useState } from "react";

export default function RankingPanel({
  usersList,
  entryFee,
  onTogglePayment,
  onExportCSV,
  activePanel,
  loading,
  showToast
}) {
  const [rankingSearch, setRankingSearch] = useState("");

  if (activePanel !== "ranking") return null;

  const activeUsersCount = usersList.filter((u) => u.paymentStatus === "active").length;
  const pendingUsersCount = usersList.filter((u) => u.paymentStatus === "pending").length;
  const totalRevenue = activeUsersCount * (entryFee || 0);

  const getFilteredRanking = () => {
    let list = [...usersList].sort((a, b) => {
      if ((b.points || 0) !== (a.points || 0)) {
        return (b.points || 0) - (a.points || 0);
      }
      if ((b.correctScores || 0) !== (a.correctScores || 0)) {
        return (b.correctScores || 0) - (a.correctScores || 0);
      }
      const errorA = a.globalErrorMargin || 0;
      const errorB = b.globalErrorMargin || 0;
      if (errorA !== errorB) {
        return errorA - errorB;
      }
      const timeA = a.paymentReceiptUploadedAt ? new Date(a.paymentReceiptUploadedAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : Infinity);
      const timeB = b.paymentReceiptUploadedAt ? new Date(b.paymentReceiptUploadedAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : Infinity);
      return timeA - timeB;
    });
    if (rankingSearch.trim()) {
      const q = rankingSearch.toLowerCase();
      list = list.filter(
        (u) =>
          (u.displayName && u.displayName.toLowerCase().includes(q)) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const filteredRanking = getFilteredRanking();

  return (
    <section className="panel on">
      <div className="ph">
        <div>
          <div className="pt" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
              <path d="M12 2a6 6 0 0 1 6 6v3.34a6 6 0 0 1-3.62 5.5l-2.38.83-2.38-.83A6 6 0 0 1 6 11.34V8a6 6 0 0 1 6-6z" />
            </svg>
            Ranking
          </div>
          <div className="ps">Tabla de posiciones y gestión de estados de pago</div>
        </div>
        <div className="fx gap8 fxc wrap">
          <div className="sr" style={{ width: "190px", display: "flex", alignItems: "center" }}>
            <span className="sico" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
            <input
              type="text"
              className="si2"
              placeholder="Usuario o email…"
              value={rankingSearch}
              onChange={(e) => setRankingSearch(e.target.value)}
              aria-label="Buscar participante"
            />
          </div>
          <button className="btn btn-o btn-sm" onClick={onExportCSV} type="button">
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="stats">
        <div className="sbox">
          <div className="sv" style={{ color: "var(--green)" }}>{activeUsersCount}</div>
          <div className="sl">Activos</div>
        </div>
        <div className="sbox">
          <div className="sv" style={{ color: "var(--amber)" }}>{pendingUsersCount}</div>
          <div className="sl">Pendientes pago</div>
        </div>
        <div className="sbox">
          <div className="sv" style={{ color: "var(--blue)" }}>{usersList.length}</div>
          <div className="sl">Registrados</div>
        </div>
        <div className="sbox">
          <div className="sv" style={{ color: "var(--gold)" }}>B/.{totalRevenue}</div>
          <div className="sl">Recaudado</div>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-8">Cargando ranking...</div>
      ) : (
        <div className="card">
          <div className="ct">Tabla de Posiciones</div>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Participante</th>
                  <th>Puntos</th>
                  <th>Exactos</th>
                  <th>Pronóst.</th>
                  <th>Pago</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredRanking.map((u, i) => {
                  const isPaid = u.paymentStatus === "active";
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className={`rpos ${i === 0 ? "g" : i === 1 ? "s" : i === 2 ? "b" : ""}`}>
                          {i + 1}
                        </div>
                      </td>
                      <td>
                        <div className="uc">
                          <div className="uav" aria-hidden="true" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                          <div>
                            <div className="un">{u.displayName || u.email.split("@")[0]}</div>
                            <div className="ue">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong
                          style={{
                            fontFamily: "var(--font-d)",
                            fontSize: "1.2rem",
                            color: "var(--gold)"
                          }}
                        >
                          {u.points || 0}
                        </strong>
                      </td>
                      <td>
                        <span className="bx bx-g" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          {u.correctScores || 0}
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                          </svg>
                        </span>
                      </td>
                      <td style={{ color: "var(--muted)" }}>{u.predictionsCount || 0}/104</td>
                      <td>
                        <label
                          className="tog"
                          title={isPaid ? "Activo (Pago Aprobado)" : "Pendiente de pago"}
                          htmlFor={`payment-chk-${u.id}`}
                        >
                          <input
                            id={`payment-chk-${u.id}`}
                            type="checkbox"
                            checked={isPaid}
                            onChange={() => onTogglePayment(u.id, isPaid)}
                          />
                          <span className="tslide" />
                        </label>
                      </td>
                      <td>
                        <button
                          className="btn btn-o btn-sm"
                          onClick={() =>
                            showToast(
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
                              `Visualizando perfil de ${u.displayName || "usuario"}`
                            )
                          }
                          type="button"
                        >
                          Ver
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
    </section>
  );
}
