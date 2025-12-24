import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left - Hero */}
        <section className="hero-content">
          <div className="badge inline-flex items-center gap-3 bg-primary/10 text-primary-700 rounded-full px-3 py-1 text-sm font-medium w-max">
            <svg className="h-4 w-4 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 12v10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Onboarding eLearning
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
            Créez un eLearning d'onboarding impactant — 3 minutes
          </h1>

          <p className="mt-4 text-lg text-slate-600 max-w-xl">
            Un parcours d'intégration court, visuel et guidé pour accueillir vos
            nouvelles recrues. Vidéos courtes, quiz interactifs et suivi de
            progression — tout ce dont vous avez besoin pour un onboarding en
            3 minutes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button variant="default" size="lg" asChild>
                <span>Commencer l'onboarding — 3 min</span>
              </Button>
            </Link>

            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" asChild>
                <span>Voir l'aperçu</span>
              </Button>
            </Link>
          </div>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <li className="feature-item flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-primary/5 flex items-center justify-center text-primary-600 font-semibold">1</div>
              <div>
                <div className="font-medium">3 minutes chrono</div>
                <div className="text-slate-500">Un module court et efficace.</div>
              </div>
            </li>

            <li className="feature-item flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-secondary/5 flex items-center justify-center text-secondary-700 font-semibold">A</div>
              <div>
                <div className="font-medium">Contenu multimédia</div>
                <div className="text-slate-500">Slides, vidéos et quiz interactifs.</div>
              </div>
            </li>

            <li className="feature-item flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-accent/5 flex items-center justify-center text-accent-700 font-semibold">✓</div>
              <div>
                <div className="font-medium">Suivi & validation</div>
                <div className="text-slate-500">Progression et score final.</div>
              </div>
            </li>
          </ul>
        </section>

        {/* Right - Preview Card */}
        <aside className="preview-card bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="rounded-md overflow-hidden bg-gradient-to-b from-white to-slate-50">
            <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
              <svg className="h-16 w-16 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 3v18l14-9L5 3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900">Aperçu du module</h3>
              <p className="mt-2 text-slate-600">Un exemple de module d'onboarding rapide — introduction, règles de base, et quiz final.</p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-primary w-2/5"></div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">Progression : 40%</div>
                </div>

                <div>
                  <span className="text-sm font-medium text-slate-700">Durée</span>
                  <div className="text-sm text-slate-500">3 min</div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link to="/onboarding" className="w-full">
                  <Button variant="default" size="default" asChild>
                    <span>Commencer</span>
                  </Button>
                </Link>

                <Button variant="ghost" size="default">Partager</Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
