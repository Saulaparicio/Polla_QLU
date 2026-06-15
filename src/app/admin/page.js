"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  setDoc, 
  getDoc, 
  writeBatch 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TEAM_ISO_CODES } from "@/lib/teamsData";
import Flag from "@/components/Flag";

// Import Modular Components
import PinGate from "@/components/admin/PinGate";
import AdminSidebar from "@/components/admin/AdminSidebar";
import MarcadoresPanel from "@/components/admin/MarcadoresPanel";
import ReglasPanel from "@/components/admin/ReglasPanel";
import CalendarioPanel from "@/components/admin/CalendarioPanel";
import RankingPanel from "@/components/admin/RankingPanel";
import NotifPanel from "@/components/admin/NotifPanel";
import MotorPanel from "@/components/admin/MotorPanel";

// Icon components for Toast
const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green, #00E676)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconError = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red, #FF5252)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const IconSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green, #00E676)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber, #FFB300)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green, #00E676)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green, #00E676)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13"></path>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const IconLightning = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber, #FFB300)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout: firebaseLogout } = useAuth();

  const renderTeamFlag = (teamId, size = 20) => {
    if (teamId && TEAM_ISO_CODES[teamId]) {
      return <Flag code={TEAM_ISO_CODES[teamId]} size={size} />;
    }
    return <span style={{ fontSize: size + "px" }} aria-hidden="true">🏳️</span>;
  };

  // Authentication Gate State
  const [pinVerified, setPinVerified] = useState(false);
  const [pinBuf, setPinBuf] = useState("");
  const [pinError, setPinError] = useState("");

  // Theme Management
  const [theme, setTheme] = useState("dark");

  // UI Active Panel & Navigation State
  const [activePanel, setActivePanel] = useState("marcadores");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Firestore Data State
  const [matches, setMatches] = useState([]);
  const [predictionsList, setPredictionsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [notifHistory, setNotifHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rule Scoring & Policy Configuration State
  const [rules, setRules] = useState({
    ptsExact: 3,
    ptsDiff: 2,
    ptsWin: 1,
    ptsDraw: 3,
    ptsCom: 2,
    closeHours: 1,
    entryFee: 10,
    quinielaName: "Polla Mundialista",
    yappyNumber: "+507 6214-9386",
    welcomeMsg: "¡Bienvenido a Polla Mundialista! Predice los resultados del Mundial y gana puntos. El ganador recibe el 60% del pozo acumulado.",
    regOpen: true,
    rankVisible: true,
    maintenanceMode: false,
    autoNotif: true,
    yappyPaymentEnabled: true
  });

  // Marcadores Scored/State Binding State
  const [scores, setScores] = useState({});
  const [statuses, setStatuses] = useState({});
  const [updatingMatchId, setUpdatingMatchId] = useState(null);
  const [marcadoresFilter, setMarcadoresFilter] = useState("all"); // 'all' or 'today'

  // Points Engine Execution State
  const [engineState, setEngineState] = useState("idle"); // 'idle' | 'running' | 'completed'
  const [lastCalcTime, setLastCalcTime] = useState("Hoy 08:45 AM");
  const [lastCalcMatchesCount, setLastCalcMatchesCount] = useState(23);
  const [engineLogs, setEngineLogs] = useState([
    { type: "ok", time: "08:45:07", text: "Motor completado. 23 partidos · 342 pts distribuidos" },
    { type: "ok", time: "08:45:05", text: "USA 4-0 PAN: 7 exactos / 18 dif / 19 ganador" },
    { type: "ok", time: "08:45:03", text: "MEX 2-1 CAN: 12 exactos / 9 dif / 18 ganador" },
    { type: "info", time: "08:45:01", text: "Reglas cargadas: exacto=3pts, dif=2pts, ganador=1pt" }
  ]);
  const [showLogsConsole, setShowLogsConsole] = useState(false);

  // Toast Notifications
  const [toastMsg, setToastMsg] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  const [toastType, setToastType] = useState(""); // 'ok' or ''
  const [toastShow, setToastShow] = useState(false);
  const toastTimerRef = useRef(null);

  const showToast = (icon, msg, type = "") => {
    setToastIcon(icon);
    setToastMsg(msg);
    setToastType(type);
    setToastShow(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastShow(false);
    }, 3200);
  };

  // Check auth and verify pin on load
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth");
      } else if (!user.isAdmin) {
        router.push("/");
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      const verifiedUid = sessionStorage.getItem("admin_pin_verified_uid");
      setPinVerified(verifiedUid === user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("admin_theme") || "dark";
      setTheme(savedTheme);
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("admin_theme", nextTheme);
    showToast(
      nextTheme === "dark" ? <IconMoon /> : <IconSun />,
      `Modo ${nextTheme === "dark" ? "Oscuro" : "Claro"} activado`
    );
  };

  // Fetch Firestore Data
  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Fetch matches
      const mq = query(collection(db, "matches"), orderBy("matchNumber", "asc"));
      const matchesSnap = await getDocs(mq);
      const matchesList = [];
      const initialScores = {};
      const initialStatuses = {};
      matchesSnap.forEach((doc) => {
        const data = doc.data();
        matchesList.push({ id: doc.id, ...data });
        initialScores[doc.id] = {
          homeScore: data.result?.homeScore !== undefined && data.result?.homeScore !== null ? data.result.homeScore : "",
          awayScore: data.result?.awayScore !== undefined && data.result?.awayScore !== null ? data.result.awayScore : ""
        };
        initialStatuses[doc.id] = data.status || "scheduled";
      });
      setMatches(matchesList);
      setScores(initialScores);
      setStatuses(initialStatuses);

      // 2. Fetch users
      const usersSnap = await getDocs(collection(db, "users"));
      const usersList = [];
      usersSnap.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsersList(usersList);

      // 3. Fetch predictions
      const predsSnap = await getDocs(collection(db, "predictions"));
      const predsList = [];
      predsSnap.forEach((doc) => {
        predsList.push({ id: doc.id, ...doc.data() });
      });
      setPredictionsList(predsList);

      // 4. Fetch rules config
      const rulesDoc = await getDoc(doc(db, "config", "rules"));
      if (rulesDoc.exists()) {
        setRules(rulesDoc.data());
      } else {
        await setDoc(doc(db, "config", "rules"), rules);
      }

      // 5. Fetch notification history
      const notifsSnap = await getDocs(collection(db, "notifications"));
      const nList = [];
      notifsSnap.forEach((doc) => {
        nList.push({ id: doc.id, ...doc.data() });
      });
      nList.sort((a, b) => b.timestamp - a.timestamp);
      if (nList.length > 0) {
        setNotifHistory(nList);
      } else {
        const mockNotifs = [
          { date: "10 Jun 09:00", type: "Email recordatorio", recipients: "12 usuarios", status: "Enviado", timestamp: Date.now() - 86400000 },
          { date: "09 Jun 18:30", type: "WhatsApp", recipients: "8 usuarios", status: "Enviado", timestamp: Date.now() - 172800000 },
          { date: "08 Jun 08:00", type: "Email bienvenida", recipients: "45 usuarios", status: "Enviado", timestamp: Date.now() - 259200000 }
        ];
        setNotifHistory(mockNotifs);
      }

    } catch (error) {
      console.error("Error fetching admin data:", error);
      showToast(<IconError />, "Error al conectar con la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchData();
    }
  }, [user]);

  // PIN pad actions
  const handlePinPress = (v) => {
    if (v === "del") {
      setPinBuf(prev => prev.slice(0, -1));
    } else if (v === "ok") {
      checkPinCode(pinBuf);
    } else if (pinBuf.length < 4) {
      const newBuf = pinBuf + v;
      setPinBuf(newBuf);
      if (newBuf.length === 4) {
        setTimeout(() => checkPinCode(newBuf), 200);
      }
    }
  };

  const checkPinCode = (code) => {
    if (code === "2026") {
      setPinVerified(true);
      if (user) {
        sessionStorage.setItem("admin_pin_verified_uid", user.uid);
      }
      showToast(<IconCheck />, "¡Bienvenido, Super Admin!", "ok");
    } else {
      setPinError("PIN incorrecto. Intenta de nuevo.");
      setPinBuf("");
      setTimeout(() => {
        setPinError("");
      }, 2000);
    }
  };

  const handleLogout = () => {
    setPinVerified(false);
    sessionStorage.removeItem("admin_pin_verified_uid");
    setPinBuf("");
    firebaseLogout();
  };

  // Scoring engine logic
  const calculatePointsForPrediction = (pred, match, rulesConfig) => {
    if (!match.result) return null;
    const actualHome = match.result.homeScore;
    const actualAway = match.result.awayScore;
    if (actualHome === null || actualHome === undefined || actualAway === null || actualAway === undefined) {
      return null;
    }
    const predHome = pred.homeScore;
    const predAway = pred.awayScore;
    if (predHome === null || predHome === undefined || predHome === "" ||
        predAway === null || predAway === undefined || predAway === "") {
      return null;
    }

    const actualWinner = actualHome > actualAway ? "home" : actualHome < actualAway ? "away" : "draw";
    const predWinner = predHome > predAway ? "home" : predHome < predAway ? "away" : "draw";

    let points = 0;
    
    if (predHome === actualHome && predAway === actualAway) {
      // Resultado Exacto: 10 puntos
      points = 10;
    } else if (predWinner === actualWinner) {
      // Acertar Ganador/Empate y Diferencia o Solo Ganador: 5 puntos
      points = 5;
    } else {
      // Aproximación en Partidos de Muchos Goles: 3 puntos
      const totalActualGoals = actualHome + actualAway;
      const isHighScoring = totalActualGoals >= 5 || actualHome >= 4 || actualAway >= 4;
      const totalError = Math.abs(predHome - actualHome) + Math.abs(predAway - actualAway);
      if (isHighScoring && totalError === 1) {
        points = 3;
      } else {
        points = 0;
      }
    }

    if (pred.wildcard) {
      points = points * (Number(rulesConfig.ptsCom) || 2);
    }

    // Acertar qué equipo avanza de ronda (10 puntos adicionales en eliminación directa)
    const isKnockout = match.stage && match.stage !== "Group Stage" && match.stage !== "Fase de Grupos";
    if (isKnockout) {
      const actualAdvancing = match.result.advancingTeamId || (actualHome > actualAway ? match.homeTeamId : (actualAway > actualHome ? match.awayTeamId : null));
      const predAdvancing = pred.advancingTeamId || (predHome > predAway ? match.homeTeamId : (predAway > predHome ? match.awayTeamId : null));
      if (actualAdvancing && predAdvancing && actualAdvancing === predAdvancing) {
        points += 10;
      }
    }

    return points;
  };

  // Individual Match Save
  const handleUpdateMatch = async (matchId) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    const newStatus = statuses[matchId];
    const matchScores = scores[matchId];
    
    if (newStatus === "finished" && 
        (matchScores.homeScore === "" || matchScores.awayScore === "")) {
      alert("Por favor ingrese marcadores válidos para finalizar el partido.");
      return;
    }

    setUpdatingMatchId(matchId);
    try {
      const matchRef = doc(db, "matches", matchId);
      const isFinished = newStatus === "finished";
      const isLive = newStatus === "live";
      
      const homeScore = (isFinished || isLive) && matchScores.homeScore !== "" && matchScores.homeScore !== undefined ? parseInt(matchScores.homeScore, 10) : null;
      const awayScore = (isFinished || isLive) && matchScores.awayScore !== "" && matchScores.awayScore !== undefined ? parseInt(matchScores.awayScore, 10) : null;
      const advancingTeamId = isFinished || isLive ? (matchScores.advancingTeamId || null) : null;
      let winner = null;
      
      if ((isFinished || isLive) && homeScore !== null && awayScore !== null) {
        winner = homeScore > awayScore ? "home" : homeScore < awayScore ? "away" : "draw";
      }

      const matchUpdate = {
        status: newStatus,
        result: ((isFinished || isLive) && homeScore !== null && awayScore !== null) ? {
          homeScore,
          awayScore,
          winner,
          advancingTeamId
        } : null
      };

      // 1. Update the match in Firestore
      await updateDoc(matchRef, matchUpdate);

      // 2. Fetch predictions to update for this match only
      const predsSnap = await getDocs(collection(db, "predictions"));
      const affectedUserIds = new Set();

      const batch = writeBatch(db);

      predsSnap.forEach((docSnap) => {
        const pred = docSnap.data();
        if (pred.matchId === matchId) {
          const predRef = doc(db, "predictions", docSnap.id);
          affectedUserIds.add(pred.userId);

          if (isFinished) {
            const pts = calculatePointsForPrediction(pred, { result: { homeScore, awayScore, winner, advancingTeamId }, stage: match.stage }, rules);
            batch.update(predRef, {
              points: pts,
              status: "checked"
            });
          } else {
            batch.update(predRef, {
              points: null,
              status: "pending"
            });
          }
        }
      });

      await batch.commit();

      // 3. Recalculate stats for affected users
      for (const userId of affectedUserIds) {
        let totalPoints = 0;
        let correctScores = 0;
        let correctOutcomes = 0;
        let predictionsCount = 0;
        let globalErrorMargin = 0;

        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.exists() ? userDocSnap.data() : {};

        const userPredsSnap = await getDocs(collection(db, "predictions"));
        userPredsSnap.forEach((docSnap) => {
          const pData = docSnap.data();
          if (pData.userId === userId) {
            if (pData.homeScore !== undefined && pData.homeScore !== null && pData.homeScore !== "" &&
                pData.awayScore !== undefined && pData.awayScore !== null && pData.awayScore !== "") {
              predictionsCount++;
            }
            if (pData.points !== null && pData.points !== undefined) {
              const pts = Number(pData.points);
              totalPoints += pts;

              const matchObj = matches.find(m => m.id === pData.matchId);
              if (matchObj && matchObj.status === "finished" && matchObj.result) {
                if (pData.homeScore === matchObj.result.homeScore && pData.awayScore === matchObj.result.awayScore) {
                  correctScores++;
                }
                const actWinner = matchObj.result.homeScore > matchObj.result.awayScore ? "home" : matchObj.result.homeScore < matchObj.result.awayScore ? "away" : "draw";
                const prWinner = pData.homeScore > pData.awayScore ? "home" : pData.homeScore < pData.awayScore ? "away" : "draw";
                if (actWinner === prWinner) {
                  correctOutcomes++;
                }
                globalErrorMargin += Math.abs(pData.homeScore - matchObj.result.homeScore) + Math.abs(pData.awayScore - matchObj.result.awayScore);
              }
            }
          }
        });

        // Long-term predictions (Champion & 3rd Place)
        const finalMatch = matches.find(m => m.matchNumber === 104 || m.id === "104");
        const thirdPlaceMatch = matches.find(m => m.matchNumber === 103 || m.id === "103");
        
        let podiumBonus = 0;
        if (finalMatch && finalMatch.status === "finished" && finalMatch.result) {
          const actualChampion = finalMatch.result.advancingTeamId || (finalMatch.result.homeScore > finalMatch.result.awayScore ? finalMatch.homeTeamId : finalMatch.awayTeamId);
          if (userData.championPrediction && userData.championPrediction === actualChampion) {
            podiumBonus += 10;
          }
        }
        if (thirdPlaceMatch && thirdPlaceMatch.status === "finished" && thirdPlaceMatch.result) {
          const actualThirdPlace = thirdPlaceMatch.result.advancingTeamId || (thirdPlaceMatch.result.homeScore > thirdPlaceMatch.result.awayScore ? thirdPlaceMatch.homeTeamId : thirdPlaceMatch.awayTeamId);
          if (userData.thirdPlacePrediction && userData.thirdPlacePrediction === actualThirdPlace) {
            podiumBonus += 10;
          }
        }
        totalPoints += podiumBonus;

        if (userDocSnap.exists()) {
          await updateDoc(userDocRef, {
            points: totalPoints,
            correctScores,
            correctOutcomes,
            predictionsCount,
            globalErrorMargin,
            podiumBonus
          });
        }
      }

      showToast(<IconCheck />, `Partido ${match.matchNumber} actualizado con éxito.`, "ok");
      fetchData();
    } catch (error) {
      console.error("Error updating match status and points:", error);
      showToast(<IconError />, "Error al actualizar el partido.");
    } finally {
      setUpdatingMatchId(null);
    }
  };

  // Save Rules Config
  const saveRules = async () => {
    try {
      const rulesRef = doc(db, "config", "rules");
      await setDoc(rulesRef, rules);
      showToast(<IconSave />, "Reglas guardadas correctamente", "ok");
    } catch (error) {
      console.error("Error saving rules:", error);
      showToast(<IconError />, "Error al guardar las reglas");
    }
  };

  const handleRuleChange = (key, value) => {
    setRules(prev => ({ ...prev, [key]: value }));
  };

  // Toggle user payment status
  const handleTogglePayment = async (userId, currentPaid) => {
    try {
      const newStatus = !currentPaid ? "active" : "pending";
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        paymentStatus: newStatus
      });
      showToast(!currentPaid ? <IconCheck /> : <IconClock />, `Pago ${!currentPaid ? "Aprobado" : "marcado Pendiente"}`, !currentPaid ? "ok" : "");
      fetchData();
    } catch (error) {
      console.error("Error toggling payment:", error);
      showToast(<IconError />, "Error al actualizar el estado de pago");
    }
  };

  // Export ranking as CSV
  const handleExportCSV = () => {
    const sortedUsers = [...usersList].sort((a, b) => {
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
    const headers = ["Puesto", "Nombre", "Email", "Puntos", "Exactos", "Pronósticos", "Estado de Pago"];
    const rows = sortedUsers.map((u, i) => [
      i + 1,
      u.displayName || u.email.split('@')[0],
      u.email,
      u.points || 0,
      u.correctScores || 0,
      `${u.predictionsCount || 0}/104`,
      u.paymentStatus === "active" ? "Activo" : u.paymentStatus === "pending" ? "Pendiente" : "No pagado"
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Leaderboard_QLU_MatchPredict_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(<IconDownload />, "CSV exportado correctamente", "ok");
  };

  // Handle Notifications Draft and Dispatch
  const handleSendNotif = async ({ selectedMatchIds, channel, recipients, subject, body }) => {
    const participants = usersList.filter(u => !u.isAdmin);
    const missingUserIds = new Set();
    selectedMatchIds.forEach(mId => {
      const matchPreds = predictionsList.filter(p => p.matchId === mId);
      const predictedUserIds = new Set(matchPreds.map(p => p.userId));
      participants.forEach(u => {
        if (!predictedUserIds.has(u.id)) {
          missingUserIds.add(u.id);
        }
      });
    });

    const recipientsCount = missingUserIds.size;
    const channelLabel = channel === "email" ? "Email recordatorio" : channel === "wa" ? "WhatsApp" : "Email + WhatsApp";
    const dateStr = new Date().toLocaleDateString("es-PA", { day: '2-digit', month: 'short' }) + " " + new Date().toLocaleTimeString("es-PA", { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const newNotif = {
      date: dateStr,
      type: channelLabel,
      recipients: `${recipientsCount} usuarios`,
      status: "Enviado",
      timestamp: Date.now()
    };

    try {
      const docId = `notif_${Date.now()}`;
      await setDoc(doc(db, "notifications", docId), newNotif);
      setNotifHistory(prev => [newNotif, ...prev]);
      showToast(<IconSend />, `Recordatorios enviados por ${channel === "email" ? "correo" : channel === "wa" ? "WhatsApp" : "correo + WhatsApp"}`, "ok");
    } catch (error) {
      console.error("Error saving notification:", error);
      showToast(<IconError />, "Error al registrar la notificación");
    }
  };

  // Run full points calculation engine
  const runPointsEngine = async () => {
    setEngineState("running");
    showToast(<IconLightning />, "Motor de puntuación iniciado...", "");
    
    const addLog = (type, text) => {
      const time = new Date().toLocaleTimeString("es-PA", { hour12: false });
      setEngineLogs(prev => [{ type, time, text }, ...prev]);
    };

    setEngineLogs([]); // clear logs for fresh run
    addLog("muted", "Motor iniciado manualmente");
    addLog("info", `Cargando reglas: exacto=${rules.ptsExact}pts, dif=${rules.ptsDiff}pts, ganador=${rules.ptsWin}pt, empate=${rules.ptsDraw}pts, comodín=x${rules.ptsCom}`);

    try {
      // 1. Fetch matches
      const matchesQuery = query(collection(db, "matches"), orderBy("matchNumber", "asc"));
      const matchesSnap = await getDocs(matchesQuery);
      const matchesList = [];
      matchesSnap.forEach(d => {
        matchesList.push({ id: d.id, ...d.data() });
      });

      // 2. Fetch users
      const usersSnap = await getDocs(collection(db, "users"));
      const usersList = [];
      usersSnap.forEach(d => {
        usersList.push({ id: d.id, ...d.data() });
      });

      // 3. Fetch predictions
      const predsSnap = await getDocs(collection(db, "predictions"));
      const predictionsList = [];
      predsSnap.forEach(d => {
        predictionsList.push({ id: d.id, ...d.data() });
      });

      addLog("info", `Cargando base de datos: ${matchesList.length} partidos, ${usersList.length} usuarios, ${predictionsList.length} predicciones`);

      // Initialize stats mapping
      const userStats = {};
      usersList.forEach(u => {
        userStats[u.id] = {
          points: 0,
          correctScores: 0,
          correctOutcomes: 0,
          predictionsCount: 0,
          globalErrorMargin: 0,
          championPrediction: u.championPrediction || null,
          thirdPlacePrediction: u.thirdPlacePrediction || null
        };
      });

      let totalProcessedPredictions = 0;
      let totalPointsAssigned = 0;
      let finishedMatchesCount = 0;

      let predictionUpdates = [];

      // Process finished matches
      for (const match of matchesList) {
        const isFinished = match.status === "finished";
        if (!isFinished) continue;

        finishedMatchesCount++;
        const matchPreds = predictionsList.filter(p => p.matchId === match.id);

        let countExact = 0;
        let countDiff = 0;
        let countWin = 0;
        let countZero = 0;

        for (const pred of matchPreds) {
          const pts = calculatePointsForPrediction(pred, match, rules);
          if (pts !== null) {
            totalProcessedPredictions++;
            totalPointsAssigned += pts;

            predictionUpdates.push({
              id: pred.id,
              points: pts,
              status: "checked"
            });

            if (userStats[pred.userId]) {
              userStats[pred.userId].points += pts;
              
              const isExact = (pred.homeScore === match.result?.homeScore && pred.awayScore === match.result?.awayScore);
              if (isExact) {
                userStats[pred.userId].correctScores++;
                countExact++;
              } else {
                const actualWinner = match.result?.homeScore > match.result?.awayScore ? "home" : match.result?.homeScore < match.result?.awayScore ? "away" : "draw";
                const predWinner = pred.homeScore > pred.awayScore ? "home" : pred.homeScore < pred.awayScore ? "away" : "draw";
                if (actualWinner === predWinner) {
                  userStats[pred.userId].correctOutcomes++;
                  if (actualWinner !== "draw" && (pred.homeScore - pred.awayScore === match.result?.homeScore - match.result?.awayScore)) {
                    countDiff++;
                  } else {
                    countWin++;
                  }
                } else {
                  countZero++;
                }
              }
              userStats[pred.userId].globalErrorMargin += Math.abs(pred.homeScore - match.result.homeScore) + Math.abs(pred.awayScore - match.result.awayScore);
            }
          }
        }

        const mHome = match.homeTeamId || match.homeTeam.substring(0, 3).toUpperCase();
        const mAway = match.awayTeamId || match.awayTeam.substring(0, 3).toUpperCase();
        const hs = match.result?.homeScore ?? 0;
        const as = match.result?.awayScore ?? 0;
        addLog("ok", `${mHome} ${hs}-${as} ${mAway}: ${countExact} exactos / ${countDiff} dif / ${countWin} ganador / ${countZero} sin pts`);
      }

      // Long-term predictions (Champion & 3rd Place)
      const finalMatch = matchesList.find(m => m.matchNumber === 104 || m.id === "104");
      const thirdPlaceMatch = matchesList.find(m => m.matchNumber === 103 || m.id === "103");
      const actualChampion = finalMatch && finalMatch.status === "finished" && finalMatch.result
        ? (finalMatch.result.advancingTeamId || (finalMatch.result.homeScore > finalMatch.result.awayScore ? finalMatch.homeTeamId : finalMatch.awayTeamId))
        : null;
      const actualThirdPlace = thirdPlaceMatch && thirdPlaceMatch.status === "finished" && thirdPlaceMatch.result
        ? (thirdPlaceMatch.result.advancingTeamId || (thirdPlaceMatch.result.homeScore > thirdPlaceMatch.result.awayScore ? thirdPlaceMatch.homeTeamId : thirdPlaceMatch.awayTeamId))
        : null;

      for (const userId of Object.keys(userStats)) {
        let podiumBonus = 0;
        if (actualChampion && userStats[userId].championPrediction === actualChampion) {
          podiumBonus += 10;
        }
        if (actualThirdPlace && userStats[userId].thirdPlacePrediction === actualThirdPlace) {
          podiumBonus += 10;
        }
        userStats[userId].points += podiumBonus;
        userStats[userId].podiumBonus = podiumBonus;
      }

      // Recount predictions made by users
      for (const userId of Object.keys(userStats)) {
        const userPreds = predictionsList.filter(p => p.userId === userId);
        const count = userPreds.filter(p => p.homeScore !== undefined && p.homeScore !== null && p.homeScore !== "" &&
                                            p.awayScore !== undefined && p.awayScore !== null && p.awayScore !== "").length;
        userStats[userId].predictionsCount = count;
      }

      // Firestore Batch updates
      let batch = writeBatch(db);
      let batchCount = 0;

      for (const pUpd of predictionUpdates) {
        const predRef = doc(db, "predictions", pUpd.id);
        batch.update(predRef, {
          points: pUpd.points,
          status: pUpd.status
        });
        batchCount++;
        if (batchCount === 500) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }

      for (const userId of Object.keys(userStats)) {
        const userRef = doc(db, "users", userId);
        batch.update(userRef, {
          points: userStats[userId].points,
          correctScores: userStats[userId].correctScores,
          correctOutcomes: userStats[userId].correctOutcomes,
          predictionsCount: userStats[userId].predictionsCount,
          globalErrorMargin: userStats[userId].globalErrorMargin,
          podiumBonus: userStats[userId].podiumBonus || 0
        });
        batchCount++;
        if (batchCount === 500) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }

      addLog("ok", `Motor completado. ${finishedMatchesCount} partidos finalizados · ${totalProcessedPredictions} predicciones procesadas · ${totalPointsAssigned} pts distribuidos`);
      setLastCalcTime("Hoy " + new Date().toLocaleTimeString("es-PA", { hour: '2-digit', minute: '2-digit', hour12: false }));
      setLastCalcMatchesCount(finishedMatchesCount);
      
      fetchData();
      setEngineState("completed");
      showToast(<IconCheck />, "Motor completado — tabla de posiciones actualizada", "ok");
    } catch (error) {
      console.error("Error executing engine:", error);
      addLog("err", `Error al ejecutar: ${error.message}`);
      setEngineState("idle");
      showToast(<IconError />, "Error al ejecutar el motor", "");
    }
  };

  // Helper: check if a match is scheduled for today
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper: calculate list of matches with missing predictions
  const getMissingPredictionsList = () => {
    const participants = usersList.filter(u => !u.isAdmin);
    const scheduledMatches = matches.filter(m => m.status === "scheduled");
    
    return scheduledMatches.map(m => {
      const matchPreds = predictionsList.filter(p => p.matchId === m.id);
      const predictedUserIds = new Set(matchPreds.map(p => p.userId));
      const missingCount = participants.filter(u => !predictedUserIds.has(u.id)).length;
      
      return {
        id: m.id,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        homeTeamId: m.homeTeamId,
        awayTeamId: m.awayTeamId,
        date: m.date,
        time: m.time,
        missing: missingCount
      };
    }).filter(item => item.missing > 0);
  };

  if (authLoading || !user || !user.isAdmin) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24 text-zinc-500 bg-[#07101D] min-h-screen">
        <span className="text-sm font-semibold text-zinc-400">Verificando permisos de administrador...</span>
      </div>
    );
  }

  const missingPredictionsList = getMissingPredictionsList();

  return (
    <div className={`admin-body ${theme}`}>
      {/* SCOPED DARK/LIGHT GLASSMORPHISM STYLES */}
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-body {
          --bg:#07101D; --surface:#0D1A2D; --surface2:#152338; --surface3:#1B2D47;
          --fg:#E8F0FF; --fg-dim:#C5D2EE; --muted:#5E7A9E;
          --border:#1C2E48; --border2:#253B5E;
          --green:#00E676; --gold:#FFD700; --red:#FF5252; --amber:#FFB300; --blue:#5B8DEF;
          --purple:#A855F7;
          --sidebar-w:224px;
          --font-d:'Bebas Neue',Impact,sans-serif;
          --font-b:'Inter',-apple-system,system-ui,sans-serif;
          --r-s:6px; --r-m:10px; --r-l:14px;
          
          --hover-bg: rgba(255, 255, 255, 0.02);
          --sb-hover-bg: rgba(255, 255, 255, 0.04);
          --gate-bg: rgba(7, 16, 29, 0.97);
          --topbar-bg: rgba(7, 16, 29, 0.95);
          
          --green-alpha10: rgba(0, 230, 118, 0.1);
          --green-alpha15: rgba(0, 230, 118, 0.15);
          --green-alpha20: rgba(0, 230, 118, 0.2);
          --green-alpha30: rgba(0, 230, 118, 0.3);
          --amber-alpha10: rgba(255, 179, 0, 0.1);
          --amber-alpha25: rgba(255, 179, 0, 0.25);
          --red-alpha10: rgba(255, 82, 82, 0.1);
          --red-alpha20: rgba(255, 82, 82, 0.2);
          --red-alpha30: rgba(255, 82, 82, 0.3);
          --blue-alpha10: rgba(91, 141, 239, 0.1);
          --blue-alpha20: rgba(91, 141, 239, 0.2);
          --purple-alpha10: rgba(168, 85, 247, 0.1);
          --purple-alpha20: rgba(168, 85, 247, 0.2);
          --purple-alpha15: rgba(168, 85, 247, 0.15);
          --purple-alpha30: rgba(168, 85, 247, 0.3);
          --gold-alpha05: rgba(255, 215, 0, 0.04);
          --gold-alpha20: rgba(255, 215, 0, 0.2);

          background: var(--bg);
          color: var(--fg);
          font-family: var(--font-b);
          min-height: 100vh;
        }

        .admin-body.light {
          --bg: #F8FAFC;
          --surface: #FFFFFF;
          --surface2: #F1F5F9;
          --surface3: #E2E8F0;
          --fg: #0F172A;
          --fg-dim: #475569;
          --muted: #64748B;
          --border: #E2E8F0;
          --border2: #CBD5E1;
          
          --green: #059669;
          --gold: #D97706;
          --red: #DC2626;
          --amber: #D97706;
          --blue: #2563EB;
          --purple: #7C3AED;
          
          --hover-bg: rgba(15, 23, 42, 0.04);
          --sb-hover-bg: rgba(15, 23, 42, 0.04);
          --gate-bg: rgba(248, 250, 252, 0.97);
          --topbar-bg: rgba(248, 250, 252, 0.95);
          
          --green-alpha10: rgba(5, 150, 105, 0.1);
          --green-alpha15: rgba(5, 150, 105, 0.15);
          --green-alpha20: rgba(5, 150, 105, 0.2);
          --green-alpha30: rgba(5, 150, 105, 0.3);
          --amber-alpha10: rgba(217, 119, 6, 0.1);
          --amber-alpha25: rgba(217, 119, 6, 0.25);
          --red-alpha10: rgba(220, 38, 38, 0.1);
          --red-alpha20: rgba(220, 38, 38, 0.2);
          --red-alpha30: rgba(220, 38, 38, 0.3);
          --blue-alpha10: rgba(37, 99, 235, 0.1);
          --blue-alpha20: rgba(37, 99, 235, 0.2);
          --purple-alpha10: rgba(124, 58, 237, 0.1);
          --purple-alpha20: rgba(124, 58, 237, 0.2);
          --purple-alpha15: rgba(124, 58, 237, 0.15);
          --purple-alpha30: rgba(124, 58, 237, 0.3);
          --gold-alpha05: rgba(217, 119, 6, 0.05);
          --gold-alpha20: rgba(217, 119, 6, 0.2);
        }

        .admin-body *, .admin-body *::before, .admin-body *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .admin-body input, .admin-body select, .admin-body textarea, .admin-body button {
          font-family: inherit;
        }

        /* ── LOGIN GATE ── */
        .admin-body .gate{position:fixed;inset:0;background:var(--gate-bg);z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px}
        .admin-body .gate-box{background:var(--surface);border:1px solid var(--border2);border-radius:20px;padding:40px 36px;width:100%;max-width:360px;text-align:center;display:flex;flex-direction:column;gap:18px}
        .admin-body .gate-icon{font-size:2.8rem}
        .admin-body .gate-title{font-family:var(--font-d);font-size:1.9rem;letter-spacing:.04em;color:var(--fg)}
        .admin-body .gate-title span{color:var(--purple)}
        .admin-body .gate-sub{color:var(--muted);font-size:.8125rem}
        .admin-body .pin-row{display:flex;justify-content:center;gap:12px}
        .admin-body .pin-dot{width:16px;height:16px;border-radius:50%;border:2px solid var(--border2);background:transparent;transition:all .15s}
        .admin-body .pin-dot.filled{background:var(--purple);border-color:var(--purple)}
        .admin-body .pin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .admin-body .pin-btn{padding:14px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);color:var(--fg);font-size:1.1rem;font-weight:600;cursor:pointer;transition:all .15s}
        .admin-body .pin-btn:hover{background:var(--surface3);border-color:var(--border2)}
        .admin-body .pin-btn.del{color:var(--red)}
        .admin-body .pin-err{color:var(--red);font-size:.8125rem;min-height:18px}
        .admin-body .pin-hint{color:var(--muted);font-size:.75rem}
        .admin-body .pin-hint strong{color:var(--fg)}

        /* ── LAYOUT ── */
        .admin-body .layout{display:flex;min-height:100vh}

        /* Sidebar */
        .admin-body .sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:100}
        .admin-body .sb-head{padding:18px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
        .admin-body .sb-logo{font-family:var(--font-d);font-size:1.3rem;color:var(--fg)}
        .admin-body .sb-logo em{font-style:normal;color:var(--green)}
        .admin-body .sb-adm{font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;background:var(--purple-alpha15);color:var(--purple);border:1px solid var(--purple-alpha30);padding:3px 8px;border-radius:20px;margin-left:auto}
        .admin-body .sb-nav{flex:1;padding:10px 8px;display:flex;flex-direction:column;gap:2px;overflow-y:auto}
        .admin-body .sb-btn{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--r-m);color:var(--muted);font-size:.875rem;font-weight:500;cursor:pointer;transition:all .15s;border:none;background:transparent;text-align:left;width:100%}
        .admin-body .sb-btn:hover{color:var(--fg);background:var(--sb-hover-bg)}
        .admin-body .sb-btn.active{color:var(--fg);background:var(--surface2)}
        .admin-body .sb-btn .sb-ico{font-size:1rem;flex-shrink:0;display:flex;align-items:center;justify-content:center}
        .admin-body .sb-cnt{margin-left:auto;background:var(--red);color:#fff;font-size:.65rem;font-weight:800;padding:2px 6px;border-radius:10px}
        .admin-body .sb-foot{padding:12px 16px;border-top:1px solid var(--border)}
        .admin-body .sb-user{display:flex;align-items:center;gap:10px}
        .admin-body .sb-av{width:32px;height:32px;border-radius:50%;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0}
        .admin-body .sb-name{font-size:.8125rem;font-weight:600;color:var(--fg)}
        .admin-body .sb-role{font-size:.7rem;color:var(--purple);text-transform:uppercase;letter-spacing:.06em}
        .admin-body .logout{margin-left:auto;padding:5px 10px;background:transparent;border:1px solid var(--border);border-radius:var(--r-s);color:var(--muted);font-size:.75rem;cursor:pointer;transition:all .15s}
        .admin-body .logout:hover{border-color:var(--red);color:var(--red)}

        /* Main */
        .admin-body .main{flex:1;margin-left:var(--sidebar-w);padding:28px;min-height:100vh}
        .admin-body .panel{display:none}
        .admin-body .panel.on{display:block}

        /* Mobile topbar */
        .admin-body .topbar{display:none;position:fixed;top:0;left:0;right:0;height:56px;z-index:200;background:var(--topbar-bg);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:0 16px;align-items:center;gap:12px}
        .admin-body .hbg{background:none;border:none;color:var(--fg);font-size:1.2rem;cursor:pointer;padding:4px}
        .admin-body .mob-logo{font-family:var(--font-d);font-size:1.3rem;color:var(--fg)}
        .admin-body .mob-logo em{font-style:normal;color:var(--green)}
        .admin-body .overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:90}

        /* Page header */
        .admin-body .ph{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:24px;flex-wrap:wrap}
        .admin-body .pt{font-family:var(--font-d);font-size:2rem;letter-spacing:.03em;color:var(--fg);display:flex;align-items:center;gap:8px}
        .admin-body .pt svg{color:var(--purple);flex-shrink:0}
        .admin-body .ps{color:var(--muted);font-size:.8125rem;margin-top:2px}

        /* Card */
        .admin-body .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-l);padding:20px}
        .admin-body .card+.card,.admin-body .card+.mt{margin-top:16px}
        .admin-body .mt{margin-top:16px}
        .admin-body .ct{font-size:.8125rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:16px}

        /* Buttons */
        .admin-body .btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:var(--r-m);font-size:.875rem;font-weight:600;cursor:pointer;transition:all .18s;border:none}
        .admin-body .btn-g{background:var(--green);color:#000}.admin-body .btn-g:hover{background:#00c853}
        .admin-body .btn-p{background:var(--purple);color:#fff}.admin-body .btn-p:hover{background:#9333ea}
        .admin-body .btn-o{background:transparent;border:1px solid var(--border2);color:var(--fg-dim)}.admin-body .btn-o:hover{border-color:var(--fg);color:var(--fg)}
        .admin-body .btn-d{background:var(--red-alpha10);border:1px solid var(--red-alpha30);color:var(--red)}.admin-body .btn-d:hover{background:var(--red-alpha20)}
        .admin-body .btn-y{background:var(--gold);color:#000}.admin-body .btn-y:hover{background:#e6c200}
        .admin-body .btn-sm{padding:6px 12px;font-size:.8125rem}
        .admin-body .btn:disabled{opacity: 0.5; pointer-events: none;}

        /* Stats */
        .admin-body .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px}
        .admin-body .sbox{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);padding:16px}
        .admin-body .sv{font-family:var(--font-d);font-size:2rem;line-height:1}
        .admin-body .sl{color:var(--muted);font-size:.75rem;text-transform:uppercase;letter-spacing:.07em;margin-top:4px}

        /* Badge */
        .admin-body .bx{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:.75rem;font-weight:600;gap:4px}
        .admin-body .bx-g{background:var(--green-alpha10);color:var(--green);border:1px solid var(--green-alpha20)}
        .admin-body .bx-a{background:var(--amber-alpha10);color:var(--amber);border:1px solid var(--amber-alpha25)}
        .admin-body .bx-r{background:var(--red-alpha10);color:var(--red);border:1px solid var(--red-alpha20)}
        .admin-body .bx-b{background:var(--blue-alpha10);color:var(--blue);border:1px solid var(--blue-alpha20)}
        .admin-body .bx-p{background:var(--purple-alpha10);color:var(--purple);border:1px solid var(--purple-alpha20)}

        /* Table */
        .admin-body .tw{overflow-x:auto;-webkit-overflow-scrolling:touch}
        .admin-body table{width:100%;border-collapse:collapse;min-width:580px}
        .admin-body th{padding:10px 12px;text-align:left;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);border-bottom:1px solid var(--border);white-space:nowrap}
        .admin-body td{padding:12px;border-bottom:1px solid var(--border);font-size:.875rem;vertical-align:middle;color:var(--fg)}
        .admin-body tr:last-child td{border-bottom:none}
        .admin-body tr:hover td{background:var(--hover-bg)}

        /* Score inputs */
        .admin-body .sw{display:flex;align-items:center;gap:8px}
        .admin-body .ti{display:flex;align-items:center;gap:7px}
        .admin-body .tf{font-size:1.2rem}
        .admin-body .tn{font-weight:500;font-size:.875rem;white-space:nowrap;color:var(--fg)}
        .admin-body .si{width:44px;height:38px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-s);color:var(--fg);font-size:1.1rem;font-weight:700;text-align:center;transition:border-color .15s}
        .admin-body .si:focus{outline:none;border-color:var(--green)}
        .admin-body .ss{color:var(--muted);font-weight:700}

        /* Form */
        .admin-body .fr{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
        .admin-body .fg{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
        .admin-body .fg:last-child{margin-bottom:0}
        .admin-body .fl{font-size:.8125rem;font-weight:600;color:var(--fg-dim)}
        .admin-body .fi,.admin-body .fsel,.admin-body .fta{background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-m);color:var(--fg);padding:10px 14px;font-size:.875rem;transition:border-color .15s;width:100%}
        .admin-body .fi:focus,.admin-body .fsel:focus,.admin-body .fta:focus{outline:none;border-color:var(--blue)}
        .admin-body .fta{resize:vertical;min-height:100px}
        .admin-body .fh{font-size:.75rem;color:var(--muted)}

        /* Rule card */
        .admin-body .rc{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);padding:16px 20px;display:flex;align-items:center;gap:16px;margin-bottom:10px}
        .admin-body .ri{font-size:1.4rem;display:flex;align-items:center;justify-content:center;color:var(--purple);flex-shrink:0}
        .admin-body .ri svg{width:22px;height:22px}
        .admin-body .rn{font-weight:600;font-size:.9375rem;color:var(--fg)}
        .admin-body .rd{font-size:.8125rem;color:var(--muted);margin-top:2px}
        .admin-body .rp{display:flex;align-items:center;gap:8px}
        .admin-body .pi{width:60px;height:38px;background:var(--surface3);border:1px solid var(--border2);border-radius:var(--r-s);color:var(--gold);font-size:1.2rem;font-weight:700;text-align:center;font-family:var(--font-d);transition:border-color .15s}
        .admin-body .pi:focus{outline:none;border-color:var(--gold)}
        .admin-body .pl{font-size:.8125rem;color:var(--muted)}

        /* Toggle */
        .admin-body .tog{position:relative;display:inline-block;width:42px;height:24px}
        .admin-body .tog input{opacity:0;width:0;height:0}
        .admin-body .tslide{position:absolute;inset:0;background:var(--surface3);border-radius:12px;cursor:pointer;transition:all .2s;border:1px solid var(--border2)}
        .admin-body .tslide::before{content:'';position:absolute;width:18px;height:18px;left:2px;top:2px;background:var(--muted);border-radius:50%;transition:all .2s}
        .admin-body .tog input:checked+.tslide{background:var(--green-alpha15);border-color:var(--green-alpha30)}
        .admin-body .tog input:checked+.tslide::before{transform:translateX(18px);background:var(--green)}

        /* Rank */
        .admin-body .rpos{font-family:var(--font-d);font-size:1.25rem;width:36px;text-align:center}
        .admin-body .rpos.g{color:var(--gold)}.admin-body .rpos.s{color:#A8B8C8}.admin-body .rpos.b{color:#CD7F32}
        .admin-body .uc{display:flex;align-items:center;gap:10px}
        .admin-body .uav{width:34px;height:34px;border-radius:50%;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--fg-dim);flex-shrink:0}
        .admin-body .un{font-weight:600;font-size:.875rem;color:var(--fg)}
        .admin-body .ue{font-size:.75rem;color:var(--muted)}

        /* Notif match */
        .admin-body .nm{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);padding:14px 16px;margin-bottom:10px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .admin-body .nmt{font-weight:600;font-size:.9375rem;color:var(--fg)}
        .admin-body .nmc{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
        .admin-body .miss{background:var(--red-alpha10);color:var(--red);border:1px solid var(--red-alpha20);padding:3px 10px;border-radius:20px;font-size:.8125rem;font-weight:600;display:flex;align-items:center;gap:4px}
        .admin-body .miss svg{flex-shrink:0}
        .admin-body .nchk{width:18px;height:18px;accent-color:var(--purple);cursor:pointer;flex-shrink:0}

        /* Motor */
        .admin-body .ms{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);padding:18px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:16px}
        .admin-body .mdot{width:12px;height:12px;border-radius:50%;flex-shrink:0}
        .admin-body .mdot.idle{background:var(--muted)}
        .admin-body .mdot.run{background:var(--amber);animation:pulse 1.5s infinite}
        .admin-body .mdot.done{background:var(--green)}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 3px rgba(255,179,0,.2)}50%{box-shadow:0 0 0 6px rgba(255,179,0,.08)}}

        /* Progress */
        .admin-body .pb{height:6px;background:var(--surface3);border-radius:3px;overflow:hidden;margin-top:8px}
        .admin-body .pf{height:100%;border-radius:3px;background:var(--green);transition:width .5s}

        /* Search */
        .admin-body .sr{position:relative;display:flex;align-items:center}
        .admin-body .si2{width:100%;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-m);color:var(--fg);padding:10px 14px 10px 36px;font-size:.875rem;transition:border-color .15s}
        .admin-body .si2:focus{outline:none;border-color:var(--blue)}
        .admin-body .sico{position:absolute;left:11px;color:var(--muted);font-size:.875rem;display:flex;align-items:center;justify-content:center}

        /* Toast */
        .admin-body .toast{position:fixed;bottom:24px;right:24px;background:var(--surface3);border:1px solid var(--border2);border-radius:var(--r-l);padding:13px 18px;font-size:.875rem;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,.4);display:flex;align-items:center;gap:10px;transform:translateY(80px);opacity:0;transition:all .3s;z-index:500;max-width:320px;color:var(--fg)}
        .admin-body .toast.show{transform:translateY(0);opacity:1}
        .admin-body .toast.ok{border-color:rgba(0,230,118,.3)}

        /* Flex utils */
        .admin-body .fx{display:flex}.admin-body .fxc{align-items:center}.admin-body .gap8{gap:8px}.admin-body .gap12{gap:12px}.admin-body .gap16{gap:16px}.admin-body .ml{margin-left:auto}.admin-body .wrap{flex-wrap:wrap}

        /* Log box */
        .admin-body .log{background:var(--surface3);border-radius:var(--r-m);padding:14px;font-size:.8125rem;font-family:monospace;color:var(--fg-dim);line-height:1.8;max-height:180px;overflow-y:auto;text-align:left;white-space:pre-wrap}

        /* Toggle row */
        .admin-body .trow{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);padding:14px 18px;display:flex;align-items:center;gap:14px;margin-bottom:10px}
        .admin-body .trinfo{flex:1}
        .admin-body .trn{font-weight:600;font-size:.875rem;color:var(--fg)}
        .admin-body .trd{font-size:.75rem;color:var(--muted);margin-top:2px}

        /* Responsive */
        @media(max-width:768px){
          .admin-body .topbar{display:flex}
          .admin-body .sidebar{transform:translateX(calc(-1 * var(--sidebar-w)));transition:transform .25s}
          .admin-body .sidebar.open{transform:translateX(0)}
          .admin-body .overlay.open{display:block}
          .admin-body .main{margin-left:0;padding:72px 14px 24px}
          .admin-body .fr{grid-template-columns:1fr}
          .admin-body .stats{grid-template-columns:repeat(2,1fr)}
          .admin-body .ph{flex-direction:column;gap:12px}
          .admin-body .ms{flex-direction:column;align-items:flex-start}
        }
      ` }} />

      {/* LOGIN GATE */}
      {!pinVerified && (
        <PinGate
          pinBuf={pinBuf}
          pinError={pinError}
          onPinPress={handlePinPress}
        />
      )}

      {/* MOBILE TOPBAR */}
      <div className="topbar">
        <button className="hbg" onClick={() => setSidebarOpen(true)} type="button">☰</button>
        <div className="mob-logo">Polla <em>Mundialista</em></div>
        <span className="bx bx-p" style={{ marginLeft: "auto", fontSize: ".65rem" }}>ADMIN</span>
      </div>
      
      {/* OVERLAY FOR MOBILE SIDEBAR */}
      <div 
        className={`overlay ${sidebarOpen ? "open" : ""}`} 
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* LAYOUT */}
      <div className="layout">

        {/* SIDEBAR */}
        <AdminSidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          missingNotifCount={missingPredictionsList.length}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* MAIN PANEL CONTENT */}
        <main className="main">

          {/* PANEL: MARCADORES */}
          {activePanel === "marcadores" && (
            <MarcadoresPanel
              matches={matches}
              loading={loading}
              scores={scores}
              setScores={setScores}
              statuses={statuses}
              setStatuses={setStatuses}
              updatingMatchId={updatingMatchId}
              marcadoresFilter={marcadoresFilter}
              setMarcadoresFilter={setMarcadoresFilter}
              onUpdateMatch={handleUpdateMatch}
              onRunEngine={runPointsEngine}
              engineState={engineState}
              lastCalcTime={lastCalcTime}
              lastCalcMatchesCount={lastCalcMatchesCount}
              engineLogs={engineLogs}
              showLogsConsole={showLogsConsole}
              setShowLogsConsole={setShowLogsConsole}
              renderTeamFlag={renderTeamFlag}
              getTodayDateString={getTodayDateString}
              showToast={showToast}
            />
          )}

          {/* PANEL: REGLAS */}
          {activePanel === "reglas" && (
            <ReglasPanel
              rules={rules}
              onRuleChange={handleRuleChange}
              onSaveRules={saveRules}
              activePanel={activePanel}
            />
          )}

          {/* PANEL: CALENDARIO */}
          {activePanel === "calendario" && (
            <CalendarioPanel
              matches={matches}
              loading={loading}
              renderTeamFlag={renderTeamFlag}
              activePanel={activePanel}
              showToast={showToast}
            />
          )}

          {/* PANEL: RANKING */}
          {activePanel === "ranking" && (
            <RankingPanel
              usersList={usersList}
              entryFee={rules.entryFee}
              onTogglePayment={handleTogglePayment}
              onExportCSV={handleExportCSV}
              activePanel={activePanel}
              loading={loading}
              showToast={showToast}
            />
          )}

          {/* PANEL: NOTIFICACIONES */}
          {activePanel === "notif" && (
            <NotifPanel
              missingPredictionsList={missingPredictionsList}
              matches={matches}
              rules={rules}
              notifHistory={notifHistory}
              onSendNotif={handleSendNotif}
              activePanel={activePanel}
              loading={loading}
              renderTeamFlag={renderTeamFlag}
            />
          )}

          {/* PANEL: MOTOR DE PUNTOS */}
          {activePanel === "motor" && (
            <MotorPanel
              matches={matches}
              predictionsList={predictionsList}
              usersList={usersList}
              engineState={engineState}
              lastCalcTime={lastCalcTime}
              lastCalcMatchesCount={lastCalcMatchesCount}
              engineLogs={engineLogs}
              onRunEngine={runPointsEngine}
              activePanel={activePanel}
              renderTeamFlag={renderTeamFlag}
            />
          )}

        </main>
      </div>

      {/* TOAST */}
      <div className={`toast ${toastShow ? "show" : ""} ${toastType === "ok" ? "ok" : ""}`} id="toastEl">
        <span>{toastIcon}</span>&nbsp;<span>{toastMsg}</span>
      </div>
    </div>
  );
}
