"use client";

interface Props {
  repName: string;
  repMobile: string;
  repEmail: string;
  onChange: (field: string, value: string) => void;
}

export default function SalesRepSection({ repName, repMobile, repEmail, onChange }: Props) {
  return (
    <div className="pb-7 mb-7 border-b border-silver">
      <div className="section-label">Sales Rep Contact <span className="text-muted font-normal normal-case tracking-normal text-[11px]">— optional</span></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
        <div>
          <label className="field-label">Name</label>
          <input
            type="text"
            className="field-input"
            placeholder="e.g. Maria Santos"
            value={repName}
            onChange={(e) => onChange("repName", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Mobile Number</label>
          <input
            type="tel"
            className="field-input"
            placeholder="e.g. +63 917 123 4567"
            value={repMobile}
            onChange={(e) => onChange("repMobile", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="field-label">Email Address</label>
        <input
          type="email"
          className="field-input"
          placeholder="e.g. m.santos@mbcmediagroup.com"
          value={repEmail}
          onChange={(e) => onChange("repEmail", e.target.value)}
        />
      </div>
    </div>
  );
}
