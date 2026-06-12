<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prode 2026 — Super Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg:#07101D; --surface:#0D1A2D; --surface2:#152338; --surface3:#1B2D47;
      --fg:#E8F0FF; --fg-dim:#C5D2EE; --muted:#5E7A9E;
      --border:#1C2E48; --border2:#253B5E;
      --green:#00E676; --gold:#FFD700; --red:#FF5252; --amber:#FFB300; --blue:#5B8DEF;
      --purple:#A855F7;
      --sidebar-w:224px;
      --font-d:'Bebas Neue',Impact,sans-serif;
      --font-b:'Inter',-apple-system,system-ui,sans-serif;
      --r-s:6px; --r-m:10px; --r-l:14px;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%}
    body{background:var(--bg);color:var(--fg);font-family:var(--font-b);overflow-x:hidden}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}

    /* ── LOGIN GATE ── */
    .gate{position:fixed;inset:0;background:rgba(7,16,29,0.97);z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px}
    .gate-box{background:var(--surface);border:1px solid var(--border2);border-radius:20px;padding:40px 36px;width:100%;max-width:360px;text-align:center;display:flex;flex-direction:column;gap:18px}
    .gate-icon{font-size:2.8rem}
    .gate-title{font-family:var(--font-d);font-size:1.9rem;letter-spacing:.04em}
    .gate-title span{color:var(--purple)}
    .gate-sub{color:var(--muted);font-size:.8125rem}
    .pin-row{display:flex;justify-content:center;gap:12px}
    .pin-dot{width:16px;height:16px;border-radius:50%;border:2px solid var(--border2);background:transparent;transition:all .15s}
    .pin-dot.filled{background:var(--purple);border-color:var(--purple)}
    .pin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .pin-btn{padding:14px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);color:var(--fg);font-size:1.1rem;font-weight:600;cursor:pointer;transition:all .15s;font-family:var(--font-b)}
    .pin-btn:hover{background:var(--surface3);border-color:var(--border2)}
    .pin-btn.del{color:var(--red)}
    .pin-err{color:var(--red);font-size:.8125rem;min-height:18px}
    .pin-hint{color:var(--muted);font-size:.75rem}
    .pin-hint strong{color:var(--fg)}

    /* ── LAYOUT ── */
    .layout{display:flex;min-height:100vh}

    /* Sidebar */
    .sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:100}
    .sb-head{padding:18px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
    .sb-logo{font-family:var(--font-d);font-size:1.3rem}
    .sb-logo em{font-style:normal;color:var(--green)}
    .sb-adm{font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;background:rgba(168,85,247,.15);color:var(--purple);border:1px solid rgba(168,85,247,.3);padding:3px 8px;border-radius:20px;margin-left:auto}
    .sb-nav{flex:1;padding:10px 8px;display:flex;flex-direction:column;gap:2px;overflow-y:auto}
    .sb-btn{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--r-m);color:var(--muted);font-size:.875rem;font-weight:500;cursor:pointer;transition:all .15s;border:none;background:transparent;text-align:left;width:100%}
    .sb-btn:hover{color:var(--fg);background:rgba(255,255,255,.04)}
    .sb-btn.active{color:var(--fg);background:var(--surface2)}
    .sb-btn .sb-ico{font-size:1rem;flex-shrink:0}
    .sb-cnt{margin-left:auto;background:var(--red);color:#fff;font-size:.65rem;font-weight:800;padding:2px 6px;border-radius:10px}
    .sb-foot{padding:12px 16px;border-top:1px solid var(--border)}
    .sb-user{display:flex;align-items:center;gap:10px}
    .sb-av{width:32px;height:32px;border-radius:50%;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0}
    .sb-name{font-size:.8125rem;font-weight:600}
    .sb-role{font-size:.7rem;color:var(--purple);text-transform:uppercase;letter-spacing:.06em}
    .logout{margin-left:auto;padding:5px 10px;background:transparent;border:1px solid var(--border);border-radius:var(--r-s);color:var(--muted);font-size:.75rem;cursor:pointer;transition:all .15s}
    .logout:hover{border-color:var(--red);color:var(--red)}

    /* Main */
    .main{flex:1;margin-left:var(--sidebar-w);padding:28px;min-height:100vh}
    .panel{display:none}
    .panel.on{display:block}

    /* Mobile topbar */
    .topbar{display:none;position:fixed;top:0;left:0;right:0;height:56px;z-index:200;background:rgba(7,16,29,.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:0 16px;align-items:center;gap:12px}
    .hbg{background:none;border:none;color:var(--fg);font-size:1.2rem;cursor:pointer;padding:4px}
    .mob-logo{font-family:var(--font-d);font-size:1.3rem}
    .mob-logo em{font-style:normal;color:var(--green)}
    .overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:90}

    /* Page header */
    .ph{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:24px;flex-wrap:wrap}
    .pt{font-family:var(--font-d);font-size:2rem;letter-spacing:.03em}
    .ps{color:var(--muted);font-size:.8125rem;margin-top:2px}

    /* Card */
    .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-l);padding:20px}
    .card+.card,.card+.mt{margin-top:16px}
    .mt{margin-top:16px}
    .ct{font-size:.8125rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:16px}

    /* Buttons */
    .btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:var(--r-m);font-size:.875rem;font-weight:600;cursor:pointer;transition:all .18s;border:none;font-family:var(--font-b)}
    .btn-g{background:var(--green);color:#000}.btn-g:hover{background:#00c853}
    .btn-p{background:var(--purple);color:#fff}.btn-p:hover{background:#9333ea}
    .btn-o{background:transparent;border:1px solid var(--border2);color:var(--fg-dim)}.btn-o:hover{border-color:var(--fg);color:var(--fg)}
    .btn-d{background:rgba(255,82,82,.1);border:1px solid rgba(255,82,82,.3);color:var(--red)}.btn-d:hover{background:rgba(255,82,82,.2)}
    .btn-y{background:var(--gold);color:#000}.btn-y:hover{background:#e6c200}
    .btn-sm{padding:6px 12px;font-size:.8125rem}

    /* Stats */
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px}
    .sbox{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);padding:16px}
    .sv{font-family:var(--font-d);font-size:2rem;line-height:1}
    .sl{color:var(--muted);font-size:.75rem;text-transform:uppercase;letter-spacing:.07em;margin-top:4px}

    /* Badge */
    .bx{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:.75rem;font-weight:600}
    .bx-g{background:rgba(0,230,118,.1);color:var(--green);border:1px solid rgba(0,230,118,.2)}
    .bx-a{background:rgba(255,179,0,.1);color:var(--amber);border:1px solid rgba(255,179,0,.25)}
    .bx-r{background:rgba(255,82,82,.1);color:var(--red);border:1px solid rgba(255,82,82,.2)}
    .bx-b{background:rgba(91,141,239,.1);color:var(--blue);border:1px solid rgba(91,141,239,.2)}
    .bx-p{background:rgba(168,85,247,.1);color:var(--purple);border:1px solid rgba(168,85,247,.2)}

    /* Table */
    .tw{overflow-x:auto;-webkit-overflow-scrolling:touch}
    table{width:100%;border-collapse:collapse;min-width:580px}
    th{padding:10px 12px;text-align:left;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);border-bottom:1px solid var(--border);white-space:nowrap}
    td{padding:12px;border-bottom:1px solid rgba(28,46,72,.5);font-size:.875rem;vertical-align:middle}
    tr:last-child td{border-bottom:none}
    tr:hover td{background:rgba(255,255,255,.02)}

    /* Score inputs */
    .sw{display:flex;align-items:center;gap:8px}
    .ti{display:flex;align-items:center;gap:7px}
    .tf{font-size:1.2rem}
    .tn{font-weight:500;font-size:.875rem;white-space:nowrap}
    .si{width:44px;height:38px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-s);color:var(--fg);font-size:1.1rem;font-weight:700;text-align:center;font-family:var(--font-b);transition:border-color .15s}
    .si:focus{outline:none;border-color:var(--green)}
    .ss{color:var(--muted);font-weight:700}

    /* Form */
    .fr{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
    .fg{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
    .fg:last-child{margin-bottom:0}
    .fl{font-size:.8125rem;font-weight:600;color:var(--fg-dim)}
    .fi,.fsel,.fta{background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-m);color:var(--fg);padding:10px 14px;font-size:.875rem;font-family:var(--font-b);transition:border-color .15s;width:100%}
    .fi:focus,.fsel:focus,.fta:focus{outline:none;border-color:var(--blue)}
    .fta{resize:vertical;min-height:100px}
    .fh{font-size:.75rem;color:var(--muted)}

    /* Rule card */
    .rc{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);padding:16px 20px;display:flex;align-items:center;gap:16px;margin-bottom:10px}
    .ri{font-size:1.4rem}
    .rn{font-weight:600;font-size:.9375rem}
    .rd{font-size:.8125rem;color:var(--muted);margin-top:2px}
    .rp{display:flex;align-items:center;gap:8px}
    .pi{width:60px;height:38px;background:var(--surface3);border:1px solid var(--border2);border-radius:var(--r-s);color:var(--gold);font-size:1.2rem;font-weight:700;text-align:center;font-family:var(--font-d);transition:border-color .15s}
    .pi:focus{outline:none;border-color:var(--gold)}
    .pl{font-size:.8125rem;color:var(--muted)}

    /* Toggle */
    .tog{position:relative;display:inline-block;width:42px;height:24px}
    .tog input{opacity:0;width:0;height:0}
    .tslide{position:absolute;inset:0;background:var(--surface3);border-radius:12px;cursor:pointer;transition:all .2s;border:1px solid var(--border2)}
    .tslide::before{content:'';position:absolute;width:18px;height:18px;left:2px;top:2px;background:var(--muted);border-radius:50%;transition:all .2s}
    .tog input:checked+.tslide{background:rgba(0,230,118,.15);border-color:rgba(0,230,118,.4)}
    .tog input:checked+.tslide::before{transform:translateX(18px);background:var(--green)}

    /* Rank */
    .rpos{font-family:var(--font-d);font-size:1.25rem;width:36px;text-align:center}
    .rpos.g{color:var(--gold)}.rpos.s{color:#A8B8C8}.rpos.b{color:#CD7F32}
    .uc{display:flex;align-items:center;gap:10px}
    .uav{width:34px;height:34px;border-radius:50%;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
    .un{font-weight:600;font-size:.875rem}
    .ue{font-size:.75rem;color:var(--muted)}

    /* Notif match */
    .nm{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);padding:14px 16px;margin-bottom:10px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
    .nmt{font-weight:600;font-size:.9375rem}
    .nmc{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
    .miss{background:rgba(255,82,82,.1);color:var(--red);border:1px solid rgba(255,82,82,.2);padding:3px 10px;border-radius:20px;font-size:.8125rem;font-weight:600}
    .nchk{width:18px;height:18px;accent-color:var(--purple);cursor:pointer;flex-shrink:0}

    /* Motor */
    .ms{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);padding:18px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:16px}
    .mdot{width:12px;height:12px;border-radius:50%;flex-shrink:0}
    .mdot.idle{background:var(--muted)}
    .mdot.run{background:var(--amber);animation:pulse 1.5s infinite}
    .mdot.done{background:var(--green)}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 3px rgba(255,179,0,.2)}50%{box-shadow:0 0 0 6px rgba(255,179,0,.08)}}

    /* Progress */
    .pb{height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-top:8px}
    .pf{height:100%;border-radius:3px;background:var(--green);transition:width .5s}

    /* Search */
    .sr{position:relative}
    .si2{width:100%;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-m);color:var(--fg);padding:10px 14px 10px 36px;font-size:.875rem;font-family:var(--font-b);transition:border-color .15s}
    .si2:focus{outline:none;border-color:var(--blue)}
    .sico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:.875rem}

    /* Toast */
    .toast{position:fixed;bottom:24px;right:24px;background:var(--surface3);border:1px solid var(--border2);border-radius:var(--r-l);padding:13px 18px;font-size:.875rem;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,.4);display:flex;align-items:center;gap:10px;transform:translateY(80px);opacity:0;transition:all .3s;z-index:500;max-width:320px}
    .toast.show{transform:translateY(0);opacity:1}
    .toast.ok{border-color:rgba(0,230,118,.3)}

    /* Flex utils */
    .fx{display:flex}.fxc{align-items:center}.gap8{gap:8px}.gap12{gap:12px}.gap16{gap:16px}.ml{margin-left:auto}.wrap{flex-wrap:wrap}

    /* Log box */
    .log{background:var(--surface2);border-radius:var(--r-m);padding:14px;font-size:.8125rem;font-family:monospace;color:var(--muted);line-height:1.8;max-height:180px;overflow-y:auto}

    /* Toggle row */
    .trow{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-m);padding:14px 18px;display:flex;align-items:center;gap:14px;margin-bottom:10px}
    .trinfo{flex:1}
    .trn{font-weight:600;font-size:.875rem}
    .trd{font-size:.75rem;color:var(--muted);margin-top:2px}

    /* Responsive */
    @media(max-width:768px){
      .topbar{display:flex}
      .sidebar{transform:translateX(calc(-1 * var(--sidebar-w)));transition:transform .25s}
      .sidebar.open{transform:translateX(0)}
      .overlay.open{display:block}
      .main{margin-left:0;padding:72px 14px 24px}
      .fr{grid-template-columns:1fr}
      .stats{grid-template-columns:repeat(2,1fr)}
      .ph{flex-direction:column;gap:12px}
      .ms{flex-direction:column;align-items:flex-start}
    }
  </style>
</head>
<body>

<!-- LOGIN GATE -->
<div class="gate" id="gate">
  <div class="gate-box">
    <div class="gate-icon">🔐</div>
    <div class="gate-title">SUPER <span>ADMIN</span></div>
    <p class="gate-sub">Ingresa el PIN de administrador para continuar</p>
    <div class="pin-row">
      <div class="pin-dot" id="d0"></div>
      <div class="pin-dot" id="d1"></div>
      <div class="pin-dot" id="d2"></div>
      <div class="pin-dot" id="d3"></div>
    </div>
    <p class="pin-err" id="perr"></p>
    <div class="pin-grid">
      <button class="pin-btn" onclick="pp('1')">1</button>
      <button class="pin-btn" onclick="pp('2')">2</button>
      <button class="pin-btn" onclick="pp('3')">3</button>
      <button class="pin-btn" onclick="pp('4')">4</button>
      <button class="pin-btn" onclick="pp('5')">5</button>
      <button class="pin-btn" onclick="pp('6')">6</button>
      <button class="pin-btn" onclick="pp('7')">7</button>
      <button class="pin-btn" onclick="pp('8')">8</button>
      <button class="pin-btn" onclick="pp('9')">9</button>
      <button class="pin-btn del" onclick="pp('del')">⌫</button>
      <button class="pin-btn" onclick="pp('0')">0</button>
      <button class="pin-btn" onclick="pp('ok')">OK</button>
    </div>
    <p class="pin-hint">Demo PIN: <strong>2026</strong></p>
  </div>
</div>

<!-- MOBILE TOPBAR -->
<div class="topbar">
  <button class="hbg" onclick="toggleSB()">☰</button>
  <div class="mob-logo">PRODE<em>2026</em></div>
  <span class="bx bx-p" style="margin-left:auto;font-size:.65rem">ADMIN</span>
</div>
<div class="overlay" id="overlay" onclick="closeSB()"></div>

<!-- LAYOUT -->
<div class="layout">

  <!-- SIDEBAR -->
  <nav class="sidebar" id="sidebar">
    <div class="sb-head">
      <div class="sb-logo">PRODE<em>2026</em></div>
      <span class="sb-adm">ADMIN</span>
    </div>
    <div class="sb-nav">
      <button class="sb-btn active" onclick="go('marcadores',this)"><span class="sb-ico">🏟️</span>Marcadores</button>
      <button class="sb-btn" onclick="go('reglas',this)"><span class="sb-ico">📋</span>Reglas</button>
      <button class="sb-btn" onclick="go('calendario',this)"><span class="sb-ico">📅</span>Calendario</button>
      <button class="sb-btn" onclick="go('ranking',this)"><span class="sb-ico">🏆</span>Ranking</button>
      <button class="sb-btn" onclick="go('notif',this)"><span class="sb-ico">📨</span>Notificaciones<span class="sb-cnt">3</span></button>
      <button class="sb-btn" onclick="go('motor',this)"><span class="sb-ico">📊</span>Motor de Puntos</button>
    </div>
    <div class="sb-foot">
      <div class="sb-user">
        <div class="sb-av">👑</div>
        <div><div class="sb-name">Super Admin</div><div class="sb-role">Organizador</div></div>
        <button class="logout" onclick="logout()">Salir</button>
      </div>
    </div>
  </nav>

  <!-- MAIN -->
  <main class="main">

    <!-- ═══ MARCADORES ═══ -->
    <section class="panel on" id="panel-marcadores">
      <div class="ph">
        <div><div class="pt">🏟️ Marcadores</div><div class="ps">Ingresa resultados oficiales al finalizar cada partido</div></div>
        <div class="fx gap8">
          <button class="btn btn-o btn-sm" onclick="toast('🔍','Mostrando todos los partidos','')">Todos</button>
          <button class="btn btn-o btn-sm" onclick="toast('📅','Filtrando: hoy','')">Hoy</button>
          <button class="btn btn-y btn-sm" onclick="runEngine('motorDot','motorState','engineBtn')">⚡ Calcular Puntos</button>
        </div>
      </div>

      <div class="stats">
        <div class="sbox"><div class="sv" style="color:var(--muted)">8</div><div class="sl">Pendientes hoy</div></div>
        <div class="sbox"><div class="sv" style="color:var(--green)">23</div><div class="sl">Finalizados</div></div>
        <div class="sbox"><div class="sv" style="color:var(--amber)">2</div><div class="sl">En vivo</div></div>
        <div class="sbox"><div class="sv" style="color:var(--blue)">104</div><div class="sl">Total partidos</div></div>
      </div>

      <div class="card">
        <div class="ct">Partidos de hoy — 11 Jun 2026</div>
        <div class="tw"><table>
          <thead><tr><th>Local</th><th>Marcador</th><th>Visitante</th><th>Hora</th><th>Sede</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody id="mtb"></tbody>
        </table></div>
      </div>

      <div class="card mt">
        <div class="ct">Motor de puntuación</div>
        <div class="ms">
          <div class="mdot idle" id="motorDot"></div>
          <div>
            <div style="font-weight:600;font-size:.9375rem">Estado: <span id="motorState">Inactivo</span></div>
            <div style="font-size:.8125rem;color:var(--muted)">Último cálculo: <span id="lastCalc">Hoy 08:45 AM · 23 partidos</span></div>
          </div>
          <div class="ml fx gap8">
            <button class="btn btn-o btn-sm" onclick="toggleLog()">Ver log</button>
            <button class="btn btn-y btn-sm" id="engineBtn" onclick="runEngine('motorDot','motorState','engineBtn')">⚡ Ejecutar</button>
          </div>
        </div>
        <div id="calcLog" style="display:none;margin-top:10px">
          <div class="log">
            <span style="color:var(--green)">[OK]</span> 08:45:07 — Motor completado. 23 partidos · 342 pts distribuidos<br>
            <span style="color:var(--green)">[OK]</span> 08:45:05 — USA 4-0 PAN: 7 exactos / 18 dif / 19 ganador<br>
            <span style="color:var(--green)">[OK]</span> 08:45:03 — MEX 2-1 CAN: 12 exactos / 9 dif / 18 ganador<br>
            <span style="color:var(--blue)">[INF]</span> 08:45:01 — Reglas cargadas: exacto=3pts, dif=2pts, ganador=1pt
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ REGLAS ═══ -->
    <section class="panel" id="panel-reglas">
      <div class="ph">
        <div><div class="pt">📋 Reglas del Torneo</div><div class="ps">Configura el sistema de puntuación y políticas de la quiniela</div></div>
        <button class="btn btn-g" onclick="saveRules()">💾 Guardar cambios</button>
      </div>

      <div class="card">
        <div class="ct">Sistema de Puntuación</div>
        <div class="rc"><div class="ri">🎯</div><div style="flex:1"><div class="rn">Resultado Exacto</div><div class="rd">Acierta el marcador exacto (ej: 2-1 correcto)</div></div><div class="rp"><input type="number" class="pi" value="3" min="0" max="10" id="pts-exact"><span class="pl">pts</span></div></div>
        <div class="rc"><div class="ri">⚖️</div><div style="flex:1"><div class="rn">Ganador + Diferencia</div><div class="rd">Acierta el ganador y la diferencia exacta de goles</div></div><div class="rp"><input type="number" class="pi" value="2" min="0" max="10" id="pts-diff"><span class="pl">pts</span></div></div>
        <div class="rc"><div class="ri">✅</div><div style="flex:1"><div class="rn">Solo Ganador Correcto</div><div class="rd">Acierta quién gana, sin importar el marcador</div></div><div class="rp"><input type="number" class="pi" value="1" min="0" max="10" id="pts-win"><span class="pl">pts</span></div></div>
        <div class="rc"><div class="ri">🤝</div><div style="flex:1"><div class="rn">Empate Exacto</div><div class="rd">Predice empate y el partido termina en empate</div></div><div class="rp"><input type="number" class="pi" value="3" min="0" max="10" id="pts-draw"><span class="pl">pts</span></div></div>
        <div class="rc" style="border-color:rgba(255,215,0,.2);background:rgba(255,215,0,.04)">
          <div class="ri">🌟</div><div style="flex:1"><div class="rn">Comodín (multiplicador)</div><div class="rd">Multiplica los puntos en el partido marcado como comodín</div></div>
          <div class="rp"><input type="number" class="pi" value="2" min="1" max="5" id="pts-com" style="color:var(--gold)"><span class="pl">×</span></div>
        </div>
      </div>

      <div class="card">
        <div class="ct">Políticas de Predicción</div>
        <div class="fr">
          <div class="fg"><label class="fl">Cierre de predicciones (horas antes del partido)</label><input type="number" class="fi" value="1" min="0" max="24"><span class="fh">Se bloquean automáticamente N horas antes del inicio</span></div>
          <div class="fg"><label class="fl">Precio de inscripción (B/.)</label><input type="number" class="fi" value="15" min="0" step="5"><span class="fh">Se muestra en el módulo de pagos Yappy</span></div>
        </div>
        <div class="fr">
          <div class="fg"><label class="fl">Nombre de la quiniela</label><input type="text" class="fi" value="Prode 2026"></div>
          <div class="fg"><label class="fl">Número de Yappy para cobros</label><input type="text" class="fi" value="+507 6XXX-XXXX"><span class="fh">Se muestra a los participantes en el módulo de pagos</span></div>
        </div>
        <div class="fg"><label class="fl">Mensaje de bienvenida</label><textarea class="fta">¡Bienvenido a Prode 2026! Predice los resultados del Mundial y gana puntos. El ganador recibe el 60% del pozo acumulado.</textarea></div>
      </div>

      <div class="card">
        <div class="ct">Controles del Torneo</div>
        <div class="trow"><div class="trinfo"><div class="trn">Inscripciones abiertas</div><div class="trd">Permite nuevos registros de participantes</div></div><label class="tog"><input type="checkbox" checked><span class="tslide"></span></label></div>
        <div class="trow"><div class="trinfo"><div class="trn">Ranking público visible</div><div class="trd">Los participantes pueden ver la tabla de posiciones</div></div><label class="tog"><input type="checkbox" checked><span class="tslide"></span></label></div>
        <div class="trow"><div class="trinfo"><div class="trn">Modo mantenimiento</div><div class="trd">Bloquea el acceso de usuarios normales</div></div><label class="tog"><input type="checkbox"><span class="tslide"></span></label></div>
        <div class="trow"><div class="trinfo"><div class="trn">Notificaciones automáticas</div><div class="trd">Envía recordatorios automáticos 3h antes del cierre</div></div><label class="tog"><input type="checkbox" checked><span class="tslide"></span></label></div>
      </div>
    </section>

    <!-- ═══ CALENDARIO ═══ -->
    <section class="panel" id="panel-calendario">
      <div class="ph">
        <div><div class="pt">📅 Calendario</div><div class="ps">104 partidos — gestión de estados y resultados rápidos</div></div>
        <div class="sr" style="width:210px"><span class="sico">🔍</span><input class="si2" placeholder="Buscar selección…" oninput="filterCal(this.value)"></div>
      </div>
      <div class="fx gap8 wrap" style="margin-bottom:16px">
        <button class="btn btn-o btn-sm" onclick="calPhase('Grupos (72)')">Grupos (72)</button>
        <button class="btn btn-o btn-sm" onclick="calPhase('Ronda 32 (16)')">Ronda 32 (16)</button>
        <button class="btn btn-o btn-sm" onclick="calPhase('Octavos (8)')">Octavos (8)</button>
        <button class="btn btn-o btn-sm" onclick="calPhase('Cuartos (4)')">Cuartos (4)</button>
        <button class="btn btn-o btn-sm" onclick="calPhase('Semis (2)')">Semis (2)</button>
        <button class="btn btn-o btn-sm" onclick="calPhase('Final')">Final</button>
      </div>
      <div class="card">
        <div class="ct" id="calTitle">Fase de Grupos — muestra</div>
        <div class="tw"><table>
          <thead><tr><th>#</th><th>Local</th><th>Marcador</th><th>Visitante</th><th>Fecha</th><th>Sede</th><th>Grupo</th><th>Estado</th></tr></thead>
          <tbody id="ctb"></tbody>
        </table></div>
      </div>
    </section>

    <!-- ═══ RANKING ═══ -->
    <section class="panel" id="panel-ranking">
      <div class="ph">
        <div><div class="pt">🏆 Ranking</div><div class="ps">Tabla de posiciones y gestión de estados de pago</div></div>
        <div class="fx gap8 fxc wrap">
          <div class="sr" style="width:190px"><span class="sico">🔍</span><input class="si2" placeholder="Usuario o email…" oninput="filterRank(this.value)"></div>
          <button class="btn btn-o btn-sm" onclick="toast('📥','Exportando CSV...','ok')">Exportar CSV</button>
        </div>
      </div>
      <div class="stats">
        <div class="sbox"><div class="sv" style="color:var(--green)">38</div><div class="sl">Activos</div></div>
        <div class="sbox"><div class="sv" style="color:var(--amber)">7</div><div class="sl">Pendientes pago</div></div>
        <div class="sbox"><div class="sv" style="color:var(--blue)">45</div><div class="sl">Registrados</div></div>
        <div class="sbox"><div class="sv" style="color:var(--gold)">B/.675</div><div class="sl">Recaudado</div></div>
      </div>
      <div class="card">
        <div class="ct">Tabla de Posiciones</div>
        <div class="tw"><table>
          <thead><tr><th>#</th><th>Participante</th><th>Puntos</th><th>Exactos</th><th>Pronóst.</th><th>Pago</th><th>Acciones</th></tr></thead>
          <tbody id="rtb"></tbody>
        </table></div>
      </div>
    </section>

    <!-- ═══ NOTIFICACIONES ═══ -->
    <section class="panel" id="panel-notif">
      <div class="ph">
        <div><div class="pt">📨 Notificaciones</div><div class="ps">Recordatorios a participantes con pronósticos pendientes</div></div>
        <button class="btn btn-p" onclick="sendAll()">📤 Enviar todos</button>
      </div>
      <div class="card">
        <div class="ct">Partidos próximas 24h con pronósticos faltantes</div>
        <div id="nmList"></div>
        <div class="fx gap8 fxc" style="margin-top:16px;flex-wrap:wrap">
          <button class="btn btn-o btn-sm" onclick="selAll(true)">Seleccionar todos</button>
          <button class="btn btn-o btn-sm" onclick="selAll(false)">Deseleccionar</button>
          <span class="ml" style="color:var(--muted);font-size:.8125rem;align-self:center"><span id="selCount">0</span> partidos seleccionados</span>
        </div>
      </div>
      <div class="card">
        <div class="ct">Redactar mensaje</div>
        <div class="fr">
          <div class="fg"><label class="fl">Canal de envío</label><select class="fsel" id="nch"><option value="email">📧 Correo electrónico</option><option value="wa">💬 WhatsApp</option><option value="both">📧 + 💬 Ambos</option></select></div>
          <div class="fg"><label class="fl">Destinatarios</label><select class="fsel"><option>Sin pronósticos pendientes</option><option>Pago pendiente</option><option>Todos los activos</option><option>Selección manual</option></select></div>
        </div>
        <div class="fg"><label class="fl">Asunto</label><input type="text" class="fi" value="⚽ ¡No te pierdas los partidos de mañana!" id="nsub"></div>
        <div class="fg"><label class="fl">Mensaje</label><textarea class="fta" id="nbody">Hola {nombre},

Te escribimos porque aún no has ingresado tus pronósticos para:

{partidos_pendientes}

Tienes tiempo hasta {tiempo_cierre} para completarlos.

¡Buena suerte! 🏆
Equipo Prode 2026</textarea></div>
        <div class="fx gap8 fxc wrap" style="margin-top:16px">
          <button class="btn btn-o btn-sm" onclick="prevNotif()">👁 Vista previa</button>
          <button class="btn btn-p" style="margin-left:auto" onclick="sendNotif()">📤 Enviar recordatorio</button>
        </div>
      </div>
      <div class="card">
        <div class="ct">Historial de envíos</div>
        <div class="tw"><table>
          <thead><tr><th>Fecha</th><th>Tipo</th><th>Destinatarios</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>10 Jun 09:00</td><td>Email recordatorio</td><td>12 usuarios</td><td><span class="bx bx-g">Enviado</span></td></tr>
            <tr><td>09 Jun 18:30</td><td>WhatsApp</td><td>8 usuarios</td><td><span class="bx bx-g">Enviado</span></td></tr>
            <tr><td>08 Jun 08:00</td><td>Email bienvenida</td><td>45 usuarios</td><td><span class="bx bx-g">Enviado</span></td></tr>
          </tbody>
        </table></div>
      </div>
    </section>

    <!-- ═══ MOTOR DE PUNTOS ═══ -->
    <section class="panel" id="panel-motor">
      <div class="ph">
        <div><div class="pt">📊 Motor de Puntos</div><div class="ps">Estado del cálculo de puntajes por partido</div></div>
        <button class="btn btn-y" onclick="runEngine('motorDot2','motorState2','engineBtn2')">⚡ Ejecutar motor</button>
      </div>
      <div class="stats">
        <div class="sbox"><div class="sv" style="color:var(--green)">23</div><div class="sl">Calculados</div></div>
        <div class="sbox"><div class="sv" style="color:var(--muted)">81</div><div class="sl">Pendientes</div></div>
        <div class="sbox"><div class="sv" style="color:var(--blue)">1,247</div><div class="sl">Predicciones</div></div>
        <div class="sbox"><div class="sv" style="color:var(--gold)">8,432</div><div class="sl">Pts distribuidos</div></div>
      </div>
      <div class="card">
        <div class="ct">Estado del motor</div>
        <div class="ms">
          <div class="mdot done" id="motorDot2"></div>
          <div>
            <div style="font-weight:600">Motor completado — última ejecución OK</div>
            <div style="font-size:.8125rem;color:var(--muted)">Hoy 08:45 AM · 23 partidos · 342 pts asignados</div>
          </div>
          <div class="ml"><button class="btn btn-y btn-sm" id="engineBtn2" onclick="runEngine('motorDot2','motorState2','engineBtn2')">⚡ Re-ejecutar</button></div>
        </div>
        <div style="margin-top:12px">
          <div style="font-size:.75rem;color:var(--muted);margin-bottom:6px">Progreso global (23/104 partidos finalizados)</div>
          <div class="pb"><div class="pf" style="width:22%"></div></div>
        </div>
      </div>
      <div class="card">
        <div class="ct">Últimos partidos calculados</div>
        <div class="tw"><table>
          <thead><tr><th>Partido</th><th>Resultado</th><th>Predicciones</th><th>Exactos</th><th>Pts asignados</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td><div class="ti"><span class="tf">🇲🇽</span><span class="tn">México</span><span style="color:var(--muted);padding:0 4px">vs</span><span class="tf">🇨🇦</span><span class="tn">Canadá</span></div></td><td><strong>2 – 1</strong></td><td>48</td><td><span class="bx bx-g">12</span></td><td><span style="color:var(--gold)">+132</span></td><td><span class="bx bx-g">✓ OK</span></td></tr>
            <tr><td><div class="ti"><span class="tf">🇺🇸</span><span class="tn">USA</span><span style="color:var(--muted);padding:0 4px">vs</span><span class="tf">🇵🇦</span><span class="tn">Panamá</span></div></td><td><strong>4 – 0</strong></td><td>51</td><td><span class="bx bx-g">7</span></td><td><span style="color:var(--gold)">+98</span></td><td><span class="bx bx-g">✓ OK</span></td></tr>
            <tr><td><div class="ti"><span class="tf">🇧🇷</span><span class="tn">Brasil</span><span style="color:var(--muted);padding:0 4px">vs</span><span class="tf">🇸🇷</span><span class="tn">Surinam</span></div></td><td><strong>5 – 0</strong></td><td>46</td><td><span class="bx bx-g">18</span></td><td><span style="color:var(--gold)">+112</span></td><td><span class="bx bx-g">✓ OK</span></td></tr>
            <tr><td><div class="ti"><span class="tf">🇦🇷</span><span class="tn">Argentina</span><span style="color:var(--muted);padding:0 4px">vs</span><span class="tf">🇵🇪</span><span class="tn">Perú</span></div></td><td><strong>3 – 0</strong></td><td>52</td><td><span class="bx bx-g">15</span></td><td><span style="color:var(--gold)">+145</span></td><td><span class="bx bx-g">✓ OK</span></td></tr>
          </tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="ct">Log del motor</div>
        <div class="log" id="engineLog">
<span style="color:var(--green)">[OK]</span> 08:45:07 — Motor completado. 1,247 predicciones · 342 pts<br>
<span style="color:var(--green)">[OK]</span> 08:45:06 — ARG 3-0 PER: 15 exactos / 22 ganador+dif / 8 ganador / 7 sin pts<br>
<span style="color:var(--green)">[OK]</span> 08:45:05 — BRA 5-0 SUR: 18 exactos / 15 ganador+dif / 10 ganador<br>
<span style="color:var(--green)">[OK]</span> 08:45:04 — USA 4-0 PAN: 7 exactos / 18 ganador+dif / 19 ganador<br>
<span style="color:var(--green)">[OK]</span> 08:45:03 — MEX 2-1 CAN: 12 exactos / 9 ganador+dif / 18 ganador<br>
<span style="color:var(--blue)">[INF]</span> 08:45:01 — Cargando reglas: exacto=3pts, dif=2pts, ganador=1pt<br>
<span style="color:var(--muted)">[LOG]</span> 08:45:00 — Motor iniciado manualmente</div>
      </div>
    </section>

  </main>
</div>

<!-- TOAST -->
<div class="toast" id="toastEl"><span id="tIcon">✅</span>&nbsp;<span id="tMsg"></span></div>

<script>
// ── DATA ─────────────────────────────────────────────────────────────
const MATCHES = [
  {id:1,home:'🇲🇽 México',   away:'🇧🇴 Bolivia',    hs:'',as:'',time:'12:00',venue:'MetLife',  group:'A',status:'pending'},
  {id:2,home:'🇺🇸 USA',      away:'🇭🇳 Honduras',   hs:'',as:'',time:'15:00',venue:'SoFi',     group:'B',status:'live'},
  {id:3,home:'🇦🇷 Argentina',away:'🇨🇱 Chile',      hs:'',as:'',time:'15:00',venue:'Azteca',   group:'C',status:'live'},
  {id:4,home:'🇫🇷 Francia',  away:'🇳🇿 N.Zelanda',  hs:'',as:'',time:'18:00',venue:'AT&T',     group:'D',status:'pending'},
  {id:5,home:'🇧🇷 Brasil',   away:'🇨🇷 Costa Rica', hs:'',as:'',time:'21:00',venue:"Levi's",   group:'E',status:'pending'},
];

const CAL = [
  {id:1,home:'🇲🇽 México',   away:'🇧🇴 Bolivia',    hs:'', as:'', date:'11 Jun',venue:'MetLife',   grp:'A',status:'live'},
  {id:2,home:'🇺🇸 USA',      away:'🇭🇳 Honduras',   hs:'', as:'', date:'11 Jun',venue:'SoFi',      grp:'B',status:'live'},
  {id:3,home:'🇦🇷 Argentina',away:'🇨🇱 Chile',      hs:'3',as:'0',date:'10 Jun',venue:'Azteca',    grp:'C',status:'done'},
  {id:4,home:'🇫🇷 Francia',  away:'🇳🇿 N.Zelanda',  hs:'2',as:'1',date:'10 Jun',venue:'AT&T',      grp:'D',status:'done'},
  {id:5,home:'🇧🇷 Brasil',   away:'🇨🇷 Costa Rica', hs:'', as:'', date:'12 Jun',venue:"Levi's",    grp:'E',status:'pending'},
  {id:6,home:'🇩🇪 Alemania', away:'🇯🇵 Japón',      hs:'', as:'', date:'12 Jun',venue:'BC Place',  grp:'F',status:'pending'},
  {id:7,home:'🇪🇸 España',   away:'🇰🇷 Corea Sur',  hs:'', as:'', date:'13 Jun',venue:'Rose Bowl', grp:'G',status:'pending'},
  {id:8,home:'🇵🇹 Portugal', away:'🇲🇦 Marruecos',  hs:'', as:'', date:'13 Jun',venue:'Est. 86',   grp:'H',status:'pending'},
];

const USERS = [
  {pos:1,em:'🦁',alias:'Carlos G.',   email:'carlos@email.com', pts:36,ex:8, pr:'23/23',paid:true},
  {pos:2,em:'🐯',alias:'María L.',    email:'maria@email.com',  pts:34,ex:7, pr:'23/23',paid:true},
  {pos:3,em:'🦊',alias:'Pedro A.',    email:'pedro@email.com',  pts:29,ex:5, pr:'22/23',paid:true},
  {pos:4,em:'🐺',alias:'Ana T.',      email:'ana@email.com',    pts:27,ex:4, pr:'21/23',paid:true},
  {pos:5,em:'🦅',alias:'Luis M.',     email:'luis@email.com',   pts:24,ex:3, pr:'20/23',paid:false},
  {pos:6,em:'🐆',alias:'Sofía P.',    email:'sofia@email.com',  pts:22,ex:3, pr:'23/23',paid:true},
  {pos:7,em:'🦈',alias:'Rodrigo V.',  email:'rodri@email.com',  pts:19,ex:2, pr:'18/23',paid:false},
  {pos:8,em:'🐬',alias:'Isabella C.', email:'isa@email.com',    pts:15,ex:1, pr:'15/23',paid:true},
];

const NOTIF_MATCHES = [
  {teams:'🇲🇽 México vs 🇧🇴 Bolivia',   time:'Mañana 12:00',missing:12},
  {teams:'🇺🇸 USA vs 🇭🇳 Honduras',     time:'Mañana 15:00',missing:8},
  {teams:'🇧🇷 Brasil vs 🇨🇷 Costa Rica',time:'Mañana 21:00',missing:15},
];

// ── PIN ──────────────────────────────────────────────────────────────
const PIN = '2026';
let pinBuf = '';

function pp(v) {
  if (v==='del') { pinBuf=pinBuf.slice(0,-1); }
  else if (v==='ok') { checkPin(); return; }
  else if (pinBuf.length<4) { pinBuf+=v; }
  for(let i=0;i<4;i++) document.getElementById('d'+i).classList.toggle('filled',i<pinBuf.length);
  if (pinBuf.length===4) setTimeout(checkPin,200);
}

function checkPin() {
  if (pinBuf===PIN) {
    document.getElementById('gate').style.display='none';
    toast('✅','¡Bienvenido, Super Admin!','ok');
  } else {
    document.getElementById('perr').textContent='PIN incorrecto. Intenta de nuevo.';
    pinBuf='';
    for(let i=0;i<4;i++) document.getElementById('d'+i).classList.remove('filled');
    setTimeout(()=>{document.getElementById('perr').textContent='';},2000);
  }
}

function logout() {
  document.getElementById('gate').style.display='flex';
  pinBuf='';
  for(let i=0;i<4;i++) document.getElementById('d'+i).classList.remove('filled');
}

// ── NAV ──────────────────────────────────────────────────────────────
function go(name, el) {
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.sb-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('panel-'+name).classList.add('on');
  el.classList.add('active');
  closeSB();
}

function toggleSB() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}
function closeSB() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

// ── MATCH TABLE ──────────────────────────────────────────────────────
function sbadge(s) {
  if(s==='done')    return '<span class="bx bx-g">✓ Finalizado</span>';
  if(s==='live')    return '<span class="bx bx-b">🔴 En vivo</span>';
  return '<span class="bx bx-a">Pendiente</span>';
}

function renderMatches() {
  document.getElementById('mtb').innerHTML = MATCHES.map(m=>`
    <tr>
      <td><div class="ti"><span class="tf">${m.home.split(' ')[0]}</span><span class="tn">${m.home.split(' ').slice(1).join(' ')}</span></div></td>
      <td><div class="sw">
        <input type="number" class="si" min="0" max="30" placeholder="0" value="${m.hs}" oninput="MATCHES[${m.id-1}].hs=this.value">
        <span class="ss">–</span>
        <input type="number" class="si" min="0" max="30" placeholder="0" value="${m.as}" oninput="MATCHES[${m.id-1}].as=this.value">
      </div></td>
      <td><div class="ti"><span class="tf">${m.away.split(' ')[0]}</span><span class="tn">${m.away.split(' ').slice(1).join(' ')}</span></div></td>
      <td style="color:var(--muted)">${m.time}</td>
      <td style="color:var(--muted);font-size:.8125rem">${m.venue}</td>
      <td>${sbadge(m.status)}</td>
      <td><button class="btn btn-g btn-sm" onclick="saveScore(${m.id})">Guardar</button></td>
    </tr>
  `).join('');
}

function saveScore(id) {
  const m=MATCHES.find(x=>x.id===id);
  if(!m) return;
  m.status='done';
  renderMatches();
  toast('✅',`Guardado: ${m.home.split(' ').slice(1).join(' ')} ${m.hs||0} – ${m.as||0} ${m.away.split(' ').slice(1).join(' ')}`,'ok');
}

// ── CALENDAR TABLE ───────────────────────────────────────────────────
function renderCal() {
  document.getElementById('ctb').innerHTML = CAL.map((m,i)=>`
    <tr>
      <td style="color:var(--muted)">${i+1}</td>
      <td><div class="ti"><span class="tf">${m.home.split(' ')[0]}</span><span class="tn">${m.home.split(' ').slice(1).join(' ')}</span></div></td>
      <td><div class="sw">
        <input type="number" class="si" min="0" max="30" placeholder="–" value="${m.hs}" ${m.status==='pending'?'disabled style="opacity:.4"':''}>
        <span class="ss">–</span>
        <input type="number" class="si" min="0" max="30" placeholder="–" value="${m.as}" ${m.status==='pending'?'disabled style="opacity:.4"':''}>
      </div></td>
      <td><div class="ti"><span class="tf">${m.away.split(' ')[0]}</span><span class="tn">${m.away.split(' ').slice(1).join(' ')}</span></div></td>
      <td style="color:var(--muted);font-size:.8125rem">${m.date}</td>
      <td style="color:var(--muted);font-size:.8125rem">${m.venue}</td>
      <td><span class="bx bx-p">${m.grp}</span></td>
      <td>${sbadge(m.status)}</td>
    </tr>
  `).join('');
}

function filterCal(q) {
  document.querySelectorAll('#ctb tr').forEach(r=>{
    r.style.display = q ? (r.textContent.toLowerCase().includes(q.toLowerCase())?'':'none') : '';
  });
}

function calPhase(p) {
  document.getElementById('calTitle').textContent = p+' — muestra';
  toast('📅','Filtrando: '+p,'');
}

// ── RANKING TABLE ────────────────────────────────────────────────────
function renderRank() {
  document.getElementById('rtb').innerHTML = USERS.map((u,i)=>`
    <tr>
      <td><div class="rpos ${i===0?'g':i===1?'s':i===2?'b':''}">${u.pos}</div></td>
      <td><div class="uc"><div class="uav">${u.em}</div><div><div class="un">${u.alias}</div><div class="ue">${u.email}</div></div></div></td>
      <td><strong style="font-family:var(--font-d);font-size:1.2rem;color:var(--gold)">${u.pts}</strong></td>
      <td><span class="bx bx-g">${u.ex} 🎯</span></td>
      <td style="color:var(--muted)">${u.pr}</td>
      <td><label class="tog" title="${u.paid?'Activo':'Pendiente de pago'}"><input type="checkbox" ${u.paid?'checked':''} onchange="togglePay(${i},this)"><span class="tslide"></span></label></td>
      <td><button class="btn btn-o btn-sm" onclick="toast('👤','Perfil de ${u.alias} — próximamente','')">Ver</button></td>
    </tr>
  `).join('');
}

function togglePay(i, el) {
  USERS[i].paid = el.checked;
  toast(el.checked?'✅':'⏳', USERS[i].alias+': pago '+(el.checked?'Aprobado':'marcado Pendiente'), el.checked?'ok':'');
}

function filterRank(q) {
  document.querySelectorAll('#rtb tr').forEach(r=>{
    r.style.display = q ? (r.textContent.toLowerCase().includes(q.toLowerCase())?'':'none') : '';
  });
}

// ── NOTIFICATIONS ────────────────────────────────────────────────────
function renderNotif() {
  document.getElementById('nmList').innerHTML = NOTIF_MATCHES.map((m,i)=>`
    <div class="nm">
      <input type="checkbox" class="nchk" id="nc${i}" onchange="countSel()">
      <div class="nmt">${m.teams}</div>
      <div class="nmc">
        <span style="color:var(--muted);font-size:.8125rem">${m.time}</span>
        <span class="miss">⚠️ ${m.missing} sin pronóstico</span>
      </div>
    </div>
  `).join('');
}

function countSel() {
  document.getElementById('selCount').textContent = document.querySelectorAll('.nchk:checked').length;
}
function selAll(v) { document.querySelectorAll('.nchk').forEach(c=>{c.checked=v;}); countSel(); }
function sendAll() { selAll(true); sendNotif(); }

function sendNotif() {
  const ch = {email:'correo',wa:'WhatsApp',both:'correo + WhatsApp'}[document.getElementById('nch').value]||'correo';
  toast('📤','Recordatorios enviados por '+ch,'ok');
}

function prevNotif() {
  const msg = document.getElementById('nbody').value
    .replace('{nombre}','Carlos G.')
    .replace('{partidos_pendientes}','• México vs Bolivia (12:00)\n• Brasil vs Costa Rica (21:00)')
    .replace('{tiempo_cierre}','3 horas antes de cada partido');
  alert('Vista previa:\n\n'+msg);
}

// ── ENGINE ────────────────────────────────────────────────────────────
function runEngine(dotId, stateId, btnId) {
  const dot=document.getElementById(dotId);
  const st=document.getElementById(stateId);
  const btn=document.getElementById(btnId);
  if(dot) dot.className='mdot run';
  if(st) st.textContent='Calculando...';
  if(btn) { btn.disabled=true; btn.textContent='⏳ Procesando...'; }
  toast('⚡','Motor de puntuación iniciado...','');
  setTimeout(()=>{
    if(dot) dot.className='mdot done';
    if(st) st.textContent='Completado';
    if(btn) { btn.disabled=false; btn.textContent=btnId==='engineBtn'?'⚡ Ejecutar':'⚡ Re-ejecutar'; }
    const lc=document.getElementById('lastCalc');
    if(lc) lc.textContent='Hoy '+new Date().toLocaleTimeString('es-PA',{hour:'2-digit',minute:'2-digit'})+' · partidos procesados';
    const log=document.getElementById('engineLog');
    if(log) { const t=new Date().toLocaleTimeString('es-PA',{hour:'2-digit',minute:'2-digit',second:'2-digit'}); log.innerHTML=`<span style="color:var(--green)">[OK]</span> ${t} — Motor completado ✓\n`+log.innerHTML; }
    toast('✅','Motor completado — tabla de posiciones actualizada','ok');
  },2800);
}

function toggleLog() {
  const el=document.getElementById('calcLog');
  el.style.display=el.style.display==='none'?'block':'none';
}

function saveRules() { toast('💾','Reglas guardadas correctamente','ok'); }

// ── TOAST ─────────────────────────────────────────────────────────────
let tTimer;
function toast(icon, msg, type) {
  const el=document.getElementById('toastEl');
  document.getElementById('tIcon').textContent=icon;
  document.getElementById('tMsg').textContent=msg;
  el.className='toast show'+(type==='ok'?' ok':'');
  clearTimeout(tTimer);
  tTimer=setTimeout(()=>el.classList.remove('show'),3200);
}

// ── INIT ──────────────────────────────────────────────────────────────
renderMatches();
renderCal();
renderRank();
renderNotif();
</script>
</body>
</html>
