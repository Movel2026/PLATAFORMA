"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeSimple, Lock, User as UserIcon, Eye, EyeSlash,
  CheckCircle, ArrowLeft, Phone, Car, Heart, Gavel,
  ChatCircle, ShieldCheck, Warning,
} from "@phosphor-icons/react";
import { MovelLogo } from "@/components/MovelLogo";
import { getSupabaseBrowser, supabaseBrowserConfigured } from "@/lib/supabase-browser";
import { useUser } from "@/lib/hooks/useUser";

type Tab = "login" | "register";

const BENEFITS = [
  { Icon: Car,         text: "Publica y vende tu carro" },
  { Icon: Heart,       text: "Guarda vehículos favoritos" },
  { Icon: Gavel,       text: "Participa en subastas" },
  { Icon: ChatCircle,  text: "Recibe ofertas de compradores" },
  { Icon: ShieldCheck, text: "Cuenta verificada con MOVEL" },
];

function AuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const returnUrl = params.get("return") || "/";
  const initialMode = (params.get("modo") || "").toLowerCase();
  const { user, loading: userLoading } = useUser();

  const [tab, setTab]                 = useState<Tab>(initialMode === "registro" ? "register" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [success, setSuccess]         = useState<string | null>(null);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass,  setLoginPass]  = useState("");

  // Registro
  const [regNombre,  setRegNombre]  = useState("");
  const [regEmail,   setRegEmail]   = useState("");
  const [regTelefono, setRegTelefono] = useState("");
  const [regPass,    setRegPass]    = useState("");
  const [regCiudad,  setRegCiudad]  = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // Redirigir si ya hay sesión
  useEffect(() => {
    if (!userLoading && user) {
      router.replace(returnUrl);
    }
  }, [user, userLoading, returnUrl, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!supabaseBrowserConfigured()) {
      setError("Supabase aún no está conectado. Si eres el admin, configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel → Settings → Environment Variables → Production, y haz Redeploy. Diagnóstico: /api/health");
      return;
    }
    setSubmitting(true);
    try {
      const sb = getSupabaseBrowser();
      if (!sb) throw new Error("No se pudo inicializar el cliente");
      const { error: err } = await sb.auth.signInWithPassword({
        email: loginEmail.trim().toLowerCase(),
        password: loginPass,
      });
      if (err) {
        if (err.message.includes("Invalid login credentials")) {
          setError("Correo o contraseña incorrectos.");
        } else if (err.message.includes("Email not confirmed")) {
          setError("Confirma tu correo electrónico antes de iniciar sesión.");
        } else {
          setError(err.message);
        }
        return;
      }
      router.replace(returnUrl);
    } catch (e) {
      setError(String(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!aceptaTerminos) {
      setError("Debes aceptar los Términos y la Política de Privacidad.");
      return;
    }
    if (regPass.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!supabaseBrowserConfigured()) {
      setError("Supabase aún no está conectado. Si eres el admin, configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel → Settings → Environment Variables → Production, y haz Redeploy. Diagnóstico: /api/health");
      return;
    }
    setSubmitting(true);
    try {
      const sb = getSupabaseBrowser();
      if (!sb) throw new Error("No se pudo inicializar el cliente");
      const { error: err, data } = await sb.auth.signUp({
        email: regEmail.trim().toLowerCase(),
        password: regPass,
        options: {
          data: {
            nombre: regNombre,
            telefono: regTelefono,
            ciudad: regCiudad,
          },
          emailRedirectTo: typeof window !== "undefined"
            ? `${window.location.origin}${returnUrl}`
            : undefined,
        },
      });
      if (err) {
        if (err.message.includes("already registered")) {
          setError("Ya existe una cuenta con este correo. Inicia sesión.");
        } else {
          setError(err.message);
        }
        return;
      }
      // Guardar metadata en tabla users (opcional, si la has creado)
      try {
        if (data.user) {
          await fetch("/api/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: data.user.id,
              nombre: regNombre,
              email: regEmail,
              telefono: regTelefono,
              ciudad: regCiudad,
              origen: "web_signup",
            }),
          });
        }
      } catch { /* opcional */ }

      setSuccess("¡Cuenta creada! Revisa tu correo para confirmar la dirección. Una vez confirmada podrás iniciar sesión.");
      setTab("login");
    } catch (e) {
      setError(String(e));
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = "w-full pl-11 pr-4 py-3 bg-white border-2 border-[#dce0e5] rounded-xl text-[14px] text-ink placeholder:text-mute outline-none focus:border-movel-900 transition-colors";

  return (
    <div className="min-h-screen bg-cloud flex flex-col">
      {/* Header */}
      <div className="bg-movel-gradient-dark px-4 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-[13px] font-semibold">
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
          <MovelLogo variant="white" size={32} animate={false} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 items-start">

          {/* Beneficios (desktop) */}
          <div className="hidden lg:block pt-8">
            <h1 className="font-display text-[40px] leading-tight text-movel-900 mb-3">
              Únete a MOVEL
            </h1>
            <p className="text-[16px] text-mute mb-8 leading-relaxed max-w-md">
              Crea tu cuenta para publicar vehículos, recibir ofertas y guardar tus favoritos.
              Es gratis y solo cobramos 3% si vendemos por ti.
            </p>
            <div className="space-y-3">
              {BENEFITS.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-movel-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} color="#0B1E4E" weight="fill" />
                  </div>
                  <p className="text-[14px] text-ink font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta auth */}
          <div className="bg-white rounded-3xl p-7 md:p-8 shadow-movel-lg border border-[#dce0e5]">
            {/* Tabs */}
            <div className="flex gap-1 bg-cloud rounded-xl p-1 mb-6">
              <button
                onClick={() => { setTab("login"); setError(null); setSuccess(null); }}
                className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold transition-all ${
                  tab === "login" ? "bg-white text-movel-900 shadow-sm" : "text-mute"
                }`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => { setTab("register"); setError(null); setSuccess(null); }}
                className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold transition-all ${
                  tab === "register" ? "bg-white text-movel-900 shadow-sm" : "text-mute"
                }`}
              >
                Crear cuenta
              </button>
            </div>

            {/* Mensajes */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                >
                  <Warning size={16} color="#dc2626" weight="fill" className="flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-red-700">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2"
                >
                  <CheckCircle size={16} color="#16a34a" weight="fill" className="flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-green-700">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Login ── */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <EnvelopeSimple size={18} color="#7A8195" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    className={inputCls}
                  />
                </div>
                <div className="relative">
                  <Lock size={18} color="#7A8195" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Tu contraseña"
                    required
                    className={inputCls + " pr-11"}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-mute hover:text-ink">
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button type="submit" disabled={submitting} className="w-full btn-primary !rounded-xl disabled:opacity-60">
                  {submitting ? "Iniciando…" : "Iniciar sesión"}
                </button>
                <p className="text-center text-[12px] text-mute">
                  ¿No tienes cuenta?{" "}
                  <button type="button" onClick={() => setTab("register")} className="text-movel-600 font-bold hover:underline">
                    Regístrate gratis
                  </button>
                </p>
              </form>
            )}

            {/* ── Registro ── */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="relative">
                  <UserIcon size={18} color="#7A8195" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={regNombre}
                    onChange={(e) => setRegNombre(e.target.value)}
                    placeholder="Nombre completo"
                    required
                    className={inputCls}
                  />
                </div>
                <div className="relative">
                  <EnvelopeSimple size={18} color="#7A8195" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    required
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Phone size={18} color="#7A8195" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={regTelefono}
                      onChange={(e) => setRegTelefono(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Celular"
                      required
                      className={inputCls}
                    />
                  </div>
                  <select
                    value={regCiudad}
                    onChange={(e) => setRegCiudad(e.target.value)}
                    required
                    className="w-full pl-4 pr-4 py-3 bg-white border-2 border-[#dce0e5] rounded-xl text-[14px] text-ink outline-none focus:border-movel-900 transition-colors"
                  >
                    <option value="">Ciudad</option>
                    <option value="Bogotá">Bogotá</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cali">Cali</option>
                    <option value="Barranquilla">Barranquilla</option>
                    <option value="Cartagena">Cartagena</option>
                    <option value="Bucaramanga">Bucaramanga</option>
                    <option value="Pereira">Pereira</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>
                <div className="relative">
                  <Lock size={18} color="#7A8195" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="Contraseña (mín. 8 caracteres)"
                    required
                    minLength={8}
                    className={inputCls + " pr-11"}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-mute hover:text-ink">
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-movel-900 rounded"
                  />
                  <span className="text-[12px] text-mute leading-relaxed">
                    Acepto los{" "}
                    <Link href="/terminos" target="_blank" className="text-movel-600 font-semibold hover:underline">Términos y Condiciones</Link>
                    {" "}y la{" "}
                    <Link href="/privacidad" target="_blank" className="text-movel-600 font-semibold hover:underline">Política de Privacidad</Link>.
                  </span>
                </label>

                <button type="submit" disabled={submitting || !aceptaTerminos} className="w-full btn-primary !rounded-xl disabled:opacity-60">
                  {submitting ? "Creando cuenta…" : "Crear cuenta gratis"}
                </button>
                <p className="text-center text-[12px] text-mute">
                  ¿Ya tienes cuenta?{" "}
                  <button type="button" onClick={() => setTab("login")} className="text-movel-600 font-bold hover:underline">
                    Inicia sesión
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-mute">Cargando…</div>}>
      <AuthContent />
    </Suspense>
  );
}
