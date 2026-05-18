"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { getVehicleById, Vehicle } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";
import DocumentBadge from "@/components/DocumentBadge";
import BottomNav from "@/components/BottomNav";
import { UserCircle, Warning, FileText, CalendarCheck, ArrowRight, ArrowLeft, Spinner } from "@phosphor-icons/react";

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

        {/* Servicios disponibles */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CalendarCheck size={22} color="#1978e5" weight="fill" />
            <h2 className="text-[16px] font-bold text-[#111418]">Servicios disponibles</h2>
          </div>
          <div className="border border-[#dce0e5] rounded-xl overflow-hidden">
            {["Agendar peritaje", "Comprar garantía"].map((service, i) => (
              <button
                key={service}
                className={`w-full px-4 py-4 bg-white flex items-center justify-between hover:bg-[#f0f2f4] transition-colors ${
                  i === 0 ? "border-b border-[#dce0e5]" : ""
                }`}
              >
                <span className="text-[15px] font-semibold text-[#111418]">{service}</span>
                <ArrowRight size={18} color="#637488" />
              </button>
            ))}
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
