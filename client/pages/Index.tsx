import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { cn } from "@/lib/utils";

const scenarioOptions = [
  {
    id: "immersion",
    label: "Immersion express",
    summary: "Vidéo manifeste + check-in interactif",
    focus: "Les nouveaux arrivants découvrent l'histoire HelioNova et partagent leurs premières attentes.",
    actions: [
      "Capsule vidéo 45 s avec sous-titres",
      "Question miroir à voix haute",
      "Réaction emoji pour briser la glace",
    ],
  },
  {
    id: "surete",
    label: "Sécurité & sûreté",
    summary: "Micro-scénarios et checklist",
    focus: "Les règles vitales sont jouées en situation pour ancrer les réflexes badge et comportement.",
    actions: [
      "Matching des pictogrammes d'alerte",
      "Checklist badge + coffre IT",
      "Micro-pause respiration pour mémoriser",
    ],
  },
  {
    id: "culture",
    label: "Culture HelioNova",
    summary: "Quiz tonalité + engagements",
    focus: "On traduit les valeurs Pulse en gestes concrets du quotidien et on signe un pacte d'équipe.",
    actions: [
      "Quiz tonalité (3 questions)",
      "Carte d'engagement à glisser",
      "Message audio du CEO",
    ],
  },
];

const timeline = [
  { slot: "00:00 — 00:40", title: "Opening cinématique", detail: "Logo HelioNova, manifeste et annonce du mentor." },
  { slot: "00:40 — 02:30", title: "Trio d'expériences", detail: "Immersion, sécurité, culture : chaque capsule dure 50 secondes." },
  { slot: "02:30 — 03:30", title: "Jeu express", detail: "Scénario badge + réaction immédiate pour évaluer la vigilance." },
  { slot: "03:30 — 04:30", title: "Consignes finales", detail: "Checklist sûreté + ressources à consulter." },
];

const safetyHighlights = [
  {
    title: "Badge & zones sensibles",
    detail: "Jamais de badge laissé visible hors site. Déclarer toute perte dans les 15 min au canal Sûreté.",
  },
  {
    title: "Sécurité numérique",
    detail: "Double authentification obligatoire et verrouillage de session dès que vous vous éloignez.",
  },
  {
    title: "Reflexe alerte",
    detail: "Utiliser le code "Nova Bleu" pour signaler discrètement une anomalie via Teams ou interphone.",
  },
];

const readingPrompts = [
  "Pourquoi HelioNova Pulse existe et comment chaque rôle contribue à la vision 2030.",
  "Les trois réflexes sécurité à appliquer dès votre première heure dans les bureaux.",
  "Comment valider votre onboarding en 3 à 5 minutes grâce aux micro-jeux intégrés.",
];

const microGames = [
  {
    id: "badge",
    title: "Jeu réflexe badge",
    prompt: "Votre badge clignote rouge à l'entrée data center. Quelle est votre première action ?",
    answers: [
      { id: "force", label: "Insister en re-badgant jusqu'à ouverture" },
      { id: "signal", label: "Signaler l'anomalie sur le canal Nova Bleu" },
      { id: "pret", label: "Demander le badge d'un collègue" },
    ],
    correct: "signal",
    tip: "Le canal Nova Bleu déclenche la cellule sûreté en moins de 90 secondes.",
  },
  {
    id: "cyber",
    title: "Jeu cyber calme",
    prompt: "Vous recevez un mail interne "Urgent" qui demande vos accès VPN.",
    answers: [
      { id: "repondre", label: "Répondre rapidement pour débloquer la situation" },
      { id: "transfert", label: "Transférer au mentor pour validation" },
      { id: "signal2", label: "Cliquer sur "Signaler" dans Outlook + notifier SecOps" },
    ],
    correct: "signal2",
    tip: "Signaler = +5 points dans le score vigilance HelioNova Pulse.",
  },
  {
    id: "culture",
    title: "Jeu culture Pulse",
    prompt: "Un client visite l'espace atelier. Quelle est la formule d'accueil Pulse ?",
    answers: [
      { id: "bonjour", label: ""Bienvenue chez HelioNova, je vous accompagne."" },
      { id: "question", label: ""Puis-je prendre votre badge ?"" },
      { id: "silence", label: "Attendre qu'il pose une question" },
    ],
    correct: "bonjour",
    tip: "Toujours proposer un accompagnement actif, c'est l'une des promesses Pulse.",
  },
];

const statBlocks = [
  { label: "Durée totale", value: "3 — 5 min" },
  { label: "Interactions", value: "12 micro-actions" },
  { label: "Score sécurité", value: "+96% vigilance" },
];

export default function Index() {
  const [activeScenario, setActiveScenario] = useState(scenarioOptions[1].id);
  const [selectedGame, setSelectedGame] = useState(microGames[0].id);
  const [chosenAnswer, setChosenAnswer] = useState<string | null>(null);

  const scenario = useMemo(
    () => scenarioOptions.find((option) => option.id === activeScenario) ?? scenarioOptions[0],
    [activeScenario],
  );

  const currentGame = useMemo(
    () => microGames.find((game) => game.id === selectedGame) ?? microGames[0],
    [selectedGame],
  );

  const handleSelectGame = (gameId: string) => {
    setSelectedGame(gameId);
    setChosenAnswer(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <section className="relative isolate overflow-hidden px-6 pb-20 pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_60%)]" />
        <div className="pointer-events-none absolute -right-40 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">HelioNova Pulse</p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Un eLearning d'onboarding immersif pour chaque nouveau talent
            </h1>
            <p className="text-lg text-slate-200">
              Nous condensons l'univers HelioNova, les consignes de sûreté et un jeu express en un format de 3 à 5 minutes.
              Le module Pulse accompagne chaque nouvel arrivant dès son premier badge.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/onboarding">Commencer maintenant</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/onboarding">Voir la narration complète</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {statBlocks.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-sm text-slate-300">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/20 backdrop-blur">
            <div className="rounded-2xl bg-slate-900/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Introduction du module</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Timeline Pulse</h2>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">3-5 min</div>
              </div>
              <div className="mt-5 space-y-4">
                {timeline.map((item) => (
                  <div key={item.slot} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">{item.slot}</p>
                    <p className="mt-1 text-base font-semibold text-white">{item.title}</p>
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
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-200">À lire</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Briefing de bienvenue HelioNova</h2>
            <p className="mt-2 text-slate-300">
              Ce module guide les nouveaux arrivants dès leurs premières minutes sur site. Chaque bloc se lit ou se joue en moins d'une minute.
            </p>
            <ul className="mt-6 space-y-4">
              {readingPrompts.map((prompt) => (
                <li key={prompt} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-200">
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
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Focus</p>
              <h3 className="mt-2 text-2xl font-semibold">{scenario.label}</h3>
              <p className="mt-2 text-slate-300">{scenario.focus}</p>
              <ul className="mt-4 space-y-3">
                {scenario.actions.map((action) => (
                  <li key={action} className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-200">
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="securite" className="bg-white py-20 text-slate-900">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-cyan-600">Consignes sûreté + sécurité</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Réflexes immédiats pour les nouveaux badges</h2>
              <p className="mt-4 text-lg text-slate-600">
                HelioNova Pulse rappelle les mesures critiques avant même l'installation de poste. Les micro-consignes sont intégrées dans les jeux et la lecture guidée.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-4 py-2">Badge nominatif</span>
                <span className="rounded-full bg-slate-100 px-4 py-2">Canal Nova Bleu</span>
                <span className="rounded-full bg-slate-100 px-4 py-2">SecOps 24/7</span>
              </div>
            </div>
            <div className="space-y-4">
              {safetyHighlights.map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="jeux" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Jeux & interactions</p>
              <h2 className="mt-2 text-3xl font-semibold">Mini-jeux pour valider les réflexes</h2>
              <p className="text-slate-300">
                Chaque micro-jeu dure 45 secondes et attribue des points vigilance. Choisissez un jeu pour tester vos réactions.
              </p>
            </div>
            <Button variant="secondary" asChild>
              <Link to="/onboarding">Lancer le parcours complet</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-[220px_1fr]">
            <div className="flex flex-col gap-3">
              {microGames.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => handleSelectGame(game.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left text-sm transition-colors",
                    selectedGame === game.id
                      ? "border-cyan-400 bg-gradient-to-r from-cyan-400/20 to-indigo-500/20"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Jeu express</p>
                  <p className="text-base font-semibold text-white">{game.title}</p>
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Scenario</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{currentGame.title}</h3>
              <p className="mt-2 text-slate-200">{currentGame.prompt}</p>
              <div className="mt-6 space-y-3">
                {currentGame.answers.map((answer) => (
                  <button
                    key={answer.id}
                    type="button"
                    onClick={() => setChosenAnswer(answer.id)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                      chosenAnswer === answer.id
                        ? answer.id === currentGame.correct
                          ? "border-emerald-400 bg-emerald-400/20 text-emerald-100"
                          : "border-rose-400 bg-rose-400/20 text-rose-100"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                    )}
                  >
                    {answer.label}
                  </button>
                ))}
              </div>
              {chosenAnswer && (
                <p
                  className={cn(
                    "mt-4 text-sm",
                    chosenAnswer === currentGame.correct ? "text-emerald-200" : "text-rose-200",
                  )}
                >
                  {chosenAnswer === currentGame.correct
                    ? currentGame.tip
                    : "Réessayez : cherchez le réflexe officiel HelioNova."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}