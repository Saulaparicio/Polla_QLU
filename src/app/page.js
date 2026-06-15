"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import Flag from "@/components/Flag";

export default function Home() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);

  // Demo state for landing page
  const [demoPredictions, setDemoPredictions] = useState({
    demo1: { homeScore: 2, awayScore: 0, saved: false },
    demo2: { homeScore: "", awayScore: "", saved: false },
    demo3: { homeScore: "", awayScore: "", saved: false }
  });
  const [demoLeaderboard, setDemoLeaderboard] = useState([
    { rank: 1, alias: "@LeonFutbolero", loc: "Buenos Aires", countryCode: "AR", delta: "dup", deltaText: "▲2", points: 128, avt: "🦁" },
    { rank: 2, alias: "@AguiPanama",    loc: "Panamá",        countryCode: "PA", delta: "dst", deltaText: "—",  points: 121, avt: "🦅" },
    { rank: 3, alias: "@PintorPitero",  loc: "Colón",         countryCode: "PA", delta: "ddn", deltaText: "▼1", points: 117, avt: "🐆" },
    { rank: 4, alias: "@DelfinCarioca", loc: "São Paulo",      countryCode: "BR", delta: "dup", deltaText: "▲1", points: 109, avt: "🐬" },
    { rank: 5, alias: "@ZorroGoleador", loc: "Guadalajara",    countryCode: "MX", delta: "dup", deltaText: "▲3", points: 104, avt: "🦊" },
    { rank: 8, alias: "@TúEstásAquí",  loc: "Mi posición",    countryCode: "PA", delta: "dup", deltaText: "▲2", points: 88,  avt: "⚡" }
  ]);

  // Auth redirect to /dashboard if logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // Scroll reveal and navbar scroll effects for landing page
  useEffect(() => {
    if (user) return; // Only run on landing page (logged out)

    // 1. Navbar scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    // 2. Intersection Observer for scroll entrance animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-active");
          }
        });
      },
      { threshold: 0.12 }
    );

    // Select elements to reveal
    const revealElements = document.querySelectorAll(
      ".step-card, .tier, .match-card, .lb-card, .payment-card"
    );
    
    revealElements.forEach((el) => {
      el.classList.add("reveal-init");
      observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [user]);

  // Handle Demo Predictions (landing page)
  const handleDemoInputChange = (id, team, value) => {
    const parsedVal = value === "" ? "" : parseInt(value, 10);
    setDemoPredictions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [team]: parsedVal,
        saved: false
      }
    }));
  };

  const handleDemoSave = (id) => {
    const pred = demoPredictions[id];
    if (pred.homeScore === "" || pred.awayScore === "") return;

    setDemoPredictions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        saved: true
      }
    }));

    // If saving the Argentina match (demo1), let's bump the user rank in the mock leaderboard to show real-time feel!
    if (id === "demo1") {
      setDemoLeaderboard((prev) => {
        const copy = [...prev];
        // Move user (index 5) up to index 4 (rank 5) or rank 6
        copy[5] = { ...copy[5], points: 91, deltaText: "▲3" };
        return copy;
      });
    }
  };

  if (loading || user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-500 min-h-screen bg-[#07101D]">
        <Loader2 className="h-10 w-10 animate-spin text-[#00E676] mb-3" />
        <span className="text-sm font-semibold font-mono text-[#5E7A9E]">
          {user ? "Redireccionando al Dashboard..." : "Cargando Quiniela Polla Mundialista..."}
        </span>
      </div>
    );
  }

  // 1. RENDER LANDING PAGE IF NOT LOGGED IN
  return (
    <div className="bg-[#07101D] text-[#E8F0FF] min-h-screen overflow-x-hidden">
      {/* Navigation Bar */}
      <nav id="top-nav" className={`fixed top-0 left-0 right-0 z-50 px-3 py-3 sm:px-6 md:px-8 bg-[#07101D]/80 backdrop-blur-md border-b flex items-center justify-between gap-2 sm:gap-6 transition-all duration-300 ${isScrolled ? "bg-[#07101D]/95 border-white/10" : "border-white/5"}`}>
        <Link href="#" className="nav-logo flex items-center gap-1.5 sm:gap-2 text-decoration-none shrink">
          <span className="nav-logo-icon text-lg sm:text-xl">⚽</span>
          <span className="nav-logo-text font-display text-lg sm:text-2xl tracking-wider">Polla <em className="text-[#00E5FF] not-italic hidden sm:inline">Mundialista</em></span>
        </Link>
        <ul className="nav-links hidden md:flex gap-7 list-none">
          <li><a href="#como-jugar" className="text-[#5E7A9E] hover:text-[#E8F0FF] text-sm font-medium transition-colors">Cómo jugar</a></li>
          <li><a href="#puntuacion" className="text-[#5E7A9E] hover:text-[#E8F0FF] text-sm font-medium transition-colors">Puntuación</a></li>
          <li><a href="#ranking" className="text-[#5E7A9E] hover:text-[#E8F0FF] text-sm font-medium transition-colors">Demo interactivo</a></li>
          <li><a href="#inscripcion" className="text-[#5E7A9E] hover:text-[#E8F0FF] text-sm font-medium transition-colors">Inscripción</a></li>
        </ul>
        <div className="nav-cta flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
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
          <Link href="/auth" className="btn btn-ghost !px-2.5 !py-1.5 !text-xs sm:!px-4 sm:!py-2 sm:!text-sm">Iniciar Sesión</Link>
          <Link href="/auth" className="btn btn-primary !px-2.5 !py-1.5 !text-xs sm:!px-4 sm:!py-2 sm:!text-sm">Registrarse</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero min-h-screen flex flex-col justify-center items-center text-center padding-clamp relative overflow-hidden">
        {/* Flags moving background ticker — SVG flags */}
        <div className="ticker-wrap absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" style={{opacity: 0.15}}>
          {/* Row 1 — top WC 2026 teams */}
          {(() => {
            const row1 = ["AR","FR","BR","ES","DE","GB-ENG","PT","UY","MX","US","CA","JP","MA","SN","KR","PA","CO","NL","BE","CH","SE","DK","AU"];
            const doubled = [...row1, ...row1];
            return (
              <div className="flex gap-8 whitespace-nowrap absolute top-[8%] w-max" style={{animation:"tickerL 35s linear infinite"}}>
                {doubled.map((c,i) => <Flag key={i} code={c} size={32} className="opacity-90" />)}
              </div>
            );
          })()}
          {/* Row 2 — more nations, reverse */}
          {(() => {
            const row2 = ["NG","CI","GH","EC","PE","CL","CR","SA","IR","PH","ZA","SR","TN","AL","HN","QA","EG"];
            const doubled = [...row2, ...row2];
            return (
              <div className="flex gap-8 whitespace-nowrap absolute top-[26%] w-max" style={{animation:"tickerL 28s linear infinite reverse"}}>
                {doubled.map((c,i) => <Flag key={i} code={c} size={26} className="opacity-90" />)}
              </div>
            );
          })()}
          {/* Row 3 — LATAM focus */}
          {(() => {
            const row3 = ["MX","AR","US","BR","CA","PA","CO","PE","UY","CL","BO","PY","VE","EC","CR","HN","GT"];
            const doubled = [...row3, ...row3];
            return (
              <div className="flex gap-8 whitespace-nowrap absolute top-[54%] w-max" style={{animation:"tickerL 42s linear infinite"}}>
                {doubled.map((c,i) => <Flag key={i} code={c} size={40} className="opacity-90" />)}
              </div>
            );
          })()}
          {/* Row 4 — Europe/Africa */}
          {(() => {
            const row4 = ["DE","FR","ES","IT","PT","NL","BE","CH","SE","DK","PL","HR","RS","CZ","MA","SN","GH","NG","CM"];
            const doubled = [...row4, ...row4];
            return (
              <div className="flex gap-8 whitespace-nowrap absolute top-[74%] w-max" style={{animation:"tickerL 22s linear infinite reverse"}}>
                {doubled.map((c,i) => <Flag key={i} code={c} size={22} className="opacity-90" />)}
              </div>
            );
          })()}
          {/* Row 5 — custom speed matching globals.css */}
          {(() => {
            const row5 = ["AR","DE","BR","FR","IT","ES","UY","PT","GB-ENG","PA","CR","HN","MX","US","CA"];
            const doubled = [...row5, ...row5];
            return (
              <div className="flex gap-8 whitespace-nowrap absolute top-[88%] w-max" style={{animation:"tickerL 50s linear infinite"}}>
                {doubled.map((c,i) => <Flag key={i} code={c} size={36} className="opacity-90" />)}
              </div>
            );
          })()}
        </div>

        <div className="hero-z relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="hero-badge inline-flex items-center gap-2 bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-7">
            ⚽ FIFA WORLD CUP 2026 &nbsp;·&nbsp; USA · CAN · MEX
          </div>
          <h1 className="hero-title font-display text-6xl md:text-[7.5rem] leading-none tracking-tight text-[#E8F0FF] uppercase select-none">
            Polla <span className="yr block text-[#00E5FF] drop-shadow-[0_0_40px_rgba(0,229,255,0.35)]">Mundialista</span>
          </h1>
          <p className="hero-tagline font-display text-lg sm:text-2xl text-[#5E7A9E] tracking-[0.22em] mt-5">PRONÓSTICA · COMPITE · GANA</p>
          <p className="hero-desc max-w-xl text-[#5E7A9E] text-sm sm:text-base leading-relaxed mt-4">
            El torneo de predicciones más emocionante del año. 104 partidos, 48 selecciones y una sola quiniela para dominarlos a todos.
          </p>
          
          <div className="hero-cta flex gap-4 mt-9 flex-wrap justify-center">
            <Link href="/auth" className="btn btn-primary btn-lg">Quiero Participar</Link>
            <a href="#como-jugar" className="btn btn-secondary btn-lg">¿Cómo Funciona?</a>
          </div>

          <div className="hero-stats flex gap-8 sm:gap-16 mt-14 flex-wrap justify-center">
            <div className="stat-item"><div className="stat-val font-display text-4xl sm:text-5xl text-[#E8F0FF]">104</div><div className="stat-lbl text-[10px] text-[#5E7A9E] tracking-wider uppercase mt-1">Partidos</div></div>
            <div className="stat-item"><div className="stat-val font-display text-4xl sm:text-5xl text-[#E8F0FF]">48</div><div className="stat-lbl text-[10px] text-[#5E7A9E] tracking-wider uppercase mt-1">Selecciones</div></div>
            <div className="stat-item"><div className="stat-val font-display text-4xl sm:text-5xl text-[#00E676]">3 PTS</div><div className="stat-lbl text-[10px] text-[#5E7A9E] tracking-wider uppercase mt-1">Exacto</div></div>
            <div className="stat-item"><div className="stat-val font-display text-4xl sm:text-5xl text-[#E8F0FF]">11 JUN</div><div className="stat-lbl text-[10px] text-[#5E7A9E] tracking-wider uppercase mt-1">Inicio 2026</div></div>
          </div>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span>SCROLL</span>
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none"><path d="M7 0v14M1 8l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </section>

      <div className="divider h-[1px] bg-[#1C2E48] mx-4 sm:mx-12"></div>

      {/* How It Works Section */}
      <section className="section py-16 px-6 sm:px-12 max-w-6xl mx-auto" id="como-jugar">
        <div className="container">
          <p className="eyebrow text-xs uppercase tracking-widest text-[#00E676] font-bold mb-2">¿Cómo jugar?</p>
          <h2 className="section-h font-display text-4xl sm:text-6xl text-[#E8F0FF] leading-none mb-2">TAN FÁCIL COMO 1-2-3</h2>
          <p className="section-p text-[#5E7A9E] text-base max-w-lg mb-10">Sin complicaciones. Pronóstica antes de cada partido, acumula puntos y asciende en el ranking.</p>
          
          <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="step-card bg-[#0D1A2D] border border-[#1C2E48] rounded-xl p-8 relative overflow-hidden transition-all hover:border-[#00E676]/30 hover:-translate-y-1">
              <div className="step-bg-num font-display text-8xl text-white/5 absolute top-2 right-4 select-none pointer-events-none">01</div>
              <div className="step-icon text-4xl mb-4">📝</div>
              <h3 className="step-title text-lg font-bold text-white mb-2">Regístrate e inscríbete</h3>
              <p className="step-desc text-sm text-[#5E7A9E] leading-relaxed">Crea tu cuenta con tu correo, elige tu alias y avatar. Realiza el pago de inscripción por Yappy y espera la confirmación.</p>
            </div>
            <div className="step-card bg-[#0D1A2D] border border-[#1C2E48] rounded-xl p-8 relative overflow-hidden transition-all hover:border-[#00E676]/30 hover:-translate-y-1">
              <div className="step-bg-num font-display text-8xl text-white/5 absolute top-2 right-4 select-none pointer-events-none">02</div>
              <div className="step-icon text-4xl mb-4">⚽</div>
              <h3 className="step-title text-lg font-bold text-white mb-2">Ingresa tus pronósticos</h3>
              <p className="step-desc text-sm text-[#5E7A9E] leading-relaxed">Antes del inicio de cada encuentro, escribe tu marcador pronosticado. Los partidos se bloquean automáticamente al pitazo inicial.</p>
            </div>
            <div className="step-card bg-[#0D1A2D] border border-[#1C2E48] rounded-xl p-8 relative overflow-hidden transition-all hover:border-[#00E676]/30 hover:-translate-y-1">
              <div className="step-bg-num font-display text-8xl text-white/5 absolute top-2 right-4 select-none pointer-events-none">03</div>
              <div className="step-icon text-4xl mb-4">🏆</div>
              <h3 className="step-title text-lg font-bold text-white mb-2">Suma puntos y compite</h3>
              <p className="step-desc text-sm text-[#5E7A9E] leading-relaxed">Los puntos se calculan automáticamente al terminar cada partido. ¡Sube puestos en el ranking general en tiempo real!</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider h-[1px] bg-[#1C2E48] mx-4 sm:mx-12"></div>

      {/* Scoring Section */}
      <section className="section py-16 px-6 sm:px-12 max-w-6xl mx-auto" id="puntuacion">
        <div className="container">
          <p className="eyebrow text-xs uppercase tracking-widest text-[#00E676] font-bold mb-2">Sistema de puntos</p>
          <h2 className="section-h font-display text-4xl sm:text-6xl text-[#E8F0FF] leading-none mb-6">ASÍ SE SUMA</h2>
          
          <div className="scoring-wrap bg-[#0D1A2D] border border-[#1C2E48] rounded-2xl overflow-hidden">
            <div className="scoring-top p-6 border-b border-[#1C2E48] flex justify-between items-center flex-wrap gap-4">
              <p className="scoring-note text-sm text-[#5E7A9E]">Los puntos se asignan automáticamente tras confirmar el resultado oficial.</p>
              <span className="text-xs text-[#5E7A9E] font-medium font-mono bg-white/5 px-3 py-1 rounded">Aplica en todo el Torneo</span>
            </div>
            <div className="scoring-grid grid grid-cols-1 md:grid-cols-3">
              <div className="tier featured bg-[#00E676]/5 p-8 text-center relative border-b md:border-b-0 md:border-r border-[#1C2E48]">
                <div className="tier-featured-bar absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00E676] to-[#00BF63]"></div>
                <div className="tier-label text-xs uppercase text-[#5E7A9E] font-bold tracking-wider mb-3">🎯 Resultado Exacto</div>
                <div className="tier-pts font-display text-6xl text-[#00E676] leading-none font-bold">3</div>
                <div className="tier-pts-unit text-xs uppercase text-[#00E676] tracking-widest font-bold mt-1">Puntos</div>
                <p className="tier-desc text-xs text-[#5E7A9E] leading-relaxed mt-4">Acertaste el marcador exacto de goles del partido.</p>
                <div className="tier-eg inline-block bg-[#152338] border border-[#1C2E48] rounded px-3 py-1.5 text-xs text-[#C5D2EE] font-mono mt-4">ARG 2-1 FRA → pronóstico 2-1 ✓</div>
              </div>
              <div className="tier p-8 text-center border-b md:border-b-0 md:border-r border-[#1C2E48]">
                <div className="tier-label text-xs uppercase text-[#5E7A9E] font-bold tracking-wider mb-3">📊 Ganador + Diferencia</div>
                <div className="tier-pts font-display text-6xl text-[#FFD700] leading-none font-bold">2</div>
                <div className="tier-pts-unit text-xs uppercase text-[#FFD700] tracking-widest font-bold mt-1">Puntos</div>
                <p className="tier-desc text-xs text-[#5E7A9E] leading-relaxed mt-4">Acertaste el ganador y la diferencia de goles exacta.</p>
                <div className="tier-eg inline-block bg-[#152338] border border-[#1C2E48] rounded px-3 py-1.5 text-xs text-[#C5D2EE] font-mono mt-4">ARG 2-1 FRA → pronóstico 3-2 ✓</div>
              </div>
              <div className="tier p-8 text-center">
                <div className="tier-label text-xs uppercase text-[#5E7A9E] font-bold tracking-wider mb-3">✅ Solo el Ganador</div>
                <div className="tier-pts font-display text-6xl text-[#5B8DEF] leading-none font-bold">1</div>
                <div className="tier-pts-unit text-xs uppercase text-[#5B8DEF] tracking-widest font-bold mt-1">Punto</div>
                <p className="tier-desc text-xs text-[#5E7A9E] leading-relaxed mt-4">Solo acertaste cuál equipo gana el partido (o el empate).</p>
                <div className="tier-eg inline-block bg-[#152338] border border-[#1C2E48] rounded px-3 py-1.5 text-xs text-[#C5D2EE] font-mono mt-4">ARG 2-1 FRA → pronóstico 1-0 ✓</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider h-[1px] bg-[#1C2E48] mx-4 sm:mx-12"></div>

      {/* Interactive Demo Section */}
      <section className="section py-16 px-6 sm:px-12 max-w-6xl mx-auto" id="ranking">
        <div className="container">
          <p className="eyebrow text-xs uppercase tracking-widest text-[#00E676] font-bold mb-2">Demo interactivo</p>
          <h2 className="section-h font-display text-4xl sm:text-6xl text-[#E8F0FF] leading-none mb-2">PRONÓSTICA ASÍ</h2>
          <p className="section-p text-[#5E7A9E] text-base max-w-lg mb-10">Prueba ingresando un marcador en la demo. Así funciona el dashboard real.</p>
          
          <div className="preview-grid grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Match Cards Demo column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Match 1 */}
              <div className={`match-card bg-[#0D1A2D] border rounded-xl p-5 relative overflow-hidden transition-all duration-300 ${demoPredictions.demo1.saved ? "border-[#00E676]/35" : "border-[#1C2E48]"}`}>
                <div className="match-top flex justify-between items-center mb-4">
                  <span className="match-group text-[10px] font-bold text-[#5E7A9E] tracking-wider uppercase">Grupo A · MetLife Stadium</span>
                  <span className={`match-timer text-[10px] font-bold px-3 py-1 rounded-full ${demoPredictions.demo1.saved ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20" : "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse"}`}>
                    {demoPredictions.demo1.saved ? "✓ Pronóstico guardado" : "🔥 Cierra en 1h 23m"}
                  </span>
                </div>
                <div className="match-body grid grid-cols-3 items-center gap-4">
                  <div className="team flex items-center gap-3">
                    <Flag code="AR" size={40} />
                    <div>
                      <div className="team-name text-sm font-bold text-white">Argentina</div>
                      <div className="team-code text-[10px] text-[#5E7A9E] font-bold uppercase">ARG</div>
                    </div>
                  </div>
                  <div className="score-row flex items-center justify-center gap-2">
                    <input
                      type="number"
                      min="0"
                      disabled={demoPredictions.demo1.saved}
                      value={demoPredictions.demo1.homeScore}
                      onChange={(e) => handleDemoInputChange("demo1", "homeScore", e.target.value)}
                      className="score-in w-14 h-14 bg-[#152338] border-2 border-[#253B5E] text-center font-bold text-xl rounded-lg text-white outline-none focus:border-[#00E676] transition-colors disabled:opacity-40"
                    />
                    <span className="vs text-[#5E7A9E] font-bold">:</span>
                    <input
                      type="number"
                      min="0"
                      disabled={demoPredictions.demo1.saved}
                      value={demoPredictions.demo1.awayScore}
                      onChange={(e) => handleDemoInputChange("demo1", "awayScore", e.target.value)}
                      className="score-in w-14 h-14 bg-[#152338] border-2 border-[#253B5E] text-center font-bold text-xl rounded-lg text-white outline-none focus:border-[#00E676] transition-colors disabled:opacity-40"
                    />
                  </div>
                  <div className="team away flex flex-row-reverse items-center gap-3 text-right">
                    <Flag code="SA" size={40} />
                    <div>
                      <div className="team-name text-sm font-bold text-white">Arabia Saudita</div>
                      <div className="team-code text-[10px] text-[#5E7A9E] font-bold uppercase">KSA</div>
                    </div>
                  </div>
                </div>
                <div className="match-foot flex justify-between items-center border-t border-white/5 mt-4 pt-4">
                  <span className={`match-status text-xs font-semibold ${demoPredictions.demo1.saved ? "text-[#00E676]" : "text-[#5E7A9E]"}`}>
                    {demoPredictions.demo1.saved ? `Guardado · ${demoPredictions.demo1.homeScore} – ${demoPredictions.demo1.awayScore}` : "Sin guardar"}
                  </span>
                  <button
                    onClick={() => handleDemoSave("demo1")}
                    disabled={demoPredictions.demo1.saved}
                    className={`btn px-5 py-2 font-bold text-xs rounded transition-all ${demoPredictions.demo1.saved ? "bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] cursor-default" : "bg-[#00E676] text-black hover:bg-[#00BF63] cursor-pointer"}`}
                  >
                    {demoPredictions.demo1.saved ? "✓ Guardado" : "Guardar Pronóstico"}
                  </button>
                </div>
              </div>

              {/* Match 2 */}
              <div className={`match-card bg-[#0D1A2D] border rounded-xl p-5 relative overflow-hidden transition-all duration-300 ${demoPredictions.demo2.saved ? "border-[#00E676]/35" : "border-[#1C2E48]"}`}>
                <div className="match-top flex justify-between items-center mb-4">
                  <span className="match-group text-[10px] font-bold text-[#5E7A9E] tracking-wider uppercase">Grupo B · SoFi Stadium</span>
                  <span className={`match-timer text-[10px] font-bold px-3 py-1 rounded-full ${demoPredictions.demo2.saved ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`}>
                    {demoPredictions.demo2.saved ? "✓ Pronóstico guardado" : "⚠️ Cierra en 3h 40m"}
                  </span>
                </div>
                <div className="match-body grid grid-cols-3 items-center gap-4">
                  <div className="team flex items-center gap-3">
                    <Flag code="FR" size={40} />
                    <div>
                      <div className="team-name text-sm font-bold text-white">Francia</div>
                      <div className="team-code text-[10px] text-[#5E7A9E] font-bold uppercase">FRA</div>
                    </div>
                  </div>
                  <div className="score-row flex items-center justify-center gap-2">
                    <input
                      type="number"
                      min="0"
                      disabled={demoPredictions.demo2.saved}
                      value={demoPredictions.demo2.homeScore}
                      onChange={(e) => handleDemoInputChange("demo2", "homeScore", e.target.value)}
                      placeholder="-"
                      className="score-in w-14 h-14 bg-[#152338] border-2 border-[#253B5E] text-center font-bold text-xl rounded-lg text-white outline-none focus:border-[#00E676] transition-colors disabled:opacity-40"
                    />
                    <span className="vs text-[#5E7A9E] font-bold">:</span>
                    <input
                      type="number"
                      min="0"
                      disabled={demoPredictions.demo2.saved}
                      value={demoPredictions.demo2.awayScore}
                      onChange={(e) => handleDemoInputChange("demo2", "awayScore", e.target.value)}
                      placeholder="-"
                      className="score-in w-14 h-14 bg-[#152338] border-2 border-[#253B5E] text-center font-bold text-xl rounded-lg text-white outline-none focus:border-[#00E676] transition-colors disabled:opacity-40"
                    />
                  </div>
                  <div className="team away flex flex-row-reverse items-center gap-3 text-right">
                    <Flag code="MA" size={40} />
                    <div>
                      <div className="team-name text-sm font-bold text-white">Marruecos</div>
                      <div className="team-code text-[10px] text-[#5E7A9E] font-bold uppercase">MAR</div>
                    </div>
                  </div>
                </div>
                <div className="match-foot flex justify-between items-center border-t border-white/5 mt-4 pt-4">
                  <span className={`match-status text-xs font-semibold ${demoPredictions.demo2.saved ? "text-[#00E676]" : "text-[#5E7A9E]"}`}>
                    {demoPredictions.demo2.saved ? `Guardado · ${demoPredictions.demo2.homeScore} – ${demoPredictions.demo2.awayScore}` : "Sin guardar"}
                  </span>
                  <button
                    onClick={() => handleDemoSave("demo2")}
                    disabled={demoPredictions.demo2.saved}
                    className={`btn px-5 py-2 font-bold text-xs rounded transition-all ${demoPredictions.demo2.saved ? "bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] cursor-default" : "bg-[#00E676] text-black hover:bg-[#00BF63] cursor-pointer"}`}
                  >
                    {demoPredictions.demo2.saved ? "✓ Guardado" : "Guardar Pronóstico"}
                  </button>
                </div>
              </div>

              {/* Match 3 */}
              <div className={`match-card bg-[#0D1A2D] border rounded-xl p-5 relative overflow-hidden transition-all duration-300 ${demoPredictions.demo3.saved ? "border-[#00E676]/35" : "border-[#1C2E48]"}`}>
                <div className="match-top flex justify-between items-center mb-4">
                  <span className="match-group text-[10px] font-bold text-[#5E7A9E] tracking-wider uppercase">Grupo C · Estadio Azteca</span>
                  <span className={`match-timer text-[10px] font-bold px-3 py-1 rounded-full ${demoPredictions.demo3.saved ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20" : "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20"}`}>
                    {demoPredictions.demo3.saved ? "✓ Pronóstico guardado" : "⏱ Cierra en 7h 10m"}
                  </span>
                </div>
                <div className="match-body grid grid-cols-3 items-center gap-4">
                  <div className="team flex items-center gap-3">
                    <Flag code="BR" size={40} />
                    <div>
                      <div className="team-name text-sm font-bold text-white">Brasil</div>
                      <div className="team-code text-[10px] text-[#5E7A9E] font-bold uppercase">BRA</div>
                    </div>
                  </div>
                  <div className="score-row flex items-center justify-center gap-2">
                    <input
                      type="number"
                      min="0"
                      disabled={demoPredictions.demo3.saved}
                      value={demoPredictions.demo3.homeScore}
                      onChange={(e) => handleDemoInputChange("demo3", "homeScore", e.target.value)}
                      placeholder="-"
                      className="score-in w-14 h-14 bg-[#152338] border-2 border-[#253B5E] text-center font-bold text-xl rounded-lg text-white outline-none focus:border-[#00E676] transition-colors disabled:opacity-40"
                    />
                    <span className="vs text-[#5E7A9E] font-bold">:</span>
                    <input
                      type="number"
                      min="0"
                      disabled={demoPredictions.demo3.saved}
                      value={demoPredictions.demo3.awayScore}
                      onChange={(e) => handleDemoInputChange("demo3", "awayScore", e.target.value)}
                      placeholder="-"
                      className="score-in w-14 h-14 bg-[#152338] border-2 border-[#253B5E] text-center font-bold text-xl rounded-lg text-white outline-none focus:border-[#00E676] transition-colors disabled:opacity-40"
                    />
                  </div>
                  <div className="team away flex flex-row-reverse items-center gap-3 text-right">
                    <Flag code="RS" size={40} />
                    <div>
                      <div className="team-name text-sm font-bold text-white">Serbia</div>
                      <div className="team-code text-[10px] text-[#5E7A9E] font-bold uppercase">SRB</div>
                    </div>
                  </div>
                </div>
                <div className="match-foot flex justify-between items-center border-t border-white/5 mt-4 pt-4">
                  <span className={`match-status text-xs font-semibold ${demoPredictions.demo3.saved ? "text-[#00E676]" : "text-[#5E7A9E]"}`}>
                    {demoPredictions.demo3.saved ? `Guardado · ${demoPredictions.demo3.homeScore} – ${demoPredictions.demo3.awayScore}` : "Sin guardar"}
                  </span>
                  <button
                    onClick={() => handleDemoSave("demo3")}
                    disabled={demoPredictions.demo3.saved}
                    className={`btn px-5 py-2 font-bold text-xs rounded transition-all ${demoPredictions.demo3.saved ? "bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] cursor-default" : "bg-[#00E676] text-black hover:bg-[#00BF63] cursor-pointer"}`}
                  >
                    {demoPredictions.demo3.saved ? "✓ Guardado" : "Guardar Pronóstico"}
                  </button>
                </div>
              </div>
            </div>

            {/* Mock Leaderboard column */}
            <div className="lg:col-span-4">
              <div className="lb-card bg-[#0D1A2D] border border-[#1C2E48] rounded-xl overflow-hidden">
                <div className="lb-head p-4 border-b border-[#1C2E48] flex justify-between items-center">
                  <span className="lb-title font-bold text-sm text-white">🏆 Tabla General</span>
                  <span className="live-pip flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase">
                    <span className="pip w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block"></span>EN VIVO
                  </span>
                </div>

                {demoLeaderboard.map((item) => (
                  <div key={item.alias} className={`lb-row flex items-center gap-3 p-3 border-t border-[#1C2E48] transition-colors ${item.alias === "@TúEstásAquí" ? "bg-[#00E676]/5 font-semibold" : ""}`}>
                    <div className={`rank-num w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                      item.rank === 1 ? "bg-[#FFD700]/15 text-[#FFD700]" : 
                      item.rank === 2 ? "bg-zinc-400/15 text-zinc-300" : 
                      item.rank === 3 ? "bg-amber-600/15 text-amber-500" : "bg-[#152338] text-[#5E7A9E]"
                    }`}>
                      {item.rank}
                    </div>
                    <div className="avt w-8 h-8 rounded-full bg-[#152338] text-base flex items-center justify-center shrink-0">{item.avt}</div>
                    <div className="lb-user flex-1 min-w-0">
                      <div className="lb-alias text-xs font-bold text-white truncate">{item.alias}</div>
                      <div className="lb-loc flex items-center gap-1 text-[10px] text-[#5E7A9E] truncate">
                        <Flag code={item.countryCode} size={12} />
                        {item.loc}
                      </div>
                    </div>
                    <div className={`pos-delta text-[10px] font-bold shrink-0 ${item.delta === "dup" ? "text-[#00E676]" : item.delta === "ddn" ? "text-red-500" : "text-[#5E7A9E]"}`}>
                      {item.deltaText}
                    </div>
                    <div className="lb-pts text-right shrink-0">
                      <div className={`lb-pts-val font-display text-xl leading-none ${item.alias === "@TúEstásAquí" ? "text-[#00E676]" : "text-white"}`}>{item.points}</div>
                      <div className="lb-pts-lbl text-[9px] text-[#5E7A9E] uppercase tracking-wider mt-0.5">pts</div>
                    </div>
                  </div>
                ))}

                <div className="lb-foot p-4 border-t border-[#1C2E48]">
                  <Link href="/auth" className="btn btn-primary w-full text-center text-xs py-2.5 font-bold">Ver Ranking Completo →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider h-[1px] bg-[#1C2E48] mx-4 sm:mx-12"></div>

      {/* Yappy payment guide Section */}
      <section className="section py-16 px-6 sm:px-12 max-w-6xl mx-auto" id="inscripcion">
        <div className="container">
          <p className="eyebrow text-xs uppercase tracking-widest text-[#00E676] font-bold mb-2">Inscripción</p>
          <h2 className="section-h font-display text-4xl sm:text-6xl text-[#E8F0FF] leading-none mb-6">CÓMO INSCRIBIRTE</h2>
          
          <div className="payment-card bg-[#0D1A2D] border border-[#1C2E48] rounded-2xl overflow-hidden">
            <div className="payment-grid grid grid-cols-1 md:grid-cols-2">
              {/* Left col */}
              <div className="pay-left p-8 sm:p-12">
                <div className="yappy-pill inline-flex items-center gap-1.5 bg-[#00AB5D]/10 border border-[#00AB5D]/30 text-[#00AB5D] px-3.5 py-1 rounded text-xs font-black mb-5">
                  💚 YAPPY
                </div>
                <h3 className="text-xl font-display text-white tracking-wide uppercase">Cuota de Inscripción</h3>
                <div className="pay-amount font-display text-6xl sm:text-8xl text-white font-bold leading-none my-3">
                  <span className="pay-curr font-display text-2xl sm:text-4xl text-[#5E7A9E] align-top mt-2 inline-block">B/.</span>10
                </div>
                <p className="pay-subtitle text-xs text-[#5E7A9E] mb-6">Pago único para participar en todo el torneo de la Copa Mundial 2026.</p>
                
                <div className="space-y-3">
                  <div className="pay-feat flex gap-2"><span className="pay-feat-icon text-[#00E676] text-sm shrink-0">✓</span><span className="pay-feat-text text-sm text-[#C5D2EE]">Acceso a los 104 partidos del torneo</span></div>
                  <div className="pay-feat flex gap-2"><span className="pay-feat-icon text-[#00E676] text-sm shrink-0">✓</span><span className="pay-feat-text text-sm text-[#C5D2EE]">Ranking en tiempo real con todos los participantes</span></div>
                  <div className="pay-feat flex gap-2"><span className="pay-feat-icon text-[#00E676] text-sm shrink-0">✓</span><span className="pay-feat-text text-sm text-[#C5D2EE]">Creación de ligas privadas para competir con amigos</span></div>
                  <div className="pay-feat flex gap-2"><span className="pay-feat-icon text-[#00E676] text-sm shrink-0">✓</span><span className="pay-feat-text text-sm text-[#C5D2EE]">Premio al ganador del torneo al final del Mundial</span></div>
                </div>
              </div>

              {/* Right col */}
              <div className="pay-right p-8 sm:p-12 border-t md:border-t-0 md:border-l border-[#1C2E48]">
                <h4 className="text-xs uppercase text-[#5E7A9E] font-bold tracking-wider mb-5">Pasos para registrarte</h4>
                
                <div className="space-y-4">
                  <div className="pay-step flex gap-3">
                    <div className="pay-step-n w-6 h-6 rounded-full bg-[#1B2D47] border border-[#253B5E] text-[#C5D2EE] font-bold text-xs flex items-center justify-center shrink-0">1</div>
                    <div className="pay-step-text text-sm text-[#C5D2EE]">Envía B/.10 por <strong>Yappy</strong> al número abajo. Escribe tu alias en el mensaje.</div>
                  </div>
                  <div className="pay-step flex gap-3">
                    <div className="pay-step-n w-6 h-6 rounded-full bg-[#1B2D47] border border-[#253B5E] text-[#C5D2EE] font-bold text-xs flex items-center justify-center shrink-0">2</div>
                    <div className="pay-step-text text-sm text-[#C5D2EE]">Crea tu cuenta e inicia sesión.</div>
                  </div>
                  <div className="pay-step flex gap-3">
                    <div className="pay-step-n w-6 h-6 rounded-full bg-[#1B2D47] border border-[#253B5E] text-[#C5D2EE] font-bold text-xs flex items-center justify-center shrink-0">3</div>
                    <div className="pay-step-text text-sm text-[#C5D2EE]">Adjunta la captura del pago desde tu cuenta y espera la confirmación en menos de 24 horas.</div>
                  </div>
                </div>

                <div className="yappy-box bg-[#152338] border border-[#253B5E] rounded-xl p-5 my-6">
                  <div className="yappy-box-lbl text-[10px] uppercase text-[#5E7A9E] tracking-wider mb-2">Número Yappy del organizador</div>
                  <div className="yappy-num font-display text-4xl text-white font-bold tracking-wide">+507 6214-9386</div>
                  <div className="yappy-name text-xs text-[#5E7A9E] mt-1">Nombre: Polla Mundialista</div>
                </div>

                <h4 className="text-xs uppercase text-[#5E7A9E] font-bold tracking-wider mb-3">Adjunta tu comprobante</h4>
                <div
                  onClick={() => router.push("/auth")}
                  className="upload-area border-2 border-dashed border-[#253B5E] rounded-xl p-6 text-center cursor-pointer hover:border-[#00E676] hover:bg-[#00E676]/5 transition-all"
                >
                  <div className="upload-icon text-3xl mb-2">📎</div>
                  <div className="upload-title text-sm font-semibold text-white">Regístrate para subir tu comprobante</div>
                  <div className="upload-hint text-xs text-[#5E7A9E] mt-0.5">Debes estar logueado para subir archivos.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section py-16 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="container">
          <div className="cta-banner bg-gradient-to-br from-[#00E676]/10 to-[#5B8DEF]/5 border border-[#00E676]/15 rounded-2xl p-8 sm:p-16 text-center">
            <h2 className="section-h font-display text-4xl sm:text-6xl text-[#E8F0FF] mb-3">¿LISTO PARA COMPETIR?</h2>
            <p className="section-p text-[#5E7A9E] text-sm sm:text-base max-w-md mx-auto mb-8">
              Las predicciones cierran automáticamente al iniciar cada partido. Registra tu cuenta y no dejes pasar tu chance de ganar.
            </p>
            <Link href="/auth" className="btn btn-primary btn-lg">Registrarme Ahora →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer bg-[#0D1A2D] border-t border-[#1C2E48] py-8 px-6 sm:px-12">
        <div className="footer-inner max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚽</span>
              <span className="font-display text-xl tracking-wider text-white">Polla <em className="text-[#00E5FF] not-italic">Mundialista</em></span>
            </div>
            <p className="footer-copy text-xs text-[#5E7A9E]">© 2026 Polla Mundialista — Quiniela del Mundial. No afiliado a FIFA.</p>
          </div>
          <ul className="footer-links flex gap-6 list-none text-xs">
            <li><Link href="/faq" className="text-[#5E7A9E] hover:text-white transition-colors">Reglamento / FAQ</Link></li>
            <li><a href="#" className="text-[#5E7A9E] hover:text-white transition-colors">Privacidad</a></li>
            <li><Link href="/auth" className="text-[#5E7A9E] hover:text-white transition-colors">Iniciar Sesión</Link></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
