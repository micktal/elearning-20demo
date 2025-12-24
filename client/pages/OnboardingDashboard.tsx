import { Link } from "react-router-dom";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { moduleSequence } from "@/lib/moduleProgress";
import { useModuleProgress } from "@/providers/ModuleProgressProvider";

const resourceLinks = [
  { title: "Charte HelioNova Pulse", href: "https://example.com/charte.pdf" },
  { title: "Kit d'accueil manager", href: "https://example.com/kit.pdf" },
  { title: "Procédure Nova Bleu", href: "https://example.com/nova.pdf" },
];

export default function OnboardingDashboard() {
  const { statuses, initialized } = useModuleProgress();
  const completedCount = moduleSequence.filter((module) => statuses[module.id]?.completed).length;
  const completionRate = Math.round((completedCount / moduleSequence.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />
      <main className="px-6 pb-24 pt-16">
        <section className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-8">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Tableau de bord</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold">Parcours HelioNova Pulse</h1>
              <p className="mt-3 text-slate-300">Suivez votre progression, consultez les badges obtenus et accédez à toutes les ressources-clés.</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 px-4 py-1">{completedCount}/{moduleSequence.length} modules validés</span>
                <span className="rounded-full border border-white/10 px-4 py-1">Score moyen : {(Object.values(statuses).reduce((sum, status) => sum + (status?.score ?? 0), 0) / moduleSequence.length).toFixed(0)}%</span>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Progression</p>
              <p className="mt-2 text-4xl font-semibold text-white">{completionRate}%</p>
              <Progress value={completionRate} className="mt-3 h-2 bg-white/10" />
              <div className="mt-4 flex justify-center gap-2">
                <Badge variant="secondary">Badge Pulse Explorer</Badge>
                {completionRate === 100 && <Badge variant="default">Certifié</Badge>}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-2">
          {moduleSequence.map((module) => {
            const status = statuses[module.id];
            const completed = status?.completed;
            return (
              <article key={module.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Module</p>
                <h2 className="text-2xl font-semibold text-white">{module.label}</h2>
                <p className="mt-2 text-sm text-slate-300">{completed ? "Module validé" : "En attente de validation"}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-400">Score : {status?.score ?? 0}%</span>
                  <Button size="sm" variant={completed ? "default" : "secondary"} asChild>
                    <Link to={module.path}>{completed ? "Revoir" : "Accéder"}</Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mx-auto mt-14 max-w-6xl grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Débrief interactif</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Ce que vous avez consolidé</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-200">
              <p>✔ Gouvernance stratégique &amp; posture Pulse</p>
              <p>✔ Réflexes sécurité : accès, incendie, EPI</p>
              <p>✔ Décision éthique, signalement et médiation</p>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
              Prochaine étape : planifier une immersion terrain avec votre mentor et partager ce rapport au manager.
            </div>
          </div>
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Ressources</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              {resourceLinks.map((resource) => (
                <li key={resource.title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="font-semibold text-white">{resource.title}</p>
                  <a href={resource.href} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
                    Télécharger
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </main>
    </div>
  );
}
