import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { LogoMark } from "@/components/branding/LogoMark";
import { Button } from "@/components/ui/button";
import { moduleSequence, type ModuleKey } from "@/lib/moduleProgress";
import { useModuleProgress } from "@/providers/ModuleProgressProvider";
import { cn } from "@/lib/utils";

type PrimaryHeaderProps = {
  theme?: "light" | "dark";
};

export function PrimaryHeader({ theme = "dark" }: PrimaryHeaderProps) {
  const isDark = theme === "dark";
  const { initialized, isModuleUnlocked, statuses } = useModuleProgress();

  const totalModules = moduleSequence.length;
  const completedCount = moduleSequence.reduce((count, module) => (statuses[module.id]?.completed ? count + 1 : count), 0);
  const completionRatio = totalModules === 0 ? 0 : completedCount / totalModules;
  const trackerWidth = Math.max(8, completionRatio * 100);

  const nextModule = moduleSequence.find((module) => !statuses[module.id]?.completed);
  const resumePath = nextModule ? nextModule.path : "/onboarding/dashboard";
  const resumeLabel = nextModule ? "Reprendre le parcours" : "Programme validé";

  const capsuleBase = cn(
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] transition",
    isDark ? "border-white/10 text-slate-100" : "border-slate-300 text-slate-700",
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b backdrop-blur-xl",
        isDark ? "bg-slate-950/70 border-white/5" : "bg-white/80 border-slate-200",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" aria-label="HelioNova Accueil">
            <LogoMark tone={isDark ? "dark" : "light"} />
          </Link>
          <div className="hidden md:flex flex-col gap-1">
            <span className={cn("text-[11px] uppercase tracking-[0.4em]", isDark ? "text-slate-400" : "text-slate-500")}>Parcours</span>
            <div className="flex items-center gap-3 text-xs">
              <span className={cn("font-semibold", isDark ? "text-white" : "text-slate-800")}>
                {completedCount}/{totalModules} modules validés
              </span>
              <div
                className={cn(
                  "h-1.5 w-32 rounded-full",
                  isDark ? "bg-white/10" : "bg-slate-200",
                )}
                role="presentation"
              >
                <span
                  className={cn(
                    "block h-full rounded-full",
                    isDark ? "bg-cyan-300" : "bg-sky-500",
                  )}
                  style={{ width: `${trackerWidth}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-1 lg:flex-row lg:items-center lg:gap-6">
          <nav
            className={cn(
              "order-2 w-full overflow-x-auto pb-1 lg:order-1",
              isDark ? "text-slate-200" : "text-slate-700",
            )}
            aria-label="Navigation des modules"
          >
            <div className={cn("text-[11px] uppercase tracking-[0.35em]", isDark ? "text-slate-500" : "text-slate-500")}>Séquence immersive</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {moduleSequence.map((module) => {
                const unlocked = initialized ? isModuleUnlocked(module.id) : module.id === "intro";
                const completed = statuses[module.id]?.completed;

                if (!unlocked) {
                  return (
                    <span
                      key={module.id}
                      className={cn(
                        capsuleBase,
                        isDark ? "text-slate-500/70 border-white/5" : "text-slate-400 border-slate-200",
                      )}
                    >
                      <Lock className="h-3 w-3" aria-hidden />
                      {module.label}
                    </span>
                  );
                }

                return (
                  <Link
                    key={module.id}
                    to={module.path}
                    className={cn(
                      capsuleBase,
                      "hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/5",
                      completed && "border-emerald-300/80 text-emerald-100 bg-emerald-500/10",
                      !isDark && "hover:border-slate-400 hover:bg-slate-50",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        completed ? "bg-emerald-300" : "bg-white/60",
                        !isDark && !completed && "bg-slate-500",
                      )}
                    />
                    {module.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="order-1 flex flex-wrap items-center justify-end gap-2 lg:order-2">
            <Button variant={isDark ? "secondary" : "outline"} size="sm" asChild>
              <Link to={resumePath}>{resumeLabel}</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/onboarding/dashboard">Tableau de bord</Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/">Portail HelioNova</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
