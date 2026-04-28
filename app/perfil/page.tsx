"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle,
  CarProfile,
  Heart,
  Bell,
  GearSix,
  SignOut,
  ShoppingCart,
  Star,
  MapPin,
  Pencil,
  WhatsappLogo,
  ArrowRight,
  Camera,
  CurrencyDollar,
  Eye,
} from "@phosphor-icons/react";
import MovelPageHeader from "@/components/MovelPageHeader";
import BottomNav from "@/components/BottomNav";

/* ─── mock data ─────────────────────────────────────────────────── */
const IS_LOGGED_IN = true; // toggle for demo

const mockUser = {
  name: "Juan Esteban García",
  email: "juanesteban@gmail.com",
  phone: "+57 317 573 7083",
  city: "Medellín, Antioquia",
  accountType: "vendedor" as "comprador" | "vendedor",
  joinDate: "Febrero 2024",
  avatar: null as string | null,
};

const mockPublicaciones = [
  { id: "p1", titulo: "Toyota Hilux 2021 4x4", precio: 148_000_000, visitas: 312, estado: "activo", img: "" },
  { id: "p2", titulo: "Mazda CX-5 Grand Touring 2022", precio: 127_000_000, visitas: 204, estado: "activo", img: "" },
  { id: "p3", titulo: "Renault Sandero Stepway 2020", precio: 52_000_000, visitas: 88, estado: "vendido", img: "" },
];

const mockFavoritos = [
  { id: "f1", titulo: "BMW 320i 2023", marca: "BMW", precio: 215_000_000, km: "8.500 km", img: "" },
  { id: "f2", titulo: "Mercedes C200 2022", marca: "Mercedes-Benz", precio: 245_000_000, km: "12.000 km", img: "" },
  { id: "f3", titulo: "Honda Civic 2023", marca: "Honda", precio: 89_000_000, km: "6.200 km", img: "" },
  { id: "f4", titulo: "Kia Sportage 2023", marca: "Kia", precio: 118_000_000, km: "15.400 km", img: "" },
];

function fmtCOP(n: number) {
  return "$ " + n.toLocaleString("es-CO");
}

/* ─── badges ────────────────────────────────────────────────────── */
function TypeBadge({ type }: { type: "comprador" | "vendedor" }) {
  return type === "vendedor" ? (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#1978e5]/15 text-[#60a5fa] border border-[#1978e5]/30">
      <CarProfile size={12} weight="fill" />
      Vendedor
    </span>
  ) : (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
      <ShoppingCart size={12} weight="fill" />
      Comprador
    </span>
  );
}

/* ─── vehicle mini card ─────────────────────────────────────────── */
function PublicacionCard({ item }: { item: typeof mockPublicaciones[0] }) {
  const isVendido = item.estado === "vendido";
  return (
    <div className={`rounded-2xl overflow-hidden border ${isVendido ? "border-white/5 opacity-60" : "border-white/10"}`}
      style={{ background: "rgba(255,255,255,0.05)" }}>
      <div className="h-28 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0d1b2e, #1565c0)" }}>
        <CarProfile size={40} color="rgba(255,255,255,0.2)" weight="fill" />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-white text-[12px] font-bold leading-tight">{item.titulo}</p>
          <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full ${
            isVendido
              ? "bg-gray-500/20 text-gray-400"
              : "bg-emerald-500/20 text-emerald-400"
          }`}>
            {isVendido ? "Vendido" : "Activo"}
          </span>
        </div>
        <p className="text-[#60a5fa] text-[13px] font-black">{fmtCOP(item.precio)}</p>
        <div className="flex items-center gap-1 mt-1.5 text-white/30 text-[11px]">
          <Eye size={11} />
          {item.visitas} visitas
        </div>
      </div>
    </div>
  );
}

function FavoritoCard({ item }: { item: typeof mockFavoritos[0] }) {
  const [liked, setLiked] = useState(true);
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10"
      style={{ background: "rgba(255,255,255,0.05)" }}>
      <div className="h-28 flex items-center justify-center relative"
        style={{ background: "linear-gradient(135deg, #0d1b2e, #1565c0)" }}>
        <CarProfile size={40} color="rgba(255,255,255,0.2)" weight="fill" />
        <button onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
          <Heart size={14} weight={liked ? "fill" : "regular"}
            color={liked ? "#f87171" : "rgba(255,255,255,0.5)"} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-white text-[12px] font-bold leading-tight mb-0.5">{item.titulo}</p>
        <p className="text-[#60a5fa] text-[13px] font-black">{fmtCOP(item.precio)}</p>
        <p className="text-white/30 text-[11px] mt-1">{item.km}</p>
      </div>
    </div>
  );
}

/* ─── main ──────────────────────────────────────────────────────── */
type ProfileTab = "info" | "publicaciones" | "favoritos";

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");

  /* ── not logged in ── */
  if (!IS_LOGGED_IN) {
    return (
      <div className="min-h-screen pb-24"
        style={{ background: "linear-gradient(160deg, #08101e 0%, #0d1b2e 55%, #0f2040 100%)" }}>
        <MovelPageHeader />
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <UserCircle size={80} color="rgba(255,255,255,0.15)" weight="fill" className="mb-4" />
          <p className="text-white text-[22px] font-black mb-2">Tu perfil MOVEL</p>
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

      {/* ── avatar card ── */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-6 mb-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-start gap-4">
            {/* avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
                {mockUser.avatar ? (
                  <img src={mockUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle size={52} color="white" weight="fill" />
                )}
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#1978e5] flex items-center justify-center border-2 border-[#08101e]">
                <Camera size={12} color="white" weight="fill" />
              </button>
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-white text-[18px] font-black truncate">{mockUser.name}</p>
                <TypeBadge type={mockUser.accountType} />
              </div>
              <p className="text-white/45 text-[12px] mb-0.5">{mockUser.email}</p>
              <div className="flex items-center gap-1 text-white/35 text-[12px]">
                <MapPin size={12} />
                {mockUser.city}
              </div>
              <p className="text-white/25 text-[11px] mt-1">Miembro desde {mockUser.joinDate}</p>
            </div>

            <button className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <Pencil size={15} color="rgba(255,255,255,0.5)" />
            </button>
          </div>

          {/* stats row */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Publicaciones", value: mockPublicaciones.filter(p => p.estado === "activo").length.toString() },
              { label: "Favoritos", value: mockFavoritos.length.toString() },
              { label: "Calificación", value: "4.8 ★" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-white text-[18px] font-black">{value}</p>
                <p className="text-white/35 text-[11px] font-semibold mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── tab bar ── */}
        <div className="flex rounded-2xl p-1 mb-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {([
            { id: "info", label: "Mi cuenta", icon: GearSix },
            { id: "publicaciones", label: "Publicaciones", icon: CarProfile },
            { id: "favoritos", label: "Favoritos", icon: Heart },
          ] as { id: ProfileTab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 ${
                activeTab === id
                  ? "bg-[#1978e5] text-white shadow-lg"
                  : "text-white/35 hover:text-white/60"
              }`}>
              <Icon size={16} weight={activeTab === id ? "fill" : "regular"} />
              {label}
            </button>
          ))}
        </div>

        {/* ── tab content ── */}
        <AnimatePresence mode="wait">
          {activeTab === "info" && (
            <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="rounded-2xl overflow-hidden mb-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>

                {[
                  { icon: Bell, label: "Notificaciones", sub: "Alertas de precios y mensajes", href: "#" },
                  { icon: WhatsappLogo, label: "WhatsApp vinculado", sub: mockUser.phone, href: "#" },
                  { icon: CurrencyDollar, label: "Historial de pagos", sub: "Ver transacciones", href: "#" },
                  { icon: Star, label: "Mis reseñas", sub: "Ver y gestionar reseñas", href: "#" },
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

              <button className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl font-bold text-[14px] text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors">
                <SignOut size={18} />
                Cerrar sesión
              </button>

              <p className="text-center text-white/20 text-[11px] mt-5 mb-2">
                MOVEL v1.0.0 · Plataforma automotriz de Colombia
              </p>
            </motion.div>
          )}

          {activeTab === "publicaciones" && (
            <motion.div key="pub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/60 text-[13px] font-semibold">
                  {mockPublicaciones.length} vehículos publicados
                </p>
                <Link href="/publicar"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-black text-white"
                  style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
                  + Publicar
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mockPublicaciones.map(p => <PublicacionCard key={p.id} item={p} />)}
              </div>
            </motion.div>
          )}

          {activeTab === "favoritos" && (
            <motion.div key="fav" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-white/60 text-[13px] font-semibold mb-4">
                {mockFavoritos.length} vehículos guardados
              </p>
              <div className="grid grid-cols-2 gap-3">
                {mockFavoritos.map(f => <FavoritoCard key={f.id} item={f} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
