"use client";

import { OBJECTIVES } from "@/lib/constants";

interface Props {
  objective: string;
  audience: string;
  notes: string;
  onChange: (field: string, value: string) => void;
}

export default function CampaignGoalsSection({ objective, audience, notes, onChange }: Props) {
  return (
    <div className="pb-7 mb-7 border-b border-silver">
      <div className="section-label">Campaign Goals</div>

      <div className="mb-4">
        <label className="field-label">
          Primary Objective <span className="text-blue-500">*</span>
        </label>
        <select
          className="field-input"
          value={objective}
          onChange={(e) => onChange("objective", e.target.value)}
          required
        >
          <option value="">Select objective…</option>
          {OBJECTIVES.map((obj) => (
            <option key={obj} value={obj}>{obj}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="field-label">Target Audience</label>
        <input
          type="text"
          className="field-input"
          placeholder="e.g. 18–45, household decision-makers, nationwide"
          value={audience}
          onChange={(e) => onChange("audience", e.target.value)}
        />
      </div>

      <div>
        <label className="field-label">Campaign Notes / Special Requests</label>
        <textarea
          className="field-input resize-y min-h-[80px] leading-relaxed"
          placeholder="Any specific angles, timings, past campaigns, competitor context…"
          value={notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </div>
    </div>
  );
}
