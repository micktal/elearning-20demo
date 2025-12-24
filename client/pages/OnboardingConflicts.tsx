import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { cn } from "@/lib/utils";

const conflictStats = [
  { label: "Durée de focus", value: "3 minutes" },
  { label: "Études de cas", value: "3 scénarios" },
  { label: "Objectif HelioNova", value: "Résolution < 24 h" },
];

const deEscalationPhases = [
  {
    phase: "1. Observation factuelle",
    window: "0 — 5 min",
    guidance: "Recueillir les faits, vérifier l'impact concret et bannir tout jugement.",
    indicator: "Compte rendu neutre validé par les parties",
  },
  {
    phase: "2. Clarification croisée",
    window: "5 — 15 min",
    guidance: "Faire reformuler chaque enjeu, isoler les besoins et quantifier les priorités.",
    indicator: "Liste d'attentes convergente",
  },
  {
    phase: "3. Décision cadrée",
    window: "15 — 25 min",
    guidance: "S'accorder sur un plan d'action, désigner un sponsor et fixer un point de contrôle.",
    indicator: "Engagement écrit + point J+1",
  },
];

const branchingScenarios = [
  {
    id: "atelier",
    title: "Atelier transverse bloqué",
    context:
      "L'équipe data et le studio design contestent la priorisation d'un livrable client. Le ton monte pendant le comité d'arbitrage.",
    signals: ["Décisions contradictoires", "Réunions rallongées", "Ton défensif"],
    tip: "Faire intervenir un tiers neutre pour reformuler les priorités et visualiser les dépendances réduit de 40 % les escalades.",
    branches: [
      {
        id: "report",
        label: "Reporter la discussion au prochain comité",
        impact: "Le blocage se solidifie, les équipes continuent en parallèle sans cohérence.",
        status: "warning",
      },
      {
        id: "arbitre",
        label: "Imposer une décision unilatérale",
        impact: "Décision contestée, adoption partielle et risques qualité.",
        status: "warning",
      },
      {
        id: "mediateur",
        label: "Nommer un médiateur et cadrer une synthèse en 15 min",
        impact: "Plan co-construit, livrable aligné et blocage levé en séance.",
        status: "success",
      },
    ],
  },
  {
    id: "feedback",
    title: "Feedback perçu comme injuste",
    context:
      "Un manager fournit un retour direct à un collaborateur senior devant l'équipe. Le collaborateur conteste publiquement l'analyse.",
    signals: ["Non-verbal fermé", "Remise en cause du manager", "Rumeurs"],
    tip: "Un recadrage individuel suivi d'un plan d'appui partagé évite 70 % des départs non souhaités.",
    branches: [
      {
        id: "ignorer",
        label: "Ignorer la réaction et poursuivre la réunion",
        impact: "La tension se diffuse, l'équipe se polarise et l'incident est amplifié sur Nova Bleu.",
        status: "warning",
      },
      {
        id: "public",
        label: "Demander des excuses publiques immédiates",
        impact: "Le collaborateur se braque, risque de plainte RH et perte de confiance.",
        status: "warning",
      },
      {
        id: "apart",
        label: "Mettre en pause, traiter en aparté et formaliser un plan",
        impact: "Dialogue apaisé, attentes clarifiées et message aligné au collectif.",
        status: "success",
      },
    ],
  },
  {
    id: "client",
    title: "Incident client multi-sites",
    context:
      "Deux responsables locaux se renvoient la responsabilité d'un incident de production devant le client stratégique.",
    signals: ["Mails en copie Comex", "Menace d'escalade fournisseur", "Retard d'analyse"],
    tip: "La création d'un journal de bord partagé et daté sécurise la transparence vis-à-vis du client.",
    branches: [
      {
        id: "blame",
        label: "Identifier un fautif pour clore rapidement",
        impact: "Risque juridique, confiance client dégradée, apprentissages non capturés.",
        status: "warning",
      },
      {
        id: "silence",
        label: "Attendre la consolidation des faits avant de répondre",
        impact: "Client laissé sans visibilité, pénalités potentielles.",
        status: "warning",
      },
      {
        id: "copil",
        label: "Organiser un copil éclair avec plan de réponse commun",
        impact: "Message unique, backlog partagé et transparence sur les remédiations.",
        status: "success",
      },
    ],
  },
];

const funFacts = [
  {
    title: "+18 pts",
    detail: "Les équipes ayant un rituel de clarification gagnent jusqu'à 18 points d'engagement Pulse.",
  },
  {
    title: "24 h",
    detail: "Un suivi froid et scripté dans les 24 h évite 6 dossiers disciplinaires sur 10.",
  },
  {
    title: "92 %",
    detail: "92 % des clients retiennent HelioNova lorsque la réponse de crise est co-signée par les unités locales.",
  },
];

const playbookSteps = [
  {
    stage: "Avant l'échange",
    checklist: ["Lister les faits et acteurs impactés", "Bloquer un créneau court et cadré", "Préparer une issue minimale acceptable"],
  },
  {
    stage: "Pendant",
    checklist: ["Poser les règles de parole", "Utiliser des questions ouvertes", "Valider la compréhension des engagements"],
  },
  {
    stage: "Après",
    checklist: ["Documenter sous Nova Bleu", "Partager les décisions aux sponsors", "Programmer un point de suivi"],
  },
];

export default function OnboardingConflicts() {
  const [activeScenario, setActiveScenario] = useState(branchingScenarios[0].id);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const scenario = useMemo(
    () => branchingScenarios.find((item) => item.id === activeScenario) ?? branchingScenarios[0],
    [activeScenario],
  );

  const activeBranch = scenario.branches.find((branch) => branch.id === selectedBranch);

  const handleScenarioChange = (id: string) => {
    setActiveScenario(id);
    setSelectedBranch(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />
      <main className="px-6 pb-24 pt-16">
        <section className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Étape 4 · Gestion des conflits</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8">
              <h1 className="text-4xl font-semibold">Neutraliser les tensions et sécuriser la coopération</h1>
              <p className="mt-4 text-slate-300">
                Ce module outille chaque collaborateur pour détecter rapidement les signaux faibles, cadrer les échanges sensibles et formaliser un plan commun.
                Il s'appuie sur des scénarios réels HelioNova et des leviers de médiation corporate.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {conflictStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-sm text-slate-300">{item.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/onboarding/simulations">← Simulations</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link to="/">Clore le parcours</Link>
                </Button>
              </div>
            </article>

            <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/20">
              <h2 className="text-xl font-semibold text-white">Phases de désescalade</h2>
              <p className="text-sm text-slate-300">Suivre cette séquence garantit une traçabilité claire et une posture corporate alignée.</p>
              <div className="mt-6 space-y-4">
                {deEscalationPhases.map((phase) => (
                  <div key={phase.phase} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">{phase.window}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{phase.phase}</p>
                    <p className="text-sm text-slate-300">{phase.guidance}</p>
                    <p className="mt-2 text-xs text-slate-400">Indicateur : {phase.indicator}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Scénarios d'embranchements</p>
              <h2 className="mt-2 text-3xl font-semibold">Choisissez la conduite à tenir</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Sélectionnez un cas d'usage puis expérimentez les différentes réactions possibles. Les meilleures réponses s'appuient sur la méthodologie Pulse.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 px-4 py-1">Coût moyen d'un conflit : 3 jours/homme</span>
              <span className="rounded-full border border-white/10 px-4 py-1">Taux de résolution cible : 95 %</span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
            <div className="flex flex-col gap-3">
              {branchingScenarios.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScenarioChange(item.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                    activeScenario === item.id
                      ? "border-cyan-400 bg-gradient-to-r from-cyan-400/20 to-indigo-500/20"
                      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Cas pratique</p>
                  <p className="mt-1 text-base font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.signals.join(" · ")}</p>
                </button>
              ))}
            </div>

            <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Analyse</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{scenario.title}</h3>
              <p className="mt-2 text-slate-200">{scenario.context}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-cyan-100">
                {scenario.signals.map((signal) => (
                  <span key={signal} className="rounded-full border border-cyan-400/40 px-3 py-1">
                    {signal}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {scenario.branches.map((branch) => (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => setSelectedBranch(branch.id)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                      selectedBranch === branch.id
                        ? branch.status === "success"
                          ? "border-emerald-400 bg-emerald-400/20 text-emerald-100"
                          : "border-amber-400 bg-amber-400/20 text-amber-100"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                    )}
                  >
                    <p className="font-semibold">{branch.label}</p>
                    <p className="text-xs text-white/80">{branch.impact}</p>
                  </button>
                ))}
              </div>

              {activeBranch && (
                <div
                  className={cn(
                    "mt-4 rounded-2xl border p-4 text-sm",
                    activeBranch.status === "success"
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-100"
                      : "border-amber-400 bg-amber-400/10 text-amber-100",
                  )}
                >
                  {activeBranch.status === "success"
                    ? scenario.tip
                    : "Consultez le médiateur Pulse ou reprenez la phase de clarification pour sécuriser la décision."}
                </div>
              )}
            </article>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Indicateurs & fun facts</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {funFacts.map((fact) => (
              <div key={fact.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-semibold text-white">{fact.title}</p>
                <p className="mt-2 text-sm text-slate-300">{fact.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Playbook express</p>
                <h2 className="mt-2 text-3xl font-semibold">Checklist post-conflit</h2>
                <p className="mt-2 max-w-2xl text-slate-300">Suivre ces étapes garantit la traçabilité Pulse et la capitalisation sur les apprentissages.</p>
              </div>
              <Button variant="secondary" asChild>
                <Link to="/onboarding/protocoles">Consignes officielles</Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {playbookSteps.map((step) => (
                <div key={step.stage} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">{step.stage}</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {step.checklist.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
