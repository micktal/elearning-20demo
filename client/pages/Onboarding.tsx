import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { DragReorderBoard } from "@/components/interactive/DragReorderBoard";

const timeline = [
  { slot: "00:00 — 00:45", title: "Accueil institutionnel", detail: "Message du Comité Exécutif et rappel de la mission HelioNova." },
  { slot: "00:45 — 01:40", title: "Repères corporate", detail: "Organisation, gouvernance et dispositifs d'accompagnement présentés de façon synthétique." },
  { slot: "01:40 — 02:20", title: "Engagement et valeurs", detail: "Posture Pulse et attentes managériales clés." },
  { slot: "02:20 — 04:00", title: "Préparation à la suite", detail: "Invitation à consulter les consignes de sûreté et les procédures opérationnelles." },
];

const readingPrompts = [
  "Vision HelioNova Pulse et ambitions 2030",
  "Gouvernance, implantations et écosystème partenaires",
  "Parcours d'intégration : rôles du manager, RH et mentor",
];

const statBlocks = [
  { label: "Durée du module", value: "4 minutes" },
  { label: "Séquences", value: "4 étapes" },
  { label: "Livrables", value: "Brief + consignes" },
];

const introInteractiveItems = [
  { id: "message", label: "Message du Comex", detail: "Aligner la vision Pulse 2030" },
  { id: "repere", label: "Repères corporate", detail: "Comprendre la gouvernance et les implantations" },
  { id: "valeurs", label: "Valeurs & posture", detail: "Intégrer les attentes managériales" },
  { id: "brief", label: "Brief opérationnel", detail: "Préparer la consultation des consignes" },
];

const introCorrectOrder = ["message", "repere", "valeurs", "brief"];

const introIllustration = "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80";

export default function OnboardingIntro() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />
      <main className="px-6 pb-20 pt-16">
        <section className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Étape 1 · Introduction</p>
            <h1 className="mt-4 text-4xl font-semibold">Bienvenue dans l'onboarding corporate HelioNova</h1>
            <p className="mt-3 text-slate-300">
              Cette première séquence pose le cadre institutionnel : ambition du groupe, gouvernance et attentes partagées. Prenez quelques minutes pour
              parcourir les informations essentielles avant d'accéder aux consignes officielles.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {statBlocks.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-sm text-slate-300">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-4">
              {readingPrompts.map((prompt) => (
                <div key={prompt} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  {prompt}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/onboarding/protocoles">Lecture terminée · Consignes</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link to="/">Revenir à l'accueil</Link>
              </Button>
            </div>
          </article>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/20">
            <div className="rounded-2xl bg-slate-900/70 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Feuille de route</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Séquence introductive</h2>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">~4 min</span>
              </div>
              <div className="mt-5 space-y-4">
                {timeline.map((item) => (
                  <div key={item.slot} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">{item.slot}</p>
                    <p className="mt-1 text-base font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-slate-300">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
