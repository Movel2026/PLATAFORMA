"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, MagnifyingGlass, Heart, User } from "@phosphor-icons/react";

const tabs = [
  { label: "Inicio",    href: "/",          icon: House },
  { label: "Buscar",    href: "/buscar",    icon: MagnifyingGlass },
  { label: "Favoritos", href: "/favoritos", icon: Heart },
  { label: "Perfil",    href: "/perfil",    icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/" || pathname.startsWith("/vehiculo");
    return pathname.startsWith(href);
  }

  return (
    // Only visible on mobile (md:hidden)
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#f0f2f4] bg-white px-4 pb-3 pt-2 z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 min-w-[56px]"
            >
              <Icon
                size={24}
                weight={active ? "fill" : "regular"}
                color={active ? "#111418" : "#637488"}
              />
              <span
                className="text-[12px] font-medium"
                style={{ color: active ? "#111418" : "#637488" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
