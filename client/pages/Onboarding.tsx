import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { cn } from "@/lib/utils";

const TOTAL_SECONDS = 240; // 4 minutes pour rester entre 3 et 5 minutes

const immersionMoments = [
  {
    slot: "00:00 — 00:45",
    title: "Accueil institutionnel",
    detail: "Message du Comité Exécutif et rappel de la mission HelioNova.",
  },
  {
    slot: "00:45 — 01:40",
    title: "Repères corporate",
    detail: "Organisation, gouvernance et dispositifs d'accompagnement présentés de façon synthétique.",
  },
  {
    slot: "01:40 — 02:40",
    title: "Sécurité intégrée",
    detail: "Cas pratiques sûreté, sécurité numérique et conformité éthique.",
  },
  {
    slot: "02:40 — 04:00",
    title: "Engagement & prochaines étapes",
    detail: "Simulation opérationnelle, validation des acquis et rendez-vous manager.",
  },
];

const readingChapters = [
  {
    id: "vision",
    tag: "Vision",
    title: "Rôle du programme Pulse",
    content:
      "Pulse structure les messages prioritaires avant la première journée sur site et assure un langage commun entre équipes, managers et RH.",
    highlights: [
      "Objectifs 2025 et trajectoire 2030",
      "Priorités du Comité Exécutif",
      "Indicateurs de succès partagés",
    ],
  },
  {
    id: "processus",
    tag: "Processus",
    title: "Déroulé du module",
    content:
      "Le parcours combine lecture guidée, rappels réglementaires et simulations pour garantir une appropriation homogène.",
    highlights: [
      "4 séquences de moins d'une minute",
      "Checklist conformité intégrée",
      "Remontée automatique vers le manager",
    ],
  },
  {
    id: "support",
    tag: "Support",
    title: "Ressources et partenaires",
    content:
      "Mentors, RH Business Partners et équipes SecOps restent mobilisés. Le module redirige vers les documents référencés dans l'intranet.",
    highlights: [
      "Canal Teams #nova-bleu",
      "Portail sécurité HelioNova",
      "Calendrier des rendez-vous onboarding",
    ],
  },
];

const safetyProtocols = [
  {
    id: "acces",
    title: "Accès physiques",
    summary:
      "Badge nominatif, zones contrôlées et consignes d'accompagnement visiteurs constituent le premier niveau de protection.",
    checklist: [
      "Déclaration instantanée sur Nova Bleu",
      "Jamais de prêt de badge",
      "Visiteur toujours accompagné",
    ],
    codeWord: "Nova Bleu",
  },
  {
    id: "cyber",
    title: "Sécurité numérique",
    summary:
      "MFA, verrouillage de session et signalement des emails suspects maintiennent notre posture de défense.",
    checklist: [
      "Mises à jour Sentinel",
      "Verrouillage à chaque absence",
      "Escalade SecOps en moins de 5 min",
    ],
    codeWord: "SecOps 24/7",
  },
  {
    id: "visiteur",
    title: "Visiteurs & ateliers",
    summary:
      "Brief sécurité, badge invité orange et journal Pulse pour tracer les passages sensibles.",
    checklist: [
      "Brief de 30 secondes",
      "Présentation des issues d'urgence",
      "Remontée dans le journal Pulse",
    ],
    codeWord: "Charte visiteur",
  },
];

const gameBank = [
  {
    id: "badge",
    title: "Gestion d'accès",
    prompt: "Votre badge est refusé à l'entrée d'une zone critique. Quelle est la démarche attendue ?",
    answers: [
      { id: "forcer", label: "Insister jusqu'à ce que la porte s'ouvre" },
      { id: "pret", label: "Demander un badge à un collègue" },
      { id: "alerte", label: "Déclarer l'incident via Nova Bleu et informer la sûreté" },
    ],
    correct: "alerte",
    tip: "La déclaration Nova Bleu garantit la traçabilité et la réactivation contrôlée des accès.",
  },
  {
    id: "phishing",
    title: "Protection des identifiants",
    prompt: "Un message interne indique \"URGENT\" et réclame vos identifiants. Quelle est la réponse conforme ?",
    answers: [
      { id: "repondre", label: "Répondre rapidement pour rassurer l'expéditeur" },
      { id: "mentor", label: "Transmettre au mentor pour avis" },
      { id: "signal", label: "Utiliser le bouton \"Signaler\" puis prévenir SecOps" },
    ],
    correct: "signal",
    tip: "Les signalements alimentent le reporting cybersécurité présenté au Comité Audit.",
  },
  {
    id: "client",
    title: "Accueil corporate",
    prompt: "Un partenaire arrive sans badge invité. Comment appliquez-vous le protocole d'accueil ?",
    answers: [
      { id: "attente", label: "Attendre qu'il retrouve son contact" },
      { id: "badge", label: "Lui demander de revenir plus tard" },
      { id: "accompagnement", label: "L'accueillir, fournir un badge invité et le conduire à l'hôte référent" },
    ],
    correct: "accompagnement",
    tip: "Un accueil structuré protège nos sites et valorise la relation client.",
  },
];

export default function Onboarding() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [started, setStarted] = useState(false);
  const [activeChapter, setActiveChapter] = useState(readingChapters[0].id);
  const [activeProtocol, setActiveProtocol] = useState(safetyProtocols[0].id);
  const [activeGame, setActiveGame] = useState(gameBank[0].id);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    if (started && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((current) => current - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      setStarted(false);
    }

    return () => window.clearInterval(timer);
  }, [started, timeLeft]);

  const progress = useMemo(() => Math.min(1, (TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS), [timeLeft]);

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (value % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const currentChapter = useMemo(
    () => readingChapters.find((chapter) => chapter.id === activeChapter) ?? readingChapters[0],
    [activeChapter],
  );

  const protocol = useMemo(
    () => safetyProtocols.find((item) => item.id === activeProtocol) ?? safetyProtocols[0],
    [activeProtocol],
  );

  const game = useMemo(() => gameBank.find((item) => item.id === activeGame) ?? gameBank[0], [activeGame]);

  const handleStart = () => setStarted(true);
  const handlePause = () => setStarted(false);
  const handleRestart = () => {
    setTimeLeft(TOTAL_SECONDS);
    setSelectedAnswer(null);
    setStarted(true);
  };

  const handleSelectGame = (id: string) => {
    setActiveGame(id);
    setSelectedAnswer(null);
  };

  const handleAnswer = (id: string) => {
    setSelectedAnswer(id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <main className="px-6 pb-20 pt-12">
        <section className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Parcours HelioNova Pulse</p>
            <h1 className="mt-4 text-4xl font-semibold">Onboarding corporate 4 minutes</h1>
            <p className="mt-3 text-slate-300">
              Ce dispositif digital délivre les messages institutionnels, rappelle les règles de conformité et prépare la rencontre managériale.
              Il constitue le premier jalon obligatoire de l'intégration.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Temps restant</p>
                <p className="font-mono text-3xl font-semibold">{formatTime(timeLeft)}</p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" style={{ width: `${progress * 100}%` }} />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Score conformité</p>
                <p className="text-3xl font-semibold">{Math.round(progress * 100)}%</p>
                <p className="text-xs text-slate-400">Mise à jour en fonction des simulations complétées.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white">
              <Button size="sm" variant={started ? "secondary" : "default"} onClick={started ? handlePause : handleStart}>
                {started ? "Mettre en pause" : "Démarrer"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleRestart}>
                Redémarrer
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link to="/">Retour au portail</Link>
              </Button>
            </div>

            <div className="mt-8 space-y-4">
              {immersionMoments.map((moment) => (
                <article key={moment.slot} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">{moment.slot}</p>
                  <p className="text-lg font-semibold text-white">{moment.title}</p>
                  <p className="text-sm text-slate-300">{moment.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap gap-2">
                {readingChapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => setActiveChapter(chapter.id)}
                    className={cn(
                      "rounded-2xl px-4 py-2 text-sm font-medium",
                      activeChapter === chapter.id ? "bg-white text-slate-900" : "bg-white/10 text-slate-200 hover:bg-white/20",
                    )}
                  >
                    {chapter.tag}
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Lecture guidée</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{currentChapter.title}</h2>
                <p className="mt-2 text-slate-300">{currentChapter.content}</p>
                <ul className="mt-4 space-y-3">
                  {currentChapter.highlights.map((item) => (
                    <li key={item} className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-200">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div id="securite" className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap gap-2">
                {safetyProtocols.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveProtocol(item.id)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm",
                      activeProtocol === item.id ? "bg-cyan-400 text-slate-950" : "bg-white/10 text-slate-300 hover:bg-white/20",
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Sécurité</p>
                    <h3 className="text-xl font-semibold text-white">{protocol.title}</h3>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Code {protocol.codeWord}</span>
                </div>
                <p className="mt-3 text-slate-300">{protocol.summary}</p>
                <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-slate-200">
                  {protocol.checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="jeux" className="mx-auto mt-12 max-w-6xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Simulations express</p>
                <h2 className="text-3xl font-semibold text-white">Exercer les bons réflexes en 45 secondes</h2>
                <p className="text-slate-300">Chaque scénario alimente le reporting conformité partagé avec les managers.</p>
              </div>
              <Button variant="secondary" asChild>
                <Link to="/">Partager avec mon mentor</Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
              <div className="flex flex-col gap-3">
                {gameBank.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectGame(item.id)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left text-sm",
                      activeGame === item.id
                        ? "border-cyan-400 bg-gradient-to-r from-cyan-400/20 to-indigo-500/20"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                    )}
                  >
                    <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Scenario</p>
                    <p className="text-base font-semibold text-white">{item.title}</p>
                  </button>
                ))}
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Challenge en cours</p>
                <h3 className="mt-2 text-2xl font-semibold">{game.title}</h3>
                <p className="mt-2 text-slate-100">{game.prompt}</p>

                <div className="mt-5 space-y-3">
                  {game.answers.map((answer) => (
                    <button
                      key={answer.id}
                      type="button"
                      onClick={() => handleAnswer(answer.id)}
                      className={cn(
                        "w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                        selectedAnswer === answer.id
                          ? answer.id === game.correct
                            ? "border-emerald-400 bg-emerald-400/20 text-emerald-100"
                            : "border-rose-400 bg-rose-400/20 text-rose-100"
                          : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                      )}
                    >
                      {answer.label}
                    </button>
                  ))}
                </div>

                {selectedAnswer && (
                  <p
                    className={cn(
                      "mt-4 text-sm",
                      selectedAnswer === game.correct ? "text-emerald-200" : "text-rose-200",
                    )}
                  >
                    {selectedAnswer === game.correct
                      ? game.tip
                      : "Référez-vous aux procédures Pulse pour sélectionner la bonne réponse."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
