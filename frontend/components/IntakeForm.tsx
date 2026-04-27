"use client";

import { useState } from "react";
import { useKitGenerator } from "@/hooks/useKitGenerator";
import ClientInfoSection from "./ClientInfoSection";
import CampaignGoalsSection from "./CampaignGoalsSection";
import SalesRepSection from "./SalesRepSection";
import SBUSelector from "./SBUSelector";
import BudgetSlider from "./BudgetSlider";

interface FormState {
  clientName: string;
  industry: string;
  objective: string;
  audience: string;
  notes: string;
  selectedSBUs: string[];
  budgetIndex: number;
  repName: string;
  repMobile: string;
  repEmail: string;
}

const INITIAL: FormState = {
  clientName: "",
  industry: "",
  objective: "",
  audience: "",
  notes: "",
  selectedSBUs: [],
  budgetIndex: 3,
  repName: "",
  repMobile: "",
  repEmail: "",
};

interface Props {
  generate: ReturnType<typeof useKitGenerator>["generate"];
  isLoading: boolean;
}

export default function IntakeForm({ generate, isLoading }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL);

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = () => {
    generate({
      client_name: form.clientName,
      industry: form.industry,
      objective: form.objective,
      audience: form.audience,
      budgetIndex: form.budgetIndex,
      selected_sbus: form.selectedSBUs,
      notes: form.notes,
      rep_name: form.repName,
      rep_mobile: form.repMobile,
      rep_email: form.repEmail,
    });
  };

  const isValid = Boolean(form.clientName.trim() && form.industry && form.objective);

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="bg-navy px-5 py-5 sm:px-9 sm:py-7 relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-blue-400">
        <h1 className="font-syne text-[22px] font-bold text-white">Campaign Brief</h1>
        <p className="text-[13px] text-white/55 mt-1">
          Fill in the details below. MMG AI will generate a tailored media kit in seconds.
        </p>
      </div>

      <div className="p-5 sm:p-9 flex flex-col">
        <ClientInfoSection
          clientName={form.clientName}
          industry={form.industry}
          onChange={handleChange}
        />
        <CampaignGoalsSection
          objective={form.objective}
          audience={form.audience}
          notes={form.notes}
          onChange={handleChange}
        />
        <SBUSelector
          selected={form.selectedSBUs}
          onChange={(sbus) => setForm((f) => ({ ...f, selectedSBUs: sbus }))}
        />
        <SalesRepSection
          repName={form.repName}
          repMobile={form.repMobile}
          repEmail={form.repEmail}
          onChange={handleChange}
        />
        <BudgetSlider
          value={form.budgetIndex}
          onChange={(i) => setForm((f) => ({ ...f, budgetIndex: i }))}
        />

        <button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="w-full py-4 bg-navy text-white rounded-[10px] font-syne text-[15px] font-bold tracking-wider mt-7 flex items-center justify-center gap-2.5 relative overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(11,31,75,0.3)] disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          <span className="absolute inset-0 bg-blue-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          <span className="relative z-10">
            {isLoading ? "Generating…" : "Generate Customized Media Kit"}
          </span>
          {!isLoading && (
            <svg className="relative z-10" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
