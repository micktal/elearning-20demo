import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { cn } from "@/lib/utils";

const safetyProtocols = [
  {
    id: "acces",
    title: "Accès physiques",
    summary:
      "Badge nominatif à présenter à chaque entrée, zones sensibles limitées et accompagnement obligatoire des visiteurs.",
    checklist: [
      "Déclarer toute anomalie sur Nova Bleu",
      "Ne jamais prêter son badge",
      "Escorter les visiteurs jusqu'au point de rendez-vous",
    ],
    codeWord: "Nova Bleu",
  },
  {
    id: "cyber",
    title: "Sécurité numérique",
    summary:
      "Verrouillage des sessions, MFA obligatoire et signalement immédiat des emails suspects via le bouton \"Signaler\".",
    checklist: [
      "Mettre à jour l'agent Sentinel",
      "Verrouiller son poste dès l'absence",
      "Transmettre à SecOps en moins de 5 minutes",
    ],
    codeWord: "SecOps 24/7",
  },
  {
    id: "visiteur",
    title: "Visiteurs & ateliers",
    summary:
      "Badge invité orange, brief sécurité de 30 secondes et journal Pulse pour tracer les passages sensibles.",
    checklist: [
      "Remettre le badge invité",
      "Présenter les issues d'urgence",
      "Reporter dans le journal Pulse",
    ],
    codeWord: "Charte visiteur",
  },
];

export default function OnboardingProtocols() {
  const [activeProtocol, setActiveProtocol] = React.useState(safetyProtocols[0].id);
  const protocol = safetyProtocols.find((item) => item.id === activeProtocol) ?? safetyProtocols[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />
      <main className="px-6 pb-20 pt-16">
        <section className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Étape 2 · Codes et consignes</p>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-semibold">Référentiel sûreté et sécurité</h1>
              <p className="mt-3 text-slate-300">
                Ces consignes sont obligatoires pour l'ensemble des collaborateurs présents sur site. Elles complètent les politiques globales HelioNova et
                doivent être maîtrisées avant d'accéder aux simulations opérationnelles.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" asChild>
                <Link to="/onboarding/intro">← Introduction</Link>
              </Button>
              <Button asChild>
                <Link to="/onboarding/simulations">Simulations opérationnelles →</Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-[220px_1fr]">
            <div className="flex flex-col gap-3">
              {safetyProtocols.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveProtocol(item.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm",
                    activeProtocol === item.id
                      ? "border-cyan-400 bg-gradient-to-r from-cyan-400/20 to-indigo-500/20"
                      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Référence</p>
                  <p className="text-base font-semibold text-white">{item.title}</p>
                </button>
              ))}
            </div>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Consigne</p>
                  <h2 className="text-2xl font-semibold text-white">{protocol.title}</h2>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Code {protocol.codeWord}</span>
              </div>
              <p className="mt-3 text-slate-200">{protocol.summary}</p>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-slate-200">
                {protocol.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Button size="sm" variant="outline" asChild>
                  <Link to="/onboarding/intro">Revenir à l'introduction</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/onboarding/simulations">Continuer vers les simulations</Link>
                </Button>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
