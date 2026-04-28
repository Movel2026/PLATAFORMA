import { notFound } from "next/navigation";
import { getVehicleById } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";
import DocumentBadge from "@/components/DocumentBadge";
import BottomNav from "@/components/BottomNav";
import { UserCircle, Warning, FileText, CalendarCheck, ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface Props {
  params: { id: string };
}

export default function HistorialPage({ params }: Props) {
  const vehicle = getVehicleById(params.id);
  if (!vehicle) notFound();

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                <p className="text-[15px] text-green-700 font-semibold">
                  Sin siniestros reportados
                </p>
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
      </div>

      <BottomNav />
    </div>
  );
}
