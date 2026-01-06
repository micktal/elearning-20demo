import { useState } from "react";
import { cn } from "@/lib/utils";

export type DiscoveryStep = {
  id: string;
  label: string;
  content: string;
};

export type GuidedDiscoveryProps = {
  title?: string;
  intro?: string;
  steps: DiscoveryStep[];
};

export function GuidedDiscovery({ title, intro, steps }: GuidedDiscoveryProps) {
  const [unlocked, setUnlocked] = useState<string[]>(
    steps.length ? [steps[0].id] : [],
  );
  const [activeStep, setActiveStep] = useState(steps[0]?.id ?? "");

  const handleClick = (stepId: string) => {
    if (!unlocked.includes(stepId)) return;
    setActiveStep(stepId);
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    const nextStep = steps[stepIndex + 1];
    if (nextStep && !unlocked.includes(nextStep.id)) {
      setUnlocked((prev) => [...prev, nextStep.id]);
    }
  };

  const currentStep = steps.find((step) => step.id === activeStep);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      {title && (
        <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">
          {title}
        </p>
      )}
      {intro && <p className="mt-2 text-sm text-slate-300">{intro}</p>}
      <div className="mt-4 grid gap-4 md:grid-cols-[260px_1fr]">
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isUnlocked = unlocked.includes(step.id);
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleClick(step.id)}
                className={cn(
                  "w-full rounded-2xl border px-4 py-3 text-left text-sm transition",
                  isUnlocked
                    ? index === unlocked.length - 1 && !currentStep
                      ? "border-amber-300"
                      : "border-cyan-400 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white"
                    : "border-white/10 bg-slate-900/40 text-slate-500",
                )}
                disabled={!isUnlocked}
              >
                <p className="text-xs uppercase tracking-[0.4em]">
                  Étape {index + 1}
                </p>
                <p className="text-base font-semibold">{step.label}</p>
              </button>
            );
          })}
        </div>
        {currentStep && (
          <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-200">
            {currentStep.content}
          </article>
        )}
      </div>
    </div>
  );
}
