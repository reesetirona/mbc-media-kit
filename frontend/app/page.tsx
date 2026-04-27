"use client";

import { useKitGenerator } from "@/hooks/useKitGenerator";
import IntakeForm from "@/components/IntakeForm";
import PreviewCard from "@/components/PreviewCard";
import InfoCard from "@/components/InfoCard";

export default function HomePage() {
  const { state, generate, reset } = useKitGenerator();

  return (
    <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
      <IntakeForm generate={generate} isLoading={state.status === "loading"} />

      <div className="flex flex-col gap-4 lg:sticky lg:top-20">
        <PreviewCard state={state} onDownloadAgain={reset} />
        <InfoCard />
      </div>
    </main>
  );
}
