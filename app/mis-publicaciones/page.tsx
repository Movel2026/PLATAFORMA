"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Car, Clock, CheckCircle, PauseCircle,
  Trash, Eye, SignIn, Plus, WhatsappLogo, CurrencyCircleDollar,
} from "@phosphor-icons/react";
import { useUser } from "@/lib/hooks/useUser";
import BottomNav from "@/components/BottomNav";

interface MiPublicacion {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  precio: number;
  ciudad: string;
  kilometraje: number;
  color: string;
  estado: string;
  created_at: string;
  fotos_urls?: string[];
  total_fotos: number;
  modo: string;
}

const ESTADO_LABEL: Record<string, { label: string; bg: string; text: string }> = {
  pendiente: { label: "En revisión",       bg: "bg-amber-50",  text: "text-amber-700" },
  activo:    { label: "Publicado",          bg: "bg-green-50",  text: "text-green-700" },
  pausado:   { label: "Pausado",            bg: "bg-gray-100",  text: "text-gray-700"  },
  vendido:   { label: "Vendido",            bg: "bg-blue-50",   text: "text-blue-700"  },
  rechazado: { label: "Rechazado",          bg: "bg-red-50",    text: "text-red-700"   },
  eliminado: { label: "Eliminado",          bg: "bg-gray-100",  text: "text-gray-500"  },
};

const fmtCOP = (n: number) => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", minimumFractionDigits: 0,
}).format(n);

const diasDesde = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
};

export default function MisPublicacionesPage() {
  const { user, loading: userLoading, configured } = useUser();
  const router = useRouter();
  const [publicaciones, setPublicaciones] = useState<MiPublicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading) return;
    if (!user) { setLoading(false); return; }

    const email = user.email || "";
    fetch(`/api/mis-publicaciones?email=${encodeURIComponent(email)}&userId=${user.id}`)
      .then((r) => r.ok ? r.json() : { vehicles: [] })
      .then((d) => setPublicaciones(d.vehicles || []))
      .catch(() => setPublicaciones([]))
      .finally(() => setLoading(false));
  }, [user, userLoading]);

  async function cambiarEstado(id: string, estado: string) {
    if (!user) return;
    setUpdatingId(id);
    try {
      const res = await fetch("/api/mis-publicaciones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado, email: user.email, userId: user.id }),
      });
      const data = await res.json();
      if (data.ok) {
        setPublicaciones((prev) =>
          prev.map((p) => (p.id === id ? { ...p, estado } : p))
        );
      } else {
        alert("No se pudo actualizar: " + (data.error || ""));
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setUpdatingId(null);
    }
  }

  // ── Estados de carga / no autenticado ──
  if (userLoading) {
    return <div className="min-h-screen flex items-center justify-center text-mute">Cargando…</div>;
  }
  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md border border-[#dce0e5] text-center">
          <p className="text-mute">La autenticación no está configurada. Contacta al equipo MOVEL.</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-cloud flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#dce0e5] shadow-movel text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-movel-50 flex items-center justify-center mb-4">
            <SignIn size={28} color="#0B1E4E" weight="bold" />
          </div>
          <h2 className="font-display text-[24px] text-movel-900 mb-2">Inicia sesión</h2>
          <p className="text-[14px] text-mute leading-relaxed mb-6">
            Necesitas estar registrado para ver y administrar tus publicaciones.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link href="/auth?return=/mis-publicaciones" className="w-full btn-primary !rounded-xl">
              Iniciar sesión
            </Link>
            <Link href="/auth?modo=registro&return=/mis-publicaciones" className="w-full text-center py-3 border-2 border-movel-900 text-movel-900 font-bold rounded-xl text-[14px] hover:bg-movel-50 transition-colors">
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Render principal ──
  return (
    <div className="min-h-screen bg-cloud pb-20">
      {/* Header */}
      <div className="bg-movel-gradient-dark px-4 py-7">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-[13px] font-semibold mb-3">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-display text-[28px] md:text-[36px] text-white leading-tight">Mis publicaciones</h1>
              <p className="text-white/65 text-[14px] mt-1">
                {publicaciones.length} {publicaciones.length === 1 ? "vehículo publicado" : "vehículos publicados"}
              </p>
            </div>
            <Link href="/publicar" className="btn-sky !py-2.5 !px-5 !rounded-xl flex items-center gap-2">
              <Plus size={17} weight="bold" />
              Publicar otro vehículo
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 border border-[#dce0e5] text-center text-mute">
            Cargando tus publicaciones…
          </div>
        ) : publicaciones.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 md:p-14 border border-[#dce0e5] text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-movel-50 flex items-center justify-center mb-4">
              <Car size={32} color="#0B1E4E" weight="fill" />
            </div>
            <h3 className="font-display text-[22px] text-movel-900 mb-2">Aún no tienes publicaciones</h3>
            <p className="text-[14px] text-mute mb-6">Publica tu primer vehículo gratis y empieza a recibir ofertas.</p>
            <Link href="/publicar" className="inline-flex btn-primary !rounded-xl items-center gap-2">
              <Plus size={17} weight="bold" />
              Publicar mi vehículo
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {publicaciones.map((p) => {
              const estado = ESTADO_LABEL[p.estado] || ESTADO_LABEL.pendiente;
              const dias = diasDesde(p.created_at);
              const isUpdating = updatingId === p.id;
              const firstFoto = Array.isArray(p.fotos_urls) && p.fotos_urls.length > 0 ? p.fotos_urls[0] : null;

              return (
                <div key={p.id} className="bg-white rounded-2xl border border-[#dce0e5] overflow-hidden hover:shadow-movel transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-0">
                    {/* Foto */}
                    <div className="bg-cloud aspect-video md:aspect-auto md:h-full md:min-h-[180px] relative overflow-hidden">
                      {firstFoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={firstFoto} alt={`${p.marca} ${p.modelo}`} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Car size={42} color="#A5C6FF" weight="fill" />
                        </div>
                      )}
                      <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${estado.bg} ${estado.text}`}>
                        {estado.label}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                        <div>
                          <h3 className="font-display text-[18px] text-movel-900 leading-tight">
                            {p.marca} {p.modelo} {p.ano}
                          </h3>
                          <p className="text-[20px] font-black text-ink mt-1">{fmtCOP(p.precio || 0)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-mute flex items-center gap-1 justify-end">
                            <Clock size={12} /> {dias === 0 ? "Hoy" : dias === 1 ? "1 día" : `${dias} días`}
                          </p>
                          <p className="text-[11px] text-mute">{p.total_fotos || 0} foto(s)</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[12px] text-mute mb-4">
                        <span>{p.ciudad}</span>
                        <span>·</span>
                        <span>{p.kilometraje?.toLocaleString("es-CO")} km</span>
                        {p.color && (<><span>·</span><span>{p.color}</span></>)}
                        {p.modo === "360" && (
                          <span className="bg-sky/10 text-sky px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                            Servicio 360°
                          </span>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-wrap gap-2">
                        {p.estado === "activo" && (
                          <Link
                            href={`/vehiculo/${p.marca.toLowerCase()}-${p.modelo.toLowerCase()}-${p.ano}-${p.id.slice(0, 6)}`.replace(/[^a-z0-9-]+/g, "-")}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold border border-[#dce0e5] text-ink rounded-lg hover:border-movel-900 hover:text-movel-900 transition-colors"
                          >
                            <Eye size={13} /> Ver en el sitio
                          </Link>
                        )}
                        {p.estado === "activo" && (
                          <button
                            onClick={() => cambiarEstado(p.id, "vendido")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            <CurrencyCircleDollar size={13} /> Marcar vendido
                          </button>
                        )}
                        {p.estado === "activo" && (
                          <button
                            onClick={() => cambiarEstado(p.id, "pausado")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50"
                          >
                            <PauseCircle size={13} weight="fill" /> Pausar
                          </button>
                        )}
                        {p.estado === "pausado" && (
                          <button
                            onClick={() => cambiarEstado(p.id, "activo")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle size={13} weight="fill" /> Reactivar
                          </button>
                        )}
                        {p.estado === "pendiente" && (
                          <span className="px-3 py-1.5 text-[12px] text-amber-700 bg-amber-50 rounded-lg">
                            ⏳ Equipo MOVEL está revisando tu publicación
                          </span>
                        )}
                        {p.estado !== "eliminado" && p.estado !== "vendido" && (
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar la publicación "${p.marca} ${p.modelo} ${p.ano}"? Esto la quitará del sitio.`)) {
                                cambiarEstado(p.id, "eliminado");
                              }
                            }}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash size={13} /> Bajar
                          </button>
                        )}
                        <a
                          href={`https://wa.me/573175737083?text=Hola%20MOVEL%2C%20tengo%20una%20duda%20sobre%20mi%20publicaci%C3%B3n%20${encodeURIComponent(p.marca + " " + p.modelo + " " + p.ano)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#25d366] hover:bg-green-50 rounded-lg transition-colors ml-auto"
                        >
                          <WhatsappLogo size={13} weight="fill" /> Ayuda
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
