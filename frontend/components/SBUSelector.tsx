"use client";

import { SBU_OPTIONS } from "@/lib/constants";

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function SBUSelector({ selected, onChange }: Props) {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="pb-7 mb-7 border-b border-silver">
      <div className="section-label">Preferred MBC Platforms</div>
      <label className="field-label">Select all that may apply</label>

      <div className="grid grid-cols-2 gap-2 mt-1">
        {SBU_OPTIONS.map(({ value, label, icon }) => {
          const checked = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              className={`flex items-center gap-2.5 px-3 py-2.5 border-[1.5px] rounded-lg text-left transition-colors ${
                checked
                  ? "border-navy bg-[#EEF1FB]"
                  : "border-border hover:border-navy hover:bg-[#f8f9ff]"
              }`}
            >
              <div
                className={`w-4 h-4 border-[1.5px] rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                  checked ? "bg-navy border-navy" : "bg-white border-border"
                }`}
              >
                {checked && (
                  <svg width="8" height="6" viewBox="0 0 10 7" fill="none">
                    <path d="M1 3l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-[12.5px] ${checked ? "text-navy font-medium" : "text-text"}`}>
                {icon} {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
