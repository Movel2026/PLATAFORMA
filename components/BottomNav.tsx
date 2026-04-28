"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, MagnifyingGlass, ChatCircle, User } from "@phosphor-icons/react";

const tabs = [
  { label: "Inicio",  href: "/",       icon: House },
  { label: "Buscar",  href: "/buscar", icon: MagnifyingGlass },
  { label: "Foro",    href: "/foro",   icon: ChatCircle },
  { label: "Perfil",  href: "/perfil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/" || pathname.startsWith("/vehiculo");
    return pathname.startsWith(href);
  }

  // dark background pages
  const isDark =
    pathname.startsWith("/buscar") ||
    pathname.startsWith("/publicar") ||
    pathname.startsWith("/subastas") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/foro") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/auth");

  return (
    // Only visible on mobile (md:hidden)
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 px-4 pb-3 pt-2 z-50"
      style={isDark
        ? {
            background: "rgba(8,16,30,0.96)",
            backdropFilter: "blur(14px)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }
        : {
            background: "white",
            borderTop: "1px solid #f0f2f4",
          }
      }
    >
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          const activeColor  = isDark ? "#60a5fa" : "#111418";
          const inactiveColor = isDark ? "rgba(255,255,255,0.35)" : "#637488";
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 min-w-[56px]"
            >
              <Icon
                size={24}
                weight={active ? "fill" : "regular"}
                color={active ? activeColor : inactiveColor}
              />
              <span
                className="text-[12px] font-medium"
                style={{ color: active ? activeColor : inactiveColor }}
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
