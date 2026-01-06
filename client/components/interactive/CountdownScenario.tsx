import { useEffect, useMemo, useState } from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type CountdownOption = {
  id: string;
  label: string;
  impact: string;
  status: "success" | "warning" | "risk";
};

export type CountdownScenarioProps = {
  title?: string;
  prompt: string;
  options: CountdownOption[];
  duration?: number;
};

const statusClasses: Record<CountdownOption["status"], string> = {
  success: "border-emerald-400 bg-emerald-500/10 text-emerald-100",
  warning: "border-amber-400 bg-amber-500/10 text-amber-100",
  risk: "border-rose-500 bg-rose-500/10 text-rose-100",
};

export function CountdownScenario({ title, prompt, options, duration = 20 }: CountdownScenarioProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [started, setStarted] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [started, timeLeft]);

  const handleStart = () => {
    setStarted(true);
    setTimeLeft(duration);
    setChoice(null);
  };

  const feedback = useMemo(() => options.find((option) => option.id === choice), [options, choice]);

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6">
      {title && <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">{title}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h3 className="text-2xl font-semibold text-white">{prompt}</h3>
        <span className="rounded-full border border-white/10 px-4 py-1 text-sm text-slate-300">Timer : {timeLeft}s</span>
        <Button size="sm" variant="secondary" onClick={handleStart}>
          {started ? "Rejouer" : "Lancer"}
        </Button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={!started || timeLeft <= 0}
            onClick={() => setChoice(option.id)}
            className={cn(
              "rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm transition",
              choice === option.id && statusClasses[option.status],
              (!started || timeLeft <= 0) && "cursor-not-allowed opacity-70",
            )}
          >
            <p className="text-base font-semibold text-white">{option.label}</p>
            <p className="text-slate-300">{option.impact}</p>
          </button>
        ))}
      </div>
      {feedback && (
        <div className={cn("mt-4 rounded-2xl border px-4 py-3 text-sm", statusClasses[feedback.status])}>
          Décision sélectionnée : {feedback.impact}
        </div>
      )}
    </div>
  );
}
