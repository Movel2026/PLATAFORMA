import { Heart } from "@phosphor-icons/react/dist/ssr";
import BottomNav from "@/components/BottomNav";

export default function FavoritosPage() {
  return (
    <div className="pb-24 min-h-screen">
      <div className="px-4 py-4 border-b border-[#f0f2f4]">
        <h1 className="text-[20px] font-bold text-[#111418]">Favoritos</h1>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#f0f2f4] flex items-center justify-center mb-4">
          <Heart size={40} color="#dce0e5" weight="fill" />
        </div>
        <h2 className="text-[18px] font-bold text-[#111418] mb-2">
          Sin favoritos aún
        </h2>
        <p className="text-[15px] text-[#637488]">
          Guarda los vehículos que te interesen para verlos aquí.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
