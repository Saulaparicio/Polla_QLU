<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prode 2026 — Mi Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg:       #07101D;
      --surface:  #0D1A2D;
      --surface2: #152338;
      --surface3: #1B2D47;
      --fg:       #E8F0FF;
      --fg-dim:   #C5D2EE;
      --muted:    #5E7A9E;
      --border:   #1C2E48;
      --border2:  #253B5E;
      --green:    #00E676;
      --green-d:  #00A853;
      --gold:     #FFD700;
      --red:      #FF5252;
      --amber:    #FFB300;
      --blue:     #5B8DEF;
      --header-h: 72px;
      --nav-h:    60px;
      --font-d:   'Bebas Neue', Impact, sans-serif;
      --font-b:   'Inter', -apple-system, system-ui, sans-serif;
      --r-s: 6px; --r-m: 12px; --r-l: 16px; --r-xl: 20px;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { height: 100%; }
    body { background: var(--bg); color: var(--fg); font-family: var(--font-b); line-height: 1.5; overflow-x: hidden; min-height: 100vh; }
    ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: var(--bg); } ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

    /* ─── HEADER ─── */
    .app-header {
      position: fixed; top: 0; left: 0; right: 0; height: var(--header-h); z-index: 200;
      background: rgba(7,16,29,0.9); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; padding: 0 clamp(12px, 3vw, 28px); gap: 16px;
    }
    .h-logo { display: flex; align-items: center; gap: 7px; text-decoration: none; flex-shrink: 0; }
    .h-logo-icon { font-size: 1.25rem; }
    .h-logo-text { font-family: var(--font-d); font-size: 1.4rem; color: var(--fg); letter-spacing: 0.04em; white-space: nowrap; }
    .h-logo-text em { font-style: normal; color: var(--green); }
    .h-divider { width: 1px; height: 28px; background: var(--border); flex-shrink: 0; }

    /* Header tabs (desktop only) */
    .h-tabs { display: flex; gap: 4px; flex: 1; }
    .h-tab {
      padding: 7px 16px; border: none; background: transparent; color: var(--muted);
      font-family: var(--font-b); font-size: 0.875rem; font-weight: 500; cursor: pointer;
      border-radius: var(--r-s); transition: all 0.18s; white-space: nowrap;
    }
    .h-tab:hover { color: var(--fg); background: rgba(255,255,255,0.04); }
    .h-tab.active { color: var(--fg); background: var(--surface2); }
    .h-tab .tab-badge {
      display: inline-flex; align-items: center; justify-content: center;
      width: 18px; height: 18px; background: var(--green); color: #000;
      border-radius: 50%; font-size: 0.65rem; font-weight: 800; margin-left: 5px;
    }

    /* Header user info */
    .h-user { display: flex; align-items: center; gap: 10px; margin-left: auto; flex-shrink: 0; }
    .h-points {
      display: flex; align-items: baseline; gap: 3px;
      background: rgba(0,230,118,0.08); border: 1px solid rgba(0,230,118,0.2);
      padding: 5px 12px; border-radius: var(--r-s);
    }
    .h-points-val { font-family: var(--font-d); font-size: 1.4rem; color: var(--green); line-height: 1; }
    .h-points-lbl { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--green); opacity: 0.7; }
    .h-rank {
      display: flex; align-items: center; gap: 5px;
      padding: 5px 12px; background: var(--surface2); border: 1px solid var(--border2);
      border-radius: var(--r-s);
    }
    .h-rank-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
    .h-rank-val { font-family: var(--font-d); font-size: 1.2rem; color: var(--fg); line-height: 1; }
    .h-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--surface3); border: 2px solid var(--border2); font-size: 1.2rem; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .h-alias { font-size: 0.8125rem; font-weight: 600; color: var(--fg); white-space: nowrap; }

    /* ─── MAIN LAYOUT ─── */
    .app-main {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 16px;
      max-width: 1400px; margin: 0 auto;
      padding: calc(var(--header-h) + 20px) 20px 100px;
    }

    /* ─── SECTION TABS ─── */
    .mob-tabs { display: none; }

    /* ─── PANEL SWITCHER ─── */
    .panel { display: none; }
    .panel.active { display: block; }

    /* ─── MATCH CARD ─── */
    .match-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r-l); padding: 18px 20px; margin-bottom: 12px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .match-card.locked { opacity: 0.6; }
    .match-card.saved  { border-color: rgba(0,230,118,0.3); }
    .match-card:hover:not(.locked) { border-color: var(--border2); box-shadow: 0 4px 20px rgba(0,0,0,0.25); }
    .mc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; gap: 8px; flex-wrap: wrap; }
    .mc-meta { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 600; }
    .mc-timer {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 11px; border-radius: 100px; font-size: 0.72rem; font-weight: 700;
    }
    .t-hot  { background: rgba(255,82,82,0.12);   border: 1px solid rgba(255,82,82,0.25);  color: var(--red);   }
    .t-warn { background: rgba(255,179,0,0.12);   border: 1px solid rgba(255,179,0,0.25);  color: var(--amber); }
    .t-ok   { background: rgba(0,230,118,0.1);    border: 1px solid rgba(0,230,118,0.2);   color: var(--green); }
    .t-done { background: rgba(0,230,118,0.08);   border: 1px solid rgba(0,230,118,0.18);  color: var(--green); }
    .t-lock { background: rgba(255,255,255,0.05); border: 1px solid var(--border2);         color: var(--muted); }
    .mc-body { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; }
    .team { display: flex; align-items: center; gap: 10px; }
    .team.away { flex-direction: row-reverse; text-align: right; justify-content: flex-start; }
    .tf { font-size: 2.2rem; line-height: 1; flex-shrink: 0; }
    .tn { font-size: 0.9375rem; font-weight: 700; color: var(--fg); }
    .tc { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-top: 1px; }
    .score-pair { display: flex; align-items: center; gap: 8px; justify-content: center; }
    .si {
      width: 54px; height: 54px; background: var(--surface2); border: 2px solid var(--border2);
      border-radius: var(--r-s); color: var(--fg); font-size: 1.55rem; font-weight: 700;
      text-align: center; font-family: var(--font-b); outline: none; transition: border-color 0.18s;
      -moz-appearance: textfield; cursor: pointer;
    }
    .si::-webkit-inner-spin-button, .si::-webkit-outer-spin-button { -webkit-appearance: none; }
    .si:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(0,230,118,0.12); }
    .si:disabled { opacity: 0.45; cursor: not-allowed; background: var(--surface); }
    .si.saved-val { border-color: rgba(0,230,118,0.5); color: var(--green); }
    .sv-sep { color: var(--muted); font-size: 0.9rem; font-weight: 700; }
    .mc-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; gap: 12px; flex-wrap: wrap; }
    .mc-status { font-size: 0.8125rem; color: var(--muted); }
    .mc-status.ok { color: var(--green); }
    .mc-actions { display: flex; gap: 8px; }
    .btn-save {
      background: var(--green); color: #000; border: none; border-radius: var(--r-s);
      padding: 9px 22px; font-family: var(--font-b); font-size: 0.875rem; font-weight: 700;
      cursor: pointer; transition: all 0.18s; white-space: nowrap;
    }
    .btn-save:hover { background: #00BF63; }
    .btn-save:disabled { background: var(--green-d); cursor: default; }
    .btn-edit {
      background: transparent; color: var(--muted); border: 1px solid var(--border2);
      border-radius: var(--r-s); padding: 9px 16px; font-family: var(--font-b);
      font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
    }
    .btn-edit:hover { color: var(--fg); border-color: var(--fg); }

    /* Result badge (for history panel) */
    .result-badge {
      display: inline-flex; align-items: center; padding: 3px 10px;
      border-radius: 100px; font-size: 0.72rem; font-weight: 700;
    }
    .rb-exact  { background: rgba(0,230,118,0.12); color: var(--green); border: 1px solid rgba(0,230,118,0.25); }
    .rb-diff   { background: rgba(255,215,0,0.12); color: var(--gold);  border: 1px solid rgba(255,215,0,0.25); }
    .rb-win    { background: rgba(91,141,239,0.12);color: var(--blue);  border: 1px solid rgba(91,141,239,0.25); }
    .rb-miss   { background: rgba(255,82,82,0.1);  color: var(--red);   border: 1px solid rgba(255,82,82,0.2); }
    .rb-pend   { background: var(--surface2); color: var(--muted); border: 1px solid var(--border2); }

    /* Empty state */
    .empty-state { text-align: center; padding: 48px 20px; }
    .empty-icon { font-size: 3rem; margin-bottom: 14px; opacity: 0.5; }
    .empty-text { color: var(--muted); font-size: 0.9375rem; }

    /* ─── SIDEBAR ─── */
    .sidebar { display: flex; flex-direction: column; gap: 14px; }
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r-l); overflow: hidden;
    }
    .card-head {
      padding: 14px 18px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .card-title { font-size: 0.875rem; font-weight: 700; color: var(--fg); display: flex; align-items: center; gap: 7px; }
    .card-action { font-size: 0.75rem; color: var(--muted); cursor: pointer; transition: color 0.2s; }
    .card-action:hover { color: var(--green); }

    /* Leaderboard */
    .lb-row {
      display: flex; align-items: center; padding: 11px 18px; gap: 10px;
      border-top: 1px solid var(--border); transition: background 0.15s;
    }
    .lb-row:first-child { border-top: none; }
    .lb-row:hover { background: rgba(255,255,255,0.02); }
    .lb-row.me { background: rgba(0,230,118,0.04); }
    .rk { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }
    .rk1 { background: rgba(255,215,0,0.15); color: var(--gold); }
    .rk2 { background: rgba(192,192,192,0.15); color: #C0C0C0; }
    .rk3 { background: rgba(205,127,50,0.15); color: #CD7F32; }
    .rkN { background: var(--surface2); color: var(--muted); }
    .lb-avt { width: 30px; height: 30px; border-radius: 50%; background: var(--surface2); font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .lb-info { flex: 1; min-width: 0; }
    .lb-alias { font-size: 0.8125rem; font-weight: 600; color: var(--fg); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .lb-sub { font-size: 0.68rem; color: var(--muted); }
    .lb-delta { font-size: 0.68rem; font-weight: 700; flex-shrink: 0; }
    .up { color: var(--green); } .dn { color: var(--red); } .st { color: var(--muted); }
    .lb-pts { flex-shrink: 0; text-align: right; }
    .lb-pts-v { font-family: var(--font-d); font-size: 1.25rem; color: var(--fg); line-height: 1; }
    .lb-pts-l { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
    .lb-foot { padding: 12px 18px; border-top: 1px solid var(--border); }

    /* Live dot */
    .live-badge { display: flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; color: var(--red); }
    .lpip { width: 6px; height: 6px; border-radius: 50%; background: var(--red); animation: lp 1.5s ease-in-out infinite; }
    @keyframes lp { 0%,100%{opacity:1} 50%{opacity:0.2} }

    /* Stats card */
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); }
    .stat-cell { background: var(--surface); padding: 16px 18px; }
    .stat-cell-val { font-family: var(--font-d); font-size: 2rem; color: var(--fg); line-height: 1; margin-bottom: 3px; }
    .stat-cell-lbl { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
    .stat-accent-green { color: var(--green); }
    .stat-accent-gold  { color: var(--gold); }
    .stat-accent-blue  { color: var(--blue); }

    /* Progress bar */
    .progress-row { padding: 12px 18px; border-top: 1px solid var(--border); }
    .progress-label { display: flex; justify-content: space-between; margin-bottom: 7px; }
    .progress-label span { font-size: 0.75rem; color: var(--muted); }
    .progress-label strong { font-size: 0.75rem; color: var(--fg); font-weight: 600; }
    .progress-bar { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--green), #00BF63); transition: width 1s ease; }

    /* Payment status card */
    .pay-status {
      display: flex; align-items: center; gap: 12px; padding: 16px 18px;
    }
    .status-icon { font-size: 1.8rem; flex-shrink: 0; }
    .status-info { flex: 1; }
    .status-title { font-size: 0.9375rem; font-weight: 700; color: var(--fg); margin-bottom: 2px; }
    .status-desc  { font-size: 0.8125rem; color: var(--muted); }
    .status-badge {
      padding: 5px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700;
      flex-shrink: 0;
    }
    .badge-active  { background: rgba(0,230,118,0.12); color: var(--green); border: 1px solid rgba(0,230,118,0.25); }
    .badge-pending { background: rgba(255,179,0,0.12);  color: var(--amber);  border: 1px solid rgba(255,179,0,0.25); }
    .pay-actions { padding: 0 18px 16px; }
    .upload-compact {
      border: 1.5px dashed var(--border2); border-radius: var(--r-m);
      padding: 16px; text-align: center; cursor: pointer; transition: all 0.2s;
    }
    .upload-compact:hover { border-color: var(--green); background: rgba(0,230,118,0.03); }
    .upload-compact-title { font-size: 0.875rem; font-weight: 600; color: var(--fg); }
    .upload-compact-hint  { font-size: 0.75rem; color: var(--muted); margin-top: 3px; }

    /* Upcoming match item (smaller) */
    .upcoming-item {
      padding: 14px 18px; border-top: 1px solid var(--border);
      display: flex; align-items: center; gap: 12px;
    }
    .upcoming-item:first-child { border-top: none; }
    .upc-teams { flex: 1; display: flex; align-items: center; gap: 8px; }
    .upc-flag { font-size: 1.5rem; }
    .upc-vs { font-size: 0.75rem; color: var(--muted); font-weight: 600; }
    .upc-time { font-size: 0.75rem; color: var(--muted); white-space: nowrap; }
    .upc-lock { font-size: 0.72rem; color: var(--amber); font-weight: 600; }

    /* ─── BOTTOM NAV (mobile only) ─── */
    .bottom-nav {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: rgba(7,16,29,0.95); backdrop-filter: blur(20px);
      border-top: 1px solid var(--border); z-index: 200;
      padding: 0 8px; height: var(--nav-h);
      align-items: stretch; justify-content: space-around;
      display: none; /* shown only inside the ≤900px media query below */
    }
    .bnav-item {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 3px; color: var(--muted); font-size: 0.6875rem; font-weight: 500; cursor: pointer;
      border: none; background: transparent; padding: 8px 4px; transition: color 0.18s;
    }
    .bnav-item.active { color: var(--green); }
    .bnav-icon { font-size: 1.3rem; line-height: 1; }
    .bnav-badge {
      position: absolute; top: 6px; right: calc(50% - 16px);
      background: var(--green); color: #000; border-radius: 50%;
      width: 16px; height: 16px; font-size: 0.6rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 1100px) {
      .app-main { grid-template-columns: 1fr 290px; }
    }
    @media (max-width: 900px) {
      .h-tabs  { display: none; }
      .h-divider { display: none; }
      .mob-tabs { display: flex; gap: 4px; margin-bottom: 14px; flex-wrap: wrap; }
      .mtab {
        padding: 8px 18px; border: 1px solid var(--border2); border-radius: 100px;
        background: transparent; color: var(--muted); font-family: var(--font-b);
        font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
      }
      .mtab.active { background: var(--surface2); color: var(--fg); border-color: var(--fg); }
      .app-main  { grid-template-columns: 1fr; padding-bottom: 80px; }
      .bottom-nav { display: flex; }
      .sidebar { display: none; }
      .sidebar.mob-visible { display: flex; }
    }
    @media (max-width: 600px) {
      .mc-body { gap: 8px; }
      .tn { font-size: 0.8125rem; }
      .si { width: 48px; height: 48px; font-size: 1.3rem; }
      .h-rank { display: none; }
      .h-alias { display: none; }
    }
    @media (max-width: 400px) {
      .si { width: 42px; height: 42px; font-size: 1.2rem; }
      .tf { font-size: 1.8rem; }
    }
  </style>
</head>
<body>

<!-- ─── HEADER ─── -->
<header class="app-header">
  <a href="landing.html" class="h-logo">
    <span class="h-logo-icon">⚽</span>
    <span class="h-logo-text">PRODE<em>26</em></span>
  </a>
  <div class="h-divider"></div>
  <div class="h-tabs">
    <button class="h-tab active" onclick="switchPanel('today', this)">
      Hoy <span class="tab-badge" id="badge-today">4</span>
    </button>
    <button class="h-tab" onclick="switchPanel('upcoming', this)">Próximos</button>
    <button class="h-tab" onclick="switchPanel('history', this)">Mis Pronósticos</button>
  </div>
  <div class="h-user">
    <div class="h-points">
      <span class="h-points-val" id="user-pts">47</span>
      <span class="h-points-lbl">pts</span>
    </div>
    <div class="h-rank">
      <span class="h-rank-label">Rank</span>
      <span class="h-rank-val">#8</span>
    </div>
    <div class="h-avatar">🦅</div>
    <span class="h-alias">@TúAquí</span>
  </div>
</header>

<!-- ─── MAIN ─── -->
<div class="app-main">

  <!-- LEFT: PANELS -->
  <main>
    <!-- Mobile tabs -->
    <div class="mob-tabs">
      <button class="mtab active" onclick="switchPanel('today', this)">Hoy (4)</button>
      <button class="mtab" onclick="switchPanel('upcoming', this)">Próximos</button>
      <button class="mtab" onclick="switchPanel('history', this)">Mis Pronósticos</button>
      <button class="mtab" onclick="showMobileSidebar(this)">Ranking</button>
    </div>

    <!-- PANEL: Today's matches -->
    <div class="panel active" id="panel-today">
      <div id="today-intro" style="margin-bottom:16px; padding: 14px 18px; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-l); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <div>
          <div style="font-weight:700; font-size:0.9375rem;">Partidos de hoy — Jornada 1</div>
          <div style="font-size:0.8125rem; color:var(--muted); margin-top:3px;">4 partidos disponibles · 2 sin pronosticar</div>
        </div>
        <div style="display:flex; align-items:center; gap:6px; font-size:0.8125rem; color:var(--amber); font-weight:600;">
          <span style="animation:lp 1.5s infinite; display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--amber);"></span>
          Grupo A cierra en 1h 23m
        </div>
      </div>

      <!-- Match 1 — HOT -->
      <div class="match-card saved" id="mc1">
        <div class="mc-top">
          <span class="mc-meta">Grupo A · Jornada 1 · MetLife Stadium, New Jersey</span>
          <span class="mc-timer t-done" id="timer-1">✓ Pronóstico guardado</span>
        </div>
        <div class="mc-body">
          <div class="team"><span class="tf">🇦🇷</span><div><div class="tn">Argentina</div><div class="tc">ARG</div></div></div>
          <div class="score-pair">
            <input type="number" class="si saved-val" id="s1a" value="2" min="0" max="20" disabled aria-label="Goles Argentina">
            <span class="sv-sep">:</span>
            <input type="number" class="si saved-val" id="s1b" value="0" min="0" max="20" disabled aria-label="Goles Arabia Saudita">
          </div>
          <div class="team away"><span class="tf">🇸🇦</span><div><div class="tn">Arabia Saudita</div><div class="tc">KSA</div></div></div>
        </div>
        <div class="mc-foot">
          <span class="mc-status ok">✓ Guardado · 2 – 0</span>
          <div class="mc-actions">
            <button class="btn-edit" onclick="editMatch(1)">Editar</button>
            <button class="btn-save" id="btn1" disabled>✓ Guardado</button>
          </div>
        </div>
      </div>

      <!-- Match 2 — WARM -->
      <div class="match-card" id="mc2">
        <div class="mc-top">
          <span class="mc-meta">Grupo B · Jornada 1 · SoFi Stadium, Los Ángeles</span>
          <span class="mc-timer t-warn" id="timer-2">⚠️ Cierra en <span class="countdown" data-minutes="220">3h 40m</span></span>
        </div>
        <div class="mc-body">
          <div class="team"><span class="tf">🇫🇷</span><div><div class="tn">Francia</div><div class="tc">FRA</div></div></div>
          <div class="score-pair">
            <input type="number" class="si" id="s2a" min="0" max="20" placeholder="–" aria-label="Goles Francia">
            <span class="sv-sep">:</span>
            <input type="number" class="si" id="s2b" min="0" max="20" placeholder="–" aria-label="Goles Marruecos">
          </div>
          <div class="team away"><span class="tf">🇲🇦</span><div><div class="tn">Marruecos</div><div class="tc">MAR</div></div></div>
        </div>
        <div class="mc-foot">
          <span class="mc-status" id="st2">Sin pronosticar</span>
          <div class="mc-actions">
            <button class="btn-save" id="btn2" onclick="saveMatch(2)">Guardar Pronóstico</button>
          </div>
        </div>
      </div>

      <!-- Match 3 — SAFE -->
      <div class="match-card" id="mc3">
        <div class="mc-top">
          <span class="mc-meta">Grupo C · Jornada 1 · Estadio Azteca, México</span>
          <span class="mc-timer t-ok" id="timer-3">⏱ Cierra en <span class="countdown" data-minutes="430">7h 10m</span></span>
        </div>
        <div class="mc-body">
          <div class="team"><span class="tf">🇧🇷</span><div><div class="tn">Brasil</div><div class="tc">BRA</div></div></div>
          <div class="score-pair">
            <input type="number" class="si" id="s3a" min="0" max="20" placeholder="–" aria-label="Goles Brasil">
            <span class="sv-sep">:</span>
            <input type="number" class="si" id="s3b" min="0" max="20" placeholder="–" aria-label="Goles Serbia">
          </div>
          <div class="team away"><span class="tf">🇸🇷</span><div><div class="tn">Serbia</div><div class="tc">SRB</div></div></div>
        </div>
        <div class="mc-foot">
          <span class="mc-status" id="st3">Sin pronosticar</span>
          <div class="mc-actions">
            <button class="btn-save" id="btn3" onclick="saveMatch(3)">Guardar Pronóstico</button>
          </div>
        </div>
      </div>

      <!-- Match 4 — SAFE -->
      <div class="match-card" id="mc4">
        <div class="mc-top">
          <span class="mc-meta">Grupo D · Jornada 1 · AT&T Stadium, Dallas</span>
          <span class="mc-timer t-ok" id="timer-4">⏱ Cierra en <span class="countdown" data-minutes="570">9h 30m</span></span>
        </div>
        <div class="mc-body">
          <div class="team"><span class="tf">🇪🇸</span><div><div class="tn">España</div><div class="tc">ESP</div></div></div>
          <div class="score-pair">
            <input type="number" class="si" id="s4a" min="0" max="20" placeholder="–" aria-label="Goles España">
            <span class="sv-sep">:</span>
            <input type="number" class="si" id="s4b" min="0" max="20" placeholder="–" aria-label="Goles Japón">
          </div>
          <div class="team away"><span class="tf">🇯🇵</span><div><div class="tn">Japón</div><div class="tc">JPN</div></div></div>
        </div>
        <div class="mc-foot">
          <span class="mc-status" id="st4">Sin pronosticar</span>
          <div class="mc-actions">
            <button class="btn-save" id="btn4" onclick="saveMatch(4)">Guardar Pronóstico</button>
          </div>
        </div>
      </div>
    </div>

    <!-- PANEL: Upcoming -->
    <div class="panel" id="panel-upcoming">
      <div class="match-card" id="mc5">
        <div class="mc-top">
          <span class="mc-meta">Grupo E · Jornada 1 · Estadio Gillette, Boston</span>
          <span class="mc-timer t-ok">⏱ Mañana 14:00</span>
        </div>
        <div class="mc-body">
          <div class="team"><span class="tf">🇩🇪</span><div><div class="tn">Alemania</div><div class="tc">GER</div></div></div>
          <div class="score-pair">
            <input type="number" class="si" id="s5a" min="0" max="20" placeholder="–" aria-label="Goles Alemania">
            <span class="sv-sep">:</span>
            <input type="number" class="si" id="s5b" min="0" max="20" placeholder="–" aria-label="Goles México">
          </div>
          <div class="team away"><span class="tf">🇲🇽</span><div><div class="tn">México</div><div class="tc">MEX</div></div></div>
        </div>
        <div class="mc-foot">
          <span class="mc-status" id="st5">Sin pronosticar</span>
          <div class="mc-actions">
            <button class="btn-save" id="btn5" onclick="saveMatch(5)">Guardar Pronóstico</button>
          </div>
        </div>
      </div>
      <div class="match-card" id="mc6">
        <div class="mc-top">
          <span class="mc-meta">Grupo F · Jornada 1 · Levi's Stadium, San Francisco</span>
          <span class="mc-timer t-ok">⏱ Mañana 18:00</span>
        </div>
        <div class="mc-body">
          <div class="team"><span class="tf">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span><div><div class="tn">Inglaterra</div><div class="tc">ENG</div></div></div>
          <div class="score-pair">
            <input type="number" class="si" id="s6a" min="0" max="20" placeholder="–" aria-label="Goles Inglaterra">
            <span class="sv-sep">:</span>
            <input type="number" class="si" id="s6b" min="0" max="20" placeholder="–" aria-label="Goles USA">
          </div>
          <div class="team away"><span class="tf">🇺🇸</span><div><div class="tn">Estados Unidos</div><div class="tc">USA</div></div></div>
        </div>
        <div class="mc-foot">
          <span class="mc-status" id="st6">Sin pronosticar</span>
          <div class="mc-actions">
            <button class="btn-save" id="btn6" onclick="saveMatch(6)">Guardar Pronóstico</button>
          </div>
        </div>
      </div>
    </div>

    <!-- PANEL: History -->
    <div class="panel" id="panel-history">
      <!-- Finished match with result -->
      <div class="match-card">
        <div class="mc-top">
          <span class="mc-meta">Grupo A · Jornada 0 · Amistoso de preparación</span>
          <span class="result-badge rb-exact">🎯 +3 pts — Exacto</span>
        </div>
        <div class="mc-body">
          <div class="team"><span class="tf">🇵🇹</span><div><div class="tn">Portugal</div><div class="tc">POR</div></div></div>
          <div class="score-pair">
            <input type="number" class="si saved-val" value="2" disabled>
            <span class="sv-sep">:</span>
            <input type="number" class="si saved-val" value="1" disabled>
          </div>
          <div class="team away"><span class="tf">🇺🇾</span><div><div class="tn">Uruguay</div><div class="tc">URU</div></div></div>
        </div>
        <div class="mc-foot">
          <span class="mc-status ok">Tu pronóstico: 2 – 1 &nbsp;·&nbsp; Real: 2 – 1 ✓</span>
          <span class="result-badge rb-exact">+3 pts</span>
        </div>
      </div>
      <div class="match-card">
        <div class="mc-top">
          <span class="mc-meta">Grupo B · Jornada 0 · Amistoso de preparación</span>
          <span class="result-badge rb-diff">📊 +2 pts — Ganador + Diferencia</span>
        </div>
        <div class="mc-body">
          <div class="team"><span class="tf">🇳🇱</span><div><div class="tn">Países Bajos</div><div class="tc">NED</div></div></div>
          <div class="score-pair">
            <input type="number" class="si" value="3" disabled style="border-color:rgba(255,215,0,0.4); color:var(--gold);">
            <span class="sv-sep">:</span>
            <input type="number" class="si" value="1" disabled style="border-color:rgba(255,215,0,0.4); color:var(--gold);">
          </div>
          <div class="team away"><span class="tf">🇸🇳</span><div><div class="tn">Senegal</div><div class="tc">SEN</div></div></div>
        </div>
        <div class="mc-foot">
          <span class="mc-status" style="color:var(--gold);">Tu pronóstico: 3 – 1 &nbsp;·&nbsp; Real: 2 – 0 ✓ (diff. 1)</span>
          <span class="result-badge rb-diff">+2 pts</span>
        </div>
      </div>
      <div class="match-card">
        <div class="mc-top">
          <span class="mc-meta">Grupo C · Jornada 0 · Amistoso de preparación</span>
          <span class="result-badge rb-win">✅ +1 pt — Solo el ganador</span>
        </div>
        <div class="mc-body">
          <div class="team"><span class="tf">🇰🇷</span><div><div class="tn">Corea del Sur</div><div class="tc">KOR</div></div></div>
          <div class="score-pair">
            <input type="number" class="si" value="1" disabled style="border-color:rgba(91,141,239,0.4); color:var(--blue);">
            <span class="sv-sep">:</span>
            <input type="number" class="si" value="0" disabled style="border-color:rgba(91,141,239,0.4); color:var(--blue);">
          </div>
          <div class="team away"><span class="tf">🇦🇺</span><div><div class="tn">Australia</div><div class="tc">AUS</div></div></div>
        </div>
        <div class="mc-foot">
          <span class="mc-status" style="color:var(--blue);">Tu pronóstico: 1 – 0 &nbsp;·&nbsp; Real: 2 – 1 ✓ (ganador)</span>
          <span class="result-badge rb-win">+1 pt</span>
        </div>
      </div>
      <div class="match-card">
        <div class="mc-top">
          <span class="mc-meta">Grupo D · Jornada 0 · Amistoso de preparación</span>
          <span class="result-badge rb-miss">✗ 0 pts — Sin punto</span>
        </div>
        <div class="mc-body">
          <div class="team"><span class="tf">🇧🇪</span><div><div class="tn">Bélgica</div><div class="tc">BEL</div></div></div>
          <div class="score-pair">
            <input type="number" class="si" value="2" disabled style="border-color:rgba(255,82,82,0.3); color:var(--red);">
            <span class="sv-sep">:</span>
            <input type="number" class="si" value="0" disabled style="border-color:rgba(255,82,82,0.3); color:var(--red);">
          </div>
          <div class="team away"><span class="tf">🇨🇭</span><div><div class="tn">Suiza</div><div class="tc">SUI</div></div></div>
        </div>
        <div class="mc-foot">
          <span class="mc-status" style="color:var(--red);">Tu pronóstico: 2 – 0 &nbsp;·&nbsp; Real: 1 – 2 ✗</span>
          <span class="result-badge rb-miss">0 pts</span>
        </div>
      </div>
    </div>
  </main>

  <!-- RIGHT: SIDEBAR -->
  <aside class="sidebar" id="sidebar">

    <!-- LEADERBOARD -->
    <div class="card">
      <div class="card-head">
        <span class="card-title">🏆 Tabla General</span>
        <span class="live-badge"><span class="lpip"></span>EN VIVO</span>
      </div>
      <div class="lb-row">
        <div class="rk rk1">1</div>
        <div class="lb-avt">🦁</div>
        <div class="lb-info"><div class="lb-alias">@LeonFutbolero</div><div class="lb-sub">🇦🇷 128 pts totales</div></div>
        <div class="lb-delta up">▲2</div>
        <div class="lb-pts"><div class="lb-pts-v">128</div><div class="lb-pts-l">pts</div></div>
      </div>
      <div class="lb-row">
        <div class="rk rk2">2</div>
        <div class="lb-avt">🦅</div>
        <div class="lb-info"><div class="lb-alias">@AguiPanama</div><div class="lb-sub">🇵🇦 121 pts totales</div></div>
        <div class="lb-delta st">—</div>
        <div class="lb-pts"><div class="lb-pts-v">121</div><div class="lb-pts-l">pts</div></div>
      </div>
      <div class="lb-row">
        <div class="rk rk3">3</div>
        <div class="lb-avt">🐆</div>
        <div class="lb-info"><div class="lb-alias">@PintorPitero</div><div class="lb-sub">🇵🇦 117 pts totales</div></div>
        <div class="lb-delta dn">▼1</div>
        <div class="lb-pts"><div class="lb-pts-v">117</div><div class="lb-pts-l">pts</div></div>
      </div>
      <div class="lb-row">
        <div class="rk rkN">4</div>
        <div class="lb-avt">🐬</div>
        <div class="lb-info"><div class="lb-alias">@DelfinCarioca</div><div class="lb-sub">🇧🇷 109 pts totales</div></div>
        <div class="lb-delta up">▲1</div>
        <div class="lb-pts"><div class="lb-pts-v">109</div><div class="lb-pts-l">pts</div></div>
      </div>
      <div class="lb-row">
        <div class="rk rkN">5</div>
        <div class="lb-avt">🦊</div>
        <div class="lb-info"><div class="lb-alias">@ZorroGoleador</div><div class="lb-sub">🇲🇽 104 pts totales</div></div>
        <div class="lb-delta up">▲3</div>
        <div class="lb-pts"><div class="lb-pts-v">104</div><div class="lb-pts-l">pts</div></div>
      </div>
      <!-- separator -->
      <div style="padding: 6px 18px; display:flex; align-items:center; gap:8px;">
        <div style="flex:1; height:1px; background:var(--border);"></div>
        <span style="font-size:0.68rem; color:var(--muted);">·· 2 posiciones ··</span>
        <div style="flex:1; height:1px; background:var(--border);"></div>
      </div>
      <div class="lb-row me">
        <div class="rk rkN">8</div>
        <div class="lb-avt">⚡</div>
        <div class="lb-info"><div class="lb-alias">@TúAquí</div><div class="lb-sub">🇵🇦 Tú</div></div>
        <div class="lb-delta up">▲2</div>
        <div class="lb-pts"><div class="lb-pts-v" style="color:var(--green);">47</div><div class="lb-pts-l">pts</div></div>
      </div>
      <div class="lb-foot">
        <a href="#" style="display:block; text-align:center; font-size:0.8125rem; color:var(--muted); text-decoration:none; padding:4px;">Ver los 24 participantes →</a>
      </div>
    </div>

    <!-- MY STATS -->
    <div class="card">
      <div class="card-head">
        <span class="card-title">📊 Mis estadísticas</span>
        <span class="card-action">Jornada 1</span>
      </div>
      <div class="stats-grid">
        <div class="stat-cell">
          <div class="stat-cell-val stat-accent-green">47</div>
          <div class="stat-cell-lbl">Puntos totales</div>
        </div>
        <div class="stat-cell">
          <div class="stat-cell-val">#8</div>
          <div class="stat-cell-lbl">Posición global</div>
        </div>
        <div class="stat-cell">
          <div class="stat-cell-val stat-accent-gold">3</div>
          <div class="stat-cell-lbl">Exactos (3 pts)</div>
        </div>
        <div class="stat-cell">
          <div class="stat-cell-val stat-accent-blue">5</div>
          <div class="stat-cell-lbl">Ganadores (+1-2)</div>
        </div>
      </div>
      <div class="progress-row">
        <div class="progress-label">
          <span>Pronósticos enviados</span>
          <strong>9 / 104</strong>
        </div>
        <div class="progress-bar"><div class="progress-fill" id="pfill" style="width:8.7%"></div></div>
      </div>
      <div class="progress-row" style="border-top: none; padding-top: 0;">
        <div class="progress-label">
          <span>Efectividad</span>
          <strong style="color:var(--green);">57%</strong>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:57%; background:linear-gradient(90deg,var(--green),var(--gold));"></div></div>
      </div>
    </div>

    <!-- PAYMENT STATUS -->
    <div class="card" id="payment-card">
      <div class="card-head">
        <span class="card-title">💳 Estado de cuenta</span>
        <button class="card-action" onclick="togglePayStatus()" style="border:none; background:none; font-family:inherit; cursor:pointer;">Cambiar estado</button>
      </div>
      <div class="pay-status" id="pay-status-row">
        <span class="status-icon" id="pay-icon">✅</span>
        <div class="status-info">
          <div class="status-title" id="pay-title">Cuenta activa</div>
          <div class="status-desc" id="pay-desc">Inscripción verificada · Torneo completo</div>
        </div>
        <span class="status-badge badge-active" id="pay-badge">ACTIVO</span>
      </div>
      <div class="pay-actions" id="pay-upload-section" style="display:none;">
        <div class="upload-compact" onclick="document.getElementById('si-file').click()">
          <div class="upload-compact-title">📎 Adjuntar comprobante Yappy</div>
          <div class="upload-compact-hint">PNG, JPG · B/. 15 · Se activa en 24h</div>
        </div>
        <input type="file" id="si-file" style="display:none" accept="image/*" onchange="handlePayUpload(this)">
        <div id="pay-upload-ok" style="display:none; margin-top:10px; background:rgba(0,230,118,0.07); border:1px solid rgba(0,230,118,0.2); border-radius:var(--r-s); padding:10px 14px; font-size:0.8125rem; color:var(--green);">
          ✓ Recibido — revisamos en 24h
        </div>
      </div>
    </div>

  </aside>
</div>

<!-- ─── BOTTOM NAV ─── -->
<nav class="bottom-nav" role="navigation" aria-label="Navegación móvil">
  <button class="bnav-item active" onclick="mobileNav('today', this)">
    <span class="bnav-icon">⚽</span>
    <span>Hoy</span>
  </button>
  <button class="bnav-item" onclick="mobileNav('upcoming', this)" style="position:relative;">
    <span class="bnav-icon">📅</span>
    <span>Próximos</span>
    <span class="bnav-badge">2</span>
  </button>
  <button class="bnav-item" onclick="mobileNav('history', this)">
    <span class="bnav-icon">📋</span>
    <span>Historial</span>
  </button>
  <button class="bnav-item" onclick="mobileNav('ranking', this)">
    <span class="bnav-icon">🏆</span>
    <span>Ranking</span>
  </button>
</nav>

<script>
  /* ─── PANEL SWITCHING ─── */
  function switchPanel(id, btn) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + id).classList.add('active');

    // desktop header tabs
    document.querySelectorAll('.h-tab').forEach(t => t.classList.remove('active'));
    // mobile tabs
    document.querySelectorAll('.mtab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // hide sidebar on mobile when switching to ranking tab
    document.getElementById('sidebar').classList.remove('mob-visible');
  }

  function showMobileSidebar(btn) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.mtab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('sidebar').classList.add('mob-visible');
  }

  function mobileNav(id, btn) {
    document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (id === 'ranking') {
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.getElementById('sidebar').classList.add('mob-visible');
    } else {
      document.getElementById('sidebar').classList.remove('mob-visible');
      switchPanel(id, null);
    }
  }

  /* ─── SAVE MATCH ─── */
  function saveMatch(id) {
    const a = document.getElementById('s' + id + 'a');
    const b = document.getElementById('s' + id + 'b');
    const btn = document.getElementById('btn' + id);
    const st  = document.getElementById('st' + id);
    const mc  = document.getElementById('mc' + id);

    const va = a.value;
    const vb = b.value;

    if (va === '' || vb === '') {
      if (va === '') { a.style.borderColor = 'var(--amber)'; setTimeout(() => { a.style.borderColor = 'var(--border2)'; }, 2000); }
      if (vb === '') { b.style.borderColor = 'var(--amber)'; setTimeout(() => { b.style.borderColor = 'var(--border2)'; }, 2000); }
      return;
    }

    // Update UI
    mc.classList.add('saved');
    a.classList.add('saved-val'); b.classList.add('saved-val');
    a.disabled = true; b.disabled = true;
    btn.disabled = true; btn.textContent = '✓ Guardado';

    const timer = document.getElementById('timer-' + id);
    if (timer) {
      timer.className = 'mc-timer t-done';
      timer.textContent = '✓ Pronóstico guardado';
    }

    st.textContent = '✓ Guardado · ' + va + ' – ' + vb;
    st.className = 'mc-status ok';

    // Add edit button
    const actionsDiv = btn.parentElement;
    if (!document.getElementById('edit-btn-' + id)) {
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-edit';
      editBtn.id = 'edit-btn-' + id;
      editBtn.textContent = 'Editar';
      editBtn.onclick = () => editMatch(id);
      actionsDiv.insertBefore(editBtn, btn);
    }

    // Update pending count in badge
    updateBadge();

    // Animate points
    animatePoints(3);
  }

  function editMatch(id) {
    const a = document.getElementById('s' + id + 'a');
    const b = document.getElementById('s' + id + 'b');
    const btn = document.getElementById('btn' + id);
    const st  = document.getElementById('st' + id);
    const mc  = document.getElementById('mc' + id);
    const editBtn = document.getElementById('edit-btn-' + id);

    mc.classList.remove('saved');
    a.classList.remove('saved-val'); b.classList.remove('saved-val');
    a.disabled = false; b.disabled = false;
    btn.disabled = false; btn.textContent = 'Guardar Pronóstico';
    st.textContent = 'Editando...'; st.className = 'mc-status';

    const timer = document.getElementById('timer-' + id);
    if (timer) {
      timer.className = 'mc-timer t-warn';
      timer.innerHTML = '⚠️ Guardando cambios';
    }

    if (editBtn) editBtn.remove();
    a.focus();
  }

  function updateBadge() {
    const pending = document.querySelectorAll('#panel-today .match-card:not(.saved)').length;
    const badge = document.getElementById('badge-today');
    if (badge) badge.textContent = pending;
  }

  /* ─── POINTS ANIMATION ─── */
  function animatePoints(delta) {
    const el = document.getElementById('user-pts');
    const current = parseInt(el.textContent);
    const target  = current + delta;
    let n = current;
    const step = () => {
      n = Math.min(n + 1, target);
      el.textContent = n;
      if (n < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ─── PAYMENT STATUS TOGGLE ─── */
  let isActive = true;
  function togglePayStatus() {
    isActive = !isActive;
    const icon  = document.getElementById('pay-icon');
    const title = document.getElementById('pay-title');
    const desc  = document.getElementById('pay-desc');
    const badge = document.getElementById('pay-badge');
    const uploadSection = document.getElementById('pay-upload-section');

    if (isActive) {
      icon.textContent  = '✅';
      title.textContent = 'Cuenta activa';
      desc.textContent  = 'Inscripción verificada · Torneo completo';
      badge.textContent = 'ACTIVO';
      badge.className   = 'status-badge badge-active';
      uploadSection.style.display = 'none';
    } else {
      icon.textContent  = '⏳';
      title.textContent = 'Pago pendiente';
      desc.textContent  = 'Envía B/.15 por Yappy y adjunta el comprobante';
      badge.textContent = 'PENDIENTE';
      badge.className   = 'status-badge badge-pending';
      uploadSection.style.display = 'block';
    }
  }

  function handlePayUpload(input) {
    if (input.files && input.files.length > 0) {
      document.getElementById('pay-upload-ok').style.display = 'block';
      const zone = document.querySelector('.upload-compact');
      zone.style.borderColor = 'var(--green)';
      zone.innerHTML = `<div class="upload-compact-title">✅ ${input.files[0].name}</div><div class="upload-compact-hint">Comprobante enviado · revisamos en 24h</div>`;
    }
  }

  /* ─── COUNTDOWN TIMERS ─── */
  function updateCountdowns() {
    document.querySelectorAll('.countdown').forEach(el => {
      const mins = parseInt(el.dataset.minutes);
      if (isNaN(mins)) return;
      const elapsed = Math.floor((Date.now() - pageLoadTime) / 60000);
      const remaining = Math.max(0, mins - elapsed);
      const h = Math.floor(remaining / 60);
      const m = remaining % 60;
      if (remaining <= 0) {
        el.textContent = 'Cerrado';
      } else if (h > 0) {
        el.textContent = h + 'h ' + m + 'm';
      } else {
        el.textContent = m + 'm';
      }
    });
  }
  const pageLoadTime = Date.now();
  updateCountdowns();
  setInterval(updateCountdowns, 60000);

  /* ─── PROGRESS BAR ANIMATE ON LOAD ─── */
  setTimeout(() => {
    const pf = document.getElementById('pfill');
    if (pf) pf.style.width = '8.7%';
  }, 300);
</script>
</body>
</html>
