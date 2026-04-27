"use client";

import { INDUSTRIES } from "@/lib/constants";

interface Props {
  clientName: string;
  industry: string;
  onChange: (field: string, value: string) => void;
}

export default function ClientInfoSection({ clientName, industry, onChange }: Props) {
  return (
    <div className="pb-7 mb-7 border-b border-silver">
      <div className="section-label">Client Information</div>

      <div className="mb-4">
        <label className="field-label">
          Client / Brand Name <span className="text-blue-500">*</span>
        </label>
        <input
          type="text"
          className="field-input"
          placeholder="e.g. Jollibee Foods Corp."
          value={clientName}
          onChange={(e) => onChange("clientName", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="field-label">
          Industry / Vertical <span className="text-blue-500">*</span>
        </label>
        <select
          className="field-input"
          value={industry}
          onChange={(e) => onChange("industry", e.target.value)}
          required
        >
          <option value="">Select industry…</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
