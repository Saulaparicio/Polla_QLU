<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prode 2026 — Calendario</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg:#07101D; --surface:#0D1A2D; --surface2:#152338; --surface3:#1B2D47;
      --fg:#E8F0FF; --fg-dim:#C5D2EE; --muted:#5E7A9E;
      --border:#1C2E48; --border2:#253B5E;
      --green:#00E676; --green-d:#00A853;
      --gold:#FFD700; --red:#FF5252; --amber:#FFB300; --blue:#5B8DEF;
      --header-h:64px; --phase-h:46px;
      --font-d:'Bebas Neue',Impact,sans-serif;
      --font-b:'Inter',-apple-system,system-ui,sans-serif;
      --r-s:6px; --r-m:12px; --r-l:16px;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{background:var(--bg);color:var(--fg);font-family:var(--font-b);min-height:100vh;overflow-x:hidden;padding-top:var(--header-h);}
    ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:var(--bg);} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px;}

    /* HEADER */
    .app-header{
      position:fixed;top:0;left:0;right:0;height:var(--header-h);z-index:200;
      background:rgba(7,16,29,.96);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
      border-bottom:1px solid var(--border);
      display:flex;align-items:center;padding:0 clamp(12px,3vw,28px);gap:14px;
    }
    .h-logo{display:flex;align-items:center;gap:7px;text-decoration:none;flex-shrink:0;}
    .h-logo-icon{font-size:1.2rem;}
    .h-logo-text{font-family:var(--font-d);font-size:1.35rem;color:var(--fg);letter-spacing:.04em;}
    .h-logo-text em{font-style:normal;color:var(--green);}
    .h-div{width:1px;height:26px;background:var(--border);}
    .h-title{font-family:var(--font-d);font-size:1.55rem;letter-spacing:.06em;color:var(--fg);}
    .h-back{color:var(--muted);font-size:.8rem;text-decoration:none;transition:color .2s;margin-left:auto;}
    .h-back:hover{color:var(--fg);}
    .h-pill{display:flex;align-items:center;gap:5px;background:rgba(0,230,118,.08);border:1px solid rgba(0,230,118,.2);padding:4px 10px;border-radius:var(--r-s);font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--green);white-space:nowrap;}

    /* PHASE BAR */
    .phase-bar{
      position:sticky;top:var(--header-h);z-index:100;
      background:rgba(7,16,29,.98);backdrop-filter:blur(12px);
      border-bottom:1px solid var(--border);
      display:flex;align-items:center;overflow-x:auto;scrollbar-width:none;
      padding:0 clamp(12px,3vw,28px);
    }
    .phase-bar::-webkit-scrollbar{display:none;}
    .phase-tab{
      flex-shrink:0;padding:13px 15px;border:none;background:transparent;
      color:var(--muted);font-family:var(--font-b);font-size:.8rem;font-weight:600;
      cursor:pointer;text-transform:uppercase;letter-spacing:.06em;
      border-bottom:2px solid transparent;transition:all .18s;white-space:nowrap;
    }
    .phase-tab:hover{color:var(--fg);}
    .phase-tab.active{color:var(--green);border-bottom-color:var(--green);}
    .phase-count{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;background:var(--surface2);color:var(--muted);border-radius:50%;font-size:.6rem;margin-left:4px;}
    .phase-tab.active .phase-count{background:rgba(0,230,118,.15);color:var(--green);}

    /* MAIN */
    .main{padding:28px clamp(12px,3vw,28px) 80px;max-width:1280px;margin:0 auto;}

    /* STATS BAR */
    .stats-bar{display:flex;flex-wrap:wrap;gap:0;margin-bottom:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-l);overflow:hidden;}
    .stat-item{display:flex;flex-direction:column;gap:2px;padding:14px 20px;border-right:1px solid var(--border);}
    .stat-item:last-child{border-right:none;}
    .stat-val{font-family:var(--font-d);font-size:1.8rem;line-height:1;}
    .stat-val.g{color:var(--green);} .stat-val.go{color:var(--gold);} .stat-val.b{color:var(--blue);}
    .stat-lbl{font-size:.65rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);}

    /* GROUP FILTER */
    .group-filter{display:flex;gap:7px;margin-bottom:20px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;}
    .group-filter::-webkit-scrollbar{display:none;}
    .gf-chip{flex-shrink:0;padding:6px 13px;border-radius:20px;border:1px solid var(--border2);background:transparent;color:var(--muted);font-size:.78rem;font-weight:600;cursor:pointer;transition:all .18s;}
    .gf-chip:hover{color:var(--fg);background:var(--surface2);}
    .gf-chip.active{background:var(--green);color:#000;border-color:var(--green);}

    /* DATE DIVIDER */
    .date-divider{display:flex;align-items:center;gap:10px;margin:24px 0 12px;}
    .date-divider:first-of-type{margin-top:0;}
    .date-label{font-family:var(--font-d);font-size:.95rem;letter-spacing:.1em;color:var(--muted);text-transform:uppercase;white-space:nowrap;}
    .date-line{flex:1;height:1px;background:var(--border);}
    .sim-badge{padding:2px 8px;border-radius:3px;font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:rgba(255,183,0,.1);color:var(--amber);border:1px solid rgba(255,183,0,.2);}
    .count-badge{font-size:.68rem;color:var(--muted);}

    /* MATCH GRID */
    .match-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px;}

    /* MATCH CARD */
    .match-card{
      background:var(--surface);border:1px solid var(--border);border-radius:var(--r-l);
      padding:14px 15px;transition:all .18s;cursor:pointer;
    }
    .match-card:hover{border-color:var(--border2);background:var(--surface2);transform:translateY(-2px);}
    .match-card.sim{border-left:3px solid var(--amber);}
    .match-card.final-match{border-color:var(--gold);background:rgba(255,215,0,.04);}

    .mc-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:11px;}
    .mc-date{font-size:.68rem;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);}
    .mc-badge{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 7px;border-radius:3px;}
    .gb-A{background:rgba(91,141,239,.12);color:#7AABFF;}
    .gb-B{background:rgba(0,230,118,.1);color:var(--green);}
    .gb-C{background:rgba(255,215,0,.1);color:var(--gold);}
    .gb-D{background:rgba(255,82,82,.1);color:var(--red);}
    .gb-E{background:rgba(255,183,0,.1);color:var(--amber);}
    .gb-F{background:rgba(180,100,240,.12);color:#C084FC;}
    .gb-G{background:rgba(34,211,238,.1);color:#22D3EE;}
    .gb-H{background:rgba(251,146,60,.1);color:#FB923C;}
    .gb-I{background:rgba(52,211,153,.1);color:#34D399;}
    .gb-J{background:rgba(248,113,113,.1);color:#F87171;}
    .gb-K{background:rgba(139,92,246,.12);color:#A78BFA;}
    .gb-L{background:rgba(236,72,153,.1);color:#F472B6;}
    .gb-ko{background:rgba(255,215,0,.1);color:var(--gold);}
    .gb-final{background:rgba(255,215,0,.18);color:var(--gold);border:1px solid rgba(255,215,0,.3);}

    .mc-teams{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:11px;}
    .mc-team{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;}
    .mc-flag{font-size:1.9rem;line-height:1;}
    .mc-name{font-size:.72rem;font-weight:600;text-align:center;color:var(--fg-dim);line-height:1.3;}
    .mc-vs{font-family:var(--font-d);font-size:1rem;color:var(--muted);flex-shrink:0;}

    .mc-foot{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
    .mc-venue{font-size:.67rem;color:var(--muted);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .mc-status{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 7px;border-radius:3px;white-space:nowrap;}
    .st-upcoming{background:rgba(91,141,239,.1);color:var(--blue);}
    .st-sim{background:rgba(255,183,0,.1);color:var(--amber);}
    .st-tbd{background:rgba(94,122,158,.1);color:var(--muted);}

    /* BRACKET (knockout) */
    .phase-section{margin-bottom:36px;}
    .phase-section-title{font-family:var(--font-d);font-size:1.9rem;letter-spacing:.06em;margin-bottom:14px;color:var(--fg);}
    .phase-section-title span{color:var(--gold);}
    .bracket-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:10px;}

    .bk-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-m);padding:13px 15px;transition:all .18s;}
    .bk-card:hover{border-color:var(--border2);}
    .bk-card.bk-final{border-color:var(--gold);background:rgba(255,215,0,.04);}
    .bk-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;}
    .bk-label{font-family:var(--font-d);font-size:.95rem;letter-spacing:.06em;color:var(--fg);}
    .bk-date{font-size:.67rem;color:var(--muted);}
    .bk-teams{display:flex;flex-direction:column;gap:5px;}
    .bk-team{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:var(--r-s);background:var(--surface2);}
    .bk-flag{font-size:1.2rem;}
    .bk-tname{font-size:.78rem;font-weight:600;flex:1;color:var(--fg-dim);}
    .bk-score{font-family:var(--font-d);font-size:1rem;color:var(--muted);}
    .bk-sep{text-align:center;font-size:.62rem;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;padding:2px 0;}
    .bk-venue{font-size:.66rem;color:var(--muted);margin-top:8px;}

    /* ANIMATIONS */
    @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .match-card,.bk-card{animation:fadeIn .18s ease both;}

    /* RESPONSIVE */
    @media(max-width:768px){.match-grid,.bracket-grid{grid-template-columns:1fr;}.stats-bar{flex-wrap:wrap;}.stat-item{border-right:none;border-bottom:1px solid var(--border);}.stat-item:last-child{border-bottom:none;}}
    @media(max-width:480px){.h-title{font-size:1.25rem;}.h-pill{display:none;}}
  </style>
</head>
<body>

<header class="app-header">
  <a class="h-logo" href="index.html">
    <span class="h-logo-icon">⚽</span>
    <span class="h-logo-text">PRODE<em>2026</em></span>
  </a>
  <div class="h-div"></div>
  <span class="h-title">CALENDARIO</span>
  <a class="h-back" href="dashboard.html">← Dashboard</a>
  <div class="h-pill">104 partidos</div>
</header>

<nav class="phase-bar" id="phaseBar">
  <button class="phase-tab active" onclick="setPhase('grupos',this)">Fase de Grupos <span class="phase-count">72</span></button>
  <button class="phase-tab" onclick="setPhase('r32',this)">Ronda de 32 <span class="phase-count">16</span></button>
  <button class="phase-tab" onclick="setPhase('r16',this)">Octavos <span class="phase-count">8</span></button>
  <button class="phase-tab" onclick="setPhase('qf',this)">Cuartos <span class="phase-count">4</span></button>
  <button class="phase-tab" onclick="setPhase('sf',this)">Semifinales <span class="phase-count">2</span></button>
  <button class="phase-tab" onclick="setPhase('final',this)">🏆 Final <span class="phase-count">1</span></button>
</nav>

<main class="main" id="mainContent"></main>

<script>
// ─── TEAMS ───────────────────────────────────────────────────────────────
const T = {
  'México':'🇲🇽','Argentina':'🇦🇷','Senegal':'🇸🇳','Iraq':'🇮🇶',
  'Estados Unidos':'🇺🇸','España':'🇪🇸','Nigeria':'🇳🇬','Jamaica':'🇯🇲',
  'Canadá':'🇨🇦','Brasil':'🇧🇷','Japón':'🇯🇵','Argelia':'🇩🇿',
  'Francia':'🇫🇷','Colombia':'🇨🇴','Marruecos':'🇲🇦','Australia':'🇦🇺',
  'Alemania':'🇩🇪','Uruguay':'🇺🇾','Corea del Sur':'🇰🇷','Ghana':'🇬🇭',
  'Portugal':'🇵🇹','Chile':'🇨🇱','Arabia Saudita':'🇸🇦','Costa Rica':'🇨🇷',
  'Inglaterra':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Países Bajos':'🇳🇱','Camerún':'🇨🇲','Panamá':'🇵🇦',
  'Italia':'🇮🇹','Ecuador':'🇪🇨','Polonia':'🇵🇱','Túnez':'🇹🇳',
  'Bélgica':'🇧🇪','Turquía':'🇹🇷','Egipto':'🇪🇬','Nueva Zelanda':'🇳🇿',
  'Croacia':'🇭🇷','Dinamarca':'🇩🇰','Costa de Marfil':'🇨🇮','Honduras':'🇭🇳',
  'Suiza':'🇨🇭','Serbia':'🇷🇸','Irán':'🇮🇷','Jordania':'🇯🇴',
  'Austria':'🇦🇹','Paraguay':'🇵🇾','Escocia':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','Uzbekistán':'🇺🇿'
};

// ─── VENUES ──────────────────────────────────────────────────────────────
const V = {
  AZT:'Estadio Azteca · CDMX',
  AKR:'Estadio AKRON · Guadalajara',
  UNI:'Est. Universitario · Monterrey',
  BCP:'BC Place · Vancouver',
  BMO:'BMO Field · Toronto',
  MET:'MetLife Stadium · New Jersey',
  ATT:'AT&T Stadium · Dallas',
  SOF:'SoFi Stadium · Los Ángeles',
  LEV:"Levi's Stadium · San José",
  HRS:'Hard Rock Stadium · Miami',
  EMP:'Empower Field · Denver',
  ARR:'Arrowhead Stadium · Kansas City',
  LIN:'Lincoln Financial Field · Filadelfia',
  LUM:'Lumen Field · Seattle',
  ALL:'Allegiant Stadium · Las Vegas',
};

// ─── GROUP STAGE (72 matches) ─────────────────────────────────────────────
const GS = [
  // GRUPO A — México, Argentina, Senegal, Iraq
  {id:1, g:'A',md:1,h:'México',         a:'Argentina',     date:'2026-06-11',time:'20:00',venue:V.AZT},
  {id:2, g:'A',md:1,h:'Senegal',        a:'Iraq',          date:'2026-06-11',time:'16:00',venue:V.ATT},
  {id:3, g:'A',md:2,h:'México',         a:'Senegal',       date:'2026-06-17',time:'20:00',venue:V.AKR},
  {id:4, g:'A',md:2,h:'Argentina',      a:'Iraq',          date:'2026-06-17',time:'16:00',venue:V.MET},
  {id:5, g:'A',md:3,h:'México',         a:'Iraq',          date:'2026-06-24',time:'18:00',venue:V.UNI,  sim:true},
  {id:6, g:'A',md:3,h:'Argentina',      a:'Senegal',       date:'2026-06-24',time:'18:00',venue:V.ATT,  sim:true},
  // GRUPO B — Estados Unidos, España, Nigeria, Jamaica
  {id:7, g:'B',md:1,h:'Estados Unidos', a:'España',        date:'2026-06-12',time:'20:00',venue:V.MET},
  {id:8, g:'B',md:1,h:'Nigeria',        a:'Jamaica',       date:'2026-06-12',time:'16:00',venue:V.HRS},
  {id:9, g:'B',md:2,h:'Estados Unidos', a:'Nigeria',       date:'2026-06-18',time:'20:00',venue:V.SOF},
  {id:10,g:'B',md:2,h:'España',         a:'Jamaica',       date:'2026-06-18',time:'16:00',venue:V.LEV},
  {id:11,g:'B',md:3,h:'Estados Unidos', a:'Jamaica',       date:'2026-06-25',time:'18:00',venue:V.MET,  sim:true},
  {id:12,g:'B',md:3,h:'España',         a:'Nigeria',       date:'2026-06-25',time:'18:00',venue:V.ATT,  sim:true},
  // GRUPO C — Canadá, Brasil, Japón, Argelia
  {id:13,g:'C',md:1,h:'Canadá',         a:'Brasil',        date:'2026-06-12',time:'13:00',venue:V.BCP},
  {id:14,g:'C',md:1,h:'Japón',          a:'Argelia',       date:'2026-06-12',time:'19:00',venue:V.BMO},
  {id:15,g:'C',md:2,h:'Canadá',         a:'Japón',         date:'2026-06-18',time:'13:00',venue:V.BCP},
  {id:16,g:'C',md:2,h:'Brasil',         a:'Argelia',       date:'2026-06-18',time:'19:00',venue:V.LUM},
  {id:17,g:'C',md:3,h:'Canadá',         a:'Argelia',       date:'2026-06-25',time:'18:00',venue:V.BMO,  sim:true},
  {id:18,g:'C',md:3,h:'Brasil',         a:'Japón',         date:'2026-06-25',time:'18:00',venue:V.MET,  sim:true},
  // GRUPO D — Francia, Colombia, Marruecos, Australia
  {id:19,g:'D',md:1,h:'Francia',        a:'Colombia',      date:'2026-06-13',time:'20:00',venue:V.HRS},
  {id:20,g:'D',md:1,h:'Marruecos',      a:'Australia',     date:'2026-06-13',time:'16:00',venue:V.LIN},
  {id:21,g:'D',md:2,h:'Francia',        a:'Marruecos',     date:'2026-06-19',time:'20:00',venue:V.MET},
  {id:22,g:'D',md:2,h:'Colombia',       a:'Australia',     date:'2026-06-19',time:'16:00',venue:V.SOF},
  {id:23,g:'D',md:3,h:'Francia',        a:'Australia',     date:'2026-06-26',time:'18:00',venue:V.ATT,  sim:true},
  {id:24,g:'D',md:3,h:'Colombia',       a:'Marruecos',     date:'2026-06-26',time:'18:00',venue:V.ARR,  sim:true},
  // GRUPO E — Alemania, Uruguay, Corea del Sur, Ghana
  {id:25,g:'E',md:1,h:'Alemania',       a:'Uruguay',       date:'2026-06-13',time:'13:00',venue:V.LEV},
  {id:26,g:'E',md:1,h:'Corea del Sur',  a:'Ghana',         date:'2026-06-13',time:'19:00',venue:V.EMP},
  {id:27,g:'E',md:2,h:'Alemania',       a:'Corea del Sur', date:'2026-06-20',time:'16:00',venue:V.ATT},
  {id:28,g:'E',md:2,h:'Uruguay',        a:'Ghana',         date:'2026-06-20',time:'20:00',venue:V.ALL},
  {id:29,g:'E',md:3,h:'Alemania',       a:'Ghana',         date:'2026-06-26',time:'22:00',venue:V.LUM,  sim:true},
  {id:30,g:'E',md:3,h:'Uruguay',        a:'Corea del Sur', date:'2026-06-26',time:'22:00',venue:V.EMP,  sim:true},
  // GRUPO F — Portugal, Chile, Arabia Saudita, Costa Rica
  {id:31,g:'F',md:1,h:'Portugal',       a:'Chile',         date:'2026-06-14',time:'16:00',venue:V.SOF},
  {id:32,g:'F',md:1,h:'Arabia Saudita', a:'Costa Rica',    date:'2026-06-14',time:'20:00',venue:V.ARR},
  {id:33,g:'F',md:2,h:'Portugal',       a:'Arabia Saudita',date:'2026-06-20',time:'13:00',venue:V.LEV},
  {id:34,g:'F',md:2,h:'Chile',          a:'Costa Rica',    date:'2026-06-21',time:'16:00',venue:V.MET},
  {id:35,g:'F',md:3,h:'Portugal',       a:'Costa Rica',    date:'2026-06-27',time:'18:00',venue:V.ATT,  sim:true},
  {id:36,g:'F',md:3,h:'Chile',          a:'Arabia Saudita',date:'2026-06-27',time:'18:00',venue:V.HRS,  sim:true},
  // GRUPO G — Inglaterra, Países Bajos, Camerún, Panamá
  {id:37,g:'G',md:1,h:'Inglaterra',     a:'Países Bajos',  date:'2026-06-14',time:'22:00',venue:V.MET},
  {id:38,g:'G',md:1,h:'Camerún',        a:'Panamá',        date:'2026-06-14',time:'13:00',venue:V.AZT},
  {id:39,g:'G',md:2,h:'Inglaterra',     a:'Camerún',       date:'2026-06-21',time:'20:00',venue:V.LIN},
  {id:40,g:'G',md:2,h:'Países Bajos',   a:'Panamá',        date:'2026-06-21',time:'13:00',venue:V.SOF},
  {id:41,g:'G',md:3,h:'Inglaterra',     a:'Panamá',        date:'2026-06-27',time:'22:00',venue:V.MET,  sim:true},
  {id:42,g:'G',md:3,h:'Países Bajos',   a:'Camerún',       date:'2026-06-27',time:'22:00',venue:V.ALL,  sim:true},
  // GRUPO H — Italia, Ecuador, Polonia, Túnez
  {id:43,g:'H',md:1,h:'Italia',         a:'Ecuador',       date:'2026-06-15',time:'16:00',venue:V.LEV},
  {id:44,g:'H',md:1,h:'Polonia',        a:'Túnez',         date:'2026-06-15',time:'20:00',venue:V.ARR},
  {id:45,g:'H',md:2,h:'Italia',         a:'Polonia',       date:'2026-06-22',time:'16:00',venue:V.MET},
  {id:46,g:'H',md:2,h:'Ecuador',        a:'Túnez',         date:'2026-06-22',time:'20:00',venue:V.EMP},
  {id:47,g:'H',md:3,h:'Italia',         a:'Túnez',         date:'2026-06-28',time:'18:00',venue:V.ATT,  sim:true},
  {id:48,g:'H',md:3,h:'Ecuador',        a:'Polonia',       date:'2026-06-28',time:'18:00',venue:V.LIN,  sim:true},
  // GRUPO I — Bélgica, Turquía, Egipto, Nueva Zelanda
  {id:49,g:'I',md:1,h:'Bélgica',        a:'Turquía',       date:'2026-06-15',time:'13:00',venue:V.HRS},
  {id:50,g:'I',md:1,h:'Egipto',         a:'Nueva Zelanda', date:'2026-06-16',time:'13:00',venue:V.LUM},
  {id:51,g:'I',md:2,h:'Bélgica',        a:'Egipto',        date:'2026-06-22',time:'13:00',venue:V.SOF},
  {id:52,g:'I',md:2,h:'Turquía',        a:'Nueva Zelanda', date:'2026-06-23',time:'16:00',venue:V.ALL},
  {id:53,g:'I',md:3,h:'Bélgica',        a:'Nueva Zelanda', date:'2026-06-28',time:'22:00',venue:V.MET,  sim:true},
  {id:54,g:'I',md:3,h:'Turquía',        a:'Egipto',        date:'2026-06-28',time:'22:00',venue:V.ARR,  sim:true},
  // GRUPO J — Croacia, Dinamarca, Costa de Marfil, Honduras
  {id:55,g:'J',md:1,h:'Croacia',        a:'Dinamarca',     date:'2026-06-16',time:'16:00',venue:V.SOF},
  {id:56,g:'J',md:1,h:'Costa de Marfil',a:'Honduras',      date:'2026-06-16',time:'20:00',venue:V.AKR},
  {id:57,g:'J',md:2,h:'Croacia',        a:'Costa de Marfil',date:'2026-06-23',time:'20:00',venue:V.LEV},
  {id:58,g:'J',md:2,h:'Dinamarca',      a:'Honduras',      date:'2026-06-23',time:'13:00',venue:V.HRS},
  {id:59,g:'J',md:3,h:'Croacia',        a:'Honduras',      date:'2026-06-29',time:'18:00',venue:V.ATT,  sim:true},
  {id:60,g:'J',md:3,h:'Dinamarca',      a:'Costa de Marfil',date:'2026-06-29',time:'18:00',venue:V.EMP, sim:true},
  // GRUPO K — Suiza, Serbia, Irán, Jordania
  {id:61,g:'K',md:1,h:'Suiza',          a:'Serbia',        date:'2026-06-16',time:'22:00',venue:V.EMP},
  {id:62,g:'K',md:1,h:'Irán',           a:'Jordania',      date:'2026-06-17',time:'13:00',venue:V.ALL},
  {id:63,g:'K',md:2,h:'Suiza',          a:'Irán',          date:'2026-06-23',time:'16:00',venue:V.ATT},
  {id:64,g:'K',md:2,h:'Serbia',         a:'Jordania',      date:'2026-06-24',time:'13:00',venue:V.LIN},
  {id:65,g:'K',md:3,h:'Suiza',          a:'Jordania',      date:'2026-06-29',time:'22:00',venue:V.MET,  sim:true},
  {id:66,g:'K',md:3,h:'Serbia',         a:'Irán',          date:'2026-06-29',time:'22:00',venue:V.SOF,  sim:true},
  // GRUPO L — Austria, Paraguay, Escocia, Uzbekistán
  {id:67,g:'L',md:1,h:'Austria',        a:'Paraguay',      date:'2026-06-17',time:'16:00',venue:V.LUM},
  {id:68,g:'L',md:1,h:'Escocia',        a:'Uzbekistán',    date:'2026-06-17',time:'20:00',venue:V.BMO},
  {id:69,g:'L',md:2,h:'Austria',        a:'Escocia',       date:'2026-06-24',time:'16:00',venue:V.HRS},
  {id:70,g:'L',md:2,h:'Paraguay',       a:'Uzbekistán',    date:'2026-06-24',time:'20:00',venue:V.BCP},
  {id:71,g:'L',md:3,h:'Austria',        a:'Uzbekistán',    date:'2026-06-30',time:'18:00',venue:V.LIN,  sim:true},
  {id:72,g:'L',md:3,h:'Paraguay',       a:'Escocia',       date:'2026-06-30',time:'18:00',venue:V.ARR,  sim:true},
];

// ─── KNOCKOUT (32 matches) ────────────────────────────────────────────────
const KO = [
  // RONDA DE 32
  {id:73, phase:'r32',label:'R32-1', h:'1ro Grupo A',    a:'3ro C/D/E',      date:'2026-07-02',time:'16:00',venue:V.MET},
  {id:74, phase:'r32',label:'R32-2', h:'1ro Grupo C',    a:'3ro A/B/F',      date:'2026-07-02',time:'20:00',venue:V.ATT},
  {id:75, phase:'r32',label:'R32-3', h:'2do Grupo A',    a:'2do Grupo C',    date:'2026-07-03',time:'13:00',venue:V.AZT},
  {id:76, phase:'r32',label:'R32-4', h:'1ro Grupo B',    a:'3ro G/H/I',      date:'2026-07-03',time:'16:00',venue:V.SOF},
  {id:77, phase:'r32',label:'R32-5', h:'1ro Grupo D',    a:'3ro J/K/L',      date:'2026-07-03',time:'20:00',venue:V.HRS},
  {id:78, phase:'r32',label:'R32-6', h:'2do Grupo B',    a:'2do Grupo D',    date:'2026-07-04',time:'13:00',venue:V.BCP},
  {id:79, phase:'r32',label:'R32-7', h:'1ro Grupo E',    a:'3ro A/B/C',      date:'2026-07-04',time:'16:00',venue:V.LEV},
  {id:80, phase:'r32',label:'R32-8', h:'1ro Grupo F',    a:'3ro D/E/F',      date:'2026-07-04',time:'20:00',venue:V.EMP},
  {id:81, phase:'r32',label:'R32-9', h:'2do Grupo E',    a:'2do Grupo G',    date:'2026-07-05',time:'13:00',venue:V.ARR},
  {id:82, phase:'r32',label:'R32-10',h:'2do Grupo F',    a:'2do Grupo H',    date:'2026-07-05',time:'16:00',venue:V.LIN},
  {id:83, phase:'r32',label:'R32-11',h:'1ro Grupo G',    a:'2do Grupo L',    date:'2026-07-05',time:'20:00',venue:V.MET},
  {id:84, phase:'r32',label:'R32-12',h:'1ro Grupo H',    a:'2do Grupo K',    date:'2026-07-06',time:'13:00',venue:V.ATT},
  {id:85, phase:'r32',label:'R32-13',h:'1ro Grupo I',    a:'1ro Grupo K',    date:'2026-07-06',time:'16:00',venue:V.SOF},
  {id:86, phase:'r32',label:'R32-14',h:'1ro Grupo J',    a:'1ro Grupo L',    date:'2026-07-06',time:'20:00',venue:V.AZT},
  {id:87, phase:'r32',label:'R32-15',h:'2do Grupo I',    a:'2do Grupo J',    date:'2026-07-07',time:'16:00',venue:V.ALL},
  {id:88, phase:'r32',label:'R32-16',h:'2do Grupo K/L',  a:'3ro mejor',      date:'2026-07-07',time:'20:00',venue:V.LUM},
  // OCTAVOS DE FINAL
  {id:89, phase:'r16',label:'Oct-1', h:'Gan. R32-1',     a:'Gan. R32-2',     date:'2026-07-09',time:'16:00',venue:V.MET},
  {id:90, phase:'r16',label:'Oct-2', h:'Gan. R32-3',     a:'Gan. R32-4',     date:'2026-07-09',time:'20:00',venue:V.ATT},
  {id:91, phase:'r16',label:'Oct-3', h:'Gan. R32-5',     a:'Gan. R32-6',     date:'2026-07-10',time:'16:00',venue:V.SOF},
  {id:92, phase:'r16',label:'Oct-4', h:'Gan. R32-7',     a:'Gan. R32-8',     date:'2026-07-10',time:'20:00',venue:V.HRS},
  {id:93, phase:'r16',label:'Oct-5', h:'Gan. R32-9',     a:'Gan. R32-10',    date:'2026-07-11',time:'16:00',venue:V.AZT},
  {id:94, phase:'r16',label:'Oct-6', h:'Gan. R32-11',    a:'Gan. R32-12',    date:'2026-07-11',time:'20:00',venue:V.LEV},
  {id:95, phase:'r16',label:'Oct-7', h:'Gan. R32-13',    a:'Gan. R32-14',    date:'2026-07-12',time:'16:00',venue:V.MET},
  {id:96, phase:'r16',label:'Oct-8', h:'Gan. R32-15',    a:'Gan. R32-16',    date:'2026-07-12',time:'20:00',venue:V.BCP},
  // CUARTOS DE FINAL
  {id:97, phase:'qf',label:'CF-1',   h:'Gan. Oct-1',     a:'Gan. Oct-2',     date:'2026-07-14',time:'16:00',venue:V.MET},
  {id:98, phase:'qf',label:'CF-2',   h:'Gan. Oct-3',     a:'Gan. Oct-4',     date:'2026-07-14',time:'20:00',venue:V.ATT},
  {id:99, phase:'qf',label:'CF-3',   h:'Gan. Oct-5',     a:'Gan. Oct-6',     date:'2026-07-15',time:'16:00',venue:V.SOF},
  {id:100,phase:'qf',label:'CF-4',   h:'Gan. Oct-7',     a:'Gan. Oct-8',     date:'2026-07-15',time:'20:00',venue:V.AZT},
  // SEMIFINALES
  {id:101,phase:'sf',label:'SF-1',   h:'Gan. CF-1',      a:'Gan. CF-2',      date:'2026-07-17',time:'20:00',venue:V.ATT},
  {id:102,phase:'sf',label:'SF-2',   h:'Gan. CF-3',      a:'Gan. CF-4',      date:'2026-07-18',time:'20:00',venue:V.MET},
  // TERCER LUGAR + FINAL
  {id:103,phase:'final',label:'3er Lugar',h:'Perdedor SF-1',a:'Perdedor SF-2',date:'2026-07-18',time:'16:00',venue:V.ATT},
  {id:104,phase:'final',label:'GRAN FINAL',h:'Ganador SF-1', a:'Ganador SF-2', date:'2026-07-19',time:'18:00',venue:V.MET,isFinal:true},
];

// ─── STATE ────────────────────────────────────────────────────────────────
let activePhase = 'grupos';
let activeGroup = 'all';

// ─── HELPERS ─────────────────────────────────────────────────────────────
function fmtDate(d) {
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'}).toUpperCase();
}
function flag(name) { return T[name] || '❓'; }
function isTbd(name) { return !T[name]; }

// ─── RENDER STATS ─────────────────────────────────────────────────────────
function renderStats() {
  return `<div class="stats-bar">
    <div class="stat-item"><span class="stat-val g">104</span><span class="stat-lbl">Partidos</span></div>
    <div class="stat-item"><span class="stat-val go">48</span><span class="stat-lbl">Selecciones</span></div>
    <div class="stat-item"><span class="stat-val b">16</span><span class="stat-lbl">Sedes</span></div>
    <div class="stat-item"><span class="stat-val" style="color:var(--muted)">39</span><span class="stat-lbl">Días</span></div>
    <div class="stat-item"><span class="stat-val" style="color:var(--fg-dim)">11 JUN</span><span class="stat-lbl">Apertura</span></div>
    <div class="stat-item"><span class="stat-val go">19 JUL</span><span class="stat-lbl">Gran Final</span></div>
  </div>`;
}

// ─── RENDER GROUP STAGE ───────────────────────────────────────────────────
function renderGroupFilter() {
  const groups = ['all','A','B','C','D','E','F','G','H','I','J','K','L'];
  return `<div class="group-filter">${groups.map(g =>
    `<button class="gf-chip${g===activeGroup?' active':''}" onclick="filterGroup('${g}')">${g==='all'?'Todos':'Grupo '+g}</button>`
  ).join('')}</div>`;
}

function renderMatchCard(m) {
  const simClass = m.sim ? ' sim' : '';
  return `<div class="match-card${simClass}">
    <div class="mc-top">
      <span class="mc-date">${fmtDate(m.date)} · ${m.time}</span>
      <span class="mc-badge gb-${m.g}">Grupo ${m.g} · J${m.md}</span>
    </div>
    <div class="mc-teams">
      <div class="mc-team">
        <span class="mc-flag">${flag(m.h)}</span>
        <span class="mc-name">${m.h}</span>
      </div>
      <span class="mc-vs">VS</span>
      <div class="mc-team">
        <span class="mc-flag">${flag(m.a)}</span>
        <span class="mc-name">${m.a}</span>
      </div>
    </div>
    <div class="mc-foot">
      <span class="mc-venue">📍 ${m.venue}</span>
      ${m.sim
        ? '<span class="mc-status st-sim">Simultáneo</span>'
        : '<span class="mc-status st-upcoming">Próximo</span>'}
    </div>
  </div>`;
}

function renderGrupos() {
  const filtered = activeGroup === 'all' ? GS : GS.filter(m => m.g === activeGroup);
  const byDate = {};
  filtered.forEach(m => { (byDate[m.date] = byDate[m.date]||[]).push(m); });

  let html = renderStats() + renderGroupFilter();
  Object.keys(byDate).sort().forEach(date => {
    const matches = byDate[date];
    const hasSim = matches.some(m => m.sim);
    html += `<div class="date-divider">
      <span class="date-label">${fmtDate(date)}</span>
      ${hasSim ? '<span class="sim-badge">Simultáneo</span>' : ''}
      <div class="date-line"></div>
      <span class="count-badge">${matches.length} partido${matches.length>1?'s':''}</span>
    </div>
    <div class="match-grid">${matches.map(renderMatchCard).join('')}</div>`;
  });
  return html;
}

// ─── RENDER KNOCKOUT ──────────────────────────────────────────────────────
function renderKoCard(m) {
  const cardClass = m.isFinal ? ' bk-final' : '';
  const badge = m.isFinal
    ? `<span class="mc-badge gb-final">🏆 ${m.label}</span>`
    : `<span class="mc-badge gb-ko">${m.label}</span>`;
  return `<div class="bk-card${cardClass}">
    <div class="bk-meta">
      <span class="bk-label">${m.label}</span>
      <span class="bk-date">${fmtDate(m.date)} · ${m.time}</span>
    </div>
    <div class="bk-teams">
      <div class="bk-team">
        <span class="bk-flag">${isTbd(m.h)?'❓':flag(m.h)}</span>
        <span class="bk-tname">${m.h}</span>
        <span class="bk-score">–</span>
      </div>
      <div class="bk-sep">vs</div>
      <div class="bk-team">
        <span class="bk-flag">${isTbd(m.a)?'❓':flag(m.a)}</span>
        <span class="bk-tname">${m.a}</span>
        <span class="bk-score">–</span>
      </div>
    </div>
    <div class="bk-venue">📍 ${m.venue}</div>
  </div>`;
}

function renderKnockout(phase) {
  const titles = {r32:'Ronda de 32',r16:'Octavos de Final',qf:'Cuartos de Final',sf:'Semifinales',final:'🏆 Final'};
  const matches = KO.filter(m => m.phase === phase);
  let html = renderStats();
  html += `<div class="phase-section">
    <div class="phase-section-title">${phase==='final'?'🏆 <span>Gran Final</span>':titles[phase]}</div>
    <div class="bracket-grid">${matches.map(renderKoCard).join('')}</div>
  </div>`;
  return html;
}

// ─── CONTROLLER ──────────────────────────────────────────────────────────
function setPhase(phase, btn) {
  activePhase = phase;
  activeGroup = 'all';
  document.querySelectorAll('.phase-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function filterGroup(g) {
  activeGroup = g;
  render();
}

function render() {
  const el = document.getElementById('mainContent');
  el.innerHTML = activePhase === 'grupos' ? renderGrupos() : renderKnockout(activePhase);
}

render();
</script>
</body>
</html>
