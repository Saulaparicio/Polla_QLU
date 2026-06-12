"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import Link from "next/link";

/* ── DATA ── */
const AVATARS = ["⚽","🏆","🦁","🐯","🦅","🦊","🐺","🐻","🦋","🌟","⭐","🔥","💫","🎯","🎪","🎭","🎨","🚀","⚡","🌊","🏔️","🌙","☀️","🎮"];
const COUNTRIES = [
  { flag:"🇦🇷", name:"Argentina" }, { flag:"🇧🇷", name:"Brasil" }, { flag:"🇫🇷", name:"Francia" },
  { flag:"🇩🇪", name:"Alemania" }, { flag:"🇪🇸", name:"España" }, { flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", name:"Inglaterra" },
  { flag:"🇵🇹", name:"Portugal" }, { flag:"🇳🇱", name:"Países Bajos" }, { flag:"🇺🇾", name:"Uruguay" },
  { flag:"🇲🇽", name:"México" }, { flag:"🇺🇸", name:"Estados Unidos" }, { flag:"🇨🇦", name:"Canadá" },
  { flag:"🇨🇴", name:"Colombia" }, { flag:"🇵🇦", name:"Panamá" }, { flag:"🇨🇱", name:"Chile" },
  { flag:"🇵🇪", name:"Perú" }, { flag:"🇧🇪", name:"Bélgica" }, { flag:"🇭🇷", name:"Croacia" },
  { flag:"🇯🇵", name:"Japón" }, { flag:"🇰🇷", name:"Corea del Sur" }, { flag:"🇸🇳", name:"Senegal" },
  { flag:"🇲🇦", name:"Marruecos" }, { flag:"🇩🇰", name:"Dinamarca" }, { flag:"🇵🇱", name:"Polonia" },
];

export default function AuthPage() {
  const router = useRouter();
  const { login, register, loginWithGoogle, user, loading: authLoading } = useAuth();

  /* navigation */
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [step, setStep] = useState(1);       // 1 | 2 | 3 | 4(success)

  /* step-1 fields */
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  /* step-2 fields */
  const [alias, setAlias]               = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("⚽");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryQuery, setCountryQuery] = useState("");

  /* step-3 fields */
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver]         = useState(false);

  /* global */
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [createdUser, setCreatedUser] = useState(null);

  /* redirect if already logged in */
  useEffect(() => {
    if (!authLoading && user) router.push("/");
  }, [user, authLoading, router]);

  if (authLoading || user) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
        <Loader2 style={{ width:40, height:40, animation:"spin 1s linear infinite", color:"#00E676" }} />
      </div>
    );
  }

  /* ── helpers ── */
  const filteredCountries = countryQuery
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(countryQuery.toLowerCase()))
    : COUNTRIES;

  const friendlyError = (code) => {
    if (!code) return "Ocurrió un error. Intenta de nuevo.";
    const map = {
      "auth/invalid-credential":   "Credenciales incorrectas. Verifica correo y contraseña.",
      "auth/wrong-password":        "Contraseña incorrecta.",
      "auth/user-not-found":        "No existe una cuenta con ese correo.",
      "auth/email-already-in-use":  "Ese correo ya está registrado.",
      "auth/weak-password":         "La contraseña debe tener al menos 6 caracteres.",
      "auth/invalid-email":         "El formato del correo no es válido.",
      "auth/unauthorized-domain":   "Este dominio/IP no está autorizado en la consola de Firebase. Agrega tu dominio actual en Firebase > Authentication > Settings > Authorized Domains.",
      "auth/operation-not-allowed": "El proveedor de inicio de sesión (Google) no está activado en tu consola de Firebase. Actívalo en Firebase > Authentication > Sign-in method.",
    };
    return map[code] || code;
  };

  /* ── step navigation ── */
  const goStep = (n) => { setError(""); setStep(n); window.scrollTo({ top: 0 }); };

  /* ── validations ── */
  const validateStep1 = () => {
    const errs = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) errs.email = "Ingresa un correo válido";
    if (password.length < 8)  errs.password = "Mínimo 8 caracteres";
    if (password !== password2) errs.password2 = "Las contraseñas no coinciden";
    setFieldErrors(errs);
    if (Object.keys(errs).length === 0) goStep(2);
  };

  const validateStep2 = () => {
    if (alias.trim().length < 3) {
      setFieldErrors({ alias: "El alias debe tener al menos 3 caracteres" });
      return;
    }
    setFieldErrors({});
    goStep(3);
  };

  /* ── login submit ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(friendlyError(err.code || err.message));
    } finally { setLoading(false); }
  };

  /* ── Google auth ── */
  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      if (loginWithGoogle) await loginWithGoogle();
      else throw new Error("Google auth not configured");
      router.push("/");
    } catch (err) {
      setError(friendlyError(err.code || err.message));
    } finally { setLoading(false); }
  };

  /* ── finish registration (step 3) ── */
  const finishRegistration = async () => {
    setError(""); setLoading(true);
    try {
      const displayName = `${selectedAvatar} ${alias.trim()}`;
      await register(email, password, displayName);
      setCreatedUser({ alias: alias.trim(), avatar: selectedAvatar, email });
      goStep(4);
    } catch (err) {
      setError(friendlyError(err.code || err.message));
    } finally { setLoading(false); }
  };

  /* ── file handling ── */
  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("El archivo no debe superar 5 MB"); return; }
    setUploadedFile(file);
  };

  /* ─────────────────────────────────────────────
     STYLES (inline — no extra CSS file needed)
  ───────────────────────────────────────────── */
  const S = {
    page: { display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"100vh" },
    leftPanel: {
      background:"rgba(13,26,45,0.55)", backdropFilter:"blur(24px) saturate(150%)",
      WebkitBackdropFilter:"blur(24px) saturate(150%)",
      borderRight:"1px solid rgba(255,255,255,0.08)",
      display:"flex", flexDirection:"column", justifyContent:"space-between",
      padding:"clamp(32px,5vw,64px)", position:"sticky", top:0, height:"100vh", overflow:"hidden",
    },
    rightPanel: {
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(24px,5vw,64px)", minHeight:"100vh",
    },
    formWrap: { width:"100%", maxWidth:440 },
    /* step indicator */
    steps: { display:"flex", alignItems:"center", marginBottom:36 },
    stepItem: { display:"flex", flexDirection:"column", alignItems:"center", gap:6, flex:1 },
    stepDot: (active, done) => ({
      width:32, height:32, borderRadius:"50%",
      border:`2px solid ${done?"#00E676":active?"#00E676":"#253B5E"}`,
      background: done ? "#00E676" : "transparent",
      color: done ? "#000" : active ? "#00E676" : "#5E7A9E",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:"0.75rem", fontWeight:700, transition:"all 0.3s", position:"relative", zIndex:1,
    }),
    stepLabel: (active) => ({ fontSize:"0.6875rem", color: active ? "#00E676" : "#5E7A9E", textTransform:"uppercase", letterSpacing:"0.08em", whiteSpace:"nowrap" }),
    stepConnector: (done) => ({ flex:1, height:1, background: done ? "#00E676" : "#1C2E48", marginTop:-22 }),
    /* card */
    formCard: {
      background:"rgba(13,26,45,0.70)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
      border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, padding:36,
      display:"flex", flexDirection:"column", gap:24,
    },
    /* inputs */
    field: { display:"flex", flexDirection:"column", gap:7 },
    fieldLabel: { fontSize:"0.8125rem", fontWeight:600, color:"#C5D2EE" },
    input: {
      background:"rgba(21,35,56,0.70)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)",
      border:"1px solid #253B5E", borderRadius:12, color:"#E8F0FF",
      fontSize:"0.9375rem", padding:"12px 14px", width:"100%", outline:"none",
      fontFamily:"inherit", transition:"border-color 0.2s",
    },
    inputError: { borderColor:"#FF5252" },
    fieldError: { fontSize:"0.75rem", color:"#FF5252" },
    /* buttons */
    btnPrimary: {
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
      background:"#00E676", color:"#000", border:"none", borderRadius:12,
      padding:"14px 24px", width:"100%", fontSize:"1rem", fontWeight:700,
      fontFamily:"inherit", cursor:"pointer", transition:"all 0.2s",
    },
    btnSecondary: {
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
      background:"transparent", color:"#C5D2EE", border:"1px solid #253B5E",
      borderRadius:12, padding:"12px 24px", fontSize:"0.9375rem",
      fontWeight:600, fontFamily:"inherit", cursor:"pointer", transition:"all 0.2s",
    },
    btnGoogle: {
      display:"flex", alignItems:"center", justifyContent:"center", gap:10,
      background:"rgba(21,35,56,0.70)", border:"1px solid #253B5E",
      borderRadius:12, padding:"12px 16px", width:"100%",
      color:"#E8F0FF", fontSize:"0.9375rem", fontWeight:600, fontFamily:"inherit",
      cursor:"pointer", transition:"all 0.2s",
    },
    btnRow: { display:"flex", gap:12 },
    divider: { display:"flex", alignItems:"center", gap:12 },
    dividerLine: { flex:1, height:1, background:"#1C2E48" },
    dividerText: { fontSize:"0.75rem", color:"#5E7A9E", textTransform:"uppercase", letterSpacing:"0.1em" },
    /* avatars */
    avatarGrid: { display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 },
    avatarOption: (sel) => ({
      width:"100%", aspectRatio:"1", borderRadius:12,
      background:"rgba(21,35,56,0.60)", border:`2px solid ${sel?"#00E676":"#1C2E48"}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:"1.5rem", cursor:"pointer", transition:"all 0.15s",
      boxShadow: sel ? "0 0 0 3px rgba(0,230,118,0.15)" : "none",
    }),
    /* countries */
    countryGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, maxHeight:180, overflowY:"auto", paddingRight:4 },
    countryOption: (sel) => ({
      background:"rgba(21,35,56,0.60)", border:`1px solid ${sel?"#00E676":"#1C2E48"}`,
      borderRadius:6, padding:"8px 6px", display:"flex", flexDirection:"column",
      alignItems:"center", gap:4, cursor:"pointer", transition:"all 0.15s", textAlign:"center",
    }),
    /* payment */
    paymentBox: {
      background:"rgba(21,35,56,0.70)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)",
      border:"1px solid #253B5E", borderRadius:18, padding:20, display:"flex", flexDirection:"column", gap:16,
    },
    uploadZone: (dov) => ({
      border:`2px dashed ${dov?"#00E676":"#253B5E"}`, borderRadius:12, padding:20,
      display:"flex", flexDirection:"column", alignItems:"center", gap:8, textAlign:"center",
      cursor:"pointer", transition:"all 0.2s",
      background: dov ? "rgba(0,230,118,0.04)" : "transparent",
    }),
    /* error banner */
    errorBanner: {
      background:"rgba(255,82,82,0.08)", border:"1px solid rgba(255,82,82,0.25)",
      borderRadius:12, padding:"12px 16px", fontSize:"0.875rem", color:"#FF5252",
    },
    /* success */
    successCard: {
      background:"rgba(13,26,45,0.70)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
      border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, padding:"40px 36px",
      display:"flex", flexDirection:"column", alignItems:"center", gap:20, textAlign:"center",
    },
    btnGold: {
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
      background:"#FFD700", color:"#000", border:"none", borderRadius:12,
      padding:"14px 24px", width:"100%", fontSize:"1rem", fontWeight:700,
      fontFamily:"inherit", cursor:"pointer", transition:"all 0.2s", textDecoration:"none",
    },
  };

  /* ── step dot helper ── */
  const isDone = (n) => step > n || step === 4;
  const isActive = (n) => step === n;

  /* ─────────────────
     RENDER
  ───────────────── */
  return (
    <>
      {/* Mobile top bar */}
      <div style={{ display:"none" }} className="auth-top-bar">
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <span style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"1.4rem", letterSpacing:"0.04em", color:"#E8F0FF" }}>
            QLU <em style={{ fontStyle:"normal", color:"#00E676" }}>MatchPredict</em>
          </span>
        </Link>
        <Link href="/dashboard" style={{ fontSize:"0.8125rem", color:"#5E7A9E", textDecoration:"none" }}>Ya tengo cuenta →</Link>
      </div>

      <div style={S.page} className="auth-page-grid">

        {/* ── LEFT PANEL ── */}
        <div style={S.leftPanel} className="auth-left-panel">
          {/* radial glow */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 20% 100%, rgba(0,230,118,0.06) 0%, transparent 60%)", pointerEvents:"none" }} />

          <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", position:"relative", zIndex:1 }}>
            <span style={{ fontSize:"1.8rem" }}>⚽</span>
            <span style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"2rem", letterSpacing:"0.04em", color:"#E8F0FF" }}>
              QLU <em style={{ fontStyle:"normal", color:"#00E676" }}>MatchPredict</em>
            </span>
          </Link>

          <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:28, padding:"40px 0", position:"relative", zIndex:1 }}>
            <h1 style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"clamp(2.4rem,3.5vw,3.6rem)", letterSpacing:"0.03em", lineHeight:0.95, color:"#E8F0FF" }}>
              LA QUINIELA<br/><em style={{ fontStyle:"normal", color:"#00E676" }}>MÁS EMOCIONANTE</em><br/>DEL MUNDIAL
            </h1>
            <p style={{ color:"#5E7A9E", fontSize:"0.9375rem", lineHeight:1.7, maxWidth:340 }}>
              104 partidos, 48 selecciones, 1 campeón. Pronostica cada resultado y compite con tus amigos en tiempo real.
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { icon:"🎯", title:"Sistema de puntos claro", desc:"Exacto: 3 pts · Dif. acertada: 2 pts · Solo ganador: 1 pt" },
                { icon:"⚡", title:"Pronósticos en tiempo real", desc:"Ingresa tu predicción hasta que el árbitro pite el inicio del partido" },
                { icon:"🏆", title:"Ranking en vivo", desc:"La tabla se actualiza automáticamente al terminar cada partido" },
                { icon:"📲", title:"Pago fácil con Yappy", desc:"Inscripción de B/.15 — paga en segundos y activa tu cuenta al instante" },
              ].map(p => (
                <div key={p.title} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:"rgba(21,35,56,0.70)", border:"1px solid #253B5E", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>{p.icon}</div>
                  <div style={{ fontSize:"0.875rem", color:"#C5D2EE", lineHeight:1.5 }}>
                    <strong style={{ color:"#E8F0FF", display:"block", fontWeight:600, fontSize:"0.8125rem", marginBottom:2 }}>{p.title}</strong>
                    {p.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", gap:24, position:"relative", zIndex:1 }}>
            {[["104","Partidos"],["48","Selecciones"],["39","Días"]].map(([num, lbl]) => (
              <div key={lbl} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"1.8rem", color:"#FFD700", letterSpacing:"0.02em" }}>{num}</div>
                <div style={{ fontSize:"0.6875rem", color:"#5E7A9E", textTransform:"uppercase", letterSpacing:"0.1em" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={S.rightPanel}>
          <div style={S.formWrap}>

            {/* ══════════════════════
                LOGIN FORM
            ══════════════════════ */}
            {mode === "login" && (
              <>
                {/* Step indicator hidden on login */}
                <div style={S.formCard}>
                  <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"1.8rem", letterSpacing:"0.03em", color:"#E8F0FF" }}>Iniciar Sesión</div>
                  <p style={{ color:"#5E7A9E", fontSize:"0.875rem", marginTop:-16, lineHeight:1.5 }}>Ingresa para gestionar tus predicciones</p>

                  {error && <div style={S.errorBanner}>{error}</div>}

                  <button style={S.btnGoogle} onClick={handleGoogle} type="button">
                    <GoogleSVG />
                    Continuar con Google
                  </button>

                  <div style={S.divider}>
                    <div style={S.dividerLine}/><span style={S.dividerText}>o con correo</span><div style={S.dividerLine}/>
                  </div>

                  <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:18 }}>
                    <div style={S.field}>
                      <label style={S.fieldLabel}>Correo electrónico</label>
                      <input style={S.input} type="email" placeholder="tu@correo.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
                    </div>
                    <div style={S.field}>
                      <label style={S.fieldLabel}>Contraseña</label>
                      <div style={{ position:"relative" }}>
                        <input style={S.input} type={showPw?"text":"password"} placeholder="Tu contraseña" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/>
                        <span onClick={()=>setShowPw(!showPw)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", cursor:"pointer", color:"#5E7A9E", fontSize:"1rem", userSelect:"none" }}>
                          {showPw ? "🙈" : "👁"}
                        </span>
                      </div>
                    </div>
                    <button type="submit" style={S.btnPrimary} disabled={loading}>
                      {loading ? <Loader2 style={{ width:18, height:18, animation:"spin 1s linear infinite" }}/> : "Iniciar Sesión"}
                    </button>
                  </form>

                  <p style={{ textAlign:"center", fontSize:"0.8125rem", color:"#5E7A9E" }}>
                    ¿No tienes cuenta?{" "}
                    <button onClick={()=>{ setMode("register"); setStep(1); setError(""); }} style={{ background:"none", border:"none", color:"#5B8DEF", cursor:"pointer", fontWeight:700, fontSize:"inherit" }}>
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </>
            )}

            {/* ══════════════════════
                REGISTER — WIZARD
            ══════════════════════ */}
            {mode === "register" && step < 4 && (
              <>
                {/* Step indicator */}
                <div style={S.steps}>
                  {["Cuenta","Perfil","Pago"].map((lbl, i) => {
                    const n = i + 1;
                    return (
                      <React_Fragment key={lbl}>
                        <div style={S.stepItem}>
                          <div style={S.stepDot(isActive(n), isDone(n))}>{isDone(n) ? "✓" : n}</div>
                          <div style={S.stepLabel(isActive(n))}>{lbl}</div>
                        </div>
                        {i < 2 && <div style={S.stepConnector(isDone(n))} />}
                      </React_Fragment>
                    );
                  })}
                </div>

                {error && <div style={{ ...S.errorBanner, marginBottom:16 }}>{error}</div>}

                {/* STEP 1 — Cuenta */}
                {step === 1 && (
                  <div style={S.formCard}>
                    <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"1.8rem", letterSpacing:"0.03em", color:"#E8F0FF" }}>Crear cuenta</div>
                    <p style={{ color:"#5E7A9E", fontSize:"0.875rem", marginTop:-16, lineHeight:1.5 }}>Empieza en 30 segundos. Sin tarjeta de crédito.</p>

                    <button style={S.btnGoogle} onClick={handleGoogle} type="button">
                      <GoogleSVG /> Continuar con Google
                    </button>

                    <div style={S.divider}>
                      <div style={S.dividerLine}/><span style={S.dividerText}>o con correo</span><div style={S.dividerLine}/>
                    </div>

                    <div style={S.field}>
                      <label style={S.fieldLabel}>Correo electrónico</label>
                      <input style={{ ...S.input, ...(fieldErrors.email ? S.inputError : {}) }} type="email" placeholder="tu@correo.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
                      {fieldErrors.email && <span style={S.fieldError}>{fieldErrors.email}</span>}
                    </div>

                    <div style={S.field}>
                      <label style={S.fieldLabel}>Contraseña</label>
                      <div style={{ position:"relative" }}>
                        <input style={{ ...S.input, paddingRight:44, ...(fieldErrors.password ? S.inputError : {}) }} type={showPw?"text":"password"} placeholder="Mínimo 8 caracteres" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password"/>
                        <span onClick={()=>setShowPw(!showPw)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", cursor:"pointer", color:"#5E7A9E", userSelect:"none" }}>
                          {showPw ? "🙈" : "👁"}
                        </span>
                      </div>
                      {fieldErrors.password && <span style={S.fieldError}>{fieldErrors.password}</span>}
                    </div>

                    <div style={S.field}>
                      <label style={S.fieldLabel}>Confirmar contraseña</label>
                      <input style={{ ...S.input, ...(fieldErrors.password2 ? S.inputError : {}) }} type="password" placeholder="Repite tu contraseña" value={password2} onChange={e=>setPassword2(e.target.value)} autoComplete="new-password"/>
                      {fieldErrors.password2 && <span style={S.fieldError}>{fieldErrors.password2}</span>}
                    </div>

                    <button style={S.btnPrimary} onClick={validateStep1} type="button">
                      Continuar <span>→</span>
                    </button>

                    <p style={{ textAlign:"center", fontSize:"0.75rem", color:"#5E7A9E", lineHeight:1.7 }}>
                      ¿Ya tienes cuenta?{" "}
                      <button onClick={()=>{ setMode("login"); setError(""); }} style={{ background:"none", border:"none", color:"#5B8DEF", cursor:"pointer", fontWeight:700, fontSize:"inherit" }}>
                        Iniciar sesión
                      </button>
                    </p>
                  </div>
                )}

                {/* STEP 2 — Perfil */}
                {step === 2 && (
                  <div style={S.formCard}>
                    <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"1.8rem", letterSpacing:"0.03em", color:"#E8F0FF" }}>Tu perfil</div>
                    <p style={{ color:"#5E7A9E", fontSize:"0.875rem", marginTop:-16, lineHeight:1.5 }}>Elige un alias y un avatar para que te identifiquen en la tabla.</p>

                    <div style={S.field}>
                      <label style={S.fieldLabel}>Alias / apodo</label>
                      <input style={{ ...S.input, ...(fieldErrors.alias ? S.inputError : {}) }} type="text" placeholder="ej. ElTigre10, RompeRedes, MaestroDelPredictor…" maxLength={24} value={alias} onChange={e=>setAlias(e.target.value)} autoComplete="off"/>
                      <span style={{ fontSize:"0.75rem", color:"#5E7A9E" }}>Máximo 24 caracteres. Puedes cambiarlo después.</span>
                      {fieldErrors.alias && <span style={S.fieldError}>{fieldErrors.alias}</span>}
                    </div>

                    <div style={S.field}>
                      <div style={S.fieldLabel}>Elige tu avatar</div>
                      <div style={S.avatarGrid}>
                        {AVATARS.map(av => (
                          <div key={av} style={S.avatarOption(selectedAvatar === av)} onClick={()=>setSelectedAvatar(av)}>{av}</div>
                        ))}
                      </div>
                    </div>

                    <div style={S.field}>
                      <div style={S.fieldLabel}>Selección favorita</div>
                      <div style={{ position:"relative" }}>
                        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#5E7A9E", fontSize:"0.9rem" }}>🔍</span>
                        <input style={{ ...S.input, paddingLeft:40 }} type="text" placeholder="Buscar selección…" value={countryQuery} onChange={e=>setCountryQuery(e.target.value)}/>
                      </div>
                      <div style={S.countryGrid}>
                        {filteredCountries.map(c => (
                          <div key={c.name} style={S.countryOption(selectedCountry === c.name)} onClick={()=>setSelectedCountry(c.name)}>
                            <div style={{ fontSize:"1.4rem", lineHeight:1 }}>{c.flag}</div>
                            <div style={{ fontSize:"0.5625rem", color:"#5E7A9E", textTransform:"uppercase", letterSpacing:"0.04em", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", width:"100%" }}>{c.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={S.btnRow}>
                      <button style={S.btnSecondary} onClick={()=>goStep(1)} type="button">← Atrás</button>
                      <button style={{ ...S.btnPrimary, flex:1 }} onClick={validateStep2} type="button">Continuar →</button>
                    </div>
                  </div>
                )}

                {/* STEP 3 — Pago */}
                {step === 3 && (
                  <div style={S.formCard}>
                    <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"1.8rem", letterSpacing:"0.03em", color:"#E8F0FF" }}>Inscripción</div>
                    <p style={{ color:"#5E7A9E", fontSize:"0.875rem", marginTop:-16, lineHeight:1.5 }}>Una sola cuota para toda la fase de grupos hasta la Gran Final.</p>

                    <div style={S.paymentBox}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontWeight:700, fontSize:"0.9375rem", color:"#E8F0FF" }}>Estado de cuenta</span>
                        <span style={{ background:"rgba(255,179,0,0.15)", color:"#FFB300", border:"1px solid rgba(255,179,0,0.3)", borderRadius:20, padding:"3px 10px", fontSize:"0.6875rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Pendiente</span>
                      </div>
                      <div style={{ textAlign:"center", padding:"12px 0" }}>
                        <div style={{ fontSize:"1rem", color:"#5E7A9E", fontWeight:600 }}>B/.</div>
                        <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"3rem", color:"#FFD700", letterSpacing:"0.02em" }}>15</div>
                        <div style={{ fontSize:"0.8125rem", color:"#5E7A9E" }}>pago único · torneo completo</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(27,45,71,0.70)", borderRadius:12, padding:14 }}>
                        <div style={{ width:40, height:40, borderRadius:8, background:"linear-gradient(135deg,#00C244,#00E676)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", flexShrink:0 }}>📲</div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:"0.9375rem", color:"#E8F0FF" }}>Pagar con Yappy</div>
                          <div style={{ fontSize:"0.8125rem", color:"#5E7A9E", fontVariantNumeric:"tabular-nums" }}>+507 6000-0000 · @QLUMatchPredictAdmin</div>
                        </div>
                      </div>
                    </div>

                    <div style={S.field}>
                      <div style={S.fieldLabel}>Adjuntar comprobante de pago</div>
                      <div
                        style={S.uploadZone(dragOver)}
                        onClick={()=>document.getElementById("auth-file-input").click()}
                        onDragOver={e=>{ e.preventDefault(); setDragOver(true); }}
                        onDragLeave={()=>setDragOver(false)}
                        onDrop={e=>{ e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                      >
                        <input id="auth-file-input" type="file" accept="image/*,.pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
                        {uploadedFile ? (
                          <div style={{ display:"flex", alignItems:"center", gap:10, width:"100%", justifyContent:"center" }}>
                            <span>📄</span>
                            <span style={{ fontSize:"0.875rem", color:"#00E676", fontWeight:600, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{uploadedFile.name}</span>
                            <span onClick={e=>{ e.stopPropagation(); setUploadedFile(null); }} style={{ cursor:"pointer", color:"#5E7A9E" }}>✕</span>
                          </div>
                        ) : (
                          <>
                            <div style={{ fontSize:"1.8rem" }}>📎</div>
                            <div style={{ fontWeight:600, fontSize:"0.875rem", color:"#E8F0FF" }}>Toca o arrastra tu captura de pantalla</div>
                            <div style={{ fontSize:"0.75rem", color:"#5E7A9E" }}>JPG, PNG o PDF · Máximo 5 MB</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={S.btnRow}>
                      <button style={S.btnSecondary} onClick={()=>goStep(2)} type="button">← Atrás</button>
                      <button style={{ ...S.btnPrimary, flex:1 }} onClick={finishRegistration} disabled={loading} type="button">
                        {loading ? <Loader2 style={{ width:18, height:18, animation:"spin 1s linear infinite" }}/> : "Completar registro"}
                      </button>
                    </div>

                    <p style={{ textAlign:"center", fontSize:"0.8125rem", color:"#5E7A9E", cursor:"pointer" }} onClick={finishRegistration}>
                      Omitir por ahora — <span style={{ color:"#5B8DEF", textDecoration:"underline" }}>activo después del pago</span>
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ══════════════════════
                SUCCESS
            ══════════════════════ */}
            {mode === "register" && step === 4 && createdUser && (
              <div style={S.successCard}>
                <div style={{ fontSize:"4rem", animation:"authBounce 0.6s ease-out 0.2s both" }}>🏆</div>
                <div style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"2.2rem", letterSpacing:"0.03em", color:"#E8F0FF" }}>¡Estás adentro!</div>
                <p style={{ color:"#5E7A9E", fontSize:"0.9375rem", lineHeight:1.6, maxWidth:320 }}>
                  {uploadedFile
                    ? `¡Listo, ${createdUser.alias}! Tu comprobante fue recibido. Un administrador verificará tu pago en breve.`
                    : `Bienvenido, ${createdUser.alias}. Completa el pago con Yappy para activar tu cuenta.`}
                </p>
                <div style={{ background:"rgba(21,35,56,0.70)", border:"1px solid #253B5E", borderRadius:18, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, width:"100%", textAlign:"left" }}>
                  <div style={{ fontSize:"2.2rem", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(27,45,71,0.70)", borderRadius:12 }}>{createdUser.avatar}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:"1rem", color:"#E8F0FF" }}>{createdUser.alias}</div>
                    <div style={{ fontSize:"0.8125rem", color:"#5E7A9E" }}>{createdUser.email}</div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%" }}>
                  <Link href="/dashboard" style={S.btnGold}>⚡ Ir al Dashboard →</Link>
                  <Link href="/dashboard?tab=ranking" style={{ ...S.btnSecondary, textDecoration:"none", justifyContent:"center" }}>Ver Ranking actual</Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Responsive + animation styles */}
      <style>{`
        @keyframes authBounce {
          0%   { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(4deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .auth-page-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 820px) {
          .auth-page-grid { grid-template-columns: 1fr !important; }
          .auth-left-panel { display: none !important; }
          .auth-top-bar { display: flex !important; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        }
        .country-grid::-webkit-scrollbar { width: 4px; }
        .country-grid::-webkit-scrollbar-thumb { background: #253B5E; border-radius: 2px; }
      `}</style>
    </>
  );
}

/* tiny helper to avoid importing React for Fragment */
function React_Fragment({ children }) { return children; }

/* Google SVG icon */
function GoogleSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:20, height:20, flexShrink:0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
