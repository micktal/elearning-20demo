import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { ModuleCompletionCard } from "@/components/interactive/ModuleCompletionCard";

const scenarios = [
  {
    id: "badge",
    title: "Badge refusé",
    context: "Votre badge est refusé à l’entrée d’une zone critique.",
    options: [
      { id: "forcer", label: "Insister pour entrer", ok: false },
      { id: "pret", label: "Utiliser le badge d’un collègue", ok: false },
      { id: "alerte", label: "Déclarer via Nova Bleu et attendre", ok: true },
    ],
    feedback: "La déclaration via Nova Bleu garantit la traçabilité et déclenche la sûreté.",
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
  },
];

export default function OnboardingSimulations() {
  const location = window.location;
  const params = new URLSearchParams(location.search);
  const requested = params.get("scenario");

  // fallback mapping based on the current path to choose a relevant scenario
  const path = location.pathname || "";
  const pathFallbackMap: Record<string, string> = {
    "/onboarding/protocoles/scenario": "badge",
    "/onboarding/protocoles": "badge",
    "/onboarding/conflits/scenario-1": "visiteur",
    "/onboarding/conflits": "visiteur",
    "/onboarding/incendie/alerte": "badge",
    "/onboarding/incendie": "badge",
    "/onboarding/epi/scenario": "visiteur",
    "/onboarding/epi": "visiteur",
    "/onboarding/ethique/scenario-cadeau": "phishing",
    "/onboarding/ethique": "phishing",
  };

  const initialId = requested ?? pathFallbackMap[path] ?? scenarios[0].id;

  const [activeId, setActiveId] = useState(initialId);
  const [answer, setAnswer] = useState<string | null>(null);

  const scenario = useMemo(() => scenarios.find((s) => s.id === activeId) ?? scenarios[0], [activeId]);
  const correct = useMemo(() => scenario.options.find((o) => o.ok)?.id, [scenario]);

  useEffect(() => {
    setAnswer(null);
  }, [activeId]);

  useEffect(() => {
    // if a requested scenario exists and differs from current, update
    if (requested && requested !== activeId) {
      const exists = scenarios.some((s) => s.id === requested);
      if (exists) setActiveId(requested);
    }
  }, [requested]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-10">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Module · Simulations</p>

          <h1 className="mt-4 text-4xl font-semibold">Tester vos réflexes essentiels</h1>

          <p className="mt-4 max-w-2xl text-slate-300">Choisissez la bonne conduite à tenir dans chaque situation.</p>

          {/* Sélecteur scénario */}
          <div className="mt-8 flex gap-3">
            {scenarios.map((s) => (
              <Button
                key={s.id}
                size="sm"
                variant={s.id === activeId ? "default" : "secondary"}
                onClick={() => {
                  setActiveId(s.id);
                }}
              >
                {s.title}
              </Button>
            ))}
          </div>

          {/* Simulation */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">{scenario.title}</h2>
            <p className="mt-2 text-slate-200">{scenario.context}</p>

            <div className="mt-6 space-y-3">
              {scenario.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAnswer(opt.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    answer === opt.id
                      ? opt.ok
                        ? "border-emerald-400 bg-emerald-400/20"
                        : "border-rose-400 bg-rose-400/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {answer && (
              <p className={`mt-4 text-sm ${answer === correct ? "text-emerald-200" : "text-rose-200"}`}>
                {answer === correct ? scenario.feedback : "Reprenez les consignes avant de poursuivre."}
              </p>
            )}
          </div>

          <div className="mt-10 flex gap-4">
            <Button asChild>
              <Link to="/onboarding/conflits">Module suivant</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/onboarding/protocoles">← Consignes</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-5xl">
          <ModuleCompletionCard
            moduleId="simulations"
            checklist={[
              { id: "badge", label: "Je sais gérer un badge refusé" },
              { id: "mail", label: "Je sais signaler un phishing" },
              { id: "visit", label: "Je maîtrise l’accueil visiteur" },
            ]}
            description="Validez vos réflexes avant de poursuivre."
          />
        </section>
      </main>
    </div>
  );
}
