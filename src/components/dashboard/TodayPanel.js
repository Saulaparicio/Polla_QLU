"use client";

import MatchCard from "./MatchCard";

export default function TodayPanel({
  liveOrRecentMatches,
  todayMatches,
  predictions,
  savingId,
  successId,
  user,
  handleInputChange,
  handleSavePrediction,
  setPredictions
}) {
  const pendingCount = todayMatches.filter(m => !predictions[m.id]?.saved).length;

  return (
    <div className="panel active animate-fade-in">
      {/* TOP SECTION: Marcadores en Vivo y Resultados */}
      {liveOrRecentMatches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FFD700] flex items-center gap-1.5 font-mono">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              ⚡ Marcadores en Vivo y Resultados Recientes
            </h3>
            <span className="text-xs text-[#5E7A9E] font-mono font-semibold">Jornada Activa</span>
          </div>
          <div className="space-y-3 mb-4">
            {liveOrRecentMatches.map((m) => (
              <MatchCard 
                key={m.id}
                match={m}
                predictions={predictions}
                savingId={savingId}
                successId={successId}
                user={user}
                handleInputChange={handleInputChange}
                handleSavePrediction={handleSavePrediction}
                setPredictions={setPredictions}
              />
            ))}
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#1C2E48] to-transparent my-6" />
        </div>
      )}

      <div 
        id="today-intro" 
        style={{ 
          marginBottom: 16, 
          padding: "14px 18px", 
          backgroundColor: "var(--surface)", 
          border: "1px solid var(--border)", 
          borderRadius: "var(--r-l)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          flexWrap: "wrap", 
          gap: 8 
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>⚽ Partidos de hoy — Predicciones Activas</div>
          <div style={{ fontSize: "0.8125rem", color: "var(--muted)", marginTop: 3 }}>
            {todayMatches.length} {todayMatches.length === 1 ? "partido disponible" : "partidos disponibles"} · {pendingCount} sin guardar
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "var(--amber)", fontWeight: 600 }}>
          <span 
            style={{ 
              animation: "lp 1.5s infinite", 
              display: "inline-block", 
              width: 6, 
              height: 6, 
              borderRadius: "50%", 
              backgroundColor: "var(--amber)" 
            }}
          ></span>
          Cierran al silbato inicial
        </div>
      </div>

      {todayMatches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚽</div>
          <div className="empty-text">No hay partidos activos por pronosticar hoy.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {todayMatches.map((m) => (
            <MatchCard 
              key={m.id}
              match={m}
              predictions={predictions}
              savingId={savingId}
              successId={successId}
              user={user}
              handleInputChange={handleInputChange}
              handleSavePrediction={handleSavePrediction}
              setPredictions={setPredictions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
