import { Link, useNavigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { Button } from "@/components/ui/button";

const governanceStats = [
  { label: "Délai de tri", value: "< 12 h" },
  { label: "Niveau requis", value: "Conformité totale" },
  { label: "Portée", value: "Tous collaborateurs" },
];

const corePrinciples = [
  "Toute alerte est traitée, même incomplète",
  "La confidentialité est absolue",
  "La traçabilité protège l’entreprise et les personnes",
  "Aucune sanction sans instruction formalisée",
];

export default function OnboardingEthics() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-10">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Module · Éthique & Gouvernance</p>

          <h1 className="mt-4 text-4xl font-semibold">Traiter les alertes avec rigueur et discernement</h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            La gouvernance éthique protège l’entreprise, les collaborateurs et les partenaires. Ce module vous apprend à reconnaître,
            orienter et traiter une alerte conformément aux standards HelioNova.
          </p>

          {/* STATS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {governanceStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-sm text-slate-300">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* OBJECTIF */}
          <h2 className="mt-10 text-xl font-semibold">Objectif du module</h2>
          <p className="mt-3 max-w-2xl text-slate-200">
            Vous permettre d’adopter les bons réflexes face à une situation sensible, sans improvisation ni mise en risque juridique.
          </p>

          {/* PRINCIPES */}
          <h2 className="mt-8 text-xl font-semibold">Principes non négociables</h2>

          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-200">
            {corePrinciples.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {/* ACTIONS */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/onboarding/ethique/phishing")}
            >
              Passer aux cas pratiques
            </Button>

            <Button variant="ghost" size="lg" asChild>
              <Link to="/onboarding/epi">← Module précédent</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
