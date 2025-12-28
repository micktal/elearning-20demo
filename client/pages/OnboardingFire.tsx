import { Link, useNavigate } from "react-router-dom";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { Button } from "@/components/ui/button";

const fireStats = [
  { label: "Priorité", value: "Protection des personnes" },
  { label: "Temps cible", value: "< 4 minutes" },
  { label: "Responsabilité", value: "Tous collaborateurs" },
];

const firePrinciples = [
  "Toute alerte est prise au sérieux",
  "La sécurité humaine prime sur l’activité",
  "Une action rapide vaut mieux qu’une attente parfaite",
  "La communication doit être factuelle et maîtrisée",
];

export default function OnboardingFire() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-10">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Module · Sécurité incendie</p>

          <h1 className="mt-4 text-4xl font-semibold">Réagir efficacement face à un départ de feu</h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Ce module vous donne les réflexes essentiels pour protéger les personnes, limiter la propagation et alerter correctement
            les acteurs de sécurité.
          </p>

          {/* STATS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {fireStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-sm text-slate-300">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          {/* OBJECTIFS */}
          <h2 className="mt-10 text-xl font-semibold">Ce que vous devez savoir faire</h2>

          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-200">
            <li>Identifier une situation anormale</li>
            <li>Alerter sans délai</li>
            <li>Choisir une réaction adaptée</li>
            <li>Faciliter l’évacuation si nécessaire</li>
          </ul>

          {/* Trainer video */}
          <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 bg-black">
            <video
              controls
              className="w-full h-auto max-h-[420px] object-cover bg-black"
              src="https://cdn.builder.io/o/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2F6ada493dc67f473abea31bd48741c828?alt=media&token=a72365e8-3e19-4ae8-81f6-9e78a18b62fc&apiKey=d93d9a0ec7824aa1ac4d890a1f90a2ec"
            />
          </div>

          {/* PRINCIPES */}
          <h2 className="mt-8 text-xl font-semibold">Principes clés</h2>

          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-200">
            {firePrinciples.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {/* ACTIONS */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Button size="lg" onClick={() => navigate("/onboarding/incendie/alerte")}>
              Passer aux mises en situation
            </Button>

            <Button variant="ghost" size="lg" asChild>
              <Link to="/onboarding/conflits">← Module précédent</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
