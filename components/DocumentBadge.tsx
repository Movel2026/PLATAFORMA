interface DocumentBadgeProps {
  vigente: boolean;
}

export default function DocumentBadge({ vigente }: DocumentBadgeProps) {
  return (
    <span
      className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
        vigente
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600"
      }`}
    >
      {vigente ? "Vigente" : "Vencido"}
    </span>
  );
}
