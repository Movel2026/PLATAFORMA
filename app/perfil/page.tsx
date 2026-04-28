import Link from "next/link";
import { UserCircle, CarProfile, Heart, Bell, Info, ArrowRight, SignOut } from "@phosphor-icons/react/dist/ssr";
import BottomNav from "@/components/BottomNav";

const menuItems = [
  { icon: CarProfile, label: "Mis vehículos publicados", href: "/publicar" },
  { icon: Heart, label: "Mis favoritos", href: "/favoritos" },
  { icon: Bell, label: "Notificaciones", href: "#" },
  { icon: Info, label: "Acerca de MOVEL", href: "#" },
];

export default function PerfilPage() {
  return (
    <div className="pb-24">
      <div className="px-4 py-4 border-b border-[#f0f2f4]">
        <h1 className="text-[20px] font-bold text-[#111418]">Perfil</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center py-8">
        <div className="w-20 h-20 rounded-full bg-[#e8f0fd] flex items-center justify-center mb-3">
          <UserCircle size={52} color="#1978e5" weight="fill" />
        </div>
        <p className="text-[18px] font-bold text-[#111418]">Invitado</p>
        <p className="text-[14px] text-[#637488] mb-4">Inicia sesión para acceder a tu cuenta</p>
        <button className="h-10 px-6 bg-[#1978e5] text-white rounded-lg font-bold text-[14px]">
          Iniciar sesión
        </button>
      </div>

      {/* Menu */}
      <div className="px-4">
        <div className="border border-[#dce0e5] rounded-xl overflow-hidden">
          {menuItems.map(({ icon: Icon, label, href }, i) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center justify-between px-4 py-4 bg-white hover:bg-[#f0f2f4] transition-colors ${
                i < menuItems.length - 1 ? "border-b border-[#dce0e5]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={22} color="#637488" />
                <span className="text-[15px] font-semibold text-[#111418]">{label}</span>
              </div>
              <ArrowRight size={18} color="#637488" />
            </Link>
          ))}
        </div>

        <button className="mt-4 w-full flex items-center justify-center gap-2 h-12 border border-[#dce0e5] rounded-xl text-[#637488] font-semibold text-[15px]">
          <SignOut size={20} />
          Cerrar sesión
        </button>

        <p className="text-center text-[12px] text-[#637488] mt-6">
          MOVEL v1.0.0 · Compra y vende seguro en Colombia
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
