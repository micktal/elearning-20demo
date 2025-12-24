import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { DragReorderBoard } from "@/components/interactive/DragReorderBoard";
import { cn } from "@/lib/utils";

const gameBank = [
  {
    id: "badge",
    title: "Gestion d'accès",
    prompt: "Votre badge est refusé à l'entrée d'une zone critique. Quelle action appliquez-vous immédiatement ?",
    answers: [
      { id: "forcer", label: "Insister jusqu'à ouverture" },
      { id: "pret", label: "Utiliser le badge d'un collègue" },
      { id: "alerte", label: "Déclarer via Nova Bleu et attendre la sûreté" },
    ],
    correct: "alerte",
    tip: "Nova Bleu assure la traçabilité et déclenche l'équipe sûreté.",
  },
  {
    id: "phishing",
    title: "Protection des identifiants",
    prompt: "Un email interne annonce \"URGENT\" et réclame vos accès VPN. Comment répondez-vous ?",
    answers: [
      { id: "repondre", label: "Répondre rapidement pour clôturer la demande" },
      { id: "mentor", label: "Transmettre au mentor" },
      { id: "signal", label: "Cliquer sur \"Signaler\" puis alerter SecOps" },
    ],
    correct: "signal",
    tip: "Chaque signalement valide alimente l'indicateur cybersécurité présenté au comité.",
  },
  {
    id: "visiteur",
    title: "Accueil corporate",
    prompt: "Un partenaire arrive en atelier sans badge invité. Quelle posture adoptez-vous ?",
    answers: [
      { id: "attente", label: "Laisser le partenaire rejoindre son contact" },
      { id: "refus", label: "Refuser l'accès et lui demander de revenir" },
      { id: "accompagnement", label: "L'accueillir, délivrer un badge invité et l'accompagner" },
    ],
    correct: "accompagnement",
    tip: "Un accueil structuré garantit conformité et expérience client.",
  },
];

export default function OnboardingSimulations() {
  const [activeGame, setActiveGame] = useState(gameBank[0].id);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const game = useMemo(() => gameBank.find((item) => item.id === activeGame) ?? gameBank[0], [activeGame]);

  const handleSelectGame = (id: string) => {
    setActiveGame(id);
    setSelectedAnswer(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />
      <main className="px-6 pb-20 pt-16">
        <section className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Étape 3 · Simulations opérationnelles</p>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-semibold">Validez vos réflexes en conditions réelles</h1>
              <p className="mt-3 text-slate-300">
                Sélectionnez un scénario et choisissez la conduite à tenir. Les bonnes réponses confirment la maîtrise des procédures avant la prise de poste
                sur site.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" asChild>
                <Link to="/onboarding/protocoles">← Consignes</Link>
              </Button>
              <Button asChild>
                <Link to="/onboarding/conflits">Module conflits →</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/">Clore le parcours</Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-[220px_1fr]">
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

            <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Challenge en cours</p>
              <h2 className="mt-2 text-2xl font-semibold">{game.title}</h2>
              <p className="mt-2 text-slate-200">{game.prompt}</p>

              <div className="mt-6 space-y-3">
                {game.answers.map((answer) => (
                  <button
                    key={answer.id}
                    type="button"
                    onClick={() => setSelectedAnswer(answer.id)}
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
                    : "Consultez à nouveau les consignes officielles pour confirmer la bonne procédure."}
                </p>
              )}
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
