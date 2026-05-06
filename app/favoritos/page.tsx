"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MagnifyingGlass, Trash, CarProfile } from "@phosphor-icons/react";
import BottomNav from "@/components/BottomNav";
import MovelPageHeader from "@/components/MovelPageHeader";
import { motion, AnimatePresence } from "framer-motion";

function fmtCOP(n: number) {
  return "$ " + n.toLocaleString("es-CO");
}

const mockFavoritos = [
  { id: "f1", titulo: "Toyota Hilux 4x4 2022", marca: "Toyota", precio: 178_000_000, km: "24.500 km", ciudad: "Medellín", img: "" },
  { id: "f2", titulo: "BMW 320i M Sport 2023", marca: "BMW", precio: 215_000_000, km: "8.500 km", ciudad: "Bogotá", img: "" },
  { id: "f3", titulo: "Mazda CX-5 Grand Touring 2022", marca: "Mazda", precio: 127_000_000, km: "18.200 km", ciudad: "Cali", img: "" },
  { id: "f4", titulo: "Honda Civic RS 2023", marca: "Honda", precio: 89_000_000, km: "6.200 km", ciudad: "Medellín", img: "" },
];

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState(mockFavoritos);

  function quitar(id: string) {
    setFavoritos((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      <MovelPageHeader />

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-black text-[#111418]">Mis favoritos</h1>
            <p className="text-[13px] text-[#637488] mt-0.5">
              {favoritos.length} {favoritos.length === 1 ? "vehículo guardado" : "vehículos guardados"}
            </p>
          </div>
          {favoritos.length > 0 && (
            <button
              onClick={() => setFavoritos([])}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-red-400 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <Trash size={14} />
              Limpiar todo
            </button>
          )}
        </div>

        {/* Lista */}
        <AnimatePresence>
          {favoritos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#f0f2f4] flex items-center justify-center mb-4">
                <Heart size={40} color="#dce0e5" weight="fill" />
              </div>
              <h2 className="text-[18px] font-bold text-[#111418] mb-2">Sin favoritos aún</h2>
              <p className="text-[14px] text-[#637488] mb-6 max-w-xs">
                Guarda los vehículos que te interesen tocando el corazón en cada anuncio.
              </p>
              <Link
                href="/buscar"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[14px] text-white"
                style={{ background: "linear-gradient(135deg, #1565c0, #1978e5)" }}
              >
                <MagnifyingGlass size={16} weight="bold" />
                Explorar vehículos
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              {favoritos.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl border border-[#dce0e5] overflow-hidden flex gap-0"
                >
                  {/* Imagen placeholder */}
                  <div
                    className="w-28 shrink-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #0d1b2e, #1565c0)" }}
                  >
                    <CarProfile size={36} color="rgba(255,255,255,0.3)" weight="fill" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-3 min-w-0">
                    <p className="text-[14px] font-black text-[#111418] leading-tight mb-0.5 truncate">
                      {item.titulo}
                    </p>
                    <p className="text-[#1978e5] text-[15px] font-black">{fmtCOP(item.precio)}</p>
                    <p className="text-[#637488] text-[12px] mt-0.5">
                      {item.km} · {item.ciudad}
                    </p>
                    <div className="flex gap-2 mt-2.5">
                      <Link
                        href={`/vehiculo/${item.id}`}
                        className="flex-1 text-center py-1.5 rounded-lg bg-[#1978e5] text-white text-[12px] font-bold hover:bg-[#1565c0] transition-colors"
                      >
                        Ver detalles
                      </Link>
                      <button
                        onClick={() => quitar(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#dce0e5] hover:bg-red-50 hover:border-red-200 transition-colors"
                      >
                        <Heart size={14} weight="fill" color="#f87171" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
