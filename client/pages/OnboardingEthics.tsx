import { useMemo, useState } from "react";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { ModuleCompletionCard } from "@/components/interactive/ModuleCompletionCard";
import { useModuleProgress } from "@/providers/ModuleProgressProvider";
import { getPreviousModule } from "@/lib/moduleProgress";
import { cn } from "@/lib/utils";

const governanceStats = [
  { label: "Temps de tri d'une alerte", value: "< 12 h" },
  { label: "Canaux monitorés", value: "5 flux" },
  { label: "Engagement Comex", value: "100 % revues" },
];

const alertFeeds = [
  {
    id: "cadeau",
    title: "Cadeaux fournisseurs",
    signal: "3 déclarations en 24 h",
    action: "Vérifier le seuil réglementaire, notifier LegalOps.",
    owner: "LegalOps",
  },
  {
    id: "conflit",
    title: "Conflit d'intérêts",
    signal: "Mentions Slack + formulaire",
    action: "Demander disclosure form et activer médiation.",
    owner: "People & Culture",
  },
  {
    id: "fraude",
    title: "Soupçon de fraude",
    signal: "Alerte Nova Bleu Signal + hotline",
    action: "Geler l'accès, déclencher revue forensique.",
    owner: "SecOps + Finance",
  },
  {
    id: "ia",
    title: "Usage IA non conforme",
    signal: "Prompt suspect remonté",
    action: "Notifier Data Privacy, vérifier clause client.",
    owner: "Data Governance",
  },
];

const branchingScenarios = [
  {
    id: "cadeau",
    title: "Invitation grand compte",
    context:
      "Un commercial reçoit une invitation premium (valeur estimée 1 200 €) à la veille d'un renouvellement de contrat.",
    options: [
      {
        id: "accepter",
        label: "Accepter pour préserver la relation",
        result: "Non-conformité immédiate, escalade Comex.",
        status: "risk",
      },
      {
        id: "reporter",
        label: "Reporter à plus tard sans formaliser",
        result: "Flou documentaire, contrôle interne bloqué.",
        status: "warning",
      },
      {
        id: "declarer",
        label: "Déclarer sur Nova Bleu Signal et refuser",
        result: "Trace conforme, client rassuré sur l'éthique.",
        status: "success",
      },
    ],
    tip: "La charte HelioNova fixe le plafond cadeaux à 150 € avec validation LegalOps.",
  },
  {
    id: "lancer",
    title: "Lanceur d'alerte anonyme",
    context:
      "Un message sans signature évoque une surfacturation projet. L'équipe finance manque d'éléments.",
    options: [
      {
        id: "ignorer",
        label: "Ignorer faute de preuve",
        result: "Risque légal si la presse révèle l'affaire.",
        status: "risk",
      },
      {
        id: "interne",
        label: "Partager en interne sans anonymiser",
        result: "Crainte de représailles, perte de confiance.",
        status: "warning",
      },
      {
        id: "procedure",
        label: "Activer cellule lanceur d'alerte + enquête discrète",
        result: "Faits recoupés, plan d'action validé en 10 jours.",
        status: "success",
      },
    ],
    tip: "Toute alerte anonyme doit être traitée sous 7 jours ouvrés avec confidentialité maximale.",
  },
  {
    id: "ia",
    title: "Fuite via IA générative",
    context:
      "Un analyste colle des données sensibles dans un outil IA non référencé pour préparer une réponse client.",
    options: [
      {
        id: "publier",
        label: "Valider la réponse si elle semble correcte",
        result: "Violation contractuelle, pénalités possibles.",
        status: "risk",
      },
      {
        id: "blamer",
        label: "Blâmer publiquement l'analyste",
        result: "Climat de peur, fuite potentielle répliquée.",
        status: "warning",
      },
      {
        id: "confidential",
        label: "Alerter Data Privacy, isoler le fichier, former l'équipe",
        result: "Incident contenu, client informé du plan de remédiation.",
        status: "success",
      },
    ],
    tip: "Les prompts sensibles doivent passer par PulseAI (tenant sécurisé certifié ISO 27001).",
  },
];

const governanceTimeline = [
  {
    stage: "T0 — Réception",
    checklist: ["Enregistrer l'alerte dans Nova Bleu Signal", "Classer par criticité", "Notifier le sponsor conformité"],
  },
  {
    stage: "T+24 h — Qualification",
    checklist: ["Recueillir les faits", "Isoler les données sensibles", "Informer les parties prenantes nécessaires"],
  },
  {
    stage: "T+5 j — Décision",
    checklist: ["Valider la mesure disciplinaire ou préventive", "Documenter la preuve", "Partager un retour à l'émetteur"],
  },
];

const insightBadges = [
  {
    title: "72 h",
    detail: "Délai maximal pour informer le Comex d'un incident majeur.",
  },
  {
    title: "+28 %",
    detail: "Les alertes traitées avec feedback augmentent de 28 % la confiance collaborateurs.",
  },
  {
    title: "0 fuite",
    detail: "Objectif HelioNova : zéro fuite média non traitée.",
  },
];

export default function OnboardingEthics() {
  const [activeFeed, setActiveFeed] = useState(alertFeeds[0].id);
  const [activeScenario, setActiveScenario] = useState(branchingScenarios[0].id);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const feed = useMemo(() => alertFeeds.find((item) => item.id === activeFeed) ?? alertFeeds[0], [activeFeed]);
  const scenario = useMemo(
    () => branchingScenarios.find((item) => item.id === activeScenario) ?? branchingScenarios[0],
    [activeScenario],
  );
  const currentOption = scenario.options.find((option) => option.id === selectedOption);

  const handleScenarioChange = (id: string) => {
    setActiveScenario(id);
    setSelectedOption(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />
      <main className="px-6 pb-24 pt-16">
        <section className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Étape 7 · Gouvernance éthique</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8">
              <h1 className="text-4xl font-semibold">Sécuriser les alertes internes et la transparence</h1>
              <p className="mt-4 text-slate-300">
                Ce module coordonne LegalOps, SecOps et People pour garantir un traitement rigoureux des alertes. Vous explorez les bons réflexes, du tri initial
                jusqu'au reporting Comex.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {governanceStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-sm text-slate-300">{stat.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="ghost" size="lg" asChild>
                  <Link to="/onboarding/epi">← Module EPI</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link to="/">Clore le parcours</Link>
                </Button>
              </div>
            </article>

            <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/20">
              <h2 className="text-xl font-semibold text-white">Flux d'alertes monitorés</h2>
              <p className="text-sm text-slate-300">Choisissez un flux pour voir son traitement prioritaire.</p>
              <div className="mt-6 grid gap-3">
                {alertFeeds.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveFeed(item.id)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                      activeFeed === item.id
                        ? "border-emerald-400 bg-gradient-to-r from-emerald-400/20 to-cyan-500/20"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                    )}
                  >
                    <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.signal}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-300">Action recommandée : {feed.action}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.4em] text-cyan-200">Pilote</p>
                <p className="text-sm text-white">{feed.owner}</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Simulateur d'arbitrage</p>
              <h2 className="mt-2 text-3xl font-semibold">Analysez chaque alerte avec recul</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Sélectionnez un cas et choisissez la réponse la plus conforme. Chaque décision met en lumière les impacts réputationnels, juridiques et humains.
              </p>
            </div>
            <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">Reporting Nova Bleu Signal</div>
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
                      ? "border-indigo-400 bg-gradient-to-r from-indigo-400/20 to-cyan-500/20"
                      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Cas pratique</p>
                  <p className="text-base font-semibold text-white">{item.title}</p>
                </button>
              ))}
            </div>

            <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Challenge en cours</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{scenario.title}</h3>
              <p className="mt-2 text-slate-200">{scenario.context}</p>

              <div className="mt-6 space-y-3">
                {scenario.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOption(option.id)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                      selectedOption === option.id
                        ? option.status === "success"
                          ? "border-emerald-400 bg-emerald-400/20 text-emerald-100"
                          : option.status === "warning"
                            ? "border-amber-400 bg-amber-400/20 text-amber-100"
                            : "border-rose-500 bg-rose-500/20 text-rose-100"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                    )}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-white/80">{option.result}</p>
                  </button>
                ))}
              </div>

              {selectedOption && (
                <div
                  className={cn(
                    "mt-4 rounded-2xl border p-4 text-sm",
                    currentOption?.status === "success"
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-100"
                      : currentOption?.status === "warning"
                        ? "border-amber-400 bg-amber-400/10 text-amber-100"
                        : "border-rose-500 bg-rose-500/10 text-rose-100",
                  )}
                >
                  {currentOption?.status === "success"
                    ? scenario.tip
                    : "Référez-vous au code de conduite et sollicitez LegalOps avant décision."}
                </div>
              )}
            </article>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Indicateurs de confiance</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {insightBadges.map((badge) => (
              <div key={badge.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-semibold text-white">{badge.title}</p>
                <p className="mt-2 text-sm text-slate-300">{badge.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Playbook conformité</p>
                <h2 className="mt-2 text-3xl font-semibold">Timeline de traitement</h2>
                <p className="mt-2 max-w-2xl text-slate-300">Ce canevas garantit la cohérence des réponses et la traçabilité requise par les régulateurs.</p>
              </div>
              <Button variant="secondary" asChild>
                <Link to="/onboarding/protocoles">Consignes officielles</Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {governanceTimeline.map((step) => (
                <div key={step.stage} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">{step.stage}</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {step.checklist.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
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
