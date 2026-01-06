import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

const scenarioOptions = [
  {
    id: "orientation",
    label: "Orientation stratégique",
    summary: "Panorama du groupe et priorités 2025.",
    focus:
      "Les nouveaux collaborateurs identifient les ambitions HelioNova et les indicateurs suivis par le Comex avant leur arrivée sur site.",
    actions: [
      "Vidéo d'ouverture du Directeur Général",
      "Repères de gouvernance et empreinte internationale",
      "Points de contact RH et managers référents",
    ],
    recommendations: [
      "Relisez le message du sponsor métier",
      "Notez 2 actions clés à partager avec votre manager",
    ],
  },
  {
    id: "conformite",
    label: "Cadre conformité",
    summary: "Règles de sûreté, sécurité et éthique.",
    focus:
      "Les obligations réglementaires et les réflexes de protection sont rappelés à l'aide de scénarios opérationnels et de checklists officielles.",
    actions: [
      "Procédure badge & accès sensibles",
      "Référentiel sécurité numérique et SecOps",
      "Processus d'escalade et numéro Nova Bleu",
    ],
    recommendations: [
      "Téléchargez la checklist conformité",
      "Testez la procédure badge lors de votre arrivée sur site",
    ],
  },
  {
    id: "culture",
    label: "Culture clients Pulse",
    summary: "Expérience client et posture de service.",
    focus:
      "Chaque valeur Pulse est traduite en comportements attendus auprès des clients et partenaires industriels.",
    actions: [
      "Engagement clients HelioNova",
      "Rituels d'équipe et codes relationnels",
      "Message audio du sponsor métier",
    ],
    recommendations: [
      "Préparez un pitch de 30s sur votre rôle",
      "Identifiez un mentor pour les 30 premiers jours",
    ],
  },
];

const timeline = [
  {
    slot: "00:00 — 00:45",
    title: "Accueil exécutif",
    detail:
      "Message institutionnel, rappel de la mission et de la raison d'être.",
  },
  {
    slot: "00:45 — 02:15",
    title: "Repères corporate",
    detail:
      "Organisation, gouvernance et enjeux prioritaires expliqués de manière synthétique.",
  },
  {
    slot: "02:15 — 03:30",
    title: "Dispositif conformité",
    detail: "Zoom sur sûreté, sécurité numérique et posture responsable.",
  },
  {
    slot: "03:30 — 04:30",
    title: "Mise en pratique",
    detail: "Cas d'usage et prochaines étapes avec le manager référent.",
  },
];

const safetyHighlights = [
  {
    title: "Badge & périmètres",
    detail:
      "Le badge reste sur soi en permanence. Toute perte se déclare immédiatement sur le canal Nova Bleu avec confirmation managériale.",
  },
  {
    title: "Protection des systèmes",
    detail:
      "Sessions verrouillées dès que vous quittez votre poste, MFA obligatoire et remontée instantanée des emails suspects à SecOps.",
  },
  {
    title: "Procédure d'alerte",
    detail:
      'Code "Nova Bleu" pour toute situation sensible et points de rassemblement rappelés lors de la prise de poste.',
  },
];

const readingPrompts = [
  "Vision HelioNova Pulse : comment chaque équipe contribue au plan stratégique 2030.",
  "Référentiel sûreté & conformité : trois réflexes à appliquer dès la première journée.",
  "Plan d'intégration : livrables attendus après le module digital et la rencontre manager.",
];

const microGames = [
  {
    id: "badge",
    title: "Procédure d'accès",
    prompt:
      "Votre badge clignote rouge devant une zone réglementée. Quel réflexe appliquez-vous ?",
    answers: [
      { id: "forcer", label: "Insister jusqu'à l'ouverture" },
      { id: "pret", label: "Emprunter le badge d'un collègue" },
      { id: "alerte", label: "Signaler via Nova Bleu et attendre la sûreté" },
    ],
    correct: "alerte",
    tip: "Déclarer l'incident via Nova Bleu active la traçabilité conformité et protège les accès critiques.",
  },
  {
    id: "cyber",
    title: "Protection des identifiants",
    prompt:
      'Un courriel interne "URGENT" demande vos codes VPN. Quelle conduite adoptez-vous ?',
    answers: [
      { id: "repondre", label: "Répondre pour accélérer le traitement" },
      { id: "mentor", label: "Transférer au mentor" },
      {
        id: "signal",
        label: 'Utiliser le bouton "Signaler" puis alerter SecOps',
      },
    ],
    correct: "signal",
    tip: "Tout signalement qualifié est consolidé dans l'indicateur vigilance du Comité Sécurité.",
  },
  {
    id: "client",
    title: "Accueil visiteur",
    prompt:
      "Un client arrive en atelier sans accompagnement. Comment appliquez-vous le protocole Pulse ?",
    answers: [
      { id: "attente", label: "Attendre qu'il se présente" },
      { id: "badge", label: "Exiger le badge invité immédiatement" },
      {
        id: "accompagnement",
        label: "Proposer un accueil et l'accompagner jusqu'à l'hôte référent",
      },
    ],
    correct: "accompagnement",
    tip: "Un accueil proactif garantit la conformité visiteurs et renforce l'expérience client HelioNova.",
  },
  {
    id: "evac",
    title: "Évacuation & points de rassemblement",
    prompt: "Un incendie est signalé. Que faites-vous en priorité ?",
    answers: [
      { id: "filtrer", label: "Rester et chercher cause" },
      { id: "alerter", label: "Alerter et évacuer vers le point de rassemblement" },
      { id: "filmer", label: "Filmer la scène pour preuve" },
    ],
    correct: "alerter",
    tip: "Protéger les personnes puis informer la sûreté locale est prioritaire.",
  },
];

const statBlocks = [
  { label: "Durée cible", value: "4 minutes" },
  { label: "Points de contact", value: "5 séquences" },
  { label: "Conformité visée", value: "100% signé" },
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function Index() {
  const [activeScenario, setActiveScenario] = useState(scenarioOptions[0].id);
  const [selectedGame, setSelectedGame] = useState(microGames[0].id);
  const [chosenAnswer, setChosenAnswer] = useState<string | null>(null);

  const scenario = useMemo(
    () =>
      scenarioOptions.find((option) => option.id === activeScenario) ??
      scenarioOptions[0],
    [activeScenario],
  );

  const currentGame = useMemo(
    () => microGames.find((game) => game.id === selectedGame) ?? microGames[0],
    [selectedGame],
  );

  const handleSelectGame = (gameId: string) => {
    setSelectedGame(gameId);
    setChosenAnswer(null);
    try {
      trackEvent("microgame_select", { gameId });
    } catch (e) {}
  };

  const handleAnswer = (answerId: string) => {
    setChosenAnswer(answerId);
    try {
      const game = microGames.find((g) => g.id === selectedGame);
      const correct = game?.correct === answerId;
      trackEvent("microgame_attempt", { gameId: selectedGame, answerId, correct });
    } catch (e) {}
  };

  useEffect(() => {
    // enable smooth scroll for in-page anchors while this page is mounted
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    try {
      trackEvent("page_view", { page: "index" });
    } catch (e) {}
    return () => {
      document.documentElement.style.scrollBehavior = previous || "";
    };
  }, []);

  const handleJumpTo = (index: number) => {
    const id = `timeline-item-${index}-${slugify(timeline[index].title)}`;
    const el = document.getElementById(id);
    if (el) {
      // use centered block to give context under header
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // small focus for accessibility
      el.setAttribute("tabindex", "-1");
      // focus briefly
      (el as HTMLElement).focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <section className="relative isolate overflow-hidden px-6 pb-20 pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_60%)]" />
        <div className="pointer-events-none absolute -right-40 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">
              HelioNova Pulse
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Un programme d'onboarding corporate clair et opérationnel
            </h1>
            <p className="text-lg text-slate-200">
              Le module digital Pulse formalise les messages institutionnels,
              les obligations de conformité et les attentes managériales en
              moins de cinq minutes. Il sert de fil rouge avant la rencontre
              avec le manager.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/onboarding/intro" onClick={() => trackEvent("start_module", { module: "intro" })}>Démarrer le module</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/onboarding/intro" onClick={() => trackEvent("open_docs", { module: "intro" })}>Consulter la documentation</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {statBlocks.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
                >
                  <p className="text-sm text-slate-300">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/20 backdrop-blur">
            <div className="rounded-2xl bg-slate-900/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                    Introduction du module
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Feuille de route Pulse
                  </h2>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  4 min
                </div>
              </div>

              {/* Table of contents for timeline - clickable jumps */}
              <div className="mt-4 flex flex-wrap gap-2">
                {timeline.map((item, idx) => (
                  <button
                    key={item.slot}
                    type="button"
                    onClick={() => handleJumpTo(idx)}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10"
                  >
                    {item.slot.split(" — ")[0]}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                {timeline.map((item, idx) => (
                  <div
                    id={`timeline-item-${idx}-${slugify(item.title)}`}
                    key={item.slot}
                    className="rounded-2xl border border-white/5 bg-white/5 p-4"
                    style={{ scrollMarginTop: "96px" }}
                    tabIndex={-1}
                  >
                    <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
                      {item.slot}
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-300">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="intro" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-200">
              Parcours corporate
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Briefing de bienvenue HelioNova
            </h2>
            <p className="mt-2 text-slate-300">
              Ce module digital prépare la prise de poste, structure les
              messages clés et dirige vers les ressources officielles. Chaque
              séquence se lit ou se joue en moins d'une minute.
            </p>
            <ul className="mt-6 space-y-4">
              {readingPrompts.map((prompt) => (
                <li
                  key={prompt}
                  className="rounded-2xl border border-white/5 p-4 text-sm text-slate-200"
                >
                  {prompt}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap gap-2">
              {scenarioOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={activeScenario === option.id}
                  onClick={() => setActiveScenario(option.id)}
                  className={cn(
                    "rounded-2xl px-4 py-2 text-sm font-medium transition-colors",
                    activeScenario === option.id
                      ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950"
                      : "bg-white/5 text-slate-200 hover:bg-white/10",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/5 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
                Focus opérationnel
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{scenario.label}</h3>
              <p className="mt-2 text-slate-300">{scenario.focus}</p>
              <ul className="mt-4 space-y-3">
                {scenario.actions.map((action) => (
                  <li
                    key={action}
                    className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-200"
                  >
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Jeux rapides</h3>
            <p className="text-sm text-slate-300">Exercez vos réflexes en quelques secondes.</p>
            <div className="mt-4 grid gap-3">
              {microGames.map((game) => (
                <div key={game.id} className="rounded-2xl border border-white/10 p-4">
                  <p className="font-semibold text-white">{game.title}</p>
                  <p className="text-sm text-slate-300">{game.prompt}</p>
                  <div className="mt-3 flex gap-2">
                    {game.answers.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleAnswer(a.id)}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs",
                          chosenAnswer === a.id ? "bg-cyan-400 text-slate-900" : "bg-white/5 text-slate-200",
                        )}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                  {chosenAnswer && (
                    <p className="mt-3 text-sm text-slate-300">{game.tip}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Points sécurité</h3>
            <div className="mt-4 space-y-3">
              {safetyHighlights.map((h) => (
                <div key={h.title} className="rounded-2xl border border-white/10 p-4 bg-slate-900/60">
                  <p className="font-semibold text-white">{h.title}</p>
                  <p className="text-sm text-slate-300">{h.detail}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
