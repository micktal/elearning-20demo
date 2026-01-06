import { useCallback, useEffect, useMemo, useState } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
  externalResponses?: Record<string, boolean>;
};

export function ModuleCompletionCard({
  moduleId,
  checklist,
  description,
  externalResponses,
}: ModuleCompletionCardProps) {
  const { markModuleComplete, isModuleCompleted, getModuleScore } =
    useModuleProgress();
  const [responses, setResponses] = useState<Record<string, boolean>>(() => ({}));

  // Merge external responses when provided (e.g., mini-game completion signals)
  useEffect(() => {
    if (!externalResponses) return;
    setResponses((prev) => ({ ...prev, ...externalResponses }));
  }, [externalResponses]);

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
            <p className="mt-2 text-sm text-slate-300">{description}</p>
          )}
        </div>
        <div className="mt-4 md:mt-0">
          <Progress value={score} className="w-60" />
          <div className="mt-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setResponses({})}>
              Réinitialiser
            </Button>
            <Button size="sm" onClick={handleValidate} disabled={!ready || alreadyValidated}>
              {alreadyValidated ? "Validé" : "Valider"}
            </Button>
          </div>
          {alreadyValidated && (
            <p className="mt-2 text-sm text-slate-400">Score enregistré : {storedScore}%</p>
          )}
          {nextModule && (
            <p className="mt-2 text-sm text-slate-400">Module suivant : {nextModule.label}</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {checklist.map((item) => (
          <label key={item.id} className={cn("flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm", responses[item.id] && "bg-slate-900/70") }>
            <div>
              <p className="font-semibold text-white">{item.label}</p>
            </div>
            <div>
              <input type="checkbox" checked={!!responses[item.id]} onChange={() => handleToggle(item.id)} />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
