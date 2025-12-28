import { Link, useNavigate } from "react-router-dom";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { moduleSequence } from "@/lib/moduleProgress";
import { useModuleProgress } from "@/providers/ModuleProgressProvider";

export default function OnboardingDashboard() {
  const { statuses } = useModuleProgress();
  const navigate = useNavigate();

  const completedCount = moduleSequence.filter((m) => statuses[m.id]?.completed).length;

  const completionRate = Math.round((completedCount / moduleSequence.length) * 100);

  const nextModule = moduleSequence.find((m) => !statuses[m.id]?.completed);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        {/* HERO DASHBOARD */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-indigo-950 p-10">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Tableau de bord</p>

          <h1 className="mt-4 text-4xl font-semibold">Parcours HelioNova Pulse</h1>

          <p className="mt-3 max-w-2xl text-slate-300">Suivez votre progression et accédez aux modules du programme d’onboarding.</p>

          {/* PROGRESSION */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Progression globale</p>
                <p className="mt-1 text-3xl font-semibold">{completionRate} %</p>
              </div>
              <span className="text-sm text-slate-400">{completedCount}/{moduleSequence.length} modules validés</span>
            </div>
            <Progress value={completionRate} className="mt-4 h-2 bg-white/10" />
          </div>

          {/* ACTION PRINCIPALE */}
          <div className="mt-10 flex flex-wrap gap-4">
            {nextModule ? (
              <Button size="lg" onClick={() => navigate(nextModule.path)}>
                Continuer le parcours
              </Button>
            ) : (
              <Button size="lg" variant="secondary">Parcours terminé</Button>
            )}

            <Button variant="ghost" size="lg" asChild>
              <Link to="/">Retour à l’accueil</Link>
            </Button>
          </div>
        </section>

        {/* LISTE DES MODULES */}
        <section className="mx-auto mt-14 max-w-5xl">
          <h2 className="mb-6 text-2xl font-semibold">Modules du parcours</h2>

          <div className="grid gap-4">
            {moduleSequence.map((module) => {
              const completed = statuses[module.id]?.completed;
              return (
                <div
                  key={module.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div>
                    <p className="font-semibold text-white">{module.label}</p>
                    <p className="text-sm text-slate-400">{completed ? "Validé" : "À suivre"}</p>
                  </div>

                  <Button size="sm" variant={completed ? "secondary" : "default"} asChild>
                    <Link to={module.path}>{completed ? "Revoir" : "Accéder"}</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
