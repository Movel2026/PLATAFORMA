import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Gauge, Gear } from "@phosphor-icons/react/dist/ssr";
import { formatCOP, Vehicle } from "@/lib/mock-data";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link
      href={`/vehiculo/${vehicle.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#dce0e5] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      {/* Photo */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <Image
          src={vehicle.fotos[0]}
          alt={vehicle.titulo}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Auction badge or City badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {vehicle.subasta?.activa ? (
            <span className="badge-live">Subasta</span>
          ) : (
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
              <MapPin size={12} color="#637488" />
              <span className="text-[11px] font-semibold text-[#637488]">{vehicle.ciudad}</span>
            </div>
          )}
        </div>
        {/* Type badge */}
        <div className="absolute top-3 right-3 bg-[#1978e5] text-white rounded-full px-2.5 py-1">
          <span className="text-[11px] font-bold">{vehicle.tipo}</span>
        </div>
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="text-[16px] font-bold text-[#111418] leading-tight line-clamp-1 mb-1">
          {vehicle.titulo}
        </h3>

        {/* Stars */}
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              weight={i < vehicle.rating ? "fill" : "regular"}
              color={i < vehicle.rating ? "#f59e0b" : "#dce0e5"}
            />
          ))}
          <span className="text-[12px] text-[#637488] ml-1">({vehicle.rating}.0)</span>
        </div>

        {/* Specs chips */}
        <div className="flex gap-2 flex-wrap mb-3">
          <span className="flex items-center gap-1 text-[12px] text-[#637488] bg-[#f0f2f4] rounded-md px-2 py-1">
            <Gauge size={12} />
            {vehicle.kilometraje}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#637488] bg-[#f0f2f4] rounded-md px-2 py-1">
            <Gear size={12} />
            {vehicle.transmision}
          </span>
          <span className="text-[12px] text-[#637488] bg-[#f0f2f4] rounded-md px-2 py-1">
            {vehicle.año}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[20px] font-black text-[#111418]">
              {formatCOP(vehicle.precio)}
            </p>
            {vehicle.precioFinanciado && (
              <p className="text-[12px] text-[#637488]">
                Desde {formatCOP(vehicle.precioFinanciado)}/mes
              </p>
            )}
          </div>
          <span className="text-[13px] font-bold text-[#1978e5] border border-[#1978e5] rounded-lg px-3 py-1.5 group-hover:bg-[#1978e5] group-hover:text-white transition-colors">
            Ver más →
          </span>
        </div>
      </div>
    </Link>
  );
}
