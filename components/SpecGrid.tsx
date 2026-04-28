interface SpecItem {
  label: string;
  value: string;
}

interface SpecGridProps {
  specs: SpecItem[];
}

export default function SpecGrid({ specs }: SpecGridProps) {
  return (
    <div className="grid grid-cols-2">
      {specs.map((spec, i) => (
        <div
          key={spec.label}
          className={`py-4 ${i % 2 === 0 ? "pr-4" : "pl-4 border-l border-[#dce0e5]"} ${
            i >= 2 ? "border-t border-[#dce0e5]" : ""
          }`}
        >
          <p className="text-[14px] text-[#637488]">{spec.label}</p>
          <p className="text-[16px] font-semibold text-[#111418] mt-0.5">{spec.value}</p>
        </div>
      ))}
    </div>
  );
}
