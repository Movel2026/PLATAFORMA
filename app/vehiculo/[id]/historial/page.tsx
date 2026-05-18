"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { getVehicleById, Vehicle } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";
import DocumentBadge from "@/components/DocumentBadge";
import BottomNav from "@/components/BottomNav";
import {
  UserCircle, Warning, FileText, CalendarCheck, ArrowLeft, Spinner,
  WhatsappLogo, Wrench, ShieldCheck, ArrowsLeftRight, CaretDown, CaretUp,
} from "@phosphor-icons/react";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
}

export default function HistorialPage() {
  const params = useParams();
  const id = params.id as string;

  const mockVehicle = getVehicleById(id);
  const [vehicle, setVehicle] = useState<Vehicle | null>(mockVehicle ?? null);
  const [loading, setLoading] = useState(!mockVehicle);
  const [notFoundState, setNotFoundState] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  useEffect(() => {
    if (mockVehicle) return;
    fetch("/api/vehiculos")
      .then((r) => r.ok ? r.json() : { vehicles: [] })
      .then((d) => {
        const found = (d.vehicles || []).find((v: Vehicle) => v.id === id);
        if (found) setVehicle(found);
        else setNotFoundState(true);
      })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false));
  }, [id, mockVehicle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={32} className="animate-spin text-movel-600" />
      </div>
    );
  }

  if (notFoundState || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[18px] font-bold text-[#111418]">Vehículo no encontrado</p>
        <Link href="/buscar" className="btn-primary !rounded-xl px-6 py-2.5 text-[14px]">
          Ver vehículos disponibles
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title="Historial" />

      <div className="px-4 space-y-6 mt-2">

        {/* Propietarios */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <UserCircle size={22} color="#1978e5" weight="fill" />
            <h2 className="text-[16px] font-bold text-[#111418]">
              Propietarios ({vehicle.propietarios.length})
            </h2>
          </div>
          <div className="space-y-0 border border-[#dce0e5] rounded-xl overflow-hidden">
            {vehicle.propietarios.map((owner, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 bg-white ${
                  i < vehicle.propietarios.length - 1 ? "border-b border-[#dce0e5]" : ""
                }`}
              >
                <div>
                  <p className="text-[15px] font-semibold text-[#111418]">{owner.nombre}</p>
                  <p className="text-[13px] text-[#637488]">
                    {owner.desde} – {owner.hasta}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#f0f2f4] flex items-center justify-center">
                  <UserCircle size={20} color="#637488" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Siniestros */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Warning size={22} color="#1978e5" weight="fill" />
            <h2 className="text-[16px] font-bold text-[#111418]">Siniestros</h2>
          </div>
          <div className="border border-[#dce0e5] rounded-xl overflow-hidden">
            {vehicle.siniestros.length === 0 ? (
              <div className="px-4 py-3 bg-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <p className="text-[15px] text-green-700 font-semibold">Sin siniestros reportados</p>
              </div>
            ) : (
              vehicle.siniestros.map((s, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 bg-white flex items-center gap-2 ${
                    i < vehicle.siniestros.length - 1 ? "border-b border-[#dce0e5]" : ""
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <p className="text-[15px] text-[#111418]">{s}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Documentos */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={22} color="#1978e5" weight="fill" />
            <h2 className="text-[16px] font-bold text-[#111418]">Documentos</h2>
          </div>
          <div className="border border-[#dce0e5] rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-white border-b border-[#dce0e5] flex items-center justify-between">
              <div>
                <p className="text-[15px] font-semibold text-[#111418]">SOAT</p>
                <p className="text-[13px] text-[#637488]">
                  Vigencia: {formatDate(vehicle.soat.hasta)}
                </p>
              </div>
              <DocumentBadge vigente={vehicle.soat.vigente} />
            </div>
            <div className="px-4 py-3 bg-white flex items-center justify-between">
              <div>
                <p className="text-[15px] font-semibold text-[#111418]">Tecnomecánica</p>
                <p className="text-[13px] text-[#637488]">
                  Vigencia: {formatDate(vehicle.tecnomecanica.hasta)}
                </p>
              </div>
              <DocumentBadge vigente={vehicle.tecnomecanica.vigente} />
            </div>
          </div>
        </section>

        {/* Servicios MOVEL */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck size={22} color="#1978e5" weight="fill" />
            <h2 className="text-[16px] font-bold text-[#111418]">Servicios MOVEL</h2>
          </div>
          <p className="text-[12px] text-[#637488] mb-3 ml-8">
            Servicios prestados directamente por el equipo MOVEL para vendedores y compradores.
          </p>
          <div className="space-y-3">
            {[
              {
                id: "peritaje",
                Icon: Wrench,
                titulo: "Peritaje técnico",
                resumen: "Inspección profesional del vehículo antes de comprar o vender",
                descripcion:
                  "Nuestros técnicos revisan en detalle el estado mecánico, latonería, pintura, kilometraje real y documentos del vehículo. Al finalizar recibes un informe completo para tomar la mejor decisión con total seguridad.",
                waMsg: "Hola MOVEL! Me interesa el servicio de *Peritaje Técnico* para un vehículo. ¿Me dan más información?",
              },
              {
                id: "garantia",
                Icon: ShieldCheck,
                titulo: "Garantía vehicular",
                resumen: "Protección post-venta contra fallas mecánicas inesperadas",
                descripcion:
                  "Cubre fallas mecánicas que aparezcan después de la compra. Puedes elegir la duración y cobertura según tu presupuesto. Ideal para vehículos usados: te da tranquilidad como comprador y hace tu oferta más atractiva como vendedor.",
                waMsg: "Hola MOVEL! Me interesa la *Garantía Vehicular*. ¿Me pueden dar más información y costos?",
              },
              {
                id: "traspaso",
                Icon: ArrowsLeftRight,
                titulo: "Traspaso en el RUNT",
                resumen: "Gestión legal completa del traspaso — vendedor y comprador protegidos",
                descripcion:
                  "Nos encargamos de todo el proceso legal ante el RUNT. Si eres vendedor, te garantizamos que el vehículo sale oficialmente de tu nombre. Si eres comprador, te garantizamos que queda registrado a tu nombre correctamente. Sin filas, sin errores, sin estrés. Tú solo firmas.",
                waMsg: "Hola MOVEL! Me interesa el servicio de *Traspaso en el RUNT*. ¿Me pueden ayudar y dar más información?",
              },
            ].map(({ id, Icon, titulo, resumen, descripcion, waMsg }) => {
              const isOpen = expandedService === id;
              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-[#dce0e5] overflow-hidden transition-shadow hover:shadow-sm"
                >
                  <button
                    onClick={() => setExpandedService(isOpen ? null : id)}
                    className="w-full px-4 py-4 flex items-center gap-3 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#0B1E4E,#1565c0)" }}>
                      <Icon size={18} color="white" weight="fill" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-[#111418] leading-tight">{titulo}</p>
                      <p className="text-[12px] text-[#637488] mt-0.5 leading-snug">{resumen}</p>
                    </div>
                    {isOpen
                      ? <CaretUp size={18} color="#637488" className="flex-shrink-0" />
                      : <CaretDown size={18} color="#637488" className="flex-shrink-0" />
                    }
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-[#f0f2f4]">
                      <p className="text-[14px] text-[#374151] leading-relaxed mt-3 mb-4">
                        {descripcion}
                      </p>
                      <a
                        href={`https://wa.me/573175737083?text=${encodeURIComponent(waMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] text-white bg-[#25d366] hover:bg-[#20b858] transition-colors"
                      >
                        <WhatsappLogo size={18} weight="fill" />
                        Me interesa — hablar con MOVEL
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <Link
          href={`/vehiculo/${id}`}
          className="flex items-center gap-2 text-[14px] text-movel-600 font-semibold hover:underline"
        >
          <ArrowLeft size={16} /> Volver al vehículo
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
