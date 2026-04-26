"use client";

import { GeneratorState } from "@/types";

interface Props {
  state: GeneratorState;
  onDownloadAgain: () => void;
}

export default function PreviewCard({ state, onDownloadAgain }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="bg-dark px-5 py-4 flex items-center justify-between">
        <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
          AI Preview
        </span>
        <div className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] animate-pulse" />
      </div>

      <div className="p-5 min-h-[280px] flex items-center justify-center">
        {state.status === "idle" && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 bg-off rounded-xl flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <p className="text-[13px] text-muted max-w-[220px] leading-relaxed">
              Fill in the form and click Generate. MMG AI will build your kit content here.
            </p>
          </div>
        )}

        {state.status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-9 h-9 border-[3px] border-silver border-t-navy rounded-full animate-spin" />
            <div className="text-[13px] text-muted font-mono animate-pulse">
              {state.loadingMessage}
            </div>
          </div>
        )}

        {state.status === "success" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <p className="font-syne text-[15px] font-bold text-navy">Kit Generated!</p>
              <p className="text-[12px] text-muted mt-1">{state.filename}</p>
            </div>
            {state.downloadUrl && (
              <a
                href={state.downloadUrl}
                download={state.filename ?? undefined}
                className="text-[12px] text-blue-600 underline"
                onClick={onDownloadAgain}
              >
                Download again
              </a>
            )}
          </div>
        )}

        {state.status === "error" && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <p className="text-[13px] text-red-600 max-w-[220px] leading-relaxed">
              {state.errorMessage || "Generation failed. Please try again."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
