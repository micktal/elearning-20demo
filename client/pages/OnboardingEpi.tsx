import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";

const epiStats = [
  { label: "Objectif", value: "Protection des personnes" },
  { label: "Obligation", value: "Port systématique" },
  { label: "Responsabilité", value: "Individuelle" },
];

const epiRules = [
  "Le port des EPI est obligatoire dès l’exposition au risque",
  "Aucune dérogation sans validation formelle",
  "Un EPI non conforme = arrêt immédiat de l’activité",
  "Tout écart doit être corrigé ou signalé",
];

const commonErrors = [
  "Retirer un EPI pour plus de confort",
  "Utiliser un EPI non adapté à la zone",
  "Tolérer un écart chez un collègue",
  "Reporter la correction à plus tard",
];

export default function OnboardingEpi() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-10">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Module · Équipements de Protection Individuelle</p>

          <h1 className="mt-4 text-4xl font-semibold">Adopter les bons réflexes EPI</h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Le port des EPI est un acte de protection individuelle et collective. Ce module vous donne les réflexes indispensables pour travailler en sécurité,
            sans compromis.
          </p>

          {/* STATS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {epiStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-sm text-slate-300">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          {/* OBJECTIFS */}
          <h2 className="mt-10 text-xl font-semibold">Ce que vous devez savoir faire</h2>

          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-200">
            <li>Identifier les EPI obligatoires selon la situation</li>
            <li>Refuser une intervention non conforme</li>
            <li>Corriger immédiatement un écart observé</li>
            <li>Protéger sa sécurité et celle des autres</li>
          </ul>

          {/* RÈGLES */}
          <h2 className="mt-8 text-xl font-semibold">Règles essentielles</h2>

          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-200">
            {epiRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>

          {/* ERREURS */}
          <h2 className="mt-8 text-xl font-semibold text-amber-300">Erreurs fréquentes à éviter</h2>

          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-200">
            {commonErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>

          {/* ACTIONS */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Button size="lg" onClick={() => navigate("/onboarding/epi/scenario")}>Passer aux mises en situation</Button>

            <Button variant="ghost" size="lg" asChild>
              <Link to="/onboarding/incendie">← Module précédent</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
