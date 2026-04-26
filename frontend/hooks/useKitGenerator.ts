"use client";

import { useState, useRef, useCallback } from "react";
import { generateKit } from "@/lib/api";
import { BUDGET_VALUES, LOADING_MESSAGES } from "@/lib/constants";
import { KitRequest, GeneratorState } from "@/types";

const DEFAULT_STATE: GeneratorState = {
  status: "idle",
  loadingMessage: LOADING_MESSAGES[0],
  errorMessage: "",
  downloadUrl: null,
  filename: null,
};

export function useKitGenerator() {
  const [state, setState] = useState<GeneratorState>(DEFAULT_STATE);
  const msgIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopMessageCycle = useCallback(() => {
    if (msgIntervalRef.current) {
      clearInterval(msgIntervalRef.current);
      msgIntervalRef.current = null;
    }
  }, []);

  const startMessageCycle = useCallback(() => {
    let i = 0;
    msgIntervalRef.current = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setState((s) => ({ ...s, loadingMessage: LOADING_MESSAGES[i] }));
    }, 1800);
  }, []);

  const generate = useCallback(
    async (
      formData: Omit<KitRequest, "budget"> & { budgetIndex: number; rep_email: string }
    ) => {
      // Revoke any previous object URL to avoid memory leaks
      setState((s) => {
        if (s.downloadUrl) URL.revokeObjectURL(s.downloadUrl);
        return { ...DEFAULT_STATE, status: "loading" };
      });

      startMessageCycle();

      const req: KitRequest = {
        client_name: formData.client_name,
        industry: formData.industry,
        objective: formData.objective,
        audience: formData.audience,
        budget: BUDGET_VALUES[formData.budgetIndex],
        selected_sbus: formData.selected_sbus,
        notes: formData.notes,
        rep_email: formData.rep_email,
      };

      try {
        const blob = await generateKit(req);
        const url = URL.createObjectURL(blob);
        const safeName = req.client_name.replace(/\s+/g, "_").replace(/\//g, "-");
        const filename = `MBC_${safeName}_MediaKit.pptx`;

        stopMessageCycle();
        setState({
          status: "success",
          loadingMessage: LOADING_MESSAGES[0],
          errorMessage: "",
          downloadUrl: url,
          filename,
        });

        // Auto-trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      } catch (err) {
        stopMessageCycle();
        setState({
          ...DEFAULT_STATE,
          status: "error",
          errorMessage: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
    [startMessageCycle, stopMessageCycle]
  );

  const reset = useCallback(() => {
    stopMessageCycle();
    setState((s) => {
      if (s.downloadUrl) URL.revokeObjectURL(s.downloadUrl);
      return DEFAULT_STATE;
    });
  }, [stopMessageCycle]);

  return { state, generate, reset };
}
