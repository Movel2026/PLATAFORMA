"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle, CarProfile, Heart, Bell, GearSix, SignOut,
  Star, MapPin, Pencil, WhatsappLogo, ArrowRight, Camera,
  CurrencyDollar, PlusCircle,
} from "@phosphor-icons/react";
import MovelPageHeader from "@/components/MovelPageHeader";
import { MovelLogo } from "@/components/MovelLogo";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/lib/hooks/useUser";

function fmtCOP(n: number) {
  return "$ " + n.toLocaleString("es-CO");
}

type ProfileTab = "info" | "publicaciones" | "favoritos";

interface FavItem {
  id: string;
  titulo: string;
  precio: number;
  km?: string;
  img?: string;
}

interface MiPublicacion {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  precio: number;
  ciudad: string;
  kilometraje: number;
  estado: string;
  fotos_urls?: string[];
}

const ESTADO_LABEL: Record<string, { label: string; color: string }> = {
  pendiente: { label: "En revisión", color: "bg-amber-500/20 text-amber-300" },
  activo:    { label: "Publicado",    color: "bg-green-500/20 text-green-300" },
  pausado:   { label: "Pausado",      color: "bg-gray-500/20 text-gray-300"  },
  vendido:   { label: "Vendido",      color: "bg-blue-500/20 text-blue-300"  },
  rechazado: { label: "Rechazado",    color: "bg-red-500/20 text-red-300"    },
};

const fmtPrecio = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

export default function PerfilPage() {
  const { user, loading: userLoading, signOut, configured } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
  const [favoritos, setFavoritos] = useState<FavItem[]>([]);
  const [publicaciones, setPublicaciones] = useState<MiPublicacion[]>([]);
  const [loadingPubs, setLoadingPubs] = useState(false);

  // Leer favoritos de localStorage
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem("movel_favoritos") || "[]");
      setFavoritos(favs);
    } catch { /* ignore */ }
  }, []);

  // Cargar publicaciones del usuario cuando hay sesión
  useEffect(() => {
    if (!user) return;
    setLoadingPubs(true);
    const email = user.email || "";
    fetch(`/api/mis-publicaciones?email=${encodeURIComponent(email)}&userId=${user.id}`)
      .then((r) => (r.ok ? r.json() : { vehicles: [] }))
      .then((d) => setPublicaciones(d.vehicles || []))
      .catch(() => setPublicaciones([]))
      .finally(() => setLoadingPubs(false));
  }, [user]);

  async function handleLogout() {
    await signOut();
    router.push("/auth");
  }

  // Extraer datos del usuario desde Supabase auth metadata
  const nombre   = user?.user_metadata?.nombre   || user?.email?.split("@")[0] || "Usuario MOVEL";
  const email    = user?.email || "";
  const telefono = user?.user_metadata?.telefono || "";
  const ciudad   = user?.user_metadata?.ciudad   || "Colombia";
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("es-CO", { month: "long", year: "numeric" })
    : new Date().toLocaleDateString("es-CO", { month: "long", year: "numeric" });

  /* ── Cargando ── */
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #08101e 0%, #0d1b2e 55%, #0f2040 100%)" }}>
        <p className="text-white/40 text-[14px]">Cargando…</p>
      </div>
    );
  }

  /* ── No autenticado ── */
  if (!user) {
    return (
      <div className="min-h-screen pb-24"
        style={{ background: "linear-gradient(160deg, #08101e 0%, #0d1b2e 55%, #0f2040 100%)" }}>
        <MovelPageHeader />
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <UserCircle size={80} color="rgba(255,255,255,0.15)" weight="fill" className="mb-4" />
          <p className="text-white text-[22px] font-black mb-2 flex items-center justify-center gap-2">Tu perfil <MovelLogo variant="white" size={22} animate={false} className="inline-block" /></p>
          <p className="text-white/45 text-[14px] mb-8 max-w-xs">
            Inicia sesión o regístrate para publicar vehículos, guardar favoritos y más.
          </p>
          <Link href="/auth"
            className="px-8 py-3 rounded-xl font-black text-[15px] text-white"
            style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
            Iniciar sesión →
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24"
      style={{ background: "linear-gradient(160deg, #08101e 0%, #0d1b2e 55%, #0f2040 100%)" }}>
      <MovelPageHeader />

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* ── avatar card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl p-6 mb-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-start gap-4">
            {/* avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
                <span className="text-white text-[32px] font-black">
                  {nombre.charAt(0).toUpperCase()}
                </span>
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#1978e5] flex items-center justify-center border-2 border-[#08101e]">
                <Camera size={12} color="white" weight="fill" />
              </button>
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-white text-[18px] font-black truncate">{nombre}</p>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#1978e5]/15 text-[#60a5fa] border border-[#1978e5]/30">
                  ✅ Miembro
                </span>
              </div>
              <p className="text-white/45 text-[12px] mb-0.5">{email}</p>
              {ciudad && (
                <div className="flex items-center gap-1 text-white/35 text-[12px]">
                  <MapPin size={12} />
                  {ciudad}
                </div>
              )}
              <p className="text-white/25 text-[11px] mt-1">Miembro desde {joinDate}</p>
            </div>

            <button className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <Pencil size={15} color="rgba(255,255,255,0.5)" />
            </button>
          </div>

          {/* stats row */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Publicaciones", value: publicaciones.length.toString() },
              { label: "Favoritos",     value: favoritos.length.toString() },
              { label: "Activa",        value: "✓" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-white text-[20px] font-black">{value}</p>
                <p className="text-white/35 text-[11px] font-semibold mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── tab bar ── */}
        <div className="flex rounded-2xl p-1 mb-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {([
            { id: "info",          label: "Mi cuenta",     icon: GearSix },
            { id: "publicaciones", label: "Publicaciones", icon: CarProfile },
            { id: "favoritos",     label: "Favoritos",     icon: Heart },
          ] as { id: ProfileTab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 ${
                activeTab === id ? "bg-[#1978e5] text-white shadow-lg" : "text-white/35 hover:text-white/60"
              }`}>
              <Icon size={16} weight={activeTab === id ? "fill" : "regular"} />
              {label}
            </button>
          ))}
        </div>

        {/* ── tab content ── */}
        <AnimatePresence mode="wait">

          {/* MI CUENTA */}
          {activeTab === "info" && (
            <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="rounded-2xl overflow-hidden mb-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {[
                  { icon: Bell,          label: "Notificaciones",   sub: "Alertas de precios y mensajes",       href: "/foro" },
                  { icon: WhatsappLogo,  label: "WhatsApp vinculado", sub: telefono || "No registrado",         href: telefono ? `https://wa.me/57${telefono.replace(/\D/g,"")}` : "#" },
                  { icon: CurrencyDollar, label: "Historial de pagos", sub: "Ver transacciones",                href: "#" },
                  { icon: Star,          label: "Mis reseñas",       sub: "Ver y gestionar reseñas",            href: "#" },
                ].map(({ icon: Icon, label, sub, href }, i, arr) => (
                  <Link key={label} href={href}
                    className={`flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors ${
                      i < arr.length - 1 ? "border-b border-white/5" : ""
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(25,120,229,0.15)" }}>
                        <Icon size={18} color="#60a5fa" weight="fill" />
                      </div>
                      <div>
                        <p className="text-white text-[14px] font-bold">{label}</p>
                        <p className="text-white/35 text-[11px]">{sub}</p>
                      </div>
                    </div>
                    <ArrowRight size={16} color="rgba(255,255,255,0.2)" />
                  </Link>
                ))}
              </div>

              <button onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl font-bold text-[14px] text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors">
                <SignOut size={18} />
                Cerrar sesión
              </button>
              <p className="text-center text-white/20 text-[11px] mt-5 mb-2">
                <MovelLogo variant="white" size={14} animate={false} className="inline-block align-middle" /> v1.0 · Plataforma automotriz de Colombia
              </p>
            </motion.div>
          )}

          {/* PUBLICACIONES */}
          {activeTab === "publicaciones" && (
            <motion.div key="pub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {loadingPubs ? (
                <div className="text-center py-12 text-white/40 text-[14px]">Cargando…</div>
              ) : publicaciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <CarProfile size={52} color="rgba(255,255,255,0.12)" weight="fill" className="mb-4" />
                  <p className="text-white/60 text-[16px] font-bold mb-2">Aún no tienes publicaciones</p>
                  <p className="text-white/30 text-[13px] mb-6 max-w-xs">
                    Publica tu vehículo gratis y llega a miles de compradores en Colombia.
                  </p>
                  <Link href="/publicar"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-black text-white"
                    style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
                    <PlusCircle size={18} weight="fill" />
                    Publicar mi vehículo
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/60 text-[13px] font-semibold">
                      {publicaciones.length} vehículo{publicaciones.length !== 1 ? "s" : ""} publicado{publicaciones.length !== 1 ? "s" : ""}
                    </p>
                    <Link
                      href="/mis-publicaciones"
                      className="text-[12px] font-bold text-[#60a5fa] hover:underline"
                    >
                      Administrar →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {publicaciones.map((p) => {
                      const est = ESTADO_LABEL[p.estado] || ESTADO_LABEL.pendiente;
                      const foto = Array.isArray(p.fotos_urls) && p.fotos_urls.length > 0 ? p.fotos_urls[0] : null;
                      return (
                        <Link
                          key={p.id}
                          href="/mis-publicaciones"
                          className="flex gap-3 rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-colors"
                          style={{ background: "rgba(255,255,255,0.04)" }}
                        >
                          <div className="w-28 h-24 shrink-0 flex items-center justify-center overflow-hidden"
                            style={{ background: "linear-gradient(135deg, #0d1b2e, #1565c0)" }}>
                            {foto ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={foto} alt={`${p.marca} ${p.modelo}`} className="w-full h-full object-cover" />
                            ) : (
                              <CarProfile size={36} color="rgba(255,255,255,0.3)" weight="fill" />
                            )}
                          </div>
                          <div className="flex-1 p-3 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-white text-[14px] font-bold leading-tight truncate">
                                {p.marca} {p.modelo} {p.ano}
                              </p>
                              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${est.color}`}>
                                {est.label}
                              </span>
                            </div>
                            <p className="text-[#60a5fa] text-[14px] font-black">{fmtPrecio(p.precio || 0)}</p>
                            <p className="text-white/40 text-[11px] mt-0.5">
                              {p.ciudad}{p.kilometraje ? ` · ${p.kilometraje.toLocaleString("es-CO")} km` : ""}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href="/publicar"
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-white border border-white/15 hover:bg-white/5 transition-colors"
                  >
                    <PlusCircle size={16} weight="fill" />
                    Publicar otro vehículo
                  </Link>
                </>
              )}
            </motion.div>
          )}

          {/* FAVORITOS */}
          {activeTab === "favoritos" && (
            <motion.div key="fav" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {favoritos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <Heart size={52} color="rgba(255,255,255,0.12)" weight="fill" className="mb-4" />
                  <p className="text-white/60 text-[16px] font-bold mb-2">No tienes favoritos guardados</p>
                  <p className="text-white/30 text-[13px] mb-6 max-w-xs">
                    Guarda vehículos que te interesen para verlos aquí.
                  </p>
                  <Link href="/buscar"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-black text-white"
                    style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
                    Explorar vehículos →
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-white/60 text-[13px] font-semibold mb-4">
                    {favoritos.length} vehículo{favoritos.length !== 1 ? "s" : ""} guardado{favoritos.length !== 1 ? "s" : ""}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {favoritos.map((f) => (
                      <Link key={f.id} href={`/vehiculo/${f.id}`}
                        className="rounded-2xl overflow-hidden border border-white/10 block"
                        style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className="h-28 flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #0d1b2e, #1565c0)" }}>
                          <CarProfile size={40} color="rgba(255,255,255,0.2)" weight="fill" />
                        </div>
                        <div className="p-3">
                          <p className="text-white text-[12px] font-bold leading-tight mb-0.5 truncate">{f.titulo}</p>
                          <p className="text-[#60a5fa] text-[13px] font-black">{fmtCOP(f.precio)}</p>
                          {f.km && <p className="text-white/30 text-[11px] mt-1">{f.km}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
