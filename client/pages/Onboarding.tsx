import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { cn } from "@/lib/utils";

const TOTAL_SECONDS = 240; // 4 minutes pour rester entre 3 et 5 minutes

const immersionMoments = [
  {
    slot: "00:00 — 00:45",
    title: "Pulse Opening",
    detail: "Logo HelioNova, message du mentor digital et objectifs personnels.",
  },
  {
    slot: "00:45 — 01:40",
    title: "Immersion culture",
    detail: "Capsule vidéo + réaction emoji pour ancrer les valeurs Pulse.",
  },
  {
    slot: "01:40 — 02:40",
    title: "Mode Sûreté",
    detail: "Micro-scénarios badge & sécurité numérique + checklist.",
  },
  {
    slot: "02:40 — 04:00",
    title: "Jeu express + pacte",
    detail: "Jeu badge, score vigilance et engagement final à signer.",
  },
];

const readingChapters = [
  {
    id: "vision",
    tag: "Story",
    title: "Pourquoi HelioNova Pulse",
    content:
      "Nous sommes une constellation d'équipes énergie & data. Pulse condense la vision 2030 et traduit concrètement la promesse faite à chaque client.",
    highlights: [
      "Mission énergie positive",
      "3 piliers: Impact, Sûreté, Service",
      "Chaque talent signe la charte Pulse",
    ],
  },
  {
    id: "parcours",
    tag: "Flow",
    title: "Comment se déroule le module",
    content:
      "Une succession de 4 capsules interactives. Lecture guidée, micro-jeux, respiration sécurité, puis pacte d'équipe.",
    highlights: [
      "45 s de vidéo manifeste",
      "Mini-quiz tonalité",
      "Jeu badge + code Nova Bleu",
    ],
  },
  {
    id: "mentor",
    tag: "Mentor",
    title: "Votre guide digital",
    content:
      "Nova, notre mentor numérique, vous pose des questions miroir et vous indique les ressources internes à sauvegarder.",
    highlights: [
      "Canal Teams #nova-bleu",
      "Portail sécurité HelioNova",
      "CTA pour planifier un duo onboarding",
    ],
  },
];

const safetyProtocols = [
  {
    id: "badge",
    title: "Badge & zones",
    summary:
      "Jamais de badge visible hors site. Perte ou vol à signaler en moins de 15 minutes via le canal Nova Bleu.",
    checklist: [
      "Double vérification badge + biométrie",
      "Ne jamais prêter son badge",
      "Toujours accompagner un visiteur",
    ],
    codeWord: "Nova Bleu",
  },
  {
    id: "cyber",
    title: "Sécurité numérique",
    summary:
      "Sessions verrouillées dès que vous quittez votre poste. Suspicion phishing = signalement SecOps + capture d'écran.",
    checklist: [
      "Activer MFA sur tous les outils",
      "Mettre à jour l'agent Sentinel",
      "Ne jamais transférer un mail suspect",
    ],
    codeWord: "SecOps 24/7",
  },
  {
    id: "atelier",
    title: "Atelier & visiteurs",
    summary:
      "Tout visiteur doit porter le badge invité orange. Présenter les issues d'urgence et garder une zone dégagée.",
    checklist: [
      "Brief express de 30 s",
      "Présenter les équipements critiques",
      "Reporter tout incident dans le journal Pulse",
    ],
    codeWord: "Aura Atelier",
  },
];

const gameBank = [
  {
    id: "badge",
    title: "Reflexe badge",
    prompt: "Votre badge clignote rouge devant la zone data. Quelle est votre première action ?",
    answers: [
      { id: "forcer", label: "Rebadger jusqu'à ouverture" },
      { id: "emprunt", label: "Emprunter un badge collègue" },
      { id: "alerte", label: "Déclencher Nova Bleu + attendre la sûreté" },
    ],
    correct: "alerte",
    tip: "Nova Bleu crée un ticket prioritaire et alerte la sûreté en 90 secondes.",
  },
  {
    id: "phishing",
    title: "Cyber calme",
    prompt: "Un mail interne \"Urgent\" réclame vos accès VPN.",
    answers: [
      { id: "repondre", label: "Répondre pour débloquer vite" },
      { id: "mentor", label: "Transférer au mentor" },
      { id: "signal", label: "Cliquer sur \"Signaler\" + notifier SecOps" },
    ],
    correct: "signal",
    tip: "Chaque signalement validé ajoute +5 points vigilance.",
  },
  {
    id: "client",
    title: "Culture Pulse",
    prompt: "Un client atteint votre atelier. Quelle phrase incarne Pulse ?",
    answers: [
      { id: "silence", label: "Attendre qu'il parle" },
      { id: "badge", label: "Demander son badge immédiatement" },
      { id: "accompagnement", label: "\"Bienvenue chez HelioNova, je vous accompagne.\"" },
    ],
    correct: "accompagnement",
    tip: "Toujours proposer un accompagnement actif : c'est la signature Pulse.",
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
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Module HelioNova Pulse</p>
            <h1 className="mt-4 text-4xl font-semibold">Onboarding immersif 3-5 minutes</h1>
            <p className="mt-3 text-slate-300">
              Un parcours express pour accueillir les nouveaux talents avec du texte guidé, des consignes de sûreté et des jeux interactifs.
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
                <p className="text-sm text-slate-300">Score vigilance</p>
                <p className="text-3xl font-semibold">{Math.round(progress * 96) + 4}%</p>
                <p className="text-xs text-slate-400">Basé sur vos réponses aux jeux express.</p>
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
                <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Jeux express</p>
                <h2 className="text-3xl font-semibold text-white">Validez vos réflexes en 45 secondes</h2>
                <p className="text-slate-300">Chaque réponse juste débloque un indice exclusif dans le module final.</p>
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
                    {selectedAnswer === game.correct ? game.tip : "Réessayez : cherchez le réflexe Pulse."}
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
