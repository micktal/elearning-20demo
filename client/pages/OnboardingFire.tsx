import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { ModuleCompletionCard } from "@/components/interactive/ModuleCompletionCard";
import { useModuleProgress } from "@/providers/ModuleProgressProvider";
import { getPreviousModule } from "@/lib/moduleProgress";
import { cn } from "@/lib/utils";

const fireStats = [
  { label: "Durée d'immersion", value: "3 min 30" },
  { label: "Capteurs suivis", value: "18 balises" },
  { label: "Objectif de réponse", value: "< 4 min" },
];

const smartBeacons = [
  {
    id: "atrium",
    zone: "Atrium Delta",
    temperature: "34 °C",
    smokeLevel: "Faible",
    status: "Normalisé",
    action: "Contrôle visuel par l'équipe sûreté et recalibrage du détecteur optique.",
    insight: "Balise connectée PulseVision : 99 % de fiabilité",
  },
  {
    id: "lab",
    zone: "Laboratoire cryo",
    temperature: "58 °C",
    smokeLevel: "Modéré",
    status: "Surveillance",
    action: "Activer le rideau coupe-feu automatique et annoncer l'évacuation ciblée du niveau -1.",
    insight: "Pic thermique issu d'un test machine non déclaré",
  },
  {
    id: "stock",
    zone: "Stockage lithium",
    temperature: "74 °C",
    smokeLevel: "Élevé",
    status: "Alerte critique",
    action: "Déployer brouillard d'eau, isoler l'alimentation et prévenir immédiatement SecOps et les pompiers.",
    insight: "Zone prioritaire Plan Delta, double confirmation requise",
  },
  {
    id: "tour",
    zone: "Tour Horizon — R+6",
    temperature: "41 °C",
    smokeLevel: "Nul",
    status: "Entraînement",
    action: "Simulation programmée : notifier les occupants via PulseCast et mesurer les temps de sortie.",
    insight: "Exercice trimestriel, capteurs en mode sandbox",
  },
];

const responseTracks = [
  {
    id: "detection",
    title: "Détection augmentée",
    prompt: "Les capteurs remontent un pic thermique au laboratoire cryo. Quelle mesure enclencher ?",
    tip: "Coupler capteurs + confirmation humaine évite 60 % de fausses alertes.",
    options: [
      {
        id: "ignore",
        label: "Attendre la prochaine lecture avant d'agir",
        result: "Le délai dépasse 4 minutes, le risque se propage à la zone adjacente.",
        status: "risk",
      },
      {
        id: "ping",
        label: "Envoyer un message générique aux occupants",
        result: "Information incomplète, confusion et retours massifs sur Nova Bleu.",
        status: "warning",
      },
      {
        id: "coupefeu",
        label: "Déclencher rideau coupe-feu + validation visuelle",
        result: "Pic contenu, équipe sûreté sur site en 90 secondes.",
        status: "success",
      },
    ],
  },
  {
    id: "evac",
    title: "Évacuation focalisée",
    prompt: "Une alarme ciblée concerne deux niveaux d'un bâtiment mixte. Quelle stratégie appliquer ?",
    tip: "La méthode PulseFlow réduit de 45 % les ralentissements d'escalier.",
    options: [
      {
        id: "massive",
        label: "Évacuer l'intégralité du bâtiment",
        result: "Congestion, perte de traçabilité, activité stoppée pendant 40 min.",
        status: "warning",
      },
      {
        id: "staggered",
        label: "Déployer la séquence PulseFlow sur les niveaux ciblés",
        result: "Sortie en 2 min 40 avec contrôle badge en sortie.",
        status: "success",
      },
      {
        id: "wait",
        label: "Isoler uniquement l'étage concerné",
        result: "Risque de propagation verticale non contrôlé.",
        status: "risk",
      },
    ],
  },
  {
    id: "communication",
    title: "Communication client / presse",
    prompt: "Un client stratégique détecte des sirènes depuis l'extérieur. Quelle réponse fournit-on ?",
    tip: "Un message en 90 secondes avec faits + plan réduit l'escalade media.",
    options: [
      {
        id: "silence",
        label: "Reporter la réponse après l'analyse",
        result: "Rumeurs en ligne, perception de crise majeure.",
        status: "risk",
      },
      {
        id: "generic",
        label: "Partager un message standard sans détail",
        result: "Client rassuré partiellement, demande d'escalade au Comex.",
        status: "warning",
      },
      {
        id: "brief",
        label: "Émettre un brief structuré (faits, périmètre, prochaine mise à jour)",
        result: "Client maintient la confiance, presse tenue informée.",
        status: "success",
      },
    ],
  },
];

const innovationIdeas = [
  {
    title: "Jumeau numérique",
    detail: "Un clone 3D du campus permet de projeter en temps réel la propagation d'une chaleur et de guider les équipes.",
  },
  {
    title: "PulseCast",
    detail: "Un système audio ciblé qui diffuse automatiquement les consignes exactes dans la zone concernée.",
  },
  {
    title: "Drones micro",
    detail: "Mini-drones thermiques vérifient les plafonds techniques sans exposer les agents.",
  },
];

const evacTimeline = [
  {
    stage: "T0 — Détection",
    checklist: [
      "Valider double signal (capteur + visuel)",
      "Notifier le PC sécurité et SecOps",
      "Lancer PulseCast sur zone impactée",
    ],
  },
  {
    stage: "T+2 min — Évacuation",
    checklist: [
      "Déployer guides-file / serre-file",
      "Basculer badge en mode comptage sorties",
      "Identifier personnes à mobilité réduite",
    ],
  },
  {
    stage: "T+5 min — Reprise",
    checklist: [
      "Informer Comex + clients critiques",
      "Analyser capteurs résiduels",
      "Documenter sur Nova Bleu + lessons learned",
    ],
  },
];

const fireChecklist = [
  { id: "capteurs", label: "Je peux lire et prioriser une cartographie capteurs" },
  { id: "evac", label: "Je sélectionne la bonne stratégie PulseFlow" },
  { id: "comm", label: "Je sais rédiger un brief client/presse" },
];

export default function OnboardingFire() {
  const [activeZone, setActiveZone] = useState(smartBeacons[0].id);
  const [activeTrack, setActiveTrack] = useState(responseTracks[0].id);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();
  const { initialized, isModuleUnlocked } = useModuleProgress();
  const moduleId = "incendie" as const;
  const nextUnlocked = initialized && isModuleUnlocked("epi");

  const zone = useMemo(() => smartBeacons.find((item) => item.id === activeZone) ?? smartBeacons[0], [activeZone]);
  const track = useMemo(() => responseTracks.find((item) => item.id === activeTrack) ?? responseTracks[0], [activeTrack]);
  const currentOption = track.options.find((option) => option.id === selectedOption);

  useEffect(() => {
    if (!initialized) return;
    if (!isModuleUnlocked(moduleId)) {
      const previous = getPreviousModule(moduleId);
      navigate(previous?.path ?? "/onboarding/conflits", { replace: true });
    }
  }, [initialized, isModuleUnlocked, moduleId, navigate]);

  const handleTrackChange = (id: string) => {
    setActiveTrack(id);
    setSelectedOption(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />
      <main className="px-6 pb-24 pt-16">
        <section className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Étape 5 · Sécurité incendie</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8">
              <h1 className="text-4xl font-semibold">Piloter une réponse incendie innovante</h1>
              <p className="mt-4 text-slate-300">
                Ce module combine capteurs intelligents, parcours d'évacuation ciblés et communication maîtrisée. Il positionne chaque collaborateur comme un acteur
                de la sécurité incendie HelioNova.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {fireStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-sm text-slate-300">{item.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="ghost" size="lg" asChild>
                  <Link to="/onboarding/conflits">← Module conflits</Link>
                </Button>
                <Button size="lg" disabled={!nextUnlocked} onClick={() => nextUnlocked && navigate("/onboarding/epi")}>
                  {nextUnlocked ? "Module EPI →" : "Validez pour débloquer"}
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/">Clore le parcours</Link>
                </Button>
              </div>
            </article>

            <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/20">
              <h2 className="text-xl font-semibold text-white">Cartographie capteurs</h2>
              <p className="text-sm text-slate-300">Choisissez une zone pour consulter les indicateurs live et les actions recommandées.</p>
              <div className="mt-6 grid gap-3">
                {smartBeacons.map((beacon) => (
                  <button
                    key={beacon.id}
                    type="button"
                    onClick={() => setActiveZone(beacon.id)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                      activeZone === beacon.id
                        ? "border-amber-400 bg-gradient-to-r from-amber-400/20 to-rose-500/20"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                    )}
                  >
                    <p className="text-xs uppercase tracking-[0.4em] text-amber-200">{beacon.zone}</p>
                    <p className="text-xs text-slate-400">{beacon.insight}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-300">Température : {zone.temperature}</p>
                <p className="text-sm text-slate-300">Fumée : {zone.smokeLevel}</p>
                <p className="mt-2 text-base font-semibold text-white">Statut : {zone.status}</p>
                <p className="mt-2 text-sm text-slate-200">Action : {zone.action}</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Parcours décisionnels</p>
              <h2 className="mt-2 text-3xl font-semibold">Choisissez la séquence adaptée</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Défiez-vous sur les scénarios clés : détection, évacuation ciblée et communication externe. Chaque option produit un résultat immédiat.
              </p>
            </div>
            <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">Temps cible HelioNova : 4 min</div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
            <div className="flex flex-col gap-3">
              {responseTracks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTrackChange(item.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                    activeTrack === item.id
                      ? "border-cyan-400 bg-gradient-to-r from-cyan-400/20 to-blue-600/20"
                      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Scénario</p>
                  <p className="text-base font-semibold text-white">{item.title}</p>
                </button>
              ))}
            </div>

            <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Challenge en cours</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{track.title}</h3>
              <p className="mt-2 text-slate-200">{track.prompt}</p>

              <div className="mt-6 space-y-3">
                {track.options.map((option) => (
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
                  {currentOption?.status === "success" ? track.tip : "Analysez la matrice PulseSafety pour sécuriser la décision."}
                </div>
              )}
            </article>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Innovation incendie</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {innovationIdeas.map((idea) => (
              <div key={idea.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold text-white">{idea.title}</p>
                <p className="mt-2 text-sm text-slate-300">{idea.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <ModuleCompletionCard
            moduleId="incendie"
            checklist={fireChecklist}
            description="Confirmez que vous savez activer les leviers incendie avant de poursuivre vers le module EPI."
          />
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Drill express</p>
                <h2 className="mt-2 text-3xl font-semibold">Timeline opérationnelle</h2>
                <p className="mt-2 max-w-2xl text-slate-300">Appliquez ces étapes pour garder une traçabilité complète et rassurer les parties prenantes.</p>
              </div>
              <Button variant="secondary" asChild>
                <Link to="/onboarding/protocoles">Consulter les consignes</Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {evacTimeline.map((step) => (
                <div key={step.stage} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">{step.stage}</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {step.checklist.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
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
