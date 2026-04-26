import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export default function InfoCard() {
  return (
    <div className="bg-dark rounded-2xl p-5 text-white">
      <div className="font-syne text-[13px] font-bold mb-3.5 text-white/70 tracking-widest uppercase">
        How This Works
      </div>

      <div className="flex flex-col gap-3">
        {HOW_IT_WORKS_STEPS.map(({ num, title, desc }) => (
          <div key={num} className="flex items-start gap-3">
            <div className="w-[22px] h-[22px] rounded-md bg-red-900/30 border border-red-700/50 text-red-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
              {num}
            </div>
            <p className="text-[12px] text-white/60 leading-relaxed">
              <strong className="text-white/80">{title}</strong> — {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
