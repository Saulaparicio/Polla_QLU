"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, query, orderBy, getDocs, doc, setDoc, getDoc, updateDoc, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TEAM_ISO_CODES } from "@/lib/teamsData";
import { formatDateEs, formatTime12h } from "@/lib/dateUtils";
import Flag from "@/components/Flag";
import { Trophy, ShieldAlert, Sparkles, Check, Save, Loader2, Lock } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function PredictionsPage() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [userRank, setUserRank] = useState("-");

  // Podium States
  const [championPred, setChampionPred] = useState("");
  const [thirdPlacePred, setThirdPlacePred] = useState("");
  const [savingPodium, setSavingPodium] = useState(false);
  const [podiumSuccess, setPodiumSuccess] = useState(false);

  const renderTeamFlag = (teamId, size = 30) => {
    if (teamId && TEAM_ISO_CODES[teamId]) {
      return <Flag code={TEAM_ISO_CODES[teamId]} size={size} />;
    }
    return <span style={{ fontSize: size + "px" }}>🏳️</span>;
  };

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Fetch all users to calculate rank
  useEffect(() => {
    if (!user) return;
    async function fetchRank() {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const usersList = [];
        usersSnap.forEach((doc) => {
          usersList.push({ uid: doc.id, ...doc.data() });
        });
        usersList.sort((a, b) => (b.points || 0) - (a.points || 0));
        const uIndex = usersList.findIndex((u) => u.uid === user.uid);
        if (uIndex !== -1) {
          setUserRank(`#${uIndex + 1}`);
        }
      } catch (e) {
        console.error("Error calculating user rank:", e);
      }
    }
    fetchRank();
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        // Fetch Matches
        const matchesQuery = query(collection(db, "matches"), orderBy("matchNumber", "asc"));
        const matchesSnap = await getDocs(matchesQuery);
        const matchesList = [];
        matchesSnap.forEach((doc) => {
          matchesList.push({ id: doc.id, ...doc.data() });
        });
        // Sort chronologically (date and time)
        matchesList.sort((a, b) => {
          const dateA = a.date || "";
          const dateB = b.date || "";
          
          // Put TBD at the end
          if (dateA === "TBD" && dateB !== "TBD") return 1;
          if (dateB === "TBD" && dateA !== "TBD") return -1;
          
          if (dateA !== dateB) {
            return dateA.localeCompare(dateB);
          }
          
          const timeA = a.time || "";
          const timeB = b.time || "";
          if (timeA === "TBD" && timeB !== "TBD") return 1;
          if (timeB === "TBD" && timeA !== "TBD") return -1;
          
          if (timeA !== timeB) {
            return timeA.localeCompare(timeB);
          }
          
          return (a.matchNumber || 0) - (b.matchNumber || 0);
        });
        setMatches(matchesList);

        // Fetch User Doc for Podium
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const uData = userSnap.data();
          setChampionPred(uData.championPrediction || "");
          setThirdPlacePred(uData.thirdPlacePrediction || "");
        }

        // Fetch User's Predictions
        const userPreds = {};
        const myPredsQuery = query(collection(db, "predictions"), where("userId", "==", user.uid));
        const myPredsSnap = await getDocs(myPredsQuery);
        myPredsSnap.forEach((doc) => {
          const data = doc.data();
          userPreds[data.matchId] = {
            homeScore: data.homeScore,
            awayScore: data.awayScore,
            advancingTeamId: data.advancingTeamId || "",
            saved: true
          };
        });
        setPredictions(userPreds);
      } catch (error) {
        console.error("Error fetching predictions data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleInputChange = (matchId, team, value) => {
    const parsedVal = (team === "homeScore" || team === "awayScore")
      ? (value === "" ? "" : parseInt(value, 10))
      : value;
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: parsedVal,
        saved: false
      }
    }));
  };

  const handleSavePrediction = async (matchId) => {
    const pred = predictions[matchId];
    if (pred?.homeScore === undefined || pred?.homeScore === "" || pred?.awayScore === undefined || pred?.awayScore === "") {
      alert("Por favor ingresa marcadores válidos.");
      return;
    }

    // Lock predictions check (15 minutes before kickoff)
    const match = matches.find(m => m.id === matchId);
    if (match) {
      const matchDate = new Date(`${match.date}T${match.time}:00`);
      const now = new Date();
      if (matchDate - now <= 15 * 60 * 1000) {
        alert("Las predicciones para este partido ya están cerradas (cierran 15 minutos antes del inicio).");
        return;
      }
    }

    setSavingId(matchId);
    try {
      const docId = `${user.uid}_${matchId}`;
      const outcome = pred.homeScore > pred.awayScore ? "home" : pred.homeScore < pred.awayScore ? "away" : "draw";
      
      let advancingTeamId = pred.advancingTeamId || null;
      if (pred.homeScore > pred.awayScore) {
        advancingTeamId = match?.homeTeamId || null;
      } else if (pred.awayScore > pred.homeScore) {
        advancingTeamId = match?.awayTeamId || null;
      }

      const predictionData = {
        userId: user.uid,
        userDisplayName: user.displayName,
        matchId: matchId,
        homeScore: pred.homeScore,
        awayScore: pred.awayScore,
        outcome: outcome,
        points: null, // Scored later by admin
        advancingTeamId: advancingTeamId,
        updatedAt: new Date().toISOString()
      };

      // Write prediction to Firestore
      await setDoc(doc(db, "predictions", docId), predictionData);

      // Mark as saved locally
      setPredictions((prev) => ({
        ...prev,
        [matchId]: {
          ...prev[matchId],
          saved: true
        }
      }));

      // Update predictions count for user
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        // Recount predictions using a server-side count query
        const myPredsQuery = query(collection(db, "predictions"), where("userId", "==", user.uid));
        const countSnap = await getCountFromServer(myPredsQuery);
        const count = countSnap.data().count;
        await updateDoc(userRef, { predictionsCount: count });
      }

      await refreshUser(); // Update navbar stats
      setSuccessId(matchId);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (error) {
      console.error("Error saving prediction:", error);
      alert("No se pudo guardar el pronóstico. Intenta nuevamente.");
    } finally {
      setSavingId(null);
    }
  };

  const getUniqueTeams = () => {
    const teamMap = {};
    matches.forEach(m => {
      if (m.homeTeamId) teamMap[m.homeTeamId] = m.homeTeam;
      if (m.awayTeamId) teamMap[m.awayTeamId] = m.awayTeam;
    });
    return Object.entries(teamMap)
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleSavePodium = async () => {
    if (!championPred || !thirdPlacePred) {
      alert("Por favor selecciona Campeón y Tercer Lugar.");
      return;
    }

    // Check if tournament started (kickoff of Match 1)
    const firstMatch = matches.find(m => m.matchNumber === 1 || m.id === "1");
    const tournamentStarted = firstMatch 
      ? (firstMatch.status === "live" || firstMatch.status === "finished" || (new Date(`${firstMatch.date}T${firstMatch.time}:00`) - new Date() <= 0))
      : false;

    if (tournamentStarted) {
      alert("El torneo ya ha comenzado. Las predicciones del podio están cerradas.");
      return;
    }

    setSavingPodium(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        championPrediction: championPred,
        thirdPlacePrediction: thirdPlacePred
      });
      setPodiumSuccess(true);
      setTimeout(() => setPodiumSuccess(false), 3000);
      await refreshUser();
    } catch (err) {
      console.error("Error saving podium prediction:", err);
      alert("No se pudo guardar la predicción del podio.");
    } finally {
      setSavingPodium(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24 text-zinc-500">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-sm font-semibold">Cargando tus pronósticos...</span>
      </div>
    );
  }

  // Check if tournament started
  const firstMatch = matches.find(m => m.matchNumber === 1 || m.id === "1");
  const tournamentStarted = firstMatch 
    ? (firstMatch.status === "live" || firstMatch.status === "finished" || (new Date(`${firstMatch.date}T${firstMatch.time}:00`) - new Date() <= 0))
    : false;

  return (
    <div className="relative overflow-hidden min-h-screen bg-background">
      <DashboardHeader
        activeTab="history"
        user={user}
        userRank={userRank}
        todayMatchesCount={matches.filter(m => m.status === "scheduled" && m.date === new Date().toISOString().split('T')[0]).length}
        logout={logout}
        router={router}
      />

      {/* Background blurs */}
      <div className="absolute top-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" style={{ paddingTop: "72px" }} />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-4xl" style={{ paddingTop: "100px" }}>
        {/* Header */}
        <div className="text-center sm:text-left mb-10 border-b border-white/10 pb-6 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            Mis Pronósticos
          </h1>
          <p className="mt-2 text-zinc-400 text-sm">
            Ingresa tus predicciones para cada partido. Se bloquearán automáticamente 15 minutos antes del pitazo inicial.
          </p>
        </div>

        {/* Podium predictions */}
        {matches.length > 0 && (
          <div className="mb-10 overflow-hidden rounded-2xl bg-surface-low/30 border border-white/10 p-6 animate-fade-in">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Pronóstico de Podio (A Largo Plazo)
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              Elige al Campeón y Tercer Lugar antes del inicio del torneo (Partido 1) para obtener 10 pts de bonificación por cada acierto.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-300">Campeón del Mundo</label>
                <select
                  value={championPred}
                  disabled={savingPodium || podiumSuccess || tournamentStarted}
                  onChange={(e) => setChampionPred(e.target.value)}
                  className="bg-[#0D1A2D] border border-white/10 text-white rounded-xl px-4 py-3 outline-none text-sm focus:border-primary/60 w-full"
                >
                  <option value="">Selecciona Campeón...</option>
                  {getUniqueTeams().map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-300">Tercer Lugar</label>
                <select
                  value={thirdPlacePred}
                  disabled={savingPodium || podiumSuccess || tournamentStarted}
                  onChange={(e) => setThirdPlacePred(e.target.value)}
                  className="bg-[#0D1A2D] border border-white/10 text-white rounded-xl px-4 py-3 outline-none text-sm focus:border-primary/60 w-full"
                >
                  <option value="">Selecciona Tercer Lugar...</option>
                  {getUniqueTeams().map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              {tournamentStarted ? (
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" />
                  Pronósticos cerrados
                </span>
              ) : (
                <button
                  onClick={handleSavePodium}
                  disabled={savingPodium || !championPred || !thirdPlacePred}
                  className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 font-bold font-mono transition-all duration-200 text-xs ${
                    podiumSuccess
                      ? "bg-primary text-surface-lowest"
                      : "bg-[#00E676] text-black hover:opacity-90 hover:shadow-[0_0_12px_rgba(0,230,118,0.3)] active:scale-[0.97]"
                  }`}
                >
                  {savingPodium ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : podiumSuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>¡Guardado!</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>Guardar Podio</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Prediction Cards */}
        <div className="space-y-6 animate-fade-in">
          {matches.map((match) => {
            const matchDate = new Date(`${match.date}T${match.time}:00`);
            const now = new Date();
            const isStarted = now >= matchDate;
            const effectiveStatus = (match.status === "scheduled" && isStarted) ? "live" : match.status;
            const isPredictionLocked = effectiveStatus === "live" || effectiveStatus === "finished" || (matchDate - now <= 15 * 60 * 1000);
            const isLocked = effectiveStatus === "live" || effectiveStatus === "finished";
            const isFinished = effectiveStatus === "finished";
            const currentPred = predictions[match.id] || { homeScore: "", awayScore: "", advancingTeamId: "", saved: false };
            const isUnsaved = !currentPred.saved && currentPred.homeScore !== "" && currentPred.awayScore !== "";

            // Calculate points displayed on this match for this prediction if match finished
            let pointsEarned = null;
            if (isFinished && currentPred.saved) {
              const actualHome = match.result?.homeScore;
              const actualAway = match.result?.awayScore;
              const predHome = currentPred.homeScore;
              const predAway = currentPred.awayScore;

              if (actualHome !== null && actualAway !== null && predHome !== "" && predAway !== "") {
                const actualWinner = actualHome > actualAway ? "home" : actualHome < actualAway ? "away" : "draw";
                const predWinner = predHome > predAway ? "home" : predHome < predAway ? "away" : "draw";
                
                if (actualHome === predHome && actualAway === predAway) {
                  pointsEarned = 10;
                } else if (actualWinner === predWinner) {
                  pointsEarned = 5;
                } else {
                  // consolation high scoring check
                  const totalGoals = actualHome + actualAway;
                  const isHighScoring = totalGoals >= 5 || actualHome >= 4 || actualAway >= 4;
                  const error = Math.abs(predHome - actualHome) + Math.abs(predAway - actualAway);
                  if (isHighScoring && error === 1) {
                    pointsEarned = 3;
                  } else {
                    pointsEarned = 0;
                  }
                }

                // Add 10 pts if correct knockout advancing
                const isKnockout = match.stage && match.stage !== "Group Stage" && match.stage !== "Fase de Grupos";
                if (isKnockout) {
                  const actualAdvancing = match.result?.advancingTeamId || (actualHome > actualAway ? match.homeTeamId : (actualAway > actualHome ? match.awayTeamId : null));
                  const predAdvancing = currentPred.advancingTeamId || (predHome > predAway ? match.homeTeamId : (predAway > predHome ? match.awayTeamId : null));
                  if (actualAdvancing && predAdvancing && actualAdvancing === predAdvancing) {
                    pointsEarned += 10;
                  }
                }
              }
            }

            return (
              <div
                key={match.id}
                className={`overflow-hidden rounded-2xl transition duration-300 shadow-lg ${
                  isPredictionLocked 
                    ? "bg-surface-low/20 border-white/5 opacity-70" 
                    : isUnsaved 
                      ? "bg-surface-low/50 border-primary/30 shadow-primary/5"
                      : "liquid-glass hover:border-primary/30 hover:bg-surface-base/40"
                }`}
              >
                {/* Top Info Bar */}
                <div className="flex flex-wrap items-center justify-between border-b border-white/5 bg-surface-lowest/45 px-5 py-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-zinc-400">
                    <span className="font-extrabold text-[#00E676] uppercase tracking-wider font-mono">
                      Partido {match.matchNumber}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-zinc-700" />
                    <span className="font-semibold text-zinc-300">{match.group || match.stage}</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-700" />
                    <span className="text-zinc-300 font-mono">{formatDateEs(match.date)} · {formatTime12h(match.time)}</span>
                  </div>
                  <div>
                    {isPredictionLocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                        <Lock className="h-3 w-3" />
                        Bloqueado
                      </span>
                    ) : currentPred.saved ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider font-mono">
                        <Check className="h-3.5 w-3.5 text-primary" />
                        Guardado
                      </span>
                    ) : isUnsaved ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider animate-pulse font-mono">
                        Cambios sin guardar
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider font-mono">
                        Sin Pronóstico
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Input Row */}
                <div className="grid grid-cols-1 md:grid-cols-7 items-center p-6 gap-4">
                  {/* Home Team label & flag */}
                  <div className="md:col-span-2 flex items-center justify-end gap-3 text-right">
                    <span className="text-base font-bold text-zinc-200 order-2 md:order-1">
                      {match.homeTeam}
                    </span>
                    <span className="order-1 md:order-2 filter drop-shadow">
                      {renderTeamFlag(match.homeTeamId, 30)}
                    </span>
                  </div>

                  {/* Input Score Controls */}
                  <div className="md:col-span-3 flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center justify-center gap-4">
                      <input
                        type="number"
                        min="0"
                        disabled={isPredictionLocked}
                        placeholder="-"
                        value={currentPred.homeScore}
                        onChange={(e) => handleInputChange(match.id, "homeScore", e.target.value)}
                        className={`w-14 h-14 rounded-xl text-center text-2xl font-black bg-surface-lowest/80 border focus:bg-surface-lowest outline-none transition-colors font-mono ${
                          isPredictionLocked 
                            ? "border-white/5 text-zinc-500 cursor-not-allowed" 
                            : "border-white/10 text-white focus:border-primary/60"
                        }`}
                      />
                      
                      <span className="text-primary font-extrabold text-lg font-mono">VS</span>

                      <input
                        type="number"
                        min="0"
                        disabled={isPredictionLocked}
                        placeholder="-"
                        value={currentPred.awayScore}
                        onChange={(e) => handleInputChange(match.id, "awayScore", e.target.value)}
                        className={`w-14 h-14 rounded-xl text-center text-2xl font-black bg-surface-lowest/80 border focus:bg-surface-lowest outline-none transition-colors font-mono ${
                          isPredictionLocked 
                            ? "border-white/5 text-zinc-500 cursor-not-allowed" 
                            : "border-white/10 text-white focus:border-primary/60"
                        }`}
                      />
                    </div>

                    {match.stage && match.stage !== "Group Stage" && match.stage !== "Fase de Grupos" && currentPred.homeScore !== "" && currentPred.awayScore !== "" && currentPred.homeScore === currentPred.awayScore && (
                      <div className="flex items-center gap-2 mt-2 text-xs bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="text-zinc-400 font-semibold">Avanza en penales:</span>
                        <select
                          value={currentPred.advancingTeamId || ""}
                          disabled={currentPred.saved || isPredictionLocked}
                          onChange={(e) => handleInputChange(match.id, "advancingTeamId", e.target.value)}
                          className="bg-[#152338] border border-[#253B5E] text-white rounded px-2 py-1 outline-none text-xs"
                        >
                          <option value="">Selecciona...</option>
                          <option value={match.homeTeamId}>{match.homeTeam}</option>
                          <option value={match.awayTeamId}>{match.awayTeam}</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Away Team label & flag */}
                  <div className="md:col-span-2 flex items-center justify-start gap-3 text-left">
                    <span className="filter drop-shadow">
                      {renderTeamFlag(match.awayTeamId, 30)}
                    </span>
                    <span className="text-base font-bold text-zinc-200">
                      {match.awayTeam}
                    </span>
                  </div>
                </div>

                {/* Bottom Row Actions / Results */}
                <div className="flex items-center justify-between border-t border-white/5 bg-surface-lowest/30 px-5 py-3 text-xs gap-3">
                  <div>
                    {isLocked ? (
                      <div className="flex items-center gap-1.5 text-zinc-500 font-mono">
                        <span>Marcador Real:</span>
                        <span className="font-bold text-zinc-300">
                          {match.result?.homeScore !== null && match.result?.awayScore !== null
                            ? `${match.result.homeScore} - ${match.result.awayScore}`
                            : "Esperando resultado..."
                          }
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-500 font-medium">
                        Fecha límite: 15 minutos antes del pitazo inicial
                      </span>
                    )}
                  </div>

                  <div>
                    {isLocked ? (
                      pointsEarned !== null && (
                        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-bold font-mono ${
                          pointsEarned >= 10
                            ? "bg-primary/10 text-primary border border-primary/20 drop-shadow-[0_0_8px_rgba(255,189,95,0.15)]"
                            : pointsEarned >= 5
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : pointsEarned > 0
                                ? "bg-zinc-300/10 text-zinc-300 border border-zinc-300/20"
                                : "bg-zinc-800/20 text-zinc-500 border border-white/5"
                        }`}>
                          <Sparkles className="h-3 w-3" />
                          <span>
                            +{pointsEarned} Pts
                          </span>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => handleSavePrediction(match.id)}
                        disabled={savingId === match.id || currentPred.saved}
                        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 font-bold font-mono transition-all duration-200 ${
                          currentPred.saved
                            ? "bg-surface-high/50 text-zinc-500 cursor-default border border-white/5"
                            : successId === match.id
                              ? "bg-primary text-surface-lowest"
                              : "bg-[#00E676] text-black hover:opacity-90 hover:shadow-[0_0_12px_rgba(0,230,118,0.3)] active:scale-[0.97]"
                        }`}
                      >
                        {savingId === match.id ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Guardando...</span>
                          </>
                        ) : successId === match.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>¡Guardado!</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5" />
                            <span>Guardar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
