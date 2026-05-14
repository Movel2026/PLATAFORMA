"use client";

import { useState, useEffect, useCallback } from "react";
import MovelPageHeader from "@/components/MovelPageHeader";
import {
  Car, TrendUp, Gavel, MagnifyingGlass, User, ChartBar, Warning,
  WhatsappLogo, ShieldCheck, Lock, ChatCircle, ArrowClockwise,
  Spinner, Database, Users, Envelope, Globe, DeviceMobile,
  Desktop, ArrowUp, ArrowDown, Minus,
} from "@phosphor-icons/react";

// ─── PIN gate ────────────────────────────────────────────────
const ADMIN_PIN = "MOVEL2025";

function PinGate({ onUnlock }: { onUnlock: (pin: string) => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      onUnlock(pin);
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #08101e 0%, #0d1b2e 55%, #0f2040 100%)" }}
    >
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
          <ShieldCheck size={32} color="white" weight="fill" />
        </div>
        <h1 className="text-white text-[22px] font-black mb-1">Panel de Administración</h1>
        <p className="text-white/40 text-[13px] mb-8">Acceso exclusivo para el equipo MOVEL</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock size={18} color="rgba(255,255,255,0.35)"
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              placeholder="Ingresa el PIN de acceso"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-[15px] outline-none transition-all"
              style={{
                background: error ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.08)",
                border: `1.5px solid ${error ? "#ef4444" : "rgba(255,255,255,0.12)"}`,
              }}
            />
          </div>
          {error && <p className="text-red-400 text-[13px]">PIN incorrecto. Intenta de nuevo.</p>}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-white text-[15px] transition-all active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #1565c0, #1978e5)" }}
          >
            Entrar al panel
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Tipos ───────────────────────────────────────────────────
interface StatsData {
  configured: boolean;
  totales: { usuarios: number; publicaciones: number; ofertas: number; contactos: number };
  registrosPorDia: Record<string, number>;
  publicacionesPorEstado: Record<string, number>;
  publicaciones: Publicacion[];
  ofertas: Oferta[];
  contactos: Contacto[];
  usuarios: Usuario[];
}

interface Publicacion {
  id: string;
  // Contacto
  nombre: string; email: string; celular: string;
  // Identificación
  marca: string; modelo: string; ano: number; version?: string;
  placa?: string; ultimo_digito_placa?: string;
  // Características
  precio: number; kilometraje?: number; ciudad: string;
  color?: string; transmision?: string; combustible?: string;
  motor?: string; potencia?: string; carroceria?: string;
  pasajeros?: string;
  // Fotos
  total_fotos: number;
  fotos_urls?: string[];   // URLs públicas en Supabase Storage
  // Adicional
  descripcion?: string;
  accept_offers?: boolean; modo?: string; // "gratis" | "360"
  // Meta
  estado: string;
  notas_admin: string;
  created_at: string;
  updated_at?: string;
}
interface Oferta {
  id: string; vehiculo: string; precio_pub: number; monto_oferta: number;
  porcentaje: number; nombre: string; celular: string; estado: string; created_at: string;
}
interface Contacto {
  id: string; nombre: string; email: string; celular: string;
  mensaje: string; vehiculo: string; estado: string; created_at: string;
}
interface Usuario {
  id: string; nombre: string; email: string; telefono: string;
  ciudad: string; origen: string; created_at: string;
}
interface TraficoData {
  configured: boolean;
  totalVisitas: number;
  totalSesiones: number;
  visitasPorDia: Record<string, number>;
  paginas: { key: string; total: number; value?: number }[];
  dispositivos: { key: string; total: number; value?: number }[];
  paises: { key: string; total: number; value?: number }[];
  ciudadesCO: { key: string; total: number }[];
  periodo?: { from: string; to: string };
}

// ─── Helpers ─────────────────────────────────────────────────
function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}
function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-CO", {
    timeZone: "America/Bogota", day: "2-digit", month: "short",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
function diasDesde(iso: string): number {
  if (!iso) return 0;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (24 * 60 * 60 * 1000)));
}
function diasLabel(d: number): string {
  if (d === 0) return "Hoy";
  if (d === 1) return "Hace 1 día";
  if (d < 30)  return `Hace ${d} días`;
  const meses = Math.floor(d / 30);
  return meses === 1 ? "Hace 1 mes" : `Hace ${meses} meses`;
}
function estadoBadge(estado: string) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    pendiente:   { bg: "#fef3c7", color: "#d97706", label: "Pendiente" },
    activo:      { bg: "#dcfce7", color: "#16a34a", label: "Activo" },
    rechazado:   { bg: "#fee2e2", color: "#dc2626", label: "Rechazado" },
    vendido:     { bg: "#ede9fe", color: "#7c3aed", label: "Vendido" },
    nueva:       { bg: "#dbeafe", color: "#1d4ed8", label: "Nueva" },
    contactado:  { bg: "#fef3c7", color: "#d97706", label: "Contactado" },
    cerrada:     { bg: "#dcfce7", color: "#16a34a", label: "Cerrada" },
    nuevo:       { bg: "#dbeafe", color: "#1d4ed8", label: "Nuevo" },
    respondido:  { bg: "#dcfce7", color: "#16a34a", label: "Respondido" },
    archivado:   { bg: "#f3f4f6", color: "#6b7280", label: "Archivado" },
  };
  const s = map[estado] ?? { bg: "#f3f4f6", color: "#6b7280", label: estado };
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: s.bg, color: s.color }}>{s.label}</span>
  );
}

// ─── Minibar chart ──────────────────────────────────────────
function MiniChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).slice(-14);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <div className="flex items-end gap-1 h-10">
      {entries.map(([day, val]) => (
        <div key={day} title={`${day}: ${val}`}
          className="flex-1 rounded-sm min-w-[4px] transition-all"
          style={{
            height: `${Math.max(8, (val / max) * 40)}px`,
            background: "linear-gradient(180deg, #42a5f5, #1565c0)",
          }} />
      ))}
      {entries.length === 0 && <span className="text-[11px] text-gray-400">Sin datos aún</span>}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────
type Tab = "resumen" | "publicaciones" | "ofertas" | "contactos" | "usuarios" | "trafico";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [tab, setTab] = useState<Tab>("resumen");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [trafico, setTrafico] = useState<TraficoData | null>(null);
  const [loadingTrafico, setLoadingTrafico] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  // ── Estado de edición y notas del admin ──
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [expandedPhotos, setExpandedPhotos] = useState<string | null>(null);

  // Iniciar edición prellenando el form con los datos actuales
  const startEdit = (pub: Publicacion) => {
    setEditingId(pub.id);
    setEditForm({
      marca:       pub.marca ?? "",
      modelo:      pub.modelo ?? "",
      ano:         String(pub.ano ?? ""),
      version:     pub.version ?? "",
      color:       pub.color ?? "",
      ciudad:      pub.ciudad ?? "",
      kilometraje: String(pub.kilometraje ?? ""),
      precio:      String(pub.precio ?? ""),
      carroceria:  pub.carroceria ?? "",
      combustible: pub.combustible ?? "",
      transmision: pub.transmision ?? "",
      motor:       pub.motor ?? "",
      potencia:    pub.potencia ?? "",
      pasajeros:   pub.pasajeros ?? "",
      descripcion: pub.descripcion ?? "",
      notas_admin: pub.notas_admin ?? "",
    });
  };

  const fetchStats = useCallback(async (pin: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-pin": pin },
      });
      if (!res.ok) throw new Error("Error al cargar datos");
      const json = await res.json();
      setStats(json);
    } catch (e) {
      setError("No se pudieron cargar las métricas. Verifica la conexión a Supabase.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrafico = useCallback(async (pin: string) => {
    setLoadingTrafico(true);
    try {
      const res = await fetch("/api/admin/trafico", {
        headers: { "x-admin-pin": pin },
      });
      const json = await res.json();
      setTrafico(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTrafico(false);
    }
  }, []);

  function handleUnlock(pin: string) {
    setAdminPin(pin);
    setUnlocked(true);
    fetchStats(pin);
    fetchTrafico(pin);
  }

  // Auto-refresh cada 90 segundos
  useEffect(() => {
    if (!unlocked || !adminPin) return;
    const interval = setInterval(() => fetchStats(adminPin), 90_000);
    return () => clearInterval(interval);
  }, [unlocked, adminPin, fetchStats]);

  async function updateEstado(tabla: string, id: string, estado: string) {
    setUpdatingId(id);
    try {
      await fetch("/api/admin/stats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
        body: JSON.stringify({ tabla, id, estado }),
      });
      await fetchStats(adminPin);
    } finally {
      setUpdatingId(null);
    }
  }

  // Guardar cambios de edición admin
  async function saveEdit(id: string) {
    setSavingEdit(true);
    try {
      const res = await fetch("/api/admin/update-publicacion", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
        body: JSON.stringify({ id, fields: editForm }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditForm({});
        await fetchStats(adminPin);
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "No se pudo guardar"));
      }
    } finally {
      setSavingEdit(false);
    }
  }

  if (!unlocked) return <PinGate onUnlock={handleUnlock} />;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "resumen",       label: "Resumen",       icon: <ChartBar size={16} /> },
    { id: "publicaciones", label: "Publicaciones", icon: <Car size={16} /> },
    { id: "ofertas",       label: "Ofertas",       icon: <Gavel size={16} /> },
    { id: "contactos",     label: "Consultas",     icon: <ChatCircle size={16} /> },
    { id: "usuarios",      label: "Usuarios",      icon: <Users size={16} /> },
    { id: "trafico",       label: "Tráfico SEO",   icon: <Globe size={16} /> },
  ];

  const noSupabase = stats && !stats.configured;

  return (
    <div className="min-h-screen" style={{ background: "#f0f2f5" }}>
      <MovelPageHeader />

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-[24px] font-black text-[#111418]">Panel de Administración</h1>
            <p className="text-[#637488] text-[13px]">Solo visible para el equipo MOVEL</p>
          </div>
          <button
            onClick={() => fetchStats(adminPin)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all active:scale-[0.97]"
            style={{ background: "#1978e5" }}
          >
            {loading ? <Spinner size={14} className="animate-spin" /> : <ArrowClockwise size={14} />}
            Actualizar
          </button>
        </div>

        {/* Banner sin Supabase */}
        {noSupabase && (
          <div className="mb-5 rounded-2xl p-4 flex items-start gap-3"
            style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)", border: "1px solid #f59e0b" }}>
            <Warning size={20} color="#d97706" weight="fill" className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-[#92400e] text-[14px] mb-1">Supabase no configurado</p>
              <p className="text-[#92400e] text-[13px]">
                Los datos en tiempo real no están disponibles. Agrega{" "}
                <code className="bg-amber-200 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
                <code className="bg-amber-200 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> en Vercel.
                Mientras tanto, los datos llegan a{" "}
                <a href="https://t.me/movelcol_bot" className="underline font-semibold">Telegram →</a>
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl p-4 bg-red-50 border border-red-200 text-red-700 text-[14px]">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all"
              style={
                tab === t.id
                  ? { background: "#1978e5", color: "white" }
                  : { background: "white", color: "#637488", border: "1px solid #dce0e5" }
              }
            >
              {t.icon} {t.label}
              {stats && t.id === "publicaciones" && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{ background: tab === t.id ? "rgba(255,255,255,0.25)" : "#e8f0fd", color: tab === t.id ? "white" : "#1978e5" }}>
                  {stats.totales.publicaciones}
                </span>
              )}
              {stats && t.id === "ofertas" && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{ background: tab === t.id ? "rgba(255,255,255,0.25)" : "#e8f0fd", color: tab === t.id ? "white" : "#1978e5" }}>
                  {stats.totales.ofertas}
                </span>
              )}
              {stats && t.id === "contactos" && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{ background: tab === t.id ? "rgba(255,255,255,0.25)" : "#e8f0fd", color: tab === t.id ? "white" : "#1978e5" }}>
                  {stats.totales.contactos}
                </span>
              )}
              {stats && t.id === "usuarios" && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{ background: tab === t.id ? "rgba(255,255,255,0.25)" : "#e8f0fd", color: tab === t.id ? "white" : "#1978e5" }}>
                  {stats.totales.usuarios}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && !stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-24" />
            ))}
          </div>
        )}

        {/* ── RESUMEN ── */}
        {tab === "resumen" && stats?.configured && (
          <div className="space-y-6">

            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Usuarios registrados", value: stats.totales.usuarios, icon: <User size={22} />, color: "#1978e5", bg: "#e8f0fd" },
                { label: "Publicaciones totales", value: stats.totales.publicaciones, icon: <Car size={22} />, color: "#16a34a", bg: "#dcfce7" },
                { label: "Ofertas recibidas", value: stats.totales.ofertas, icon: <Gavel size={22} />, color: "#d97706", bg: "#fef3c7" },
                { label: "Consultas recibidas", value: stats.totales.contactos, icon: <ChatCircle size={22} />, color: "#7c3aed", bg: "#ede9fe" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: kpi.bg, color: kpi.color }}>
                    {kpi.icon}
                  </div>
                  <p className="text-[28px] font-black text-[#111418]">{kpi.value}</p>
                  <p className="text-[12px] text-[#637488]">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Gráfico registros + estado publicaciones */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendUp size={18} color="#1978e5" />
                  <h3 className="font-bold text-[#111418] text-[15px]">Registros — últimos 14 días</h3>
                </div>
                <MiniChart data={stats.registrosPorDia} />
                <p className="text-[11px] text-[#637488] mt-2">Cada barra = un día</p>
              </div>

              <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
                <div className="flex items-center gap-2 mb-4">
                  <ChartBar size={18} color="#1978e5" />
                  <h3 className="font-bold text-[#111418] text-[15px]">Estado publicaciones</h3>
                </div>
                <div className="space-y-2">
                  {Object.entries(stats.publicacionesPorEstado).map(([estado, count]) => {
                    const total = stats.totales.publicaciones || 1;
                    const pct = Math.round((count / total) * 100);
                    const colors: Record<string, string> = {
                      pendiente: "#f59e0b", activo: "#16a34a", rechazado: "#ef4444", vendido: "#7c3aed"
                    };
                    const color = colors[estado] ?? "#6b7280";
                    return (
                      <div key={estado}>
                        <div className="flex justify-between text-[12px] mb-1">
                          <span className="capitalize text-[#637488]">{estado}</span>
                          <span className="font-bold text-[#111418]">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(stats.publicacionesPorEstado).length === 0 && (
                    <p className="text-[13px] text-[#637488]">Sin publicaciones aún</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
              <h3 className="font-bold text-[#111418] text-[15px] mb-4">Actividad reciente</h3>
              <div className="space-y-3">
                {[
                  ...stats.publicaciones.slice(0, 3).map((p) => ({
                    icon: <Car size={16} color="#1978e5" />,
                    text: `Nueva publicación: ${p.marca} ${p.modelo} ${p.ano}`,
                    sub: p.nombre, time: p.created_at,
                  })),
                  ...stats.ofertas.slice(0, 3).map((o) => ({
                    icon: <Gavel size={16} color="#d97706" />,
                    text: `Oferta recibida: ${o.vehiculo}`,
                    sub: `${o.nombre} · $${o.monto_oferta?.toLocaleString("es-CO")}`, time: o.created_at,
                  })),
                  ...stats.usuarios.slice(0, 3).map((u) => ({
                    icon: <User size={16} color="#16a34a" />,
                    text: `Nuevo usuario: ${u.nombre}`,
                    sub: u.email, time: u.created_at,
                  })),
                ]
                  .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                  .slice(0, 8)
                  .map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-2" style={{ borderBottom: i < 7 ? "1px solid #f0f2f4" : "none" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "#f0f2f4" }}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#111418] truncate">{item.text}</p>
                        <p className="text-[12px] text-[#637488] truncate">{item.sub}</p>
                      </div>
                      <span className="text-[11px] text-[#637488] shrink-0">{formatFecha(item.time)}</span>
                    </div>
                  ))}
                {stats.publicaciones.length === 0 && stats.ofertas.length === 0 && stats.usuarios.length === 0 && (
                  <p className="text-[13px] text-[#637488]">Aún no hay actividad registrada.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── PUBLICACIONES ── */}
        {tab === "publicaciones" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlass size={16} color="#637488" className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por marca, modelo, nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[14px] outline-none bg-white"
                style={{ border: "1px solid #dce0e5" }}
              />
            </div>

            {!stats?.configured ? (
              <NoSupabaseCard />
            ) : stats.publicaciones.length === 0 ? (
              <EmptyCard icon={<Car size={32} color="#637488" />} text="No hay publicaciones registradas" />
            ) : (
              stats.publicaciones
                .filter((p) =>
                  !search ||
                  `${p.marca} ${p.modelo} ${p.nombre} ${p.ciudad}`.toLowerCase().includes(search.toLowerCase())
                )
                .map((pub) => {
                  const dias = diasDesde(pub.created_at);
                  const placaMasked = pub.placa
                    ? `••• • ${pub.placa.slice(-1)}`
                    : pub.ultimo_digito_placa ? `••• • ${pub.ultimo_digito_placa}` : "—";
                  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#9aa5b4] mb-0.5">{label}</p>
                      <p className="text-[13px] text-[#111418] font-medium">{value || "—"}</p>
                    </div>
                  );
                  return (
                  <div key={pub.id} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
                    {/* ── Header ── */}
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-[#111418] text-[17px]">
                            {pub.marca} {pub.modelo} {pub.ano}
                          </h3>
                          {pub.version && <span className="text-[12px] text-[#637488]">· {pub.version}</span>}
                          {estadoBadge(pub.estado)}
                          {pub.modo === "360" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0B1E4E] text-white">
                              ⚡ Servicio 360°
                            </span>
                          )}
                          {pub.accept_offers && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fef3c7] text-[#d97706]">
                              Acepta ofertas
                            </span>
                          )}
                        </div>
                        <p className="text-[22px] font-black text-[#0B1E4E]">{formatCOP(pub.precio)}</p>
                        <p className="text-[12px] text-[#637488] mt-0.5">
                          <span className="font-bold text-[#111418]">{diasLabel(dias)}</span>
                          {" · "}{formatFecha(pub.created_at)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-[#111418] text-[14px]">{pub.nombre}</p>
                        <a href={`mailto:${pub.email}`} className="text-[#0B1E4E] text-[13px] hover:underline">{pub.email}</a>
                        <p className="text-[13px] text-[#637488]">{pub.celular}</p>
                      </div>
                    </div>

                    {/* ── Datos del vehículo (todos los campos) ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-4 rounded-xl bg-[#f8f9fa]">
                      <Field label="Marca"       value={pub.marca} />
                      <Field label="Modelo"      value={pub.modelo} />
                      <Field label="Año"         value={pub.ano} />
                      <Field label="Versión"     value={pub.version} />
                      <Field label="Color"       value={pub.color} />
                      <Field label="Ciudad"      value={pub.ciudad} />
                      <Field label="Kilometraje" value={pub.kilometraje ? `${pub.kilometraje.toLocaleString("es-CO")} km` : "—"} />
                      <Field label="Carrocería"  value={pub.carroceria} />
                      <Field label="Combustible" value={pub.combustible} />
                      <Field label="Transmisión" value={pub.transmision} />
                      <Field label="Motor"       value={pub.motor} />
                      <Field label="Potencia"    value={pub.potencia} />
                      <Field label="Pasajeros"   value={pub.pasajeros} />
                      <Field label="Fotos"       value={`${pub.total_fotos} cargada(s)`} />
                      <Field label="Público verá (placa)" value={
                        <span className="font-mono">{pub.ultimo_digito_placa ? `••• • ${pub.ultimo_digito_placa}` : placaMasked}</span>
                      } />
                      <Field label="Placa completa (priv.)" value={
                        <span className="font-mono font-bold">{pub.placa || "—"}</span>
                      } />
                    </div>

                    {/* ── Descripción ── */}
                    {pub.descripcion && (
                      <div className="mb-4 p-4 rounded-xl bg-[#f8f9fa] border-l-4 border-[#0B1E4E]">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#9aa5b4] mb-1">Descripción del vendedor</p>
                        <p className="text-[13px] text-[#111418] leading-relaxed whitespace-pre-wrap">{pub.descripcion}</p>
                      </div>
                    )}

                    {/* ── EDICIÓN INLINE (cuando editingId === pub.id) ── */}
                    {editingId === pub.id && (
                      <div className="mb-4 p-5 rounded-xl bg-[#fef3c7] border-2 border-[#f59e0b]">
                        <p className="text-[12px] font-bold text-[#92400e] mb-3 uppercase tracking-wide">✏️ Modo edición — corrige o agrega información</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { k: "marca", l: "Marca" }, { k: "modelo", l: "Modelo" },
                            { k: "ano", l: "Año" }, { k: "version", l: "Versión" },
                            { k: "color", l: "Color" }, { k: "ciudad", l: "Ciudad" },
                            { k: "kilometraje", l: "Kilometraje (km)" }, { k: "precio", l: "Precio (COP)" },
                            { k: "carroceria", l: "Carrocería" }, { k: "combustible", l: "Combustible" },
                            { k: "transmision", l: "Transmisión" }, { k: "motor", l: "Motor" },
                            { k: "potencia", l: "Potencia" }, { k: "pasajeros", l: "Pasajeros" },
                          ].map(({ k, l }) => (
                            <div key={k}>
                              <label className="block text-[10px] font-bold uppercase tracking-wide text-[#9aa5b4] mb-1">{l}</label>
                              <input
                                type="text"
                                value={editForm[k] ?? ""}
                                onChange={(e) => setEditForm({ ...editForm, [k]: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] outline-none focus:border-[#0B1E4E] bg-white"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="mt-3">
                          <label className="block text-[10px] font-bold uppercase tracking-wide text-[#9aa5b4] mb-1">Descripción</label>
                          <textarea
                            value={editForm.descripcion ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] outline-none focus:border-[#0B1E4E] bg-white"
                          />
                        </div>
                        <div className="mt-3">
                          <label className="block text-[10px] font-bold uppercase tracking-wide text-[#9aa5b4] mb-1">📝 Notas del admin (privadas)</label>
                          <textarea
                            value={editForm.notas_admin ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, notas_admin: e.target.value })}
                            placeholder="Notas internas: verificación pendiente, observaciones, contactos hechos, etc."
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] outline-none focus:border-[#0B1E4E] bg-white"
                          />
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => saveEdit(pub.id)}
                            disabled={savingEdit}
                            className="px-4 py-2 rounded-lg text-[12px] font-bold text-white bg-[#0B1E4E] hover:bg-[#050E26] transition-colors disabled:opacity-60"
                          >
                            {savingEdit ? "Guardando…" : "💾 Guardar cambios"}
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditForm({}); }}
                            className="px-4 py-2 rounded-lg text-[12px] font-bold text-[#637488] bg-white border border-[#dce0e5] hover:bg-[#f0f2f4] transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ── Notas admin (visible cuando NO está en modo edit) ── */}
                    {editingId !== pub.id && pub.notas_admin && (
                      <div className="mb-4 p-3 rounded-xl bg-[#fef3c7] border-l-4 border-[#f59e0b]">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#92400e] mb-1">📝 Notas del admin</p>
                        <p className="text-[13px] text-[#92400e] leading-relaxed whitespace-pre-wrap">{pub.notas_admin}</p>
                      </div>
                    )}

                    {/* ── Galería de fotos (verificación humana) ── */}
                    {(() => {
                      const urls = Array.isArray(pub.fotos_urls) ? pub.fotos_urls : [];
                      const hasUrls = urls.length > 0;
                      const totalReportado = pub.total_fotos ?? 0;
                      const expanded = expandedPhotos === pub.id;
                      return (
                        <div className="mb-4">
                          <button
                            onClick={() => setExpandedPhotos(expanded ? null : pub.id)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-bold text-[#0B1E4E] bg-[#EEF4FF] hover:bg-[#D7E5FF] transition-colors"
                          >
                            📷 {expanded ? "Ocultar" : `Ver ${hasUrls ? urls.length : totalReportado} foto(s) del vehículo`}
                            {hasUrls && !expanded && <span className="ml-1 text-[10px] text-green-700">✓ disponibles</span>}
                            {!hasUrls && totalReportado > 0 && !expanded && <span className="ml-1 text-[10px] text-amber-600">⚠ no almacenadas</span>}
                          </button>

                          {expanded && (
                            <div className="mt-3 p-4 rounded-xl bg-[#f8f9fa] border border-[#dce0e5]">
                              {hasUrls ? (
                                <>
                                  <p className="text-[11px] text-green-700 mb-3">
                                    ✓ {urls.length} foto(s) almacenada(s) en Supabase Storage. Click para abrir tamaño completo.
                                  </p>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {urls.map((u, i) => (
                                      <a
                                        key={u + i}
                                        href={u}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block aspect-square rounded-lg overflow-hidden border border-[#dce0e5] bg-white hover:border-[#0B1E4E] hover:shadow-md transition-all group relative"
                                      >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={u}
                                          alt={`Foto ${i + 1}`}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                          onError={(e) => {
                                            const t = e.currentTarget;
                                            t.style.display = "none";
                                            t.parentElement?.classList.add("bg-red-50", "border-red-200");
                                            const errLabel = document.createElement("div");
                                            errLabel.className = "absolute inset-0 flex items-center justify-center text-[10px] text-red-600 p-2 text-center";
                                            errLabel.textContent = `Error foto ${i + 1}`;
                                            t.parentElement?.appendChild(errLabel);
                                          }}
                                        />
                                        <div className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                                          {i + 1}
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                </>
                              ) : totalReportado > 0 ? (
                                <>
                                  <p className="text-[12px] text-amber-700 mb-2 font-semibold">
                                    ⚠️ Hay {totalReportado} foto(s) reportada(s) pero NO se almacenaron en Supabase Storage.
                                  </p>
                                  <p className="text-[11px] text-[#637488] mb-3">
                                    Esto suele pasar cuando: (1) el bucket <code className="bg-white px-1 rounded">vehiculos</code> no existe en Supabase Storage,
                                    (2) las policies no permiten upload, o (3) la columna <code className="bg-white px-1 rounded">fotos_urls</code> no existe aún en la tabla.
                                    Consulta <code className="bg-white px-1 rounded">SETUP-SUPABASE.md</code> sección 3 para crear el bucket.
                                  </p>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {Array.from({ length: totalReportado }).map((_, i) => (
                                      <div key={i} className="aspect-square rounded-lg border-2 border-dashed border-[#dce0e5] bg-white flex items-center justify-center text-[11px] text-[#9aa5b4]">
                                        Foto {i + 1}
                                      </div>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <p className="text-[12px] text-[#637488]">⚠️ Sin fotos cargadas en esta publicación.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* ── Acciones ── */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => editingId === pub.id ? setEditingId(null) : startEdit(pub)}
                        className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all"
                        style={{ background: editingId === pub.id ? "#f59e0b" : "#EEF4FF", color: editingId === pub.id ? "white" : "#0B1E4E" }}
                      >
                        ✏️ {editingId === pub.id ? "Cerrar edición" : "Editar / Agregar info"}
                      </button>
                      <span className="w-px h-6 bg-[#dce0e5]" aria-hidden />
                      {["pendiente", "activo", "rechazado", "vendido"].map((e) => (
                        <button
                          key={e}
                          disabled={pub.estado === e || updatingId === pub.id}
                          onClick={() => updateEstado("publicaciones", pub.id, e)}
                          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-40"
                          style={
                            pub.estado === e
                              ? { background: "#0B1E4E", color: "white" }
                              : { background: "#f0f2f4", color: "#637488" }
                          }
                        >
                          {updatingId === pub.id ? "..." : e.charAt(0).toUpperCase() + e.slice(1)}
                        </button>
                      ))}
                      {pub.celular && (
                        <a
                          href={`https://wa.me/${pub.celular.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white"
                          style={{ background: "#25d366" }}
                        >
                          <WhatsappLogo size={14} /> Contactar
                        </a>
                      )}
                    </div>
                  </div>
                  );
                })
            )}
          </div>
        )}

        {/* ── OFERTAS ── */}
        {tab === "ofertas" && (
          <div className="space-y-4">
            <div className="relative">
              <MagnifyingGlass size={16} color="#637488" className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por vehículo, nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[14px] outline-none bg-white"
                style={{ border: "1px solid #dce0e5" }}
              />
            </div>

            {!stats?.configured ? (
              <NoSupabaseCard />
            ) : stats.ofertas.length === 0 ? (
              <EmptyCard icon={<Gavel size={32} color="#637488" />} text="No hay ofertas registradas" />
            ) : (
              stats.ofertas
                .filter((o) =>
                  !search ||
                  `${o.vehiculo} ${o.nombre}`.toLowerCase().includes(search.toLowerCase())
                )
                .map((oferta) => (
                  <div key={oferta.id} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#111418] text-[15px]">{oferta.vehiculo}</h3>
                          {estadoBadge(oferta.estado)}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div>
                            <p className="text-[11px] text-[#637488]">Precio publicado</p>
                            <p className="font-semibold text-[#111418] text-[14px]">{formatCOP(oferta.precio_pub)}</p>
                          </div>
                          <div className="w-px h-8 bg-gray-200" />
                          <div>
                            <p className="text-[11px] text-[#637488]">Oferta</p>
                            <p className="font-black text-[#1978e5] text-[20px]">{formatCOP(oferta.monto_oferta)}</p>
                          </div>
                          <div className="w-px h-8 bg-gray-200" />
                          <div>
                            <p className="text-[11px] text-[#637488]">% del precio</p>
                            <p className="font-bold text-[18px]"
                              style={{ color: oferta.porcentaje >= 95 ? "#16a34a" : oferta.porcentaje >= 85 ? "#d97706" : "#dc2626" }}>
                              {oferta.porcentaje}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#111418] text-[14px]">{oferta.nombre}</p>
                        <p className="text-[13px] text-[#637488]">{oferta.celular}</p>
                        <p className="text-[11px] text-[#9aa5b4] mt-1">{formatFecha(oferta.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      {["nueva", "contactado", "cerrada", "rechazada"].map((e) => (
                        <button
                          key={e}
                          disabled={oferta.estado === e || updatingId === oferta.id}
                          onClick={() => updateEstado("ofertas", oferta.id, e)}
                          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-40"
                          style={
                            oferta.estado === e
                              ? { background: "#1978e5", color: "white" }
                              : { background: "#f0f2f4", color: "#637488" }
                          }
                        >
                          {updatingId === oferta.id ? "..." : e.charAt(0).toUpperCase() + e.slice(1)}
                        </button>
                      ))}
                      {oferta.celular && (
                        <a
                          href={`https://wa.me/${oferta.celular.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white"
                          style={{ background: "#25d366" }}
                        >
                          <WhatsappLogo size={14} /> Contactar
                        </a>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* ── CONSULTAS ── */}
        {tab === "contactos" && (
          <div className="space-y-4">
            <div className="relative">
              <MagnifyingGlass size={16} color="#637488" className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, email, vehículo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[14px] outline-none bg-white"
                style={{ border: "1px solid #dce0e5" }}
              />
            </div>

            {!stats?.configured ? (
              <NoSupabaseCard />
            ) : stats.contactos.length === 0 ? (
              <EmptyCard icon={<ChatCircle size={32} color="#637488" />} text="No hay consultas registradas" />
            ) : (
              stats.contactos
                .filter((c) =>
                  !search ||
                  `${c.nombre} ${c.email} ${c.vehiculo} ${c.mensaje}`.toLowerCase().includes(search.toLowerCase())
                )
                .map((contacto) => (
                  <div key={contacto.id} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#111418] text-[15px]">{contacto.nombre}</h3>
                          {estadoBadge(contacto.estado)}
                        </div>
                        {contacto.vehiculo && (
                          <p className="text-[13px] text-[#1978e5] font-medium mb-1">Re: {contacto.vehiculo}</p>
                        )}
                        {contacto.mensaje && (
                          <p className="text-[13px] text-[#637488] line-clamp-2">{contacto.mensaje}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <a href={`mailto:${contacto.email}`} className="text-[#1978e5] text-[13px] block">{contacto.email}</a>
                        <p className="text-[13px] text-[#637488]">{contacto.celular}</p>
                        <p className="text-[11px] text-[#9aa5b4] mt-1">{formatFecha(contacto.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      {["nuevo", "respondido", "archivado"].map((e) => (
                        <button
                          key={e}
                          disabled={contacto.estado === e || updatingId === contacto.id}
                          onClick={() => updateEstado("contactos", contacto.id, e)}
                          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-40"
                          style={
                            contacto.estado === e
                              ? { background: "#1978e5", color: "white" }
                              : { background: "#f0f2f4", color: "#637488" }
                          }
                        >
                          {updatingId === contacto.id ? "..." : e.charAt(0).toUpperCase() + e.slice(1)}
                        </button>
                      ))}
                      <div className="ml-auto flex gap-2">
                        {contacto.email && (
                          <a href={`mailto:${contacto.email}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                            style={{ background: "#e8f0fd", color: "#1978e5" }}>
                            <Envelope size={14} /> Email
                          </a>
                        )}
                        {contacto.celular && (
                          <a
                            href={`https://wa.me/${contacto.celular.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white"
                            style={{ background: "#25d366" }}
                          >
                            <WhatsappLogo size={14} /> WA
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* ── USUARIOS ── */}
        {tab === "usuarios" && (
          <div className="space-y-4">
            <div className="relative">
              <MagnifyingGlass size={16} color="#637488" className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, email, ciudad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[14px] outline-none bg-white"
                style={{ border: "1px solid #dce0e5" }}
              />
            </div>

            {!stats?.configured ? (
              <NoSupabaseCard />
            ) : stats.usuarios.length === 0 ? (
              <EmptyCard icon={<User size={32} color="#637488" />} text="No hay usuarios registrados" />
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #dce0e5" }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "#f8f9fa", borderBottom: "1px solid #dce0e5" }}>
                        {["Nombre", "Email", "Teléfono", "Ciudad", "Origen", "Registro"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[12px] font-bold text-[#637488] uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.usuarios
                        .filter((u) =>
                          !search ||
                          `${u.nombre} ${u.email} ${u.ciudad}`.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((u, i) => (
                          <tr key={u.id}
                            style={{ borderBottom: i < stats.usuarios.length - 1 ? "1px solid #f0f2f4" : "none" }}
                            className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                                  style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
                                  {u.nombre?.charAt(0)?.toUpperCase() ?? "?"}
                                </div>
                                <span className="font-semibold text-[#111418] text-[13px]">{u.nombre}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <a href={`mailto:${u.email}`} className="text-[#1978e5] text-[13px]">{u.email}</a>
                            </td>
                            <td className="px-4 py-3 text-[13px] text-[#637488]">{u.telefono || "-"}</td>
                            <td className="px-4 py-3 text-[13px] text-[#637488]">{u.ciudad || "-"}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                                style={{ background: "#f0f2f4", color: "#637488" }}>
                                {u.origen || "web"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[12px] text-[#9aa5b4]">{formatFecha(u.created_at)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TRÁFICO SEO ── */}
        {tab === "trafico" && (
          <div className="space-y-5">

            {/* Sin Vercel token configurado */}
            {trafico && !trafico.configured && (
              <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #dce0e5" }}>
                <div className="flex items-start gap-3 mb-5">
                  <Warning size={22} color="#d97706" weight="fill" className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-[#111418] text-[15px] mb-1">Vercel Analytics no configurado</p>
                    <p className="text-[#637488] text-[13px]">
                      Agrega estas 3 variables en <strong>Vercel → Settings → Environment Variables</strong> y redeploya:
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { key: "VERCEL_ACCESS_TOKEN", desc: "Vercel → Account Settings → Tokens → Create Token (scope: Full Account)", link: "https://vercel.com/account/tokens" },
                    { key: "VERCEL_PROJECT_ID", desc: "Vercel → tu proyecto → Settings → General → Project ID" , link: null },
                    { key: "VERCEL_TEAM_ID", desc: "Vercel → Account Settings → General → Team ID (opcional si tienes team)", link: null },
                  ].map(({ key, desc, link }) => (
                    <div key={key} className="p-3 rounded-xl" style={{ background: "#f8f9fa", border: "1px solid #dce0e5" }}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <code className="text-[#1978e5] text-[13px] font-bold">{key}</code>
                        {link && <a href={link} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#1978e5] underline">Obtener →</a>}
                      </div>
                      <p className="text-[#637488] text-[12px]">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl" style={{ background: "#e8f0fd" }}>
                  <p className="text-[#1978e5] text-[13px] font-semibold">
                    💡 Mientras tanto, ve el tráfico en{" "}
                    <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline">
                      Vercel → Analytics →
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Loading */}
            {loadingTrafico && !trafico && (
              <div className="bg-white rounded-2xl p-8 text-center" style={{ border: "1px solid #dce0e5" }}>
                <Spinner size={28} color="#1978e5" className="animate-spin mx-auto mb-3" />
                <p className="text-[#637488] text-[14px]">Cargando métricas de tráfico...</p>
              </div>
            )}

            {/* Datos de tráfico */}
            {trafico?.configured && (
              <>
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Visitas únicas (30d)", value: trafico.totalVisitas.toLocaleString("es-CO"), icon: <Globe size={20} />, color: "#1978e5", bg: "#e8f0fd" },
                    { label: "Sesiones (30d)", value: trafico.totalSesiones.toLocaleString("es-CO"), icon: <TrendUp size={20} />, color: "#16a34a", bg: "#dcfce7" },
                    { label: "Promedio diario", value: Math.round(trafico.totalVisitas / 30).toLocaleString("es-CO"), icon: <ChartBar size={20} />, color: "#d97706", bg: "#fef3c7" },
                    { label: "Período", value: "30 días", icon: <Database size={20} />, color: "#7c3aed", bg: "#ede9fe" },
                  ].map((kpi) => (
                    <div key={kpi.label} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: kpi.bg, color: kpi.color }}>
                        {kpi.icon}
                      </div>
                      <p className="text-[26px] font-black text-[#111418]">{kpi.value}</p>
                      <p className="text-[12px] text-[#637488]">{kpi.label}</p>
                    </div>
                  ))}
                </div>

                {/* Gráfico de visitas por día */}
                <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendUp size={18} color="#1978e5" />
                      <h3 className="font-bold text-[#111418] text-[15px]">Visitas diarias — últimos 30 días</h3>
                    </div>
                    <button onClick={() => fetchTrafico(adminPin)}
                      className="text-[12px] text-[#1978e5] flex items-center gap-1">
                      <ArrowClockwise size={12} /> Actualizar
                    </button>
                  </div>
                  <TrafficBarChart data={trafico.visitasPorDia} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Páginas más vistas */}
                  <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
                    <h3 className="font-bold text-[#111418] text-[15px] mb-4 flex items-center gap-2">
                      <ChartBar size={16} color="#1978e5" /> Páginas más visitadas
                    </h3>
                    <div className="space-y-2">
                      {trafico.paginas.length > 0 ? trafico.paginas.slice(0, 8).map((p, i) => {
                        const total  = p.total ?? p.value ?? 0;
                        const maxVal = Math.max(...trafico.paginas.map((x) => x.total ?? x.value ?? 0), 1);
                        const pct    = Math.round((total / maxVal) * 100);
                        const path   = p.key?.replace("https://movelcar.com", "") || p.key || "/";
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between text-[12px] mb-1">
                              <span className="text-[#637488] truncate max-w-[200px]" title={path}>{path || "/"}</span>
                              <span className="font-bold text-[#111418] ml-2">{total.toLocaleString("es-CO")}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-gray-100">
                              <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #1565c0, #42a5f5)" }} />
                            </div>
                          </div>
                        );
                      }) : (
                        <p className="text-[13px] text-[#637488]">Sin datos disponibles aún</p>
                      )}
                    </div>
                  </div>

                  {/* Dispositivos + Países */}
                  <div className="space-y-4">
                    {/* Dispositivos */}
                    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
                      <h3 className="font-bold text-[#111418] text-[15px] mb-3 flex items-center gap-2">
                        <DeviceMobile size={16} color="#1978e5" /> Dispositivos
                      </h3>
                      <div className="flex gap-3 flex-wrap">
                        {trafico.dispositivos.length > 0 ? trafico.dispositivos.map((d, i) => {
                          const total = d.total ?? d.value ?? 0;
                          const allTotal = trafico.dispositivos.reduce((s, x) => s + (x.total ?? x.value ?? 0), 0) || 1;
                          const pct = Math.round((total / allTotal) * 100);
                          const isMobile = d.key?.toLowerCase().includes("mobile") || d.key?.toLowerCase().includes("phone");
                          return (
                            <div key={i} className="flex-1 min-w-[80px] text-center p-3 rounded-xl" style={{ background: "#f8f9fa" }}>
                              {isMobile ? <DeviceMobile size={20} color="#1978e5" className="mx-auto mb-1" /> : <Desktop size={20} color="#637488" className="mx-auto mb-1" />}
                              <p className="font-bold text-[#111418] text-[16px]">{pct}%</p>
                              <p className="text-[11px] text-[#637488] capitalize">{d.key}</p>
                            </div>
                          );
                        }) : (
                          <p className="text-[13px] text-[#637488]">Sin datos</p>
                        )}
                      </div>
                    </div>

                    {/* Ciudades Colombia */}
                    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #dce0e5" }}>
                      <h3 className="font-bold text-[#111418] text-[15px] mb-3 flex items-center gap-2">
                        🇨🇴 <span>Top ciudades Colombia</span>
                      </h3>
                      <div className="space-y-2.5">
                        {trafico.ciudadesCO && trafico.ciudadesCO.length > 0 ? trafico.ciudadesCO.map((c, i) => {
                          const maxVal = Math.max(...trafico.ciudadesCO.map((x) => x.total), 1);
                          const pct    = Math.round((c.total / maxVal) * 100);
                          const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
                          return (
                            <div key={i}>
                              <div className="flex items-center justify-between text-[13px] mb-1">
                                <span className="flex items-center gap-1.5">
                                  <span>{medals[i] ?? `${i + 1}.`}</span>
                                  <span className="font-semibold text-[#111418]">{c.key}</span>
                                </span>
                                <span className="font-bold text-[#1978e5]">{c.total.toLocaleString("es-CO")} visitas</span>
                              </div>
                              <div className="h-2 rounded-full bg-gray-100">
                                <div className="h-2 rounded-full transition-all"
                                  style={{
                                    width: `${pct}%`,
                                    background: i === 0
                                      ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                                      : "linear-gradient(90deg, #1565c0, #42a5f5)",
                                  }} />
                              </div>
                            </div>
                          );
                        }) : (
                          <div className="text-center py-4">
                            <p className="text-[13px] text-[#637488]">Sin visitas desde Colombia aún</p>
                            <p className="text-[11px] text-[#9aa5b4] mt-1">Los datos aparecen al acumular tráfico</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Link a Vercel */}
                <div className="p-4 rounded-2xl text-center" style={{ background: "#e8f0fd" }}>
                  <p className="text-[13px] text-[#1978e5] font-semibold">
                    📊 Ver analytics completo en{" "}
                    <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">
                      Vercel Dashboard → Analytics →
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Enlace a Telegram */}
        <div className="mt-8 p-4 rounded-2xl text-center" style={{ background: "#e8f0fd" }}>
          <p className="text-[13px] text-[#1978e5] font-semibold">
            📱 Las notificaciones en tiempo real también llegan a{" "}
            <a href="https://t.me/movelcol_bot" target="_blank" rel="noopener noreferrer"
              className="underline">Telegram →</a>
          </p>
        </div>

      </div>
    </div>
  );
}

// ─── Traffic bar chart (30 días) ─────────────────────────────
function TrafficBarChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b)).slice(-30);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  // Comparar primera y segunda mitad para mostrar tendencia
  const mid   = Math.floor(entries.length / 2);
  const first = entries.slice(0, mid).reduce((s, [, v]) => s + v, 0);
  const last  = entries.slice(mid).reduce((s, [, v]) => s + v, 0);
  const trend = last > first ? "up" : last < first ? "down" : "flat";

  return (
    <div>
      <div className="flex items-end gap-1 h-28 mb-2">
        {entries.map(([day, val]) => {
          const height = Math.max(4, (val / max) * 112);
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1 group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#111418] text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {day.slice(5)}: {val}
              </div>
              <div
                className="w-full rounded-t-sm transition-all"
                style={{
                  height: `${height}px`,
                  background: val >= max * 0.8
                    ? "linear-gradient(180deg, #16a34a, #22c55e)"
                    : val >= max * 0.4
                    ? "linear-gradient(180deg, #1565c0, #42a5f5)"
                    : "linear-gradient(180deg, #94a3b8, #cbd5e1)",
                }}
              />
            </div>
          );
        })}
        {entries.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[13px] text-[#637488]">Aún no hay datos de tráfico registrados</p>
          </div>
        )}
      </div>

      {/* Eje X — fechas inicio/fin */}
      {entries.length > 0 && (
        <div className="flex justify-between text-[10px] text-[#637488] mb-3">
          <span>{entries[0]?.[0]?.slice(5)}</span>
          <span>{entries[entries.length - 1]?.[0]?.slice(5)}</span>
        </div>
      )}

      {/* Tendencia */}
      {entries.length > 0 && (
        <div className="flex items-center gap-2 text-[13px]">
          {trend === "up"   && <><ArrowUp size={14} color="#16a34a" /><span className="text-[#16a34a] font-semibold">Tráfico en aumento vs quincena anterior</span></>}
          {trend === "down" && <><ArrowDown size={14} color="#dc2626" /><span className="text-[#dc2626] font-semibold">Tráfico en descenso vs quincena anterior</span></>}
          {trend === "flat" && <><Minus size={14} color="#637488" /><span className="text-[#637488] font-semibold">Tráfico estable</span></>}
        </div>
      )}
    </div>
  );
}

// ─── Componentes auxiliares ───────────────────────────────────
function NoSupabaseCard() {
  return (
    <div className="bg-white rounded-2xl p-8 text-center" style={{ border: "1px solid #dce0e5" }}>
      <Database size={40} color="#9aa5b4" className="mx-auto mb-3" />
      <h3 className="font-bold text-[#111418] text-[16px] mb-2">Base de datos no conectada</h3>
      <p className="text-[#637488] text-[14px] max-w-sm mx-auto">
        Configura Supabase para ver los datos aquí. Sigue las instrucciones del archivo{" "}
        <code className="bg-gray-100 px-1 rounded">supabase-schema.sql</code>.
      </p>
    </div>
  );
}

function EmptyCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 text-center" style={{ border: "1px solid #dce0e5" }}>
      <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">{icon}</div>
      <p className="text-[#637488] text-[14px]">{text}</p>
    </div>
  );
}
