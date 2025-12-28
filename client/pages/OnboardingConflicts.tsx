import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";

const conflictStats = [
  { label: "Durée", value: "3 minutes" },
  { label: "Objectif", value: "Désescalade rapide" },
  { label: "Cible HelioNova", value: "< 24 h" },
];

const deEscalationPhases = [
  {
    phase: "1. Observation factuelle",
    description:
      "Recueillir les faits sans interprétation. Identifier les acteurs, le contexte et l’impact réel.",
  },
  {
    phase: "2. Clarification croisée",
    description:
      "Faire reformuler les enjeux par chaque partie. Identifier besoins, attentes et points de tension.",
  },
  {
    phase: "3. Décision cadrée",
    description:
      "S’accorder sur un plan d’action, désigner un responsable et fixer un point de suivi.",
  },
];

export default function OnboardingConflicts() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-10">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Module · Gestion des conflits</p>

          <h1 className="mt-4 text-4xl font-semibold">Neutraliser les tensions avant qu’elles n’escaladent</h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Les situations de tension font partie de la vie professionnelle. L’enjeu n’est pas de les éviter, mais de les traiter
            rapidement, avec méthode et neutralité. Ce module vous donne des repères clairs pour agir dès le premier signe de
            friction.
          </p>

          {/* STATS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {conflictStats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
              >
                <p className="text-sm text-slate-300">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* OBJECTIF */}
          <h2 className="mt-10 text-xl font-semibold">Objectif du module</h2>
          <p className="mt-3 max-w-2xl text-slate-200">
            Vous permettre d’identifier rapidement une situation de conflit, d’adopter la bonne posture et de structurer une réponse
            conforme aux standards HelioNova.
          </p>

          {/* MÉTHODE */}
          <h2 className="mt-8 text-xl font-semibold">La méthode HelioNova en 3 phases</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {deEscalationPhases.map((phase) => (
              <div
                key={phase.phase}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm font-semibold text-cyan-200">{phase.phase}</p>
                <p className="mt-2 text-sm text-slate-300">{phase.description}</p>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/onboarding/conflits/conflict-verbal")}
            >
              Passer aux cas pratiques
            </Button>

            <Button variant="ghost" size="lg" asChild>
              <Link to="/onboarding/simulations">← Retour</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
