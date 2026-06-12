"use client";

import React from "react";

export default function ReglasPanel({
  rules,
  onRuleChange,
  onSaveRules,
  activePanel
}) {
  if (activePanel !== "reglas") return null;

  return (
    <section className="panel on">
      <div className="ph">
        <div>
          <div className="pt" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
            Reglas del Torneo
          </div>
          <div className="ps">Configura el sistema de puntuación y políticas de la quiniela</div>
        </div>
        <button className="btn btn-g" onClick={onSaveRules} type="button" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Guardar cambios
        </button>
      </div>

      <div className="card">
        <div className="ct">Sistema de Puntuación</div>
        <div className="rc">
          <div className="ri">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="rn">Resultado Exacto</div>
            <div className="rd">Acierta el marcador exacto (ej: 2-1 correcto)</div>
          </div>
          <div className="rp">
            <input
              type="number"
              className="pi"
              min="0"
              max="10"
              value={rules.ptsExact ?? 3}
              onChange={(e) => onRuleChange("ptsExact", parseInt(e.target.value, 10) || 0)}
              aria-label="Puntos por resultado exacto"
            />
            <span className="pl">pts</span>
          </div>
        </div>
        <div className="rc">
          <div className="ri">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m16 16 3-8 3 8c-.87.65-2.24 1-3 1s-2.13-.35-3-1Z" />
              <path d="m2 16 3-8 3 8c-.87.65-2.24 1-3 1s-2.13-.35-3-1Z" />
              <path d="M7 21h10" />
              <path d="M12 3v18" />
              <path d="M3 7h18" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="rn">Ganador + Diferencia</div>
            <div className="rd">Acierta el ganador y la diferencia exacta de goles</div>
          </div>
          <div className="rp">
            <input
              type="number"
              className="pi"
              min="0"
              max="10"
              value={rules.ptsDiff ?? 2}
              onChange={(e) => onRuleChange("ptsDiff", parseInt(e.target.value, 10) || 0)}
              aria-label="Puntos por ganador y diferencia"
            />
            <span className="pl">pts</span>
          </div>
        </div>
        <div className="rc">
          <div className="ri">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="rn">Solo Ganador Correcto</div>
            <div className="rd">Acierta quién gana, sin importar el marcador</div>
          </div>
          <div className="rp">
            <input
              type="number"
              className="pi"
              min="0"
              max="10"
              value={rules.ptsWin ?? 1}
              onChange={(e) => onRuleChange("ptsWin", parseInt(e.target.value, 10) || 0)}
              aria-label="Puntos por ganador"
            />
            <span className="pl">pts</span>
          </div>
        </div>
        <div className="rc">
          <div className="ri">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <line x1="8" x2="16" y1="10" y2="10"/>
              <line x1="8" x2="16" y1="14" y2="14"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="rn">Empate Exacto</div>
            <div className="rd">Predice empate y el partido termina en empate exacto</div>
          </div>
          <div className="rp">
            <input
              type="number"
              className="pi"
              min="0"
              max="10"
              value={rules.ptsDraw ?? 3}
              onChange={(e) => onRuleChange("ptsDraw", parseInt(e.target.value, 10) || 0)}
              aria-label="Puntos por empate exacto"
            />
            <span className="pl">pts</span>
          </div>
        </div>
        <div
          className="rc"
          style={{ borderColor: "var(--gold-alpha20)", background: "var(--gold-alpha05)" }}
        >
          <div className="ri">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="rn">Comodín (multiplicador)</div>
            <div className="rd">Multiplica los puntos en el partido marcado como comodín</div>
          </div>
          <div className="rp">
            <input
              type="number"
              className="pi"
              min="1"
              max="5"
              style={{ color: "var(--gold)" }}
              value={rules.ptsCom ?? 2}
              onChange={(e) => onRuleChange("ptsCom", parseInt(e.target.value, 10) || 1)}
              aria-label="Multiplicador por comodín"
            />
            <span className="pl">×</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="ct">Políticas de Predicción</div>
        <div className="fr">
          <div className="fg">
            <label className="fl" htmlFor="closeHours">
              Cierre de predicciones (horas antes del partido)
            </label>
            <input
              id="closeHours"
              type="number"
              className="fi"
              min="0"
              max="24"
              value={rules.closeHours ?? 1}
              onChange={(e) => onRuleChange("closeHours", parseInt(e.target.value, 10) || 0)}
            />
            <span className="fh">Se bloquean automáticamente N horas antes del inicio</span>
          </div>
          <div className="fg">
            <label className="fl" htmlFor="entryFee">
              Precio de inscripción (B/.)
            </label>
            <input
              id="entryFee"
              type="number"
              className="fi"
              min="0"
              step="5"
              value={rules.entryFee ?? 15}
              onChange={(e) => onRuleChange("entryFee", parseInt(e.target.value, 10) || 0)}
            />
            <span className="fh">Se muestra en el módulo de pagos Yappy</span>
          </div>
        </div>
        <div className="fr">
          <div className="fg">
            <label className="fl" htmlFor="quinielaName">
              Nombre de la quiniela
            </label>
            <input
              id="quinielaName"
              type="text"
              className="fi"
              value={rules.quinielaName ?? "QLU MatchPredict"}
              onChange={(e) => onRuleChange("quinielaName", e.target.value)}
            />
          </div>
          <div className="fg">
            <label className="fl" htmlFor="yappyNumber">
              Número de Yappy para cobros
            </label>
            <input
              id="yappyNumber"
              type="text"
              className="fi"
              value={rules.yappyNumber ?? ""}
              onChange={(e) => onRuleChange("yappyNumber", e.target.value)}
            />
            <span className="fh">Se muestra a los participantes en el módulo de pagos</span>
          </div>
        </div>
        <div className="fg">
          <label className="fl" htmlFor="welcomeMsg">
            Mensaje de bienvenida
          </label>
          <textarea
            id="welcomeMsg"
            className="fta"
            value={rules.welcomeMsg ?? ""}
            onChange={(e) => onRuleChange("welcomeMsg", e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="ct">Controles del Torneo</div>
        <div className="trow">
          <div className="trinfo">
            <div className="trn">Habilitar cobro por Yappy</div>
            <div className="trd">Activa la obligatoriedad de verificar pagos e inscripción vía Yappy</div>
          </div>
          <label className="tog" htmlFor="yappyPaymentEnabled">
            <input
              id="yappyPaymentEnabled"
              type="checkbox"
              checked={rules.yappyPaymentEnabled !== false}
              onChange={(e) => onRuleChange("yappyPaymentEnabled", e.target.checked)}
            />
            <span className="tslide" />
          </label>
        </div>
        <div className="trow">
          <div className="trinfo">
            <div className="trn">Inscripciones abiertas</div>
            <div className="trd">Permite nuevos registros de participantes</div>
          </div>
          <label className="tog" htmlFor="regOpen">
            <input
              id="regOpen"
              type="checkbox"
              checked={!!rules.regOpen}
              onChange={(e) => onRuleChange("regOpen", e.target.checked)}
            />
            <span className="tslide" />
          </label>
        </div>
        <div className="trow">
          <div className="trinfo">
            <div className="trn">Ranking público visible</div>
            <div className="trd">Los participantes pueden ver la tabla de posiciones</div>
          </div>
          <label className="tog" htmlFor="rankVisible">
            <input
              id="rankVisible"
              type="checkbox"
              checked={!!rules.rankVisible}
              onChange={(e) => onRuleChange("rankVisible", e.target.checked)}
            />
            <span className="tslide" />
          </label>
        </div>
        <div className="trow">
          <div className="trinfo">
            <div className="trn">Modo mantenimiento</div>
            <div className="trd">Bloquea el acceso de usuarios normales</div>
          </div>
          <label className="tog" htmlFor="maintenanceMode">
            <input
              id="maintenanceMode"
              type="checkbox"
              checked={!!rules.maintenanceMode}
              onChange={(e) => onRuleChange("maintenanceMode", e.target.checked)}
            />
            <span className="tslide" />
          </label>
        </div>
        <div className="trow">
          <div className="trinfo">
            <div className="trn">Notificaciones automáticas</div>
            <div className="trd">Envía recordatorios automáticos antes del cierre</div>
          </div>
          <label className="tog" htmlFor="autoNotif">
            <input
              id="autoNotif"
              type="checkbox"
              checked={!!rules.autoNotif}
              onChange={(e) => onRuleChange("autoNotif", e.target.checked)}
            />
            <span className="tslide" />
          </label>
        </div>
      </div>
    </section>
  );
}
