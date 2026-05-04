"use client";

import { useState } from "react";
import Link from "next/link";
import MovelPageHeader from "@/components/MovelPageHeader";
import {
  Car, CheckCircle, Clock, XCircle, TrendUp, CurrencyCircleDollar,
  Gavel, Eye, MagnifyingGlass, Funnel, ArrowRight, User,
  ChartBar, Warning, Wrench, WhatsappLogo, ShieldCheck, Lock,
} from "@phosphor-icons/react";

// ─── PIN gate ─────────────────────────────────────────────────────────────
// Cambia este PIN por el que quieras (o muévelo a una variable de entorno .env.local)
const ADMIN_PIN = "MOVEL2025";

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      onUnlock();
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
              onChange={e => setPin(e.target.value)}
              className={`w-full h-12 pl-11 pr-4 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 transition-all ${
                error
                  ? "ring-2 ring-red-500 bg-red-500/10"
                  : "focus:ring-[#1978e5]/60"
              }`}
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          </div>
          {error && (
            <p className="text-red-400 text-[13px] font-semibold">PIN incorrecto. Intenta de nuevo.</p>
          )}
          <button
            type="submit"
            className="w-full h-12 rounded-xl font-black text-[15px] text-white"
            style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}
          >
            Acceder al panel →
          </button>
        </form>

        <p className="text-white/20 text-[11px] mt-8">
          Esta página no es de acceso público · Solo equipo MOVEL
        </p>
      </div>
    </div>
  );
}

// ── Mock data ─────────────────────────────────────────────────────────────
const solicitudes = [
  { id: "SOL-001", nombre: "Carlos Méndez", tel: "+57 310 234 5678", vehiculo: "Toyota Corolla 2021", precio: 65000000, estado: "pendiente", fecha: "2025-04-26", fotos: 8, ciudad: "Bogotá" },
  { id: "SOL-002", nombre: "María López", tel: "+57 315 876 5432", vehiculo: "Mazda CX-5 2022", precio: 98000000, estado: "revisando", fecha: "2025-04-25", fotos: 12, ciudad: "Medellín" },
  { id: "SOL-003", nombre: "Andrés Torres", tel: "+57 320 111 2233", vehiculo: "Chevrolet Spark 2020", precio: 28000000, estado: "aprobado", fecha: "2025-04-24", fotos: 6, ciudad: "Cali" },
  { id: "SOL-004", nombre: "Paula Gómez", tel: "+57 318 444 5566", vehiculo: "Kia Sportage 2023", precio: 112000000, estado: "pendiente", fecha: "2025-04-24", fotos: 15, ciudad: "Barranquilla" },
  { id: "SOL-005", nombre: "Javier Ruiz", tel: "+57 312 999 8877", vehiculo: "Renault Duster 2021", precio: 54000000, estado: "rechazado", fecha: "2025-04-23", fotos: 4, ciudad: "Bogotá" },
  { id: "SOL-006", nombre: "Lucía Herrera", tel: "+57 316 333 2211", vehiculo: "Hyundai Tucson 2022", precio: 88000000, estado: "aprobado", fecha: "2025-04-22", fotos: 10, ciudad: "Medellín" },
  { id: "SOL-007", nombre: "Diego Vargas", tel: "+57 319 777 6655", vehiculo: "Nissan Kicks 2023", precio: 72000000, estado: "revisando", fecha: "2025-04-21", fotos: 9, ciudad: "Bogotá" },
  { id: "SOL-008", nombre: "Ana Martínez", tel: "+57 313 555 4433", vehiculo: "Ford Escape 2021", precio: 79000000, estado: "pendiente", fecha: "2025-04-20", fotos: 7, ciudad: "Cali" },
];

const metricas = [
  { label: "Publicaciones activas", valor: "142", cambio: "+12 esta semana", color: "#1978e5", icon: Car },
  { label: "Pendientes revisión", valor: "8", cambio: "3 urgentes", color: "#f59e0b", icon: Clock },
  { label: "Ventas cerradas (mes)", valor: "34", cambio: "+8 vs mes anterior", color: "#10b981", icon: CheckCircle },
  { label: "Valor total en plataforma", valor: "$4.2B", cambio: "COP en inventario", color: "#8b5cf6", icon: CurrencyCircleDollar },
  { label: "Subastas activas", valor: "7", cambio: "2 terminan hoy", color: "#ef4444", icon: Gavel },
  { label: "Usuarios registrados", valor: "1,247", cambio: "+89 este mes", color: "#0ea5e9", icon: User },
];

const marcasStats = [
  { marca: "Toyota", total: 28, porcentaje: 20 },
  { marca: "Mazda", total: 22, porcentaje: 15 },
  { marca: "Chevrolet", total: 19, porcentaje: 13 },
  { marca: "Kia", total: 17, porcentaje: 12 },
  { marca: "Hyundai", total: 15, porcentaje: 11 },
  { marca: "Renault", total: 12, porcentaje: 8 },
  { marca: "Nissan", total: 11, porcentaje: 8 },
  { marca: "Otros", total: 18, porcentaje: 13 },
];

const preciosStats = [
  { rango: "$10M–$30M", total: 24 },
  { rango: "$30M–$60M", total: 38 },
  { rango: "$60M–$100M", total: 45 },
  { rango: "$100M–$150M", total: 22 },
  { rango: "+$150M", total: 13 },
];

const TABS = ["Solicitudes", "Métricas", "Subastas", "Usuarios"] as const;
type Tab = typeof TABS[number];

const estadoConfig = {
  pendiente:  { label: "Pendiente",  bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500"  },
  revisando:  { label: "Revisando",  bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500"   },
  aprobado:   { label: "Aprobado",   bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500"  },
  rechazado:  { label: "Rechazado",  bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500"    },
} as const;

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("Solicitudes");
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [estadosSol, setEstadosSol] = useState<Record<string, string>>(
    Object.fromEntries(solicitudes.map((s) => [s.id, s.estado]))
  );

  const filtered = solicitudes.filter((s) => {
    const matchSearch = !search || s.vehiculo.toLowerCase().includes(search.toLowerCase()) || s.nombre.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filtroEstado === "todos" || estadosSol[s.id] === filtroEstado;
    return matchSearch && matchEstado;
  });

  const cambiarEstado = (id: string, nuevoEstado: string) => {
    setEstadosSol((prev) => ({ ...prev, [id]: nuevoEstado }));
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <MovelPageHeader />

      {/* Header admin */}
      <div style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #1565c0 60%, #1978e5 100%)" }} className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#93c5fd] text-[12px] font-bold uppercase tracking-widest mb-1">Panel de Control</p>
              <h1 className="text-white text-[28px] font-black tracking-tight">Administración MOVEL</h1>
              <p className="text-white/60 text-[14px] mt-1">Gestión de publicaciones, métricas y usuarios</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <User size={20} color="white" weight="fill" />
              </div>
              <div>
                <p className="text-white font-bold text-[14px]">Administrador</p>
                <p className="text-white/60 text-[12px]">movelcol@outlook.com</p>
              </div>
            </div>
          </div>

          {/* Mini métricas en header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {metricas.slice(0, 4).map((m) => (
              <div key={m.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15">
                <p className="text-white/60 text-[11px] font-semibold mb-1">{m.label}</p>
                <p className="text-white text-[22px] font-black">{m.valor}</p>
                <p className="text-white/40 text-[11px]">{m.cambio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#dce0e5] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-4 text-[14px] font-bold border-b-2 transition-colors ${
                tab === t ? "border-[#1978e5] text-[#1978e5]" : "border-transparent text-[#637488] hover:text-[#111418]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── TAB: SOLICITUDES ── */}
        {tab === "Solicitudes" && (
          <div>
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl h-11 px-4 border border-[#dce0e5]">
                <MagnifyingGlass size={16} color="#637488" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o vehículo..." className="flex-1 bg-transparent text-[14px] outline-none" />
              </div>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
                className="h-11 px-4 bg-white border border-[#dce0e5] rounded-xl text-[14px] text-[#637488] outline-none cursor-pointer">
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="revisando">Revisando</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl border border-[#dce0e5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#f0f2f4] bg-[#f8f9fa]">
                      <th className="text-left px-5 py-3 text-[11px] font-bold text-[#637488] uppercase tracking-widest">ID</th>
                      <th className="text-left px-5 py-3 text-[11px] font-bold text-[#637488] uppercase tracking-widest">Vendedor</th>
                      <th className="text-left px-5 py-3 text-[11px] font-bold text-[#637488] uppercase tracking-widest">Vehículo</th>
                      <th className="text-left px-5 py-3 text-[11px] font-bold text-[#637488] uppercase tracking-widest">Precio</th>
                      <th className="text-left px-5 py-3 text-[11px] font-bold text-[#637488] uppercase tracking-widest">Ciudad</th>
                      <th className="text-left px-5 py-3 text-[11px] font-bold text-[#637488] uppercase tracking-widest">Fotos</th>
                      <th className="text-left px-5 py-3 text-[11px] font-bold text-[#637488] uppercase tracking-widest">Estado</th>
                      <th className="text-left px-5 py-3 text-[11px] font-bold text-[#637488] uppercase tracking-widest">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, i) => {
                      const est = estadosSol[s.id] as keyof typeof estadoConfig;
                      const cfg = estadoConfig[est];
                      return (
                        <tr key={s.id} className={`border-b border-[#f0f2f4] hover:bg-[#f8f9fa] transition-colors ${i % 2 === 0 ? "" : "bg-[#fafafa]"}`}>
                          <td className="px-5 py-4 text-[13px] text-[#637488] font-mono">{s.id}</td>
                          <td className="px-5 py-4">
                            <p className="text-[14px] font-semibold text-[#111418]">{s.nombre}</p>
                            <p className="text-[12px] text-[#637488]">{s.fecha}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-[14px] font-semibold text-[#111418]">{s.vehiculo}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-[14px] font-bold text-[#1978e5]">{formatCOP(s.precio)}</p>
                          </td>
                          <td className="px-5 py-4 text-[13px] text-[#637488]">{s.ciudad}</td>
                          <td className="px-5 py-4">
                            <span className="flex items-center gap-1 text-[13px] text-[#637488]">
                              📷 {s.fotos}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold ${cfg.bg} ${cfg.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <a href={`https://wa.me/${s.tel.replace(/\s|\+/g, "")}?text=Hola ${s.nombre}, soy del equipo MOVEL. Revisamos tu solicitud ${s.id}`}
                                target="_blank" rel="noopener noreferrer"
                                className="w-8 h-8 bg-[#25d366]/10 hover:bg-[#25d366] text-[#25d366] hover:text-white rounded-lg flex items-center justify-center transition-colors">
                                <WhatsappLogo size={16} weight="fill" />
                              </a>
                              {est === "pendiente" || est === "revisando" ? (
                                <>
                                  <button onClick={() => cambiarEstado(s.id, "aprobado")}
                                    className="w-8 h-8 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white rounded-lg flex items-center justify-center transition-colors" title="Aprobar">
                                    <CheckCircle size={16} weight="fill" />
                                  </button>
                                  <button onClick={() => cambiarEstado(s.id, "rechazado")}
                                    className="w-8 h-8 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg flex items-center justify-center transition-colors" title="Rechazar">
                                    <XCircle size={16} weight="fill" />
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => cambiarEstado(s.id, "revisando")}
                                  className="w-8 h-8 bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg flex items-center justify-center transition-colors" title="Volver a revisar">
                                  <Eye size={16} weight="fill" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-[#f0f2f4] bg-[#f8f9fa]">
                <p className="text-[13px] text-[#637488]">Mostrando <strong>{filtered.length}</strong> de {solicitudes.length} solicitudes</p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: MÉTRICAS ── */}
        {tab === "Métricas" && (
          <div className="space-y-6">
            {/* Tarjetas métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {metricas.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="bg-white rounded-2xl p-5 border border-[#dce0e5]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: m.color + "20" }}>
                        <Icon size={22} color={m.color} weight="fill" />
                      </div>
                      <TrendUp size={16} color="#10b981" weight="bold" />
                    </div>
                    <p className="text-[28px] font-black text-[#111418]">{m.valor}</p>
                    <p className="text-[13px] font-semibold text-[#111418] mt-1">{m.label}</p>
                    <p className="text-[12px] text-[#637488] mt-0.5">{m.cambio}</p>
                  </div>
                );
              })}
            </div>

            {/* Marcas más publicadas */}
            <div className="grid lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
                <h3 className="text-[16px] font-bold text-[#111418] mb-4 flex items-center gap-2">
                  <ChartBar size={18} color="#1978e5" weight="fill" />
                  Marcas más publicadas
                </h3>
                <div className="space-y-3">
                  {marcasStats.map((m) => (
                    <div key={m.marca}>
                      <div className="flex justify-between text-[13px] mb-1">
                        <span className="font-semibold text-[#111418]">{m.marca}</span>
                        <span className="text-[#637488]">{m.total} vehículos</span>
                      </div>
                      <div className="h-2 bg-[#f0f2f4] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#1565c0] to-[#1978e5] transition-all"
                          style={{ width: `${m.porcentaje}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rangos de precio */}
              <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
                <h3 className="text-[16px] font-bold text-[#111418] mb-4 flex items-center gap-2">
                  <CurrencyCircleDollar size={18} color="#1978e5" weight="fill" />
                  Distribución por precio
                </h3>
                <div className="space-y-3">
                  {preciosStats.map((p, i) => {
                    const max = Math.max(...preciosStats.map((x) => x.total));
                    const pct = Math.round((p.total / max) * 100);
                    const colors = ["#1978e5","#42a5f5","#60a5fa","#93c5fd","#bfdbfe"];
                    return (
                      <div key={p.rango}>
                        <div className="flex justify-between text-[13px] mb-1">
                          <span className="font-semibold text-[#111418]">{p.rango}</span>
                          <span className="text-[#637488]">{p.total} vehículos</span>
                        </div>
                        <div className="h-2 bg-[#f0f2f4] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: colors[i] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Alertas */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
              <Warning size={24} color="#f59e0b" weight="fill" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-800 text-[15px]">Atención requerida</p>
                <p className="text-amber-700 text-[13px] mt-1">Hay 3 solicitudes urgentes con más de 48h sin revisión. 2 subastas terminan hoy antes de las 6pm.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SUBASTAS ── */}
        {tab === "Subastas" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[20px] font-black text-[#111418]">Subastas activas</h2>
              <Link href="/subastas" className="flex items-center gap-2 text-[14px] font-bold text-[#1978e5] hover:underline">
                Ver plataforma pública <ArrowRight size={14} />
              </Link>
            </div>
            {[
              { id: "AUC-001", vehiculo: "Toyota RAV4 2022", oferta: 95000000, participantes: 12, termina: "Hoy 5:00 PM", estado: "activa" },
              { id: "AUC-002", vehiculo: "Mazda CX-5 2021", oferta: 82000000, participantes: 8, termina: "Hoy 8:00 PM", estado: "activa" },
              { id: "AUC-003", vehiculo: "Kia Sportage 2023", oferta: 105000000, participantes: 19, termina: "Mañana 3:00 PM", estado: "activa" },
              { id: "AUC-004", vehiculo: "Chevrolet Tracker 2022", oferta: 73000000, participantes: 5, termina: "Mañana 6:00 PM", estado: "activa" },
              { id: "AUC-005", vehiculo: "Hyundai Tucson 2021", oferta: 88000000, participantes: 14, termina: "Ayer 5:00 PM", estado: "terminada" },
              { id: "AUC-006", vehiculo: "Renault Koleos 2022", oferta: 91000000, participantes: 9, termina: "Hace 2 días", estado: "terminada" },
            ].map((a) => (
              <div key={a.id} className="bg-white rounded-2xl border border-[#dce0e5] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.estado === "activa" ? "bg-red-100" : "bg-gray-100"}`}>
                    <Gavel size={20} color={a.estado === "activa" ? "#ef4444" : "#9ca3af"} weight="fill" />
                  </div>
                  <div>
                    <p className="font-bold text-[#111418] text-[15px]">{a.vehiculo}</p>
                    <p className="text-[12px] text-[#637488]">{a.id} · {a.participantes} participantes</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-[11px] text-[#637488]">Oferta actual</p>
                    <p className="font-black text-[#1978e5] text-[16px]">{formatCOP(a.oferta)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#637488]">Termina</p>
                    <p className="font-bold text-[13px] text-[#111418]">{a.termina}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${
                    a.estado === "activa" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {a.estado === "activa" ? "🔴 En vivo" : "✓ Terminada"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: USUARIOS ── */}
        {tab === "Usuarios" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total usuarios", val: "1,247", color: "#1978e5" },
                { label: "Compradores activos", val: "934", color: "#10b981" },
                { label: "Vendedores activos", val: "313", color: "#f59e0b" },
                { label: "Nuevos este mes", val: "89", color: "#8b5cf6" },
              ].map((u) => (
                <div key={u.label} className="bg-white rounded-2xl p-5 border border-[#dce0e5]">
                  <p className="text-[28px] font-black" style={{ color: u.color }}>{u.val}</p>
                  <p className="text-[13px] text-[#637488] mt-1">{u.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#dce0e5] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#f0f2f4] bg-[#f8f9fa]">
                <h3 className="font-bold text-[#111418]">Usuarios recientes</h3>
              </div>
              {[
                { nombre: "Carlos Méndez", email: "c.mendez@gmail.com", tipo: "vendedor", registro: "Hace 2 días", pub: 3 },
                { nombre: "María López", email: "maria.l@hotmail.com", tipo: "comprador", registro: "Hace 3 días", pub: 0 },
                { nombre: "Andrés Torres", email: "a.torres@gmail.com", tipo: "vendedor", registro: "Hace 5 días", pub: 1 },
                { nombre: "Paula Gómez", email: "pgomez@yahoo.com", tipo: "comprador", registro: "Hace 1 semana", pub: 0 },
                { nombre: "Javier Ruiz", email: "jruiz@gmail.com", tipo: "vendedor", registro: "Hace 1 semana", pub: 2 },
              ].map((u, i) => (
                <div key={i} className="px-5 py-4 border-b border-[#f0f2f4] flex items-center justify-between hover:bg-[#f8f9fa]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1978e5]/10 flex items-center justify-center">
                      <User size={18} color="#1978e5" weight="fill" />
                    </div>
                    <div>
                      <p className="font-semibold text-[14px] text-[#111418]">{u.nombre}</p>
                      <p className="text-[12px] text-[#637488]">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      u.tipo === "vendedor" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    }`}>{u.tipo}</span>
                    <div className="text-right hidden sm:block">
                      <p className="text-[12px] text-[#637488]">{u.registro}</p>
                      {u.pub > 0 && <p className="text-[11px] text-[#1978e5] font-semibold">{u.pub} publicaciones</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
