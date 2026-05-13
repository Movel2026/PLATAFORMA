"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, MapPin, Gauge, Gear, Heart, Images, ShieldCheck } from "@phosphor-icons/react";
import { formatCOP, Vehicle } from "@/lib/mock-data";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [liked, setLiked] = useState(false);

  // Cursor glow handler inline (sin importar el hook para mantener este componente ligero)
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div
      onMouseMove={onMove}
      className="cursor-glow cursor-glow-soft group bg-white rounded-2xl overflow-hidden border border-[#dce0e5] card-hover relative"
    >

      {/* ── FOTO ── */}
      <Link href={`/vehiculo/${vehicle.id}`}>
        <div className="relative h-48 bg-gray-200 overflow-hidden img-zoom">
          <Image
            src={vehicle.fotos[0]}
            alt={vehicle.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradiente inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Badge top-left: Subasta o Ciudad */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-[2]">
            {vehicle.subasta?.activa ? (
              <span className="badge-live">Subasta</span>
            ) : (
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                <MapPin size={12} color="#7A8195" />
                <span className="text-[11px] font-semibold text-mute">{vehicle.ciudad}</span>
              </div>
            )}
          </div>

          {/* Badge tipo top-right */}
          <div className="absolute top-3 right-3 bg-movel-gradient text-white rounded-full px-2.5 py-1 z-[2]">
            <span className="text-[11px] font-bold">{vehicle.tipo}</span>
          </div>

          {/* Fotos counter bottom-left */}
          {vehicle.fotos.length > 1 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 text-white rounded-full px-2 py-1">
              <Images size={12} />
              <span className="text-[11px] font-semibold">{vehicle.fotos.length} fotos</span>
            </div>
          )}
        </div>
      </Link>

      {/* Botón corazón — flotante sobre la card */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setLiked(!liked);
        }}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:scale-110 active:scale-95 transition-all"
        aria-label={liked ? "Quitar de favoritos" : "Guardar favorito"}
        style={{ top: "44px" }}
      >
        <Heart
          size={16}
          weight={liked ? "fill" : "regular"}
          color={liked ? "#FF6B3D" : "#7A8195"}
        />
      </button>

      {/* ── INFO ── */}
      <Link href={`/vehiculo/${vehicle.id}`}>
        <div className="p-4">

          {/* Título + verificado */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-[15px] font-bold text-ink leading-tight line-clamp-1 flex-1">
              {vehicle.titulo}
            </h3>
            {vehicle.soat?.vigente && (
              <ShieldCheck size={16} color="#3CCF91" weight="fill" className="flex-shrink-0 mt-0.5" />
            )}
          </div>

          {/* Estrellas */}
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                weight={i < vehicle.rating ? "fill" : "regular"}
                color={i < vehicle.rating ? "#FF6B3D" : "#dce0e5"}
              />
            ))}
            <span className="text-[11px] text-mute ml-1">({vehicle.rating}.0)</span>
          </div>

          {/* Specs chips */}
          <div className="flex gap-1.5 flex-wrap mb-3">
            <span className="flex items-center gap-1 text-[11px] text-mute bg-cloud rounded-md px-2 py-1">
              <Gauge size={11} />
              {vehicle.kilometraje}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-mute bg-cloud rounded-md px-2 py-1">
              <Gear size={11} />
              {vehicle.transmision}
            </span>
            <span className="text-[11px] text-mute bg-cloud rounded-md px-2 py-1">
              {vehicle.año}
            </span>
          </div>

          {/* Precio + CTA */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[20px] font-black text-ink leading-tight">
                {formatCOP(vehicle.precio)}
              </p>
              {vehicle.precioFinanciado && (
                <p className="text-[11px] text-mute">
                  Desde <span className="text-movel-600 font-semibold">{formatCOP(vehicle.precioFinanciado)}/mes</span>
                </p>
              )}
            </div>
            <span className="text-[12px] font-bold text-movel-900 border border-movel-900 rounded-lg px-3 py-1.5 group-hover:bg-movel-gradient group-hover:text-white group-hover:border-transparent transition-all">
              Ver →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
