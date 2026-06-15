"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, orderBy, getDocs, doc, setDoc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Import modular layouts
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TodayPanel from "@/components/dashboard/TodayPanel";
import UpcomingPanel from "@/components/dashboard/UpcomingPanel";
import HistoryPanel from "@/components/dashboard/HistoryPanel";
import RankingPanel from "@/components/dashboard/RankingPanel";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardBottomNav from "@/components/dashboard/DashboardBottomNav";

function DashboardContent() {
  const { user, loading: authLoading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Core loading/fetching states
  const [loading, setLoading] = useState(true);
  const [allMatches, setAllMatches] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [stats, setStats] = useState({ users: 0, predictions: 0, matches: 104 });
  const [userRank, setUserRank] = useState("-");
  const [rules, setRules] = useState(null);

  // Interaction/UI states
  const [activeTab, setActiveTab] = useState("today");
  const [savingId, setSavingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [rankFilter, setRankFilter] = useState("all");

  // Parse tab search param
  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab && ["today", "upcoming", "history", "ranking"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Scroll to match and highlight
  useEffect(() => {
    if (loading) return;
    const matchId = searchParams?.get("matchId");
    if (!matchId) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(`match-${matchId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("highlight-pulse");
        
        const cleanupTimer = setTimeout(() => {
          element.classList.remove("highlight-pulse");
        }, 6000);
        return () => clearTimeout(cleanupTimer);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams, loading, activeTab]);

  // Auth redirect for guests
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  // Fetch data
  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      try {
        // Fetch all users to calculate ranks
        const usersSnap = await getDocs(collection(db, "users"));
        const usersList = [];
        usersSnap.forEach((doc) => {
          usersList.push({ uid: doc.id, ...doc.data() });
        });
        
        usersList.sort((a, b) => {
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
        
        setTopUsers(usersList);

        // Fetch counts
        const allUsersSnap = await getDocs(collection(db, "users"));
        const predsSnap = await getDocs(collection(db, "predictions"));

        setStats({
          users: allUsersSnap.size,
          predictions: predsSnap.size,
          matches: 104,
        });

        // Current User rank check
        const uIndex = usersList.findIndex((u) => u.uid === user.uid);
        if (uIndex !== -1) {
          setUserRank(`#${uIndex + 1}`);
        }

        // Fetch rules config
        const rulesDoc = await getDoc(doc(db, "config", "rules"));
        if (rulesDoc.exists()) {
          setRules(rulesDoc.data());
        }

        // Fetch user's predictions
        const userPreds = {};
        predsSnap.forEach((doc) => {
          const data = doc.data();
          if (data.userId === user.uid) {
            userPreds[data.matchId] = {
              homeScore: data.homeScore !== undefined ? data.homeScore : "",
              awayScore: data.awayScore !== undefined ? data.awayScore : "",
              advancingTeamId: data.advancingTeamId || "",
              saved: true,
              points: data.points !== undefined ? data.points : null
            };
          }
        });
        setPredictions(userPreds);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  // Real-time listener for matches
  useEffect(() => {
    if (!user) return;
    const mq = query(collection(db, "matches"), orderBy("matchNumber", "asc"));
    const unsubscribe = onSnapshot(mq, (snapshot) => {
      const matchesList = [];
      snapshot.forEach((docSnap) => {
        matchesList.push({ id: docSnap.id, ...docSnap.data() });
      });
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
      setAllMatches(matchesList);
      setStats(prev => ({
        ...prev,
        matches: snapshot.size || 104
      }));
    }, (error) => {
      console.error("Error listening to matches:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle predictions input change
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

  // Save prediction to Firestore
  const handleSavePrediction = async (matchId) => {
    const pred = predictions[matchId];
    if (pred?.homeScore === undefined || pred?.homeScore === "" || pred?.awayScore === undefined || pred?.awayScore === "") {
      alert("Por favor ingresa marcadores válidos.");
      return;
    }

    // Lock predictions check (15 minutes before kickoff)
    const match = allMatches.find(m => m.id === matchId);
    if (match && match.status !== "predicting") {
      const matchDate = new Date(`${match.date}T${match.time}:00Z`);
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
        userDisplayName: user.displayName || user.email.split('@')[0],
        matchId: matchId,
        homeScore: pred.homeScore,
        awayScore: pred.awayScore,
        outcome: outcome,
        points: null,
        advancingTeamId: advancingTeamId,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, "predictions", docId), predictionData);

      setPredictions((prev) => ({
        ...prev,
        [matchId]: {
          ...prev[matchId],
          saved: true
        }
      }));

      // Recount predictions and update user document
      const userRef = doc(db, "users", user.uid);
      const allPredsSnap = await getDocs(collection(db, "predictions"));
      let count = 0;
      allPredsSnap.forEach((doc) => {
        if (doc.data().userId === user.uid) count++;
      });
      await updateDoc(userRef, { predictionsCount: count });

      await refreshUser();
      setSuccessId(matchId);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (error) {
      console.error("Error saving prediction:", error);
      alert("No se pudo guardar el pronóstico. Intenta de nuevo.");
    } finally {
      setSavingId(null);
    }
  };

  // Upload Yappy voucher Captura
  const handlePayUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo supera el límite de 5 MB.");
      return;
    }

    setUploadingReceipt(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result;
        // Save to user document in Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          paymentStatus: "pending",
          paymentReceiptUrl: base64String,
          paymentReceiptUploadedAt: new Date().toISOString()
        });
        
        await refreshUser();
      } catch (err) {
        console.error("Error uploading receipt:", err);
        alert("Error al subir el comprobante. Intenta de nuevo.");
      } finally {
        setUploadingReceipt(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Toggle payment status for testing
  const togglePayStatus = async () => {
    if (!user) return;
    const currentStatus = user.paymentStatus || "unpaid";
    let nextStatus = "unpaid";
    if (currentStatus === "unpaid") nextStatus = "pending";
    else if (currentStatus === "pending") nextStatus = "active";
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        paymentStatus: nextStatus,
        ...(nextStatus === "unpaid" ? { paymentReceiptUrl: null } : {})
      });
      await refreshUser();
    } catch (err) {
      console.error("Error toggling payment status:", err);
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(`${window.location.origin}/auth?ref=${user?.uid || "invite"}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || !user || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-500 min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-[#00E676] mb-3" />
        <span className="text-sm font-semibold font-mono text-[#5E7A9E]">Cargando Quiniela QLU MatchPredict...</span>
      </div>
    );
  }

  // Helper to get local date string YYYY-MM-DD
  const getLocalDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayStr = getLocalDateString();

  // Find date of last finished match
  const finishedMatchesList = allMatches.filter(m => m.status === "finished");
  const lastFinishedDate = finishedMatchesList.length > 0
    ? finishedMatchesList.reduce((max, m) => m.date > max ? m.date : max, "")
    : null;

  // Only live matches for the top live section (finished matches are in the Recent Results widget)
  const liveOrRecentMatches = allMatches.filter(m => {
    return m.status === "live";
  }).sort((a, b) => {
    return (a.matchNumber || 0) - (b.matchNumber || 0);
  });

  // Filter matches into Today (pending predictions), Upcoming, History panels
  const todayMatches = allMatches.filter(m => m.status === "scheduled" || m.status === "predicting").slice(0, 4);
  const upcomingMatches = allMatches.filter(m => (m.status === "scheduled" || m.status === "predicting") && !todayMatches.some(tm => tm.id === m.id));
  const historyMatches = allMatches.filter(m => m.status === "finished").sort((a, b) => (b.matchNumber || 0) - (a.matchNumber || 0));

  const myPredictionsCount = Object.keys(predictions).filter(k => predictions[k].saved).length;
  const effectiveness = myPredictionsCount > 0 
    ? Math.round((((user.correctScores || 0) + (user.correctOutcomes || 0)) / myPredictionsCount) * 100) 
    : 0;

  const displayUser = {
    ...user,
    paymentStatus: (rules?.yappyPaymentEnabled === false) ? "active" : user.paymentStatus
  };

  const currentUserRank = topUsers.findIndex((u) => u.uid === user.uid) + 1;
  const currentUserData = topUsers.find((u) => u.uid === user.uid);

  return (
    <div className="text-[#E8F0FF] min-h-screen">
      {/* Header */}
      <DashboardHeader 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={displayUser}
        userRank={userRank}
        todayMatchesCount={todayMatches.length}
        logout={logout}
        router={router}
      />

      {/* Main Layout Grid */}
      <div className="app-main">
        {/* Left column: active panel */}
        <main>
          {/* Mobile tabs */}
          <div className="mob-tabs">
            <button 
              onClick={() => setActiveTab("today")}
              className={`mtab ${activeTab === "today" ? "active" : ""}`}
            >
              Hoy ({todayMatches.length})
            </button>
            <button 
              onClick={() => setActiveTab("upcoming")}
              className={`mtab ${activeTab === "upcoming" ? "active" : ""}`}
            >
              Próximos
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={`mtab ${activeTab === "history" ? "active" : ""}`}
            >
              Mis Pronósticos
            </button>
            <button 
              onClick={() => setActiveTab("ranking")}
              className={`mtab ${activeTab === "ranking" ? "active" : ""}`}
            >
              Ranking
            </button>
          </div>

          {/* PANEL: Hoy */}
          {activeTab === "today" && (
            <TodayPanel 
              liveOrRecentMatches={liveOrRecentMatches}
              todayMatches={todayMatches}
              predictions={predictions}
              savingId={savingId}
              successId={successId}
              user={displayUser}
              handleInputChange={handleInputChange}
              handleSavePrediction={handleSavePrediction}
              setPredictions={setPredictions}
            />
          )}

          {/* PANEL: Próximos */}
          {activeTab === "upcoming" && (
            <UpcomingPanel 
              upcomingMatches={upcomingMatches}
              predictions={predictions}
              savingId={savingId}
              successId={successId}
              user={displayUser}
              handleInputChange={handleInputChange}
              handleSavePrediction={handleSavePrediction}
              setPredictions={setPredictions}
            />
          )}

          {/* PANEL: Historial */}
          {activeTab === "history" && (
            <HistoryPanel 
              historyMatches={historyMatches}
              predictions={predictions}
            />
          )}

          {/* PANEL: Ranking (FULL VIEW) */}
          {activeTab === "ranking" && (
            <RankingPanel 
              topUsers={topUsers}
              allMatches={allMatches}
              user={displayUser}
              rankFilter={rankFilter}
              setRankFilter={setRankFilter}
              myPredictionsCount={myPredictionsCount}
              currentUserRank={currentUserRank}
              currentUserData={currentUserData}
              setActiveTab={setActiveTab}
            />
          )}
        </main>

        {/* Right column: Sidebar (Leaderboard + Stats + Payment + Recent Results) */}
        <DashboardSidebar 
          activeTab={activeTab}
          topUsers={topUsers}
          user={displayUser}
          stats={stats}
          myPredictionsCount={myPredictionsCount}
          effectiveness={effectiveness}
          userRank={userRank}
          togglePayStatus={togglePayStatus}
          handlePayUpload={handlePayUpload}
          uploadingReceipt={uploadingReceipt}
          copyReferral={copyReferral}
          copied={copied}
          setActiveTab={setActiveTab}
          matches={allMatches}
        />
      </div>

      {/* Mobile Navigation bar */}
      <DashboardBottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        upcomingMatchesCount={upcomingMatches.length}
        router={router}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#00E676]" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
