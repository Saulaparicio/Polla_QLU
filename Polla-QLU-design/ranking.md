<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prode 2026 — Ranking</title>
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
      --silver:   #C0C8D8;
      --bronze:   #CD7F32;
      --red:      #FF5252;
      --amber:    #FFB300;
      --blue:     #5B8DEF;
      --font-d:   'Bebas Neue', Impact, sans-serif;
      --font-b:   'Inter', -apple-system, system-ui, sans-serif;
      --r-s: 6px; --r-m: 12px; --r-l: 16px;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { height: 100%; scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--fg); font-family: var(--font-b); line-height: 1.5; overflow-x: hidden; min-height: 100vh; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

    /* ─── HEADER ─── */
    .app-header {
      position: fixed; top: 0; left: 0; right: 0; height: 68px; z-index: 200;
      background: rgba(7,16,29,0.92); backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; padding: 0 clamp(16px, 4vw, 40px); gap: 14px;
    }
    .h-back {
      display: flex; align-items: center; gap: 6px; text-decoration: none;
      color: var(--muted); font-size: 0.875rem; font-weight: 500; transition: color 0.15s;
    }
    .h-back:hover { color: var(--fg); }
    .h-logo { display: flex; align-items: center; gap: 7px; text-decoration: none; }
    .h-logo-icon { font-size: 1.2rem; }
    .h-logo-text { font-family: var(--font-d); font-size: 1.35rem; color: var(--fg); letter-spacing: 0.04em; }
    .h-logo-text em { font-style: normal; color: var(--green); }
    .h-divider { width: 1px; height: 26px; background: var(--border); }
    .h-title { font-family: var(--font-d); font-size: 1.2rem; letter-spacing: 0.06em; color: var(--fg-dim); }
    .h-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
    .h-date { font-size: 0.8rem; color: var(--muted); }
    .h-live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

    /* ─── PAGE WRAPPER ─── */
    .page { padding-top: 68px; }

    /* ─── HERO STRIP ─── */
    .hero-strip {
      background: linear-gradient(160deg, #0D1A2D 0%, #07101D 60%);
      border-bottom: 1px solid var(--border);
      padding: clamp(28px, 4vw, 48px) clamp(16px, 6vw, 80px);
      display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center;
    }
    .hero-eyebrow { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--green); font-weight: 600; }
    .hero-title { font-family: var(--font-d); font-size: clamp(2.5rem, 6vw, 5rem); letter-spacing: 0.04em; line-height: 1; }
    .hero-sub { color: var(--muted); font-size: 0.9375rem; max-width: 480px; }
    .hero-stats { display: flex; gap: 28px; margin-top: 16px; flex-wrap: wrap; justify-content: center; }
    .h-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .h-stat-val { font-family: var(--font-d); font-size: 1.8rem; color: var(--green); line-height: 1; }
    .h-stat-lbl { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }

    /* ─── PODIUM SECTION ─── */
    .podium-section {
      padding: clamp(32px, 5vw, 64px) clamp(16px, 6vw, 80px);
      display: flex; flex-direction: column; align-items: center; gap: 40px;
    }
    .podium-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted); font-weight: 600; }

    .podium {
      display: flex; align-items: flex-end; gap: clamp(8px, 2vw, 20px);
      justify-content: center; width: 100%; max-width: 680px;
    }

    /* podium slot */
    .podium-slot {
      display: flex; flex-direction: column; align-items: center; gap: 0;
      flex: 1; min-width: 0;
    }

    .podium-card {
      width: 100%; padding: clamp(16px, 2.5vw, 28px) clamp(12px, 2vw, 20px);
      border-radius: var(--r-l) var(--r-l) 0 0;
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      position: relative; overflow: hidden;
      animation: riseUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    }
    @keyframes riseUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }

    .podium-slot:nth-child(1) .podium-card { background: linear-gradient(160deg, #1a1a0a 0%, #2a2000 100%); border: 1.5px solid var(--gold); animation-delay: 0.1s; }
    .podium-slot:nth-child(2) .podium-card { background: linear-gradient(160deg, #0e1c30 0%, #152338 100%); border: 1.5px solid rgba(192,200,216,0.5); animation-delay: 0.2s; }
    .podium-slot:nth-child(3) .podium-card { background: linear-gradient(160deg, #1a1008 0%, #2a1800 100%); border: 1.5px solid rgba(205,127,50,0.5); animation-delay: 0.15s; }

    .podium-glow {
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
    }
    .podium-slot:nth-child(1) .podium-glow { background: linear-gradient(90deg, transparent, var(--gold), transparent); }
    .podium-slot:nth-child(2) .podium-glow { background: linear-gradient(90deg, transparent, var(--silver), transparent); }
    .podium-slot:nth-child(3) .podium-glow { background: linear-gradient(90deg, transparent, var(--bronze), transparent); }

    .podium-badge {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; font-weight: 900; font-family: var(--font-d);
      position: absolute; top: 10px; right: 10px;
    }
    .podium-slot:nth-child(1) .podium-badge { background: var(--gold); color: #000; }
    .podium-slot:nth-child(2) .podium-badge { background: var(--silver); color: #000; }
    .podium-slot:nth-child(3) .podium-badge { background: var(--bronze); color: #fff; }

    .podium-avatar {
      width: clamp(56px, 8vw, 80px); height: clamp(56px, 8vw, 80px); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: clamp(1.5rem, 3vw, 2.2rem);
      position: relative;
    }
    .podium-slot:nth-child(1) .podium-avatar { background: radial-gradient(circle, #3a2e00, #1a1500); box-shadow: 0 0 24px rgba(255,215,0,0.3); border: 2px solid var(--gold); }
    .podium-slot:nth-child(2) .podium-avatar { background: radial-gradient(circle, #1e2a3e, #131f33); border: 2px solid rgba(192,200,216,0.4); }
    .podium-slot:nth-child(3) .podium-avatar { background: radial-gradient(circle, #2a1c0a, #1a1000); border: 2px solid rgba(205,127,50,0.4); }

    .crown { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); font-size: 1.2rem; }

    .podium-name { font-weight: 700; font-size: clamp(0.875rem, 2vw, 1rem); text-align: center; line-height: 1.2; }
    .podium-country { font-size: 0.75rem; color: var(--muted); text-align: center; }
    .podium-pts {
      font-family: var(--font-d); line-height: 1; text-align: center;
    }
    .podium-slot:nth-child(1) .podium-pts { font-size: clamp(2rem, 4vw, 3rem); color: var(--gold); }
    .podium-slot:nth-child(2) .podium-pts { font-size: clamp(1.5rem, 3vw, 2.2rem); color: var(--silver); }
    .podium-slot:nth-child(3) .podium-pts { font-size: clamp(1.5rem, 3vw, 2.2rem); color: var(--bronze); }

    .podium-pts-lbl { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6; }
    .podium-detail { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
    .p-chip {
      padding: 3px 8px; border-radius: 20px; font-size: 0.7rem; font-weight: 600;
      background: rgba(255,255,255,0.06); color: var(--fg-dim);
    }

    /* podium base (step) */
    .podium-step {
      width: 100%; border-radius: 0 0 var(--r-s) var(--r-s);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-d); font-size: 1.5rem; font-weight: 400; letter-spacing: 0.06em;
    }
    .podium-slot:nth-child(1) .podium-step { background: var(--gold); color: #000; height: clamp(40px,5vw,64px); }
    .podium-slot:nth-child(2) .podium-step { background: var(--silver); color: #000; height: clamp(28px,4vw,44px); }
    .podium-slot:nth-child(3) .podium-step { background: var(--bronze); color: #fff; height: clamp(24px,3.5vw,36px); }

    /* ordering: 2nd | 1st | 3rd */
    .podium { flex-direction: row; }
    .podium-slot--2 { order: 1; }
    .podium-slot--1 { order: 2; }
    .podium-slot--3 { order: 3; }

    /* ─── TABLE SECTION ─── */
    .table-section {
      padding: 0 clamp(16px, 6vw, 80px) 60px;
    }
    .section-header {
      display: flex; align-items: center; gap: 12px;
      padding: 20px 0 16px;
      border-top: 1px solid var(--border);
    }
    .section-title { font-family: var(--font-d); font-size: 1.4rem; letter-spacing: 0.06em; }
    .section-count { padding: 3px 10px; border-radius: 20px; background: var(--surface2); font-size: 0.75rem; color: var(--muted); font-weight: 600; }
    .section-spacer { flex: 1; }
    .filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .filter-btn {
      padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border);
      background: transparent; color: var(--muted); font-size: 0.8rem; font-family: var(--font-b); font-weight: 500;
      cursor: pointer; transition: all 0.15s;
    }
    .filter-btn:hover { border-color: var(--border2); color: var(--fg); }
    .filter-btn.active { background: var(--surface2); border-color: var(--border2); color: var(--fg); }

    /* Table */
    .rank-table { width: 100%; border-collapse: collapse; }
    .rank-table th {
      padding: 10px 12px; text-align: left; font-size: 0.7rem; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--muted); border-bottom: 1px solid var(--border); font-weight: 600;
    }
    .rank-table th.center { text-align: center; }
    .rank-table tbody tr {
      border-bottom: 1px solid var(--border);
      transition: background 0.15s;
      animation: fadeInRow 0.4s both;
    }
    @keyframes fadeInRow { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
    .rank-table tbody tr:hover { background: rgba(255,255,255,0.025); }
    .rank-table tbody tr.highlight-row { background: rgba(0,230,118,0.04); }
    .rank-table td { padding: 12px; vertical-align: middle; }
    .rank-table td.center { text-align: center; }

    /* Pos cell */
    .pos-cell { display: flex; align-items: center; gap: 8px; min-width: 48px; }
    .pos-num { font-family: var(--font-d); font-size: 1.1rem; color: var(--fg-dim); min-width: 22px; text-align: right; }
    .move { font-size: 0.65rem; font-weight: 700; padding: 2px 4px; border-radius: 3px; }
    .move.up { background: rgba(0,230,118,0.15); color: var(--green); }
    .move.down { background: rgba(255,82,82,0.15); color: var(--red); }
    .move.same { background: rgba(94,122,158,0.15); color: var(--muted); }

    /* Player cell */
    .player-cell { display: flex; align-items: center; gap: 10px; }
    .player-avatar {
      width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
      background: var(--surface2); border: 1px solid var(--border2);
    }
    .player-info { display: flex; flex-direction: column; }
    .player-name { font-weight: 600; font-size: 0.9rem; line-height: 1.2; }
    .player-meta { font-size: 0.75rem; color: var(--muted); }
    .player-tag {
      display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 700;
      margin-left: 5px;
    }
    .tag-you { background: rgba(0,230,118,0.15); color: var(--green); }
    .tag-admin { background: rgba(91,141,239,0.15); color: var(--blue); }

    /* Points cell */
    .pts-cell { font-family: var(--font-d); font-size: 1.2rem; color: var(--fg); }
    .pts-bar-wrap { margin-top: 4px; height: 3px; background: var(--border); border-radius: 2px; width: 80px; }
    .pts-bar { height: 3px; border-radius: 2px; background: var(--green); }

    /* Pred breakdown */
    .pred-cell { display: flex; flex-direction: column; gap: 3px; align-items: center; }
    .pred-exact { font-size: 0.875rem; font-weight: 700; color: var(--green); }
    .pred-winner { font-size: 0.75rem; color: var(--amber); }
    .pred-lbl { font-size: 0.65rem; color: var(--muted); }

    /* Status */
    .status-pill {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
    }
    .status-pill.active { background: rgba(0,230,118,0.12); color: var(--green); border: 1px solid rgba(0,230,118,0.25); }
    .status-pill.pending { background: rgba(255,179,0,0.12); color: var(--amber); border: 1px solid rgba(255,179,0,0.25); }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    /* last prediction */
    .last-pred { font-size: 0.8rem; color: var(--muted); font-style: italic; }

    /* ─── SECTION: My stats ─── */
    .my-stats-bar {
      margin: 0 clamp(16px, 6vw, 80px) 24px;
      padding: 16px 20px;
      background: var(--surface2); border: 1px solid var(--border2); border-radius: var(--r-l);
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
    }
    .ms-avatar { font-size: 1.8rem; }
    .ms-name { font-weight: 700; font-size: 1rem; }
    .ms-sub { font-size: 0.8rem; color: var(--muted); }
    .ms-spacer { flex: 1; }
    .ms-stats { display: flex; gap: 20px; flex-wrap: wrap; }
    .ms-stat { display: flex; flex-direction: column; align-items: center; gap: 1px; }
    .ms-val { font-family: var(--font-d); font-size: 1.6rem; line-height: 1; }
    .ms-val.green { color: var(--green); }
    .ms-val.gold { color: var(--gold); }
    .ms-val.blue { color: var(--blue); }
    .ms-lbl { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.09em; color: var(--muted); }
    .ms-cta {
      padding: 9px 20px; background: var(--green); color: #000; border: none;
      border-radius: var(--r-s); font-size: 0.875rem; font-weight: 700; cursor: pointer;
      font-family: var(--font-b); transition: background 0.15s; white-space: nowrap;
    }
    .ms-cta:hover { background: var(--green-d); }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 640px) {
      .podium { gap: 6px; }
      .rank-table th.hide-sm, .rank-table td.hide-sm { display: none; }
      .pts-bar-wrap { display: none; }
      .my-stats-bar { flex-direction: column; text-align: center; }
      .ms-spacer { display: none; }
      .ms-stats { justify-content: center; }
      .filter-row { display: none; }
      .section-header { flex-wrap: wrap; }
    }
    @media (min-width: 641px) and (max-width: 900px) {
      .rank-table th.hide-md, .rank-table td.hide-md { display: none; }
    }
  </style>
</head>
<body>
  <!-- HEADER -->
  <header class="app-header">
    <a href="index.html" class="h-back">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Inicio
    </a>
    <div class="h-divider"></div>
    <a href="index.html" class="h-logo">
      <span class="h-logo-icon">⚽</span>
      <span class="h-logo-text">PRODE<em>2026</em></span>
    </a>
    <div class="h-divider"></div>
    <span class="h-title">TABLA DE POSICIONES</span>
    <div class="h-right">
      <div class="h-live-dot"></div>
      <span class="h-date" id="liveDate">Actualizado ahora</span>
    </div>
  </header>

  <div class="page">

    <!-- HERO STRIP -->
    <div class="hero-strip">
      <div class="hero-eyebrow">Quiniela Prode 2026 · Jornada 3</div>
      <div class="hero-title">🏆 RANKING GENERAL</div>
      <div class="hero-sub">Posiciones después de 18 partidos. Siguiente actualización tras el cierre del día.</div>
      <div class="hero-stats">
        <div class="h-stat">
          <div class="h-stat-val" id="totalParticipants">24</div>
          <div class="h-stat-lbl">Participantes</div>
        </div>
        <div class="h-stat">
          <div class="h-stat-val">18</div>
          <div class="h-stat-lbl">Partidos jugados</div>
        </div>
        <div class="h-stat">
          <div class="h-stat-val" style="color:var(--gold)">86</div>
          <div class="h-stat-lbl">Puntos del líder</div>
        </div>
        <div class="h-stat">
          <div class="h-stat-val">104</div>
          <div class="h-stat-lbl">Total partidos</div>
        </div>
      </div>
    </div>

    <!-- PODIUM -->
    <div class="podium-section">
      <div class="podium-label">Top 3 Líderes</div>

      <div class="podium">

        <!-- 2nd PLACE -->
        <div class="podium-slot podium-slot--2">
          <div class="podium-card">
            <div class="podium-glow"></div>
            <div class="podium-badge">2</div>
            <div class="podium-avatar">🦁</div>
            <div class="podium-name">Valentina Cruz</div>
            <div class="podium-country">🇲🇽 México</div>
            <div class="podium-pts">79<br><span class="podium-pts-lbl">puntos</span></div>
            <div class="podium-detail">
              <span class="p-chip">✓✓ 11 exactos</span>
              <span class="p-chip">18 pronóst.</span>
            </div>
          </div>
          <div class="podium-step">2°</div>
        </div>

        <!-- 1st PLACE -->
        <div class="podium-slot podium-slot--1">
          <div class="podium-card">
            <div class="podium-glow"></div>
            <div class="podium-badge">1</div>
            <div class="podium-avatar">
              <div class="crown">👑</div>
              🦅
            </div>
            <div class="podium-name">Carlos Mendoza</div>
            <div class="podium-country">🇺🇸 USA</div>
            <div class="podium-pts">86<br><span class="podium-pts-lbl">puntos</span></div>
            <div class="podium-detail">
              <span class="p-chip">✓✓ 14 exactos</span>
              <span class="p-chip">18 pronóst.</span>
            </div>
          </div>
          <div class="podium-step">1°</div>
        </div>

        <!-- 3rd PLACE -->
        <div class="podium-slot podium-slot--3">
          <div class="podium-card">
            <div class="podium-glow"></div>
            <div class="podium-badge">3</div>
            <div class="podium-avatar">🐉</div>
            <div class="podium-name">André Lima</div>
            <div class="podium-country">🇧🇷 Brasil</div>
            <div class="podium-pts">74<br><span class="podium-pts-lbl">puntos</span></div>
            <div class="podium-detail">
              <span class="p-chip">✓✓ 10 exactos</span>
              <span class="p-chip">17 pronóst.</span>
            </div>
          </div>
          <div class="podium-step">3°</div>
        </div>

      </div>
    </div>

    <!-- MY STATS BAR (logged-in user, pos #7) -->
    <div class="my-stats-bar">
      <div class="ms-avatar">🐯</div>
      <div>
        <div class="ms-name">Tu posición — Rodrigo A. <span class="player-tag tag-you">TÚ</span></div>
        <div class="ms-sub">🇵🇦 Panamá · Activo ✓</div>
      </div>
      <div class="ms-spacer"></div>
      <div class="ms-stats">
        <div class="ms-stat"><div class="ms-val green">58</div><div class="ms-lbl">Puntos</div></div>
        <div class="ms-stat"><div class="ms-val gold">#7</div><div class="ms-lbl">Posición</div></div>
        <div class="ms-stat"><div class="ms-val blue">7</div><div class="ms-lbl">Exactos</div></div>
        <div class="ms-stat"><div class="ms-val">18/18</div><div class="ms-lbl">Pronóst.</div></div>
      </div>
      <button class="ms-cta" onclick="window.location='dashboard.html'">Ver mis pronósticos →</button>
    </div>

    <!-- TABLE SECTION -->
    <div class="table-section">
      <div class="section-header">
        <div class="section-title">POSICIONES 4 – 24</div>
        <span class="section-count">21 jugadores</span>
        <div class="section-spacer"></div>
        <div class="filter-row">
          <button class="filter-btn active" onclick="setFilter('all',this)">Todos</button>
          <button class="filter-btn" onclick="setFilter('activo',this)">Activos</button>
          <button class="filter-btn" onclick="setFilter('pendiente',this)">Pendiente pago</button>
        </div>
      </div>

      <table class="rank-table">
        <thead>
          <tr>
            <th style="width:60px">#</th>
            <th>Jugador</th>
            <th class="center">Puntos</th>
            <th class="center hide-sm">Exactos</th>
            <th class="center hide-sm">Ganador</th>
            <th class="center hide-md">Pronóst.</th>
            <th class="center hide-sm">Estado</th>
          </tr>
        </thead>
        <tbody id="rankBody"></tbody>
      </table>
    </div>

  </div>

  <script>
    const players = [
      { pos:4,  prev:5,  name:"Sofía Torres",      country:"🇦🇷", avatar:"🦊", pts:68, exact:9,  winner:4, total:18, status:"activo",   you:false },
      { pos:5,  prev:3,  name:"Nicolás Herrera",   country:"🇨🇴", avatar:"🦅", pts:65, exact:8,  winner:5, total:18, status:"activo",   you:false },
      { pos:6,  prev:6,  name:"Isabella Martín",   country:"🇪🇸", avatar:"💫", pts:62, exact:8,  winner:4, total:17, status:"activo",   you:false },
      { pos:7,  prev:9,  name:"Rodrigo A.",         country:"🇵🇦", avatar:"🐯", pts:58, exact:7,  winner:5, total:18, status:"activo",   you:true  },
      { pos:8,  prev:7,  name:"Lucía Fernández",   country:"🇺🇾", avatar:"🌊", pts:55, exact:7,  winner:4, total:17, status:"activo",   you:false },
      { pos:9,  prev:8,  name:"Diego Ramírez",     country:"🇲🇽", avatar:"🐍", pts:53, exact:6,  winner:6, total:18, status:"activo",   you:false },
      { pos:10, prev:12, name:"Camila Rosas",       country:"🇨🇱", avatar:"🌺", pts:51, exact:6,  winner:5, total:16, status:"activo",   you:false },
      { pos:11, prev:10, name:"Mateo Guzmán",       country:"🇧🇴", avatar:"🦋", pts:49, exact:6,  winner:4, total:17, status:"pendiente",you:false },
      { pos:12, prev:11, name:"Ana García",         country:"🇻🇪", avatar:"🌸", pts:47, exact:5,  winner:6, total:18, status:"activo",   you:false },
      { pos:13, prev:15, name:"Pablo Suárez",       country:"🇵🇪", avatar:"🦜", pts:44, exact:5,  winner:5, total:15, status:"activo",   you:false },
      { pos:14, prev:13, name:"Elena Moreno",       country:"🇵🇦", avatar:"🌴", pts:42, exact:5,  winner:4, total:18, status:"activo",   you:false },
      { pos:15, prev:14, name:"Sebastián V.",       country:"🇺🇸", avatar:"🦁", pts:40, exact:4,  winner:6, total:16, status:"activo",   you:false },
      { pos:16, prev:18, name:"Catalina López",     country:"🇨🇷", avatar:"🦋", pts:38, exact:4,  winner:5, total:14, status:"activo",   you:false },
      { pos:17, prev:16, name:"Javier Núñez",       country:"🇪🇨", avatar:"🐊", pts:36, exact:4,  winner:4, total:17, status:"pendiente",you:false },
      { pos:18, prev:17, name:"Mariana Castro",     country:"🇧🇷", avatar:"🌻", pts:33, exact:3,  winner:6, total:15, status:"activo",   you:false },
      { pos:19, prev:20, name:"Adrián Pérez",       country:"🇲🇽", avatar:"🔥", pts:30, exact:3,  winner:5, total:13, status:"activo",   you:false },
      { pos:20, prev:19, name:"Rosa Jiménez",       country:"🇨🇴", avatar:"🌹", pts:28, exact:3,  winner:4, total:16, status:"pendiente",you:false },
      { pos:21, prev:21, name:"Fernando Gil",       country:"🇦🇷", avatar:"⚡", pts:25, exact:2,  winner:5, total:12, status:"activo",   you:false },
      { pos:22, prev:22, name:"Valeria Ruiz",       country:"🇵🇦", avatar:"🌟", pts:22, exact:2,  winner:4, total:14, status:"activo",   you:false },
      { pos:23, prev:24, name:"Cristian Vega",      country:"🇨🇱", avatar:"🐺", pts:18, exact:1,  winner:5, total:11, status:"pendiente",you:false },
      { pos:24, prev:23, name:"Laura Díaz",         country:"🇻🇪", avatar:"🦄", pts:12, exact:1,  winner:3, total:9,  status:"pendiente",you:false },
    ];

    const maxPts = 86;
    let currentFilter = 'all';

    function setFilter(f, btn) {
      currentFilter = f;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTable();
    }

    function renderTable() {
      const body = document.getElementById('rankBody');
      const filtered = currentFilter === 'all' ? players : players.filter(p => p.status === currentFilter);

      body.innerHTML = filtered.map((p, i) => {
        const delta = p.prev - p.pos;
        let moveHtml = '';
        if (delta > 0) moveHtml = `<span class="move up">▲${delta}</span>`;
        else if (delta < 0) moveHtml = `<span class="move down">▼${Math.abs(delta)}</span>`;
        else moveHtml = `<span class="move same">—</span>`;

        const pct = Math.round((p.pts / maxPts) * 100);
        const barColor = p.you ? 'var(--blue)' : p.pos <= 10 ? 'var(--green)' : 'var(--border2)';
        const youTag = p.you ? `<span class="player-tag tag-you">TÚ</span>` : '';

        return `
          <tr class="${p.you ? 'highlight-row' : ''}" style="animation-delay:${i*0.03}s">
            <td>
              <div class="pos-cell">
                <div class="pos-num">${p.pos}</div>
                ${moveHtml}
              </div>
            </td>
            <td>
              <div class="player-cell">
                <div class="player-avatar">${p.avatar}</div>
                <div class="player-info">
                  <span class="player-name">${p.name}${youTag}</span>
                  <span class="player-meta">${p.country}</span>
                </div>
              </div>
            </td>
            <td class="center">
              <div class="pts-cell">${p.pts}</div>
              <div class="pts-bar-wrap"><div class="pts-bar" style="width:${pct}%;background:${barColor}"></div></div>
            </td>
            <td class="center hide-sm">
              <div class="pred-cell">
                <span class="pred-exact">${p.exact}</span>
                <span class="pred-lbl">exactos</span>
              </div>
            </td>
            <td class="center hide-sm">
              <div class="pred-cell">
                <span class="pred-winner" style="color:var(--amber)">${p.winner}</span>
                <span class="pred-lbl">ganador</span>
              </div>
            </td>
            <td class="center hide-md">
              <span class="last-pred">${p.total}/18</span>
            </td>
            <td class="center hide-sm">
              <span class="status-pill ${p.status}">
                <span class="status-dot"></span>
                ${p.status === 'activo' ? 'Activo' : 'Pendiente'}
              </span>
            </td>
          </tr>`;
      }).join('');
    }

    // Update date
    const now = new Date();
    document.getElementById('liveDate').textContent = `Hoy ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

    renderTable();
  </script>
</body>
</html>
