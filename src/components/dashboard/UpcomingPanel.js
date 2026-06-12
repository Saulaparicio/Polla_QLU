"use client";

import MatchCard from "./MatchCard";

export default function UpcomingPanel({
  upcomingMatches,
  predictions,
  savingId,
  successId,
  user,
  handleInputChange,
  handleSavePrediction,
  setPredictions
}) {
  return (
    <div className="panel active animate-fade-in">
      <div className="bg-[#0D1A2D] border border-[#1C2E48] rounded-xl p-4 mb-4">
        <div className="font-bold text-sm text-white">Próximos Partidos del Mundial</div>
        <div className="text-xs text-[#5E7A9E] mt-0.5">Partidos futuros del fixture. Registra tus resultados con anticipación.</div>
      </div>

      {upcomingMatches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-text">No hay más partidos futuros programados.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingMatches.map((m) => (
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
