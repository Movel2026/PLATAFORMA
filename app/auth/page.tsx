"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeSimple,
  Lock,
  User,
  Eye,
  EyeSlash,
  CheckCircle,
  ArrowLeft,
  Check,
  Phone,
  Car,
  Heart,
  Gavel,
  ChatCircle,
  ShieldCheck,
} from "@phosphor-icons/react";

function MovelLogoWhite() {
  return (
    <svg width="100" height="30" viewBox="0 0 120 36" fill="none" aria-label="MOVEL">
      <text x="0" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">M</text>
      <g>
        <text x="23" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">O</text>
        <circle cx="36" cy="16" r="7" fill="#1565c0" />
        <circle cx="36" cy="16" r="7" fill="none" stroke="white" strokeWidth="1.2" />
        <line x1="36" y1="16" x2="40.5" y2="10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="36" cy="16" r="1.2" fill="white" />
        <line x1="29.5" y1="16" x2="31" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="36" y1="9.5" x2="36" y2="11" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="42.5" y1="16" x2="41" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </g>
      <text x="51" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">VEL</text>
    </svg>
  );
}

type Tab = "login" | "register";

const BENEFITS = [
  { icon: Car,         color: "#60a5fa", text: "Compra y vende tu carro fácilmente" },
  { icon: Heart,       color: "#f87171", text: "Guarda tus vehículos favoritos" },
  { icon: Gavel,       color: "#a78bfa", text: "Participa en subastas en vivo" },
  { icon: ChatCircle,  color: "#34d399", text: "Conecta con compradores y vendedores" },
  { icon: ShieldCheck, color: "#fbbf24", text: "Compra con garantía MOVEL" },
];

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successName, setSuccessName] = useState("");

  /* login */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass,  setLoginPass]  = useState("");

  /* register */
  const [regName,  setRegName]  = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPass,  setRegPass]  = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const stored = localStorage.getItem("movel_user");
    const nombre = stored ? JSON.parse(stored).name : loginEmail.split("@")[0];
    localStorage.setItem("movel_session", JSON.stringify({ email: loginEmail, loggedIn: true }));
    setSuccessName(nombre);
    setSuccess(true);
    setTimeout(() => { window.location.href = "/perfil"; }, 1400);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const userData = {
      name:      regName,
      email:     regEmail,
      phone:     regPhone,
      city:      "",
      joinDate:  new Date().toLocaleDateString("es-CO", { month: "long", year: "numeric" }),
    };
    localStorage.setItem("movel_user",    JSON.stringify(userData));
    localStorage.setItem("movel_session", JSON.stringify({ email: regEmail, loggedIn: true }));
    setSuccessName(regName.split(" ")[0]);
    setSuccess(true);
    setTimeout(() => { window.location.href = "/perfil"; }, 1400);
  }

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(135deg, #08101e 0%, #0d1b2e 60%, #0f2040 100%)" }}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <CheckCircle size={72} color="#4ade80" weight="fill" />
          <p className="text-white text-[22px] font-black">
            ¡Bienvenido{successName ? `, ${successName}` : ""}!
          </p>
          <p className="text-white/50 text-[14px]">Redirigiendo a tu perfil…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #08101e 0%, #0d1b2e 55%, #0f2040 100%)" }}>

      {/* top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white text-[13px] font-semibold transition-colors">
          <ArrowLeft size={16} />
          Inicio
        </Link>
        <MovelLogoWhite />
        <div className="w-16" />
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Tab switcher */}
          <div className="flex rounded-2xl p-1 mb-7"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {(["login", "register"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-xl text-[14px] font-black transition-all duration-300 ${
                  tab === t ? "bg-[#1978e5] text-white shadow-lg" : "text-white/40 hover:text-white/70"
                }`}>
                {t === "login" ? "Iniciar sesión" : "Registrarse"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ══ LOGIN ══ */}
            {tab === "login" ? (
              <motion.form key="login"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin} className="space-y-4">

                <Field label="Correo electrónico" icon={<EnvelopeSimple size={18} color="rgba(255,255,255,0.35)" />}>
                  <input type="email" required placeholder="tu@correo.com"
                    value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                    className="input-dark w-full h-12 pl-11 pr-4 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }} />
                </Field>

                <Field label="Contraseña" icon={<Lock size={18} color="rgba(255,255,255,0.35)" />}>
                  <input type={showPassword ? "text" : "password"} required placeholder="••••••••"
                    value={loginPass} onChange={e => setLoginPass(e.target.value)}
                    className="input-dark w-full h-12 pl-11 pr-12 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </Field>

                <div className="flex justify-end">
                  <button type="button" className="text-[13px] text-[#60a5fa] hover:text-white font-semibold transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button type="submit"
                  className="w-full h-12 rounded-xl font-black text-[15px] text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #1565c0 0%, #1978e5 55%, #42a5f5 100%)" }}>
                  Entrar a mi cuenta
                </button>

                <Divider />

                <p className="text-center text-white/50 text-[13px]">
                  ¿No tienes cuenta?{" "}
                  <button type="button" onClick={() => setTab("register")}
                    className="text-[#60a5fa] font-bold hover:text-white transition-colors">
                    Regístrate gratis
                  </button>
                </p>
              </motion.form>

            ) : (

            /* ══ REGISTER ══ */
              <motion.form key="register"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleRegister} className="space-y-4">

                {/* Benefits banner */}
                <div className="rounded-2xl p-4"
                  style={{ background: "rgba(25,120,229,0.12)", border: "1px solid rgba(25,120,229,0.25)" }}>
                  <p className="text-[12px] font-black text-[#60a5fa] uppercase tracking-wider mb-3">
                    Con tu cuenta MOVEL puedes:
                  </p>
                  <div className="space-y-2">
                    {BENEFITS.map(({ icon: Icon, color, text }) => (
                      <div key={text} className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${color}20` }}>
                          <Icon size={13} color={color} weight="fill" />
                        </div>
                        <span className="text-[13px] text-white/75">{text}</span>
                        <Check size={12} color="#4ade80" weight="bold" className="ml-auto flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nombre */}
                <Field label="Nombre completo" icon={<User size={18} color="rgba(255,255,255,0.35)" />}>
                  <input type="text" required placeholder="Juan Esteban García"
                    value={regName} onChange={e => setRegName(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }} />
                </Field>

                {/* Celular */}
                <Field label="Número de celular" icon={<Phone size={18} color="rgba(255,255,255,0.35)" />}>
                  <input type="tel" required placeholder="3XX XXX XXXX"
                    value={regPhone} onChange={e => setRegPhone(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }} />
                </Field>

                {/* Email */}
                <Field label="Correo electrónico" icon={<EnvelopeSimple size={18} color="rgba(255,255,255,0.35)" />}>
                  <input type="email" required placeholder="tu@correo.com"
                    value={regEmail} onChange={e => setRegEmail(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }} />
                </Field>

                {/* Contraseña */}
                <Field label="Contraseña" icon={<Lock size={18} color="rgba(255,255,255,0.35)" />}>
                  <input type={showPassword ? "text" : "password"} required minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    value={regPass} onChange={e => setRegPass(e.target.value)}
                    className="w-full h-12 pl-11 pr-12 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </Field>

                <p className="text-[12px] text-white/35 text-center leading-5">
                  Al registrarte, aceptas los{" "}
                  <span className="text-[#60a5fa] cursor-pointer hover:text-white">Términos de uso</span>
                  {" "}y la{" "}
                  <span className="text-[#60a5fa] cursor-pointer hover:text-white">Política de privacidad</span>
                  {" "}de MOVEL.
                </p>

                <button type="submit"
                  className="w-full h-12 rounded-xl font-black text-[15px] text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #1565c0 0%, #1978e5 55%, #42a5f5 100%)" }}>
                  Crear mi cuenta gratis →
                </button>

                <p className="text-center text-white/50 text-[13px]">
                  ¿Ya tienes cuenta?{" "}
                  <button type="button" onClick={() => setTab("login")}
                    className="text-[#60a5fa] font-bold hover:text-white transition-colors">
                    Inicia sesión
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Helpers de UI ── */
function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/60 text-[12px] font-bold mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</span>
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-white/30 text-[12px] font-semibold">o</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}
