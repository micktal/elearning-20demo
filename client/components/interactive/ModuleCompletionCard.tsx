import { useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  moduleSequence,
  getNextModule,
  type ModuleKey,
} from "@/lib/moduleProgress";
import { useModuleProgress } from "@/providers/ModuleProgressProvider";
import { cn } from "@/lib/utils";

export type ModuleCompletionCardProps = {
  moduleId: ModuleKey;
  checklist: { id: string; label: string }[];
  description?: string;
};

export function ModuleCompletionCard({
  moduleId,
  checklist,
  description,
}: ModuleCompletionCardProps) {
  const { markModuleComplete, isModuleCompleted, getModuleScore } =
    useModuleProgress();
  const [responses, setResponses] = useState<Record<string, boolean>>(
    () => ({}),
  );

  const completedCount = useMemo(
    () => checklist.filter((item) => responses[item.id]).length,
    [checklist, responses],
  );
  const score = useMemo(
    () => Math.round((completedCount / checklist.length) * 100),
    [completedCount, checklist.length],
  );
  const ready = completedCount === checklist.length;
  const alreadyValidated = isModuleCompleted(moduleId);
  const storedScore = getModuleScore(moduleId);
  const nextModule = getNextModule(moduleId);
  const [justValidated, setJustValidated] = useState(false);

  const handleToggle = (id: string) => {
    setResponses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleValidate = useCallback(() => {
    if (!ready) return;
    markModuleComplete(moduleId, score || 100);
    try {
      setJustValidated(true);
      // remove the visual state after a brief moment
      window.setTimeout(() => setJustValidated(false), 1200);
    } catch (e) {
      // ignore
    }
  }, [markModuleComplete, moduleId, ready, score]);

  useEffect(() => {
    if (alreadyValidated) {
      // ensure a short announcement for screen readers when module becomes validated
      setJustValidated(true);
      const t = window.setTimeout(() => setJustValidated(false), 1200);
      return () => clearTimeout(t);
    }
    return;
  }, [alreadyValidated]);

  return (
    <div className={cn("rounded-3xl border border-white/10 bg-white/5 p-6", justValidated && "ring-2 ring-emerald-400/40")}
         aria-live="polite">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">
            Final scoring
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Validez le module
          </h2>
          {description && (
            <p className="mt-2 max-w-2xl text-slate-300">{description}</p>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Score
          </p>
          <p className="text-3xl font-semibold text-white">
            {alreadyValidated ? `${storedScore}%` : `${score}%`}
          </p>
          <Progress
            value={alreadyValidated ? storedScore : score}
            className="mt-2 h-2 bg-white/10 transition-all duration-200"
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {checklist.map((item) => (
          <label
            key={item.id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm transition",
              responses[item.id] &&
                "border-emerald-400 bg-emerald-400/10 text-emerald-100",
            )}
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 cursor-pointer accent-cyan-400"
              checked={responses[item.id] ?? false}
              onChange={() => handleToggle(item.id)}
              disabled={alreadyValidated}
              aria-checked={responses[item.id] ?? false}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {!alreadyValidated && (
          <Button size="lg" disabled={!ready} onClick={handleValidate} aria-label={ready ? "Valider le module" : "Complétez la checklist pour valider"}>
            Valider ce module
          </Button>
        )}
        {/* 'Module suivant' removed as per design — sequential gating remains handled elsewhere */}
        <Button
          size="lg"
          variant="ghost"
          onClick={() => setResponses({})}
          disabled={alreadyValidated}
        >
          Réinitialiser les cases
        </Button>
      </div>

      {/* Accessibility announcement for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {justValidated && "Module validé. Vous pouvez poursuivre le parcours."}
      </div>
    </div>
  );
}
