"use client";

import { useEffect, useState, Suspense } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { TEAM_ISO_CODES } from "@/lib/teamsData";
import Flag from "@/components/Flag";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

function CalendarContent() {
  const { user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("q") || "";

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState("grupos");
  const [activeGroup, setActiveGroup] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect guest users to landing page
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.replace("/");
    }
  }, [mounted, user, authLoading, router]);

  // Fetch all matches from Firestore sorted by matchNumber
  useEffect(() => {
    if (!user) return;
    async function fetchMatches() {
      try {
        const q = query(collection(db, "matches"), orderBy("matchNumber", "asc"));
        const querySnapshot = await getDocs(q);
        const matchesList = [];
        querySnapshot.forEach((doc) => {
          matchesList.push({ id: doc.id, ...doc.data() });
        });
        setMatches(matchesList);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, [user]);

  if (!mounted || authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#07101D]">
        <Loader2 className="h-10 w-10 animate-spin text-[#00E676]" />
      </div>
    );
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────────
  const getMatchPhase = (matchNumber) => {
    if (matchNumber <= 72) return "grupos";
    if (matchNumber <= 88) return "r32";
    if (matchNumber <= 96) return "r16";
    if (matchNumber <= 100) return "qf";
    if (matchNumber <= 102) return "sf";
    return "final";
  };

  const getPhaseCount = (phaseId) => {
    return matches.filter((m) => getMatchPhase(m.matchNumber) === phaseId).length;
  };

  const isSimultaneous = (match) => {
    if (!match.group) return false;
    return matches.some(
      (other) =>
        other.id !== match.id &&
        other.group === match.group &&
        other.date === match.date &&
        other.time === match.time
    );
  };

  const getMatchdayForGroupMatch = (match) => {
    if (!match.group) return null;
    const groupMatches = matches
      .filter((m) => m.group === match.group)
      .sort((a, b) => a.matchNumber - b.matchNumber);
    const index = groupMatches.findIndex((m) => m.id === match.id);
    if (index === -1) return 1;
    return Math.floor(index / 2) + 1;
  };

  const fmtDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const dt = new Date(dateStr + "T12:00:00");
      return dt
        .toLocaleDateString("es-MX", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
        .toUpperCase()
        .replace(".", "");
    } catch (e) {
      return dateStr;
    }
  };

  const isRealTeam = (teamId) => {
    return !!(teamId && TEAM_ISO_CODES[teamId]);
  };

  const renderTeamFlag = (teamId, size = 28) => {
    if (isRealTeam(teamId)) {
      return <Flag code={TEAM_ISO_CODES[teamId]} size={size} />;
    }
    return <span className="text-base select-none">❓</span>;
  };

  const getGroupLetter = (groupName) => {
    if (!groupName) return "";
    return groupName.replace(/grupo\s+/i, "").trim();
  };

  const getGroupBadgeClass = (match) => {
    if (match.matchNumber >= 103) return "gb-final";
    if (match.matchNumber >= 73) return "gb-ko";
    return `gb-${getGroupLetter(match.group)}`;
  };

  const getStatusLabelAndClass = (m) => {
    if (m.status === "live") return { label: "En Vivo", className: "st-live" };
    if (m.status === "finished") return { label: "Finalizado", className: "st-finished" };
    if (isSimultaneous(m)) return { label: "Simultáneo", className: "st-sim" };
    return { label: "Próximo", className: "st-upcoming" };
  };

  const isFinishedOrLive = (m) => {
    return m.status === "finished" || m.status === "live";
  };

  const getMatchLabel = (match) => {
    if (match.label) return match.label;
    const num = match.matchNumber;
    if (num >= 73 && num <= 88) return `R32-${num - 72}`;
    if (num >= 89 && num <= 96) return `Oct-${num - 88}`;
    if (num >= 97 && num <= 100) return `CF-${num - 96}`;
    if (num >= 101 && num <= 102) return `SF-${num - 100}`;
    if (num === 103) return "3er Lugar";
    if (num === 104) return "GRAN FINAL";
    return match.stage || `Partido ${num}`;
  };

  const showScore = (match, team) => {
    if (isFinishedOrLive(match)) {
      const score = team === "home" ? match.result?.homeScore : match.result?.awayScore;
      return score !== undefined && score !== null ? score : "–";
    }
    return "–";
  };

  // ─── FILTER & GROUP LOGIC ────────────────────────────────────────────────
  const isSearchActive = !!searchQuery.trim();
  
  const filteredMatches = isSearchActive
    ? matches.filter((m) => {
        const queryLower = searchQuery.toLowerCase().trim();
        return (
          (m.homeTeam && m.homeTeam.toLowerCase().includes(queryLower)) ||
          (m.awayTeam && m.awayTeam.toLowerCase().includes(queryLower)) ||
          (m.group && m.group.toLowerCase().includes(queryLower)) ||
          (m.venue && m.venue.toLowerCase().includes(queryLower))
        );
      })
    : matches.filter((m) => getMatchPhase(m.matchNumber) === activePhase);

  const groupFilteredMatches =
    !isSearchActive && activePhase === "grupos" && activeGroup !== "all"
      ? filteredMatches.filter((m) => getGroupLetter(m.group) === activeGroup)
      : filteredMatches;

  // Group matches by group
  const groupMatchesByGroup = (matchesList) => {
    const grouped = {};
    const sorted = [...matchesList].sort((a, b) => {
      const grpA = a.group || "";
      const grpB = b.group || "";
      if (grpA !== grpB) return grpA.localeCompare(grpB);
      return a.matchNumber - b.matchNumber;
    });

    sorted.forEach((m) => {
      const grp = m.group || "TBD";
      if (!grouped[grp]) {
        grouped[grp] = [];
      }
      grouped[grp].push(m);
    });
    return grouped;
  };

  const groupedGroupMatches = groupMatchesByGroup(groupFilteredMatches);
  const groupsList = ["all", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  const phases = [
    { id: "grupos", name: "Fase de Grupos" },
    { id: "r32", name: "Ronda de 32" },
    { id: "r16", name: "Octavos" },
    { id: "qf", name: "Cuartos" },
    { id: "sf", name: "Semifinales" },
    { id: "final", name: "🏆 Final" },
  ];

  return (
    <div className="calendar-container min-h-screen">
      {/* SCOPED STYLING */}
      <style dangerouslySetInnerHTML={{ __html: `
        .calendar-container {
          --bg: #07101D; --surface: #0D1A2D; --surface2: #152338; --surface3: #1B2D47;
          --fg: #E8F0FF; --fg-dim: #C5D2EE; --muted: #5E7A9E;
          --border: #1C2E48; --border2: #253B5E;
          --green: #00E676; --green-d: #00A853;
          --gold: #FFD700; --red: #FF5252; --amber: #FFB300; --blue: #5B8DEF;
          --font-d: 'Bebas Neue', Impact, sans-serif;
          --font-b: 'Inter', -apple-system, system-ui, sans-serif;
          --r-s: 6px; --r-m: 12px; --r-l: 16px;
          
          background: var(--bg);
          color: var(--fg);
          font-family: var(--font-b);
          width: 100%;
          padding-top: 72px;
        }

        .calendar-container ::-webkit-scrollbar { width: 5px; }
        .calendar-container ::-webkit-scrollbar-track { background: var(--bg); }
        .calendar-container ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

        /* HEADER EXTRA STYLES */
        .calendar-container .h-back {
          color: var(--muted);
          font-size: .8rem;
          text-decoration: none;
          transition: color .2s;
          margin-left: auto;
        }
        .calendar-container .h-back:hover {
          color: var(--fg);
        }
        .calendar-container .h-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(0, 230, 118, 0.08);
          border: 1px solid rgba(0, 230, 118, 0.2);
          padding: 4px 10px;
          border-radius: var(--r-s);
          font-size: .7rem;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: var(--green);
          white-space: nowrap;
        }
        .calendar-container .h-title {
          font-family: var(--font-d);
          font-size: 1.55rem;
          letter-spacing: .06em;
          color: var(--fg);
        }
        .calendar-container .h-div {
          width: 1px;
          height: 26px;
          background: var(--border);
        }

        /* PHASE BAR */
        .calendar-container .phase-bar {
          position: sticky;
          top: 72px;
          z-index: 30;
          background: rgba(7, 16, 29, 0.98);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 0 clamp(12px, 3vw, 28px);
        }
        .calendar-container .phase-bar::-webkit-scrollbar { display: none; }
        
        .calendar-container .phase-tab {
          flex-shrink: 0;
          padding: 13px 15px;
          border: none;
          background: transparent;
          color: var(--muted);
          font-family: var(--font-b);
          font-size: .8rem;
          font-weight: 600;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: .06em;
          border-bottom: 2px solid transparent;
          transition: all .18s;
          white-space: nowrap;
        }
        .calendar-container .phase-tab:hover { color: var(--fg); }
        .calendar-container .phase-tab.active { color: var(--green); border-bottom-color: var(--green); }
        
        .calendar-container .phase-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 17px;
          height: 17px;
          background: var(--surface2);
          color: var(--muted);
          border-radius: 50%;
          font-size: .6rem;
          margin-left: 4px;
        }
        .calendar-container .phase-tab.active .phase-count {
          background: rgba(0, 230, 118, 0.15);
          color: var(--green);
        }

        /* MAIN CONTENT */
        .calendar-container .main-content {
          padding: 28px clamp(12px, 3vw, 28px) 80px;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* STATS BAR */
        .calendar-container .stats-bar {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-l);
          overflow: hidden;
        }
        .calendar-container .stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 14px 20px;
          border-right: 1px solid var(--border);
          flex: 1;
          min-width: 120px;
        }
        .calendar-container .stat-item:last-child { border-right: none; }
        .calendar-container .stat-val { font-family: var(--font-d); font-size: 1.8rem; line-height: 1; }
        .calendar-container .stat-val.g { color: var(--green); }
        .calendar-container .stat-val.go { color: var(--gold); }
        .calendar-container .stat-val.b { color: var(--blue); }
        .calendar-container .stat-lbl { font-size: .65rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }

        /* GROUP FILTER */
        .calendar-container .group-filter {
          display: flex;
          gap: 7px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .calendar-container .group-filter::-webkit-scrollbar { display: none; }
        
        .calendar-container .gf-chip {
          flex-shrink: 0;
          padding: 6px 13px;
          border-radius: 20px;
          border: 1px solid var(--border2);
          background: transparent;
          color: var(--muted);
          font-size: .78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all .18s;
        }
        .calendar-container .gf-chip:hover { color: var(--fg); background: var(--surface2); }
        .calendar-container .gf-chip.active { background: var(--green); color: #000; border-color: var(--green); }

        /* DATE DIVIDER */
        .calendar-container .date-divider { display: flex; align-items: center; gap: 10px; margin: 24px 0 12px; }
        .calendar-container .date-divider:first-of-type { margin-top: 0; }
        .calendar-container .date-label { font-family: var(--font-d); font-size: .95rem; letter-spacing: .1em; color: var(--muted); text-transform: uppercase; white-space: nowrap; }
        .calendar-container .date-line { flex: 1; height: 1px; background: var(--border); }
        .calendar-container .sim-badge { padding: 2px 8px; border-radius: 3px; font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; background: rgba(255, 183, 0, 0.1); color: var(--amber); border: 1px solid rgba(255, 183, 0, 0.2); }
        .calendar-container .count-badge { font-size: .68rem; color: var(--muted); }

        /* MATCH GRID */
        .calendar-container .match-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px; }

        /* MATCH CARD */
        .calendar-container .match-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-l);
          padding: 14px 15px;
          transition: all .18s;
          cursor: pointer;
        }
        .calendar-container .match-card:hover { border-color: var(--border2); background: var(--surface2); transform: translateY(-2px); }
        .calendar-container .match-card.sim { border-left: 3px solid var(--amber); }
        .calendar-container .match-card.final-match { border-color: var(--gold); background: rgba(255, 215, 0, 0.04); }

        .calendar-container .mc-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 11px; }
        .calendar-container .mc-date { font-size: .68rem; text-transform: uppercase; letter-spacing: .07em; color: var(--muted); }
        .calendar-container .mc-badge { font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; padding: 2px 7px; border-radius: 3px; }
        
        .calendar-container .gb-A { background: rgba(91, 141, 239, 0.12); color: #7AABFF; }
        .calendar-container .gb-B { background: rgba(0, 230, 118, 0.1); color: var(--green); }
        .calendar-container .gb-C { background: rgba(255, 215, 0, 0.1); color: var(--gold); }
        .calendar-container .gb-D { background: rgba(255, 82, 82, 0.1); color: var(--red); }
        .calendar-container .gb-E { background: rgba(255, 183, 0, 0.1); color: var(--amber); }
        .calendar-container .gb-F { background: rgba(180, 100, 240, 0.12); color: #C084FC; }
        .calendar-container .gb-G { background: rgba(34, 211, 238, 0.1); color: #22D3EE; }
        .calendar-container .gb-H { background: rgba(251, 146, 60, 0.1); color: #FB923C; }
        .calendar-container .gb-I { background: rgba(52, 211, 153, 0.1); color: #34D399; }
        .calendar-container .gb-J { background: rgba(248, 113, 113, 0.1); color: #F87171; }
        .calendar-container .gb-K { background: rgba(139, 92, 246, 0.12); color: #A78BFA; }
        .calendar-container .gb-L { background: rgba(236, 72, 153, 0.1); color: #F472B6; }
        .calendar-container .gb-ko { background: rgba(255, 215, 0, 0.1); color: var(--gold); }
        .calendar-container .gb-final { background: rgba(255, 215, 0, 0.18); color: var(--gold); border: 1px solid rgba(255, 215, 0, 0.3); }

        .calendar-container .mc-teams { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 11px; }
        .calendar-container .mc-team { display: flex; flex-direction: column; align-items: center; gap: 3px; flex: 1; }
        .calendar-container .mc-flag { display: flex; align-items: center; justify-content: center; height: 28px; }
        .calendar-container .mc-name { font-size: .72rem; font-weight: 600; text-align: center; color: var(--fg-dim); line-height: 1.3; }
        .calendar-container .mc-vs { font-family: var(--font-d); font-size: 1rem; color: var(--muted); flex-shrink: 0; }

        .calendar-container .mc-scores-preview {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .calendar-container .mc-score-num {
          font-family: var(--font-d);
          font-size: 1.1rem;
          color: var(--green);
        }

        .calendar-container .mc-foot { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .calendar-container .mc-venue { font-size: .67rem; color: var(--muted); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .calendar-container .mc-status { font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; padding: 2px 7px; border-radius: 3px; white-space: nowrap; }
        
        .calendar-container .st-upcoming { background: rgba(91, 141, 239, 0.1); color: var(--blue); }
        .calendar-container .st-live { background: rgba(0, 230, 118, 0.1); color: var(--green); border: 1px solid rgba(0, 230, 118, 0.2); animation: pulse 2s infinite; }
        .calendar-container .st-finished { background: rgba(94, 122, 158, 0.1); color: var(--muted); }
        .calendar-container .st-sim { background: rgba(255, 183, 0, 0.1); color: var(--amber); }

        /* BRACKET (knockout) */
        .calendar-container .phase-section { margin-bottom: 36px; }
        .calendar-container .phase-section-title { font-family: var(--font-d); font-size: 1.9rem; letter-spacing: .06em; margin-bottom: 14px; color: var(--fg); }
        .calendar-container .phase-section-title span { color: var(--gold); }
        
        .calendar-container .bracket-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 10px; }
        .calendar-container .bk-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-m); padding: 13px 15px; transition: all .18s; }
        .calendar-container .bk-card:hover { border-color: var(--border2); }
        .calendar-container .bk-card.bk-final { border-color: var(--gold); background: rgba(255, 215, 0, 0.04); }
        
        .calendar-container .bk-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
        .calendar-container .bk-label { font-family: var(--font-d); font-size: .95rem; letter-spacing: .06em; color: var(--fg); }
        .calendar-container .bk-date { font-size: .67rem; color: var(--muted); }
        
        .calendar-container .bk-teams { display: flex; flex-direction: column; gap: 5px; }
        .calendar-container .bk-team { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: var(--r-s); background: var(--surface2); border: 1px solid transparent; }
        .calendar-container .bk-team.winner { border: 1px solid rgba(0, 230, 118, 0.3); background: rgba(0, 230, 118, 0.03); }
        
        .calendar-container .bk-flag { display: flex; align-items: center; justify-content: center; height: 20px; width: 26px; }
        .calendar-container .bk-tname { font-size: .78rem; font-weight: 600; flex: 1; color: var(--fg-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .calendar-container .bk-score { font-family: var(--font-d); font-size: 1.1rem; color: var(--muted); min-width: 12px; text-align: right; }
        .calendar-container .bk-score.active { color: var(--green); }
        
        .calendar-container .bk-sep { text-align: center; font-size: .62rem; color: var(--muted); text-transform: uppercase; letter-spacing: .07em; padding: 2px 0; }
        .calendar-container .bk-venue { font-size: .66rem; color: var(--muted); margin-top: 8px; }

        /* ANIMATIONS */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        .calendar-container .match-card, .calendar-container .bk-card { animation: fadeIn .18s ease both; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* RESPONSIVE Adjustments inside MainWrapper layout context */
        @media(max-width: 768px) {
          .calendar-container .match-grid, .calendar-container .bracket-grid { grid-template-columns: 1fr; }
          .calendar-container .stats-bar { flex-wrap: wrap; }
          .calendar-container .stat-item { border-right: none; border-bottom: 1px solid var(--border); padding: 10px 15px; }
          .calendar-container .stat-item:last-child { border-bottom: none; }
          .calendar-container .phase-bar {
            top: 72px;
          }
        }
        @media(max-width: 480px) {
          .calendar-container .phase-section-title { font-size: 1.5rem; }
        }
      ` }} />

      {/* HEADER */}
      <header className="app-header">
        <Link className="h-logo" href="/dashboard">
          <span className="h-logo-icon">⚽</span>
          <span className="h-logo-text">QLU <em>MatchPredict</em></span>
        </Link>
        <div className="h-div"></div>
        <span className="h-title">CALENDARIO</span>
        <Link className="h-back" href="/dashboard">← Dashboard</Link>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-[#1C2E48] text-slate-500 dark:text-[#5E7A9E] hover:bg-slate-100 dark:hover:bg-[#1C2E48]/50 transition-all duration-200 cursor-pointer mr-2 ml-2"
          title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <svg className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="18.36" x2="5.64" y2="19.78"></line>
              <line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
        <div className="h-pill">{matches.length} partidos</div>
      </header>

      {/* PHASE STICKY BAR (hidden if search is active) */}
      {!isSearchActive && (
        <nav className="phase-bar">
          {phases.map((p) => {
            const active = activePhase === p.id;
            const count = getPhaseCount(p.id);
            return (
              <button
                key={p.id}
                className={`phase-tab ${active ? "active" : ""}`}
                onClick={() => {
                  setActivePhase(p.id);
                  setActiveGroup("all");
                }}
              >
                {p.name} <span className="phase-count">{count}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* MAIN CONTAINER */}
      <main className="main-content">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#00E676]" />
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
            <span className="text-4xl mb-3">⚽</span>
            <p className="text-lg font-bold">No se encontraron partidos</p>
            <p className="text-sm mt-1">La base de datos de partidos no ha sido inicializada.</p>
          </div>
        ) : (
          <>
            {/* SEARCH RESULTS SUMMARY */}
            {isSearchActive && (
              <div className="flex items-center justify-between p-4 mb-6 bg-[#0D1A2D] border border-[#1C2E48] rounded-xl">
                <div className="text-sm text-[#E8F0FF]">
                  Mostrando resultados para: <span className="text-[#00E676] font-bold">"{searchQuery}"</span>
                </div>
                <Link
                  href="/calendar"
                  className="text-xs text-[#5E7A9E] hover:text-[#E8F0FF] font-bold"
                >
                  Limpiar búsqueda ✗
                </Link>
              </div>
            )}

            {/* STATS BAR */}
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-val g">104</span>
                <span className="stat-lbl">Partidos</span>
              </div>
              <div className="stat-item">
                <span className="stat-val go">48</span>
                <span className="stat-lbl">Selecciones</span>
              </div>
              <div className="stat-item">
                <span className="stat-val b">16</span>
                <span className="stat-lbl">Sedes</span>
              </div>
              <div className="stat-item">
                <span className="stat-val" style={{ color: "var(--muted)" }}>39</span>
                <span className="stat-lbl">Días</span>
              </div>
              <div className="stat-item">
                <span className="stat-val" style={{ color: "var(--fg-dim)" }}>11 JUN</span>
                <span className="stat-lbl">Apertura</span>
              </div>
              <div className="stat-item">
                <span className="stat-val go">19 JUL</span>
                <span className="stat-lbl">Gran Final</span>
              </div>
            </div>

            {/* SEARCH RESULTS VIEW */}
            {isSearchActive && (
              <div className="phase-section">
                <div className="phase-section-title">
                  Resultados de la Búsqueda
                </div>
                {groupFilteredMatches.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500">
                     No se encontraron partidos para su consulta.
                  </div>
                ) : (
                  <div className="match-grid">
                    {groupFilteredMatches.map((m) => {
                      const isSim = isSimultaneous(m);
                      const statusInfo = getStatusLabelAndClass(m);
                      const homeMd = getMatchdayForGroupMatch(m);
                      const isGroup = m.matchNumber <= 72;

                      return (
                        <div
                          key={m.id}
                          className={`match-card ${isSim ? "sim" : ""} ${
                            m.matchNumber === 104 ? "final-match" : ""
                          }`}
                          onClick={() => router.push(`/dashboard?tab=upcoming&matchId=${m.id}`)}
                        >
                          <div className="mc-top">
                            <span className="mc-date">
                              {fmtDate(m.date)} · {m.time}
                            </span>
                            <span className={`mc-badge ${getGroupBadgeClass(m)}`}>
                              {isGroup ? `${m.group} · J${homeMd}` : getMatchLabel(m)}
                            </span>
                          </div>
                          <div className="mc-teams">
                            <div className="mc-team">
                              <div className="mc-flag">
                                {renderTeamFlag(m.homeTeamId, 28)}
                              </div>
                              <span className="mc-name">{m.homeTeam}</span>
                            </div>
                            <span className="mc-vs">VS</span>
                            <div className="mc-team">
                              <div className="mc-flag">
                                {renderTeamFlag(m.awayTeamId, 28)}
                              </div>
                              <span className="mc-name">{m.awayTeam}</span>
                            </div>
                          </div>
                          <div className="mc-foot">
                            <span className="mc-venue" title={m.venue}>
                              📍 {m.venue}
                            </span>
                            {isFinishedOrLive(m) && (
                              <div className="mc-scores-preview">
                                <span className="mc-score-num">{m.result?.homeScore}</span>
                                <span className="text-zinc-600 font-bold">:</span>
                                <span className="mc-score-num">{m.result?.awayScore}</span>
                              </div>
                            )}
                            <span className={`mc-status ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* FASE DE GRUPOS VIEW (only if search is NOT active) */}
            {!isSearchActive && activePhase === "grupos" && (
              <>
                {/* Group Filter Chips */}
                <div className="group-filter">
                  {groupsList.map((g) => (
                    <button
                      key={g}
                      className={`gf-chip ${activeGroup === g ? "active" : ""}`}
                      onClick={() => setActiveGroup(g)}
                    >
                      {g === "all" ? "Todos" : `Grupo ${g}`}
                    </button>
                  ))}
                </div>

                {/* Group Stage Matches grouped by group */}
                {Object.keys(groupedGroupMatches).length === 0 ? (
                  <div className="text-center py-10 text-zinc-500">
                    No hay partidos para el grupo seleccionado
                  </div>
                ) : (
                  Object.keys(groupedGroupMatches)
                    .sort()
                    .map((groupName) => {
                      const groupMatches = groupedGroupMatches[groupName];
                      const groupHasSim = groupMatches.some((m) => isSimultaneous(m));

                      return (
                        <div key={groupName} className="mb-8">
                          {/* Group divider */}
                          <div className="date-divider">
                            <span className="date-label">{groupName}</span>
                            {groupHasSim && <span className="sim-badge">Simultáneo</span>}
                            <div className="date-line"></div>
                            <span className="count-badge">
                              {groupMatches.length} partido{groupMatches.length > 1 ? "s" : ""}
                            </span>
                          </div>

                          {/* Grid of match cards */}
                          <div className="match-grid">
                            {groupMatches.map((m) => {
                              const isSim = isSimultaneous(m);
                              const statusInfo = getStatusLabelAndClass(m);
                              const homeMd = getMatchdayForGroupMatch(m);

                              return (
                                <div
                                  key={m.id}
                                  className={`match-card ${isSim ? "sim" : ""} ${
                                    m.matchNumber === 104 ? "final-match" : ""
                                  }`}
                                  onClick={() => router.push(`/dashboard?tab=upcoming&matchId=${m.id}`)}
                                >
                                  <div className="mc-top">
                                    <span className="mc-date">
                                      {fmtDate(m.date)} · {m.time}
                                    </span>
                                    <span className={`mc-badge ${getGroupBadgeClass(m)}`}>
                                      {m.group} · J{homeMd}
                                    </span>
                                  </div>
                                  <div className="mc-teams">
                                    <div className="mc-team">
                                      <div className="mc-flag">
                                        {renderTeamFlag(m.homeTeamId, 28)}
                                      </div>
                                      <span className="mc-name">{m.homeTeam}</span>
                                    </div>
                                    <span className="mc-vs">VS</span>
                                    <div className="mc-team">
                                      <div className="mc-flag">
                                        {renderTeamFlag(m.awayTeamId, 28)}
                                      </div>
                                      <span className="mc-name">{m.awayTeam}</span>
                                    </div>
                                  </div>
                                  <div className="mc-foot">
                                    <span className="mc-venue" title={m.venue}>
                                      📍 {m.venue}
                                    </span>
                                    {isFinishedOrLive(m) && (
                                      <div className="mc-scores-preview">
                                        <span className="mc-score-num">{m.result?.homeScore}</span>
                                        <span className="text-zinc-600 font-bold">:</span>
                                        <span className="mc-score-num">{m.result?.awayScore}</span>
                                      </div>
                                    )}
                                    <span className={`mc-status ${statusInfo.className}`}>
                                      {statusInfo.label}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                )}
              </>
            )}

            {/* KNOCKOUT VIEW (only if search is NOT active) */}
            {!isSearchActive && activePhase !== "grupos" && (
              <div className="phase-section">
                <div className="phase-section-title">
                  {activePhase === "final" ? (
                    <>
                      🏆 <span>Gran Final / 3er Puesto</span>
                    </>
                  ) : (
                    phases.find((p) => p.id === activePhase)?.name
                  )}
                </div>

                {groupFilteredMatches.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500">
                    No hay partidos cargados para esta fase
                  </div>
                ) : (
                  <div className="bracket-grid">
                    {groupFilteredMatches
                      .sort((a, b) => a.matchNumber - b.matchNumber)
                      .map((m) => {
                        const scoreHome = showScore(m, "home");
                        const scoreAway = showScore(m, "away");

                        return (
                          <div
                            key={m.id}
                            className={`bk-card cursor-pointer hover:border-white/20 transition-all ${m.matchNumber === 104 ? "bk-final" : ""}`}
                            onClick={() => router.push(`/dashboard?tab=upcoming&matchId=${m.id}`)}
                          >
                            <div className="bk-meta">
                              <span className="bk-label">{getMatchLabel(m)}</span>
                              <span className="bk-date">
                                {fmtDate(m.date)} · {m.time}
                              </span>
                            </div>
                            <div className="bk-teams">
                              <div
                                className={`bk-team ${
                                  m.status === "finished" && m.result?.winner === "home"
                                    ? "winner"
                                    : ""
                                }`}
                              >
                                <div className="bk-flag">
                                  {renderTeamFlag(m.homeTeamId, 20)}
                                </div>
                                <span className="bk-tname" title={m.homeTeam}>
                                  {m.homeTeam}
                                </span>
                                <span
                                  className={`bk-score ${
                                    isFinishedOrLive(m) ? "active" : ""
                                  }`}
                                >
                                  {scoreHome}
                                </span>
                              </div>
                              <div className="bk-sep">vs</div>
                              <div
                                className={`bk-team ${
                                  m.status === "finished" && m.result?.winner === "away"
                                    ? "winner"
                                    : ""
                                }`}
                              >
                                <div className="bk-flag">
                                  {renderTeamFlag(m.awayTeamId, 20)}
                                </div>
                                <span className="bk-tname" title={m.awayTeam}>
                                  {m.awayTeam}
                                </span>
                                <span
                                  className={`bk-score ${
                                    isFinishedOrLive(m) ? "active" : ""
                                  }`}
                                >
                                  {scoreAway}
                                </span>
                              </div>
                            </div>
                            <div className="bk-venue" title={m.venue}>
                              📍 {m.venue}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#07101D]">
        <Loader2 className="h-10 w-10 animate-spin text-[#00E676]" />
      </div>
    }>
      <CalendarContent />
    </Suspense>
  );
}
