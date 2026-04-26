"use client";

import { INDUSTRIES } from "@/lib/constants";

interface Props {
  clientName: string;
  contactPerson: string;
  industry: string;
  onChange: (field: string, value: string) => void;
}

export default function ClientInfoSection({ clientName, contactPerson, industry, onChange }: Props) {
  return (
    <div className="pb-7 mb-7 border-b border-silver">
      <div className="section-label">Client Information</div>

      <div className="grid grid-cols-2 gap-3.5 mb-4">
        <div>
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
          <label className="field-label">Contact Person</label>
          <input
            type="text"
            className="field-input"
            placeholder="e.g. Maria Santos"
            value={contactPerson}
            onChange={(e) => onChange("contactPerson", e.target.value)}
          />
        </div>
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
