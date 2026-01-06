import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useModuleProgress } from "@/providers/ModuleProgressProvider";
import { getNextModule, getPreviousModule } from "@/lib/moduleProgress";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { ModuleCompletionCard } from "@/components/interactive/ModuleCompletionCard";
import { DragReorderBoard } from "@/components/interactive/DragReorderBoard";
import { ClassificationBoard } from "@/components/interactive/ClassificationBoard";
import { trackEvent } from "@/lib/analytics";

// Lightweight mini-game component used inline for quick exercises
function MiniGame({ game, onClose, onFinish }: { game: any; onClose: () => void; onFinish?: (score: number) => void }) {
  const [answerId, setAnswerId] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(game?.duration ?? null);

  useEffect(() => {
    if (!game?.duration || finished) return;
    setTimeLeft(game.duration);
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(t);
          // timeout - mark as failed
          setFinished(true);
          try { trackEvent("mini_game_timeout", { gameId: game.id }); } catch (e) {}
          if (onFinish) onFinish(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [game?.duration, finished, game, onFinish]);

  if (!game) return null;

  const handleAnswer = (id: string) => {
    if (finished) return;
    setAnswerId(id);
    const correct = id === game.correct;
    setFinished(true);
    try { trackEvent("mini_game_attempt", { gameId: game.id, correct }); } catch (e) {}
    if (onFinish) onFinish(correct ? 1 : 0);
  };

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Jeu : {game.title}</h3>
        {timeLeft !== null && (
          <div className="text-sm text-slate-300">Temps restant : {timeLeft}s</div>
        )}
      </div>

      <p className="mt-2 text-slate-300 text-sm">{game.question}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-1">
        {game.options.map((opt: any) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleAnswer(opt.id)}
            disabled={finished}
            className={`w-full rounded-md px-4 py-2 text-left text-sm ${
              finished ? (opt.id === game.correct ? "bg-emerald-600/20 border-emerald-400" : opt.id === answerId ? "bg-rose-600/20 border-rose-400" : "bg-white/5") : "bg-white/5"
            } border`}
          >
            <div className="font-medium text-white">{opt.label}</div>
            {opt.hint && <div className="text-xs text-slate-300 mt-1">{opt.hint}</div>}
          </button>
        ))}
      </div>

      {finished && (
        <div className="mt-4 text-sm">
          {answerId === game.correct ? (
            <p className="text-emerald-300">Bravo — {game.success ?? "Bonne réponse"}</p>
          ) : (
            <p className="text-rose-300">Raté — {game.failure ?? "Réponse incorrecte"}</p>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => { try { trackEvent("mini_game_close", { gameId: game.id }); } catch (e) {} onClose(); }}
          className="rounded-md bg-white/6 px-3 py-2 text-sm text-white"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

// General safety scenarios
const safetyScenarios = [
  {
    id: "badge",
    title: "Badge refusé",
    context: "Votre badge est refusé à l’entrée d’une zone critique.",
    options: [
      { id: "forcer", label: "Insister pour entrer", ok: false },
      { id: "pret", label: "Utiliser le badge d’un collègue", ok: false },
      { id: "alerte", label: "Déclarer via Nova Bleu et attendre", ok: true },
    ],
    feedback:
      "La déclaration via Nova Bleu garantit la traçabilité et déclenche la sûreté.",
    game: {
      id: "game-badge-1",
      title: "Checklist badge",
      question: "Quel est le bon réflexe si votre badge est refusé?",
      options: [
        { id: "forcer", label: "Insister pour entrer" },
        { id: "pret", label: "Utiliser le badge d’un collègue" },
        { id: "alerte", label: "Déclarer via Nova Bleu et attendre" },
      ],
      correct: "alerte",
      success: "La sécurité prime — vous avez choisi la bonne option.",
      failure: "La solution sûre est de déclarer via Nova Bleu.",
    },
  },
  {
    id: "phishing",
    title: "Email suspect",
    context: "Un email interne urgent vous demande vos identifiants VPN.",
    options: [
      { id: "repondre", label: "Répondre rapidement", ok: false },
      { id: "mentor", label: "Demander conseil", ok: false },
      { id: "signal", label: "Signaler et alerter SecOps", ok: true },
    ],
    feedback: "Le signalement rapide alimente la protection collective.",
    game: {
      id: "game-phishing-1",
      title: "Reconnaître le phishing",
      question: "Quel signe indique que l'email est probablement un phishing?",
      options: [
        { id: "urgent", label: "Ton urgent et demande d'identifiants" },
        { id: "greeting", label: "Salutation amicale ordinaire" },
        { id: "signature", label: "Signature complète du responsable" },
      ],
      correct: "urgent",
      success: "Bien vu — les demandes d'identifiants sont des signaux d'alerte.",
      failure: "Méfiez-vous des demandes d'identifiants ou d'actions urgentes.",
    },
    // Activity: classification - sort signals into suspicious vs normal
    activity: {
      type: "classify",
      categories: [
        { id: "suspicious", label: "Suspicious" },
        { id: "normal", label: "Normal" },
      ],
      items: [
        { id: "link", label: "Lien externe inconnu" },
        { id: "sender", label: "Expéditeur inconnu" },
        { id: "tone", label: "Ton urgent" },
      ],
      correctMapping: { link: "suspicious", sender: "suspicious", tone: "suspicious" },
    },
  },
  {
    id: "visiteur",
    title: "Visiteur sans badge",
    context: "Un partenaire arrive en atelier sans badge invité.",
    options: [
      { id: "attente", label: "Le laisser passer", ok: false },
      { id: "refus", label: "Refuser l’accès", ok: false },
      { id: "accueil", label: "Délivrer un badge et accompagner", ok: true },
    ],
    feedback: "L’accompagnement protège la conformité et l’expérience client.",
    game: {
      id: "game-visiteur-1",
      title: "Scénario visiteur",
      question: "Quelle est la meilleure pratique si un visiteur arrive sans badge?",
      options: [
        { id: "laisser", label: "Le laisser entrer" },
        { id: "refuser", label: "Refuser et appeler la sécurité" },
        { id: "accueil", label: "Délivrer un badge et accompagner" },
      ],
      correct: "accueil",
      success: "Accompagner le visiteur et délivrer un badge protège tout le monde.",
      failure: "Ne laissez pas un visiteur sans accompagnement dans une zone sensible.",
    },
    // activity: drag & drop - order the welcome steps
    activity: {
      type: "reorder",
      items: [
        { id: "identify", label: "Identifier le visiteur et son motif" },
        { id: "badge", label: "Délivrer un badge invité" },
        { id: "escort", label: "Accompagner vers la zone" },
      ],
      correctOrder: ["identify", "badge", "escort"],
    },
  },
];

// Conflict-specific scenarios (de-escalation focused)
const conflictScenarios = [
  {
    id: "conflict-verbal",
    title: "Conflit verbal en atelier",
    context:
      "Deux collègues ont une discussion qui monte en tension devant les autres.",
    options: [
      { id: "ignorer", label: "Ignorer et continuer", ok: false },
      {
        id: "intervenir",
        label: "Intervenir en privé pour clarifier",
        ok: true,
      },
      { id: "punir", label: "Sanctionner publiquement", ok: false, branch: "conflict-punish" },
    ],
    feedback:
      "Intervenir en privé permet de désamorcer la situation et préserver la dignité des personnes.",
    game: {
      id: "game-conflict-1",
      title: "Dé-escalade rapide",
      question: "Quelle est la meilleure première action pour désamorcer une dispute en public?",
      options: [
        { id: "ignorer", label: "Ignorer" },
        { id: "intervenir", label: "Demander un échange en privé" },
        { id: "punir", label: "Réprimander publiquement" },
      ],
      correct: "intervenir",
      success: "C'est la meilleure façon de protéger les personnes et la dynamique d'équipe.",
      failure: "Une réponse publique peut aggraver la situation.",
    },
    // activity: classify appropriate handling steps
    activity: {
      type: "classify",
      categories: [
        { id: "immediate", label: "Action immédiate" },
        { id: "followup", label: "Suivi / Documenter" },
      ],
      items: [
        { id: "separate", label: "Séparer et parler en privé" },
        { id: "note", label: "Prendre des notes les faits" },
        { id: "announce", label: "Faire une annonce publique" },
      ],
      correctMapping: { separate: "immediate", note: "followup", announce: "followup" },
    },
  },
  {
    id: "conflict-punish",
    title: "Conséquences d'une sanction publique",
    context: "Sanctionner publiquement peut provoquer démotivation et perte de confiance. Que feriez-vous ensuite?",
    options: [
      { id: "apology", label: "Présenter des excuses et réparer", ok: true },
      { id: "defend", label: "Défendre la décision" , ok: false},
      { id: "ignore", label: "Ignorer les conséquences", ok: false },
    ],
    feedback: "Réparer la relation et documenter les faits est essentiel pour la confiance à long terme.",
  },
  {
    id: "conflict-manager",
    title: "Conflit avec un manager",
    context:
      "Un manager tient des propos qui mettent un collaborateur en difficulté.",
    options: [
      { id: "defendre", label: "Prendre le parti sans faits", ok: false },
      { id: "escalade", label: "Documenter et informer RH/Comex", ok: true },
      { id: "affronter", label: "Répondre sur le ton", ok: false },
    ],
    feedback:
      "Documenter et alerter les bonnes instances garantit imparcialité et traçabilité.",
    game: {
      id: "game-conflict-manager-1",
      title: "Documenter un incident",
      question: "Quelle action est la plus appropriée quand un manager dépasse les limites?",
      options: [
        { id: "defendre", label: "Prendre parti sans vérifier" },
        { id: "escalade", label: "Documenter les faits et informer RH/Comex" },
        { id: "affronter", label: "Répondre sur le ton" },
      ],
      correct: "escalade",
      success: "Documenter permet une gestion équitable et professionnelle.",
      failure: "Ne pas documenter peut nuire à l'impartialité des actions futures.",
    },
  },
  {
    id: "conflict-client",
    title: "Client en désaccord",
    context:
      "Un client conteste une action et la discussion devient conflictuelle.",
    options: [
      {
        id: "retourner",
        label: "Retourner la critique contre le client",
        ok: false,
      },
      {
        id: "calmer",
        label: "Proposer un point de calme et écouter",
        ok: true,
      },
      { id: "ignorer2", label: "Ignorer et laisser filer", ok: false },
    ],
    feedback:
      "Calmer et écouter permet souvent de trouver un terrain d’entente rapidement.",
    game: {
      id: "game-conflict-client-1",
      title: "Gérer un client mécontent",
      question: "Quelle est la meilleure approche quand un client est en colère?",
      options: [
        { id: "retourner", label: "Se défendre vivement" },
        { id: "calmer", label: "Proposer un espace calme et écouter" },
        { id: "ignorer2", label: "Ignorer et espérer que ça passe" },
      ],
      correct: "calmer",
      success: "Écouter et calmer désamorce souvent la situation.",
      failure: "Ignorer ou riposter peut empirer la relation client.",
    },
  },
];

// Fire-specific scenarios
const fireScenarios = [
  {
    id: "incendie-alerte",
    title: "Départ de feu - Alerte",
    context:
      "Vous remarquez de la fumée provenant d’un équipement proche d’une zone de production.",
    options: [
      { id: "ignorer", label: "Ne rien faire et surveiller", ok: false },
      {
        id: "alerter",
        label: "Alerter immédiatement le PC Sécurité et évacuer",
        ok: true,
      },
      { id: "retirer", label: "Tenter d’éteindre seul(e)", ok: false },
    ],
    feedback:
      "Alerter et évacuer garantit la sécurité des personnes et active les procédures d’intervention.",
    game: {
      id: "game-incendie-1",
      title: "Réagir face à la fumée",
      question: "Quelle est la première action à prendre si vous voyez de la fumée?",
      options: [
        { id: "ignorer", label: "Surveiller sans rien dire" },
        { id: "alerter", label: "Alerter et évacuer" },
        { id: "retirer", label: "Tenter d'éteindre seul" },
      ],
      correct: "alerter",
      success: "Alerter et évacuer protège les personnes et facilite l'intervention.",
      failure: "Ne tentez pas d'intervenir seul si la situation est incertaine.",
      // timed variant: respond within 12 seconds
      duration: 12,
    },
  },
  {
    id: "incendie-evac",
    title: "Evacuation ordonnée",
    context: "Une alerte incendie est déclenchée dans votre bâtiment.",
    options: [
      {
        id: "panique",
        label: "Courir vers la sortie la plus proche sans ordre",
        ok: false,
      },
      {
        id: "suivre",
        label:
          "Suivre les consignes d’évacuation et les points de rassemblement",
        ok: true,
      },
      {
        id: "reprendre",
        label: "Retourner récupérer un objet personnel",
        ok: false,
      },
    ],
    feedback:
      "Suivre les consignes d’évacuation protège tout le monde et facilite l’intervention des secours.",
    game: {
      id: "game-incendie-evac-1",
      title: "Choix d'évacuation",
      question: "Lors d'une alerte, que faites-vous en priorité?",
      options: [
        { id: "panique", label: "Courir vers la sortie la plus proche" },
        { id: "suivre", label: "Suivre les consignes et points de rassemblement" },
        { id: "reprendre", label: "Retourner pour un objet personnel" },
      ],
      correct: "suivre",
      success: "Suivre les consignes sauve des vies.",
      failure: "Retourner pour un objet peut mettre des vies en danger.",
    },
  },
];

export default function OnboardingSimulations() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const requested = params.get("scenario");

  // detect context from path
  const path = location.pathname || "";
  const pathSegments = path.split("/").filter(Boolean);
  const moduleKey = pathSegments[1] ?? null; // e.g. 'conflits', 'protocoles', 'epi', 'ethique', 'simulations'
  const pathScenarioId = pathSegments.length >= 3 ? pathSegments[2] : null;
  const isConflicts = moduleKey === "conflits";

  // choose the scenario set based on context
  let scenarios = safetyScenarios;
  if (moduleKey === "conflits") scenarios = conflictScenarios;
  if (moduleKey === "incendie") scenarios = fireScenarios;

  // compute current module id based on path
  const currentModuleId = (moduleKey ?? (isConflicts ? "conflits" : "simulations")) as any;
  const nextMod = getNextModule(currentModuleId) ?? null;
  const prevMod = getPreviousModule(currentModuleId) ?? null;
  const nextPath = nextMod?.path ?? null;
  const nextLabel = nextMod?.label ?? null;
  const prevPath = prevMod?.path ?? null;
  const prevLabel = prevMod?.label ?? null;

  // fallback mapping for module base paths -> default scenario id
  const pathFallbackMap: Record<string, string> = {
    "/onboarding/protocoles": "badge",
    "/onboarding/conflits": conflictScenarios[0].id,
    "/onboarding/incendie": fireScenarios[0].id,
    "/onboarding/epi": "visiteur",
  };

  const initialId = requested ?? pathScenarioId ?? pathFallbackMap[path] ?? scenarios[0].id;

  const [activeId, setActiveId] = useState(initialId);
  const [answer, setAnswer] = useState<string | null>(null);
  const [gameOpen, setGameOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<any>(null);
  const [externalResponses, setExternalResponses] = useState<Record<string, boolean> | undefined>(undefined);

  const scenario = useMemo(() => scenarios.find((s) => s.id === activeId) ?? scenarios[0], [activeId, scenarios]);
  const correct = useMemo(() => scenario.options.find((o) => o.ok)?.id, [scenario]);

  useEffect(() => {
    setAnswer(null);
  }, [activeId]);

  const navigate = useNavigate();
  const { initialized, isModuleUnlocked } = useModuleProgress();

  useEffect(() => {
    if (!requested || requested === activeId) return;

    const exists = scenarios.some((s) => s.id === requested);
    if (exists) {
      setActiveId(requested);
      return;
    }

    const otherScenarios = isConflicts ? safetyScenarios : conflictScenarios;
    const inOther = otherScenarios.some((s) => s.id === requested);

    if (inOther) {
      toast.error("Ce scénario appartient à un autre module. Redirection vers le scénario par défaut.");
    }
  }, [requested, activeId, scenarios, isConflicts]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <main className="px-6 pb-24 pt-16">
        <section className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Étape · Simulations</p>
            <h1 className="mt-4 text-3xl font-semibold text-white">{scenario.title}</h1>
            <p className="mt-3 text-slate-300">{scenario.context}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {scenario.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    // branch handling
                    if ((opt as any).branch) {
                      try { trackEvent("branch_choice", { from: scenario.id, choice: opt.id, to: (opt as any).branch }); } catch (e) {}
                      setActiveId((opt as any).branch);
                      return;
                    }
                    setAnswer(opt.id);
                  }}
                  className={`rounded-2xl border border-white/10 p-4 text-left text-sm transition ${
                    answer === opt.id ? (opt.ok ? "border-emerald-400 bg-emerald-500/10" : "border-rose-500 bg-rose-500/10") : "bg-white/5"
                  }`}
                >
                  <p className="font-semibold text-white">{opt.label}</p>
                </button>
              ))}
            </div>

            {answer && (
              <div className="mt-6 rounded-2xl border p-4 text-sm text-slate-200">
                {answer === correct ? (
                  <p className="text-emerald-300">Bonne réponse — {scenario.feedback}</p>
                ) : (
                  <p className="text-rose-300">Réponse incorrecte — {scenario.feedback}</p>
                )}
              </div>
            )}

            {/* Mini-game launcher */}
            {scenario.game && (
              <div className="mt-6">
                <Button
                  size="md"
                  onClick={() => {
                    try { trackEvent("mini_game_start", { gameId: scenario.game.id, module: currentModuleId }); } catch (e) {}
                    setActiveGame(scenario.game);
                    setGameOpen(true);
                  }}
                >
                  Lancer le jeu
                </Button>

                {gameOpen && activeGame && (
                  <div className="mt-4">
                    <MiniGame
                      game={activeGame}
                      onClose={() => {
                        setGameOpen(false);
                        setActiveGame(null);
                      }}
                      onFinish={(score) => {
                        try { trackEvent("mini_game_finish", { gameId: activeGame?.id, score, module: currentModuleId }); } catch (e) {}
                        // if user succeeded at least one mini-game, mark 'pratique' as done in the UI checklist
                        if (score && score > 0) {
                          setExternalResponses((prev) => ({ ...(prev || {}), pratique: true }));
                          try { trackEvent("practice_marked", { module: currentModuleId, gameId: activeGame?.id }); } catch (e) {}
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Activity: drag & drop or classification */}
            {scenario.activity && scenario.activity.type === "reorder" && (
              <div className="mt-6">
                <DragReorderBoard
                  title={"Exercice : ordonner les étapes"}
                  description={"Placez les étapes dans l'ordre correct pour accueillir un visiteur."}
                  items={scenario.activity.items}
                  correctOrder={scenario.activity.correctOrder}
                  onSolved={() => {
                    try { trackEvent("activity_solved", { type: "reorder", module: currentModuleId, scenario: scenario.id }); } catch (e) {}
                    setExternalResponses((prev) => ({ ...(prev || {}), pratique: true }));
                    toast.success("Exercice réussi — pratique cochée");
                  }}
                />
              </div>
            )}

            {scenario.activity && scenario.activity.type === "classify" && (
              <div className="mt-6">
                <ClassificationBoard
                  title={"Exercice : classer les signaux"}
                  prompt={"Classez les éléments entre suspects et normaux"}
                  categories={scenario.activity.categories}
                  items={scenario.activity.items}
                  correctMapping={scenario.activity.correctMapping}
                  onSolved={() => {
                    try { trackEvent("activity_solved", { type: "classify", module: currentModuleId, scenario: scenario.id }); } catch (e) {}
                    setExternalResponses((prev) => ({ ...(prev || {}), pratique: true }));
                    toast.success("Exercice réussi — pratique cochée");
                  }}
                />
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {prevPath && (
                <Button variant="ghost" size="lg" asChild>
                  <Link to={prevPath}>← {prevLabel}</Link>
                </Button>
              )}

              {nextPath && (
                <Button variant="secondary" size="lg" asChild>
                  <Link to={nextPath}>{nextLabel} →</Link>
                </Button>
              )}
            </div>
          </article>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">Complétion du module</h2>
            <p className="text-sm text-slate-300 mt-1">Validez le module une fois que vous avez terminé les simulations.</p>
            <div className="mt-6">
              <ModuleCompletionCard
                moduleId={"simulations" as any}
                checklist={[{ id: "read", label: "J'ai lu les consignes" }, { id: "pratique", label: "J'ai réalisé les mises en situation" }, { id: "quiz", label: "J'ai passé le quiz" }]}
                description="Vérifiez que vous avez complété les éléments requis pour valider ce module."
                externalResponses={externalResponses}
              />
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
