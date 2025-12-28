import { Link, useNavigate } from "react-router-dom";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";

const statBlocks = [
  { label: "Durée", value: "4 minutes" },
  { label: "Séquences", value: "4 étapes" },
  { label: "Objectif", value: "Comprendre le cadre" },
];

export default function OnboardingIntro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        {/* HERO */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-10">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Onboarding · Introduction</p>

          <h1 className="mt-4 text-4xl font-semibold">Bienvenue chez HelioNova Pulse</h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Ce module d’introduction vous permet de comprendre le cadre,
            la vision et les attentes avant d’entrer dans les consignes
            opérationnelles.
          </p>

          {/* VIDEO DE PRÉSENTATION */}
          <div className="mt-6">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
              <video
                controls
                src="https://xnwexjnaiffdcifcnton.supabase.co/storage/v1/object/sign/pdf%20memo/novawelcome.mov?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMWE2Y2M1ZS1kN2E2LTRjY2EtOTg1Ny1iOTc0Njg3NGQzNmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZGYgbWVtby9ub3Zhd2VsY29tZS5tb3YiLCJpYXQiOjE3NjY5Mzg1NjQsImV4cCI6MTc5ODQ3NDU2NH0.HG3Y-WAfBqmKnWQZTo67PvcrGOb0emI5JmG3AFPoffY"
                className="w-full h-auto max-h-[480px] object-cover"
              />
            </div>
          </div>

          {/* STATS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {statBlocks.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
              >
                <p className="text-sm text-slate-300">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* OBJECTIFS */}
          <h2 className="mt-10 text-xl font-semibold">À l’issue de cette introduction, vous saurez :</h2>

          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-200">
            <li>Expliquer la vision Pulse 2030</li>
            <li>Identifier les acteurs clés (manager, RH, mentor)</li>
            <li>Comprendre le déroulé global du programme</li>
          </ul>

          {/* ACTIONS */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/onboarding/protocoles")}
            >
              Commencer le module
            </Button>

            <Button variant="ghost" size="lg" asChild>
              <Link to="/">Retour à l’accueil</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
