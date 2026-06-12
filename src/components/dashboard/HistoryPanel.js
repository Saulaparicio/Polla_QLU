"use client";

import HistoryCard from "./HistoryCard";

export default function HistoryPanel({ historyMatches, predictions }) {
  return (
    <div className="panel active animate-fade-in">
      <div className="bg-[#0D1A2D] border border-[#1C2E48] rounded-xl p-4 mb-4">
        <div className="font-bold text-sm text-white flex items-center gap-1.5">📝 Historial de Partidos Finalizados</div>
        <div className="text-xs text-[#5E7A9E] mt-0.5">Resultados finales oficiales y puntos obtenidos.</div>
      </div>

      {historyMatches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <div className="empty-text">Aún no hay partidos evaluados en el historial.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {historyMatches.map((m) => (
            <HistoryCard 
              key={m.id}
              match={m}
              predictions={predictions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
