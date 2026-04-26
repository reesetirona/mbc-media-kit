"use client";

import { BUDGET_VALUES, BUDGET_LABELS } from "@/lib/constants";

interface Props {
  value: number;
  onChange: (index: number) => void;
}

export default function BudgetSlider({ value, onChange }: Props) {
  const pct = (value / (BUDGET_VALUES.length - 1)) * 100;

  return (
    <div className="pb-7 mb-7 border-b border-silver">
      <div className="section-label">Budget Range</div>

      <div className="font-syne text-[22px] font-bold text-navy mb-2.5">
        {BUDGET_VALUES[value]}{" "}
        <span className="text-[13px] font-normal text-muted font-sans">
          estimated campaign budget
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={BUDGET_VALUES.length - 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 rounded cursor-pointer outline-none appearance-none"
        style={{
          background: `linear-gradient(to right, var(--navy) 0%, var(--navy) ${pct}%, #E2E5EC ${pct}%)`,
        }}
      />

      <div className="flex justify-between text-[10px] text-muted font-mono mt-1.5">
        {BUDGET_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
