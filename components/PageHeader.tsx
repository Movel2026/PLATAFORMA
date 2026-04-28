"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ShareNetwork } from "@phosphor-icons/react";

interface PageHeaderProps {
  title?: string;
  showShare?: boolean;
  showBack?: boolean;
  onBack?: () => void;
}

export default function PageHeader({
  title,
  showShare = false,
  showBack = true,
  onBack,
}: PageHeaderProps) {
  const router = useRouter();

  function handleBack() {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-40">
      {showBack ? (
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f0f2f4] transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft size={24} color="#111418" weight="bold" />
        </button>
      ) : (
        <div className="w-10" />
      )}

      {title && (
        <h1 className="text-[18px] font-bold text-[#111418] tracking-tight">
          {title}
        </h1>
      )}

      {showShare ? (
        <button
          onClick={handleShare}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f0f2f4] transition-colors"
          aria-label="Compartir"
        >
          <ShareNetwork size={24} color="#111418" />
        </button>
      ) : (
        <div className="w-10" />
      )}
    </header>
  );
}
