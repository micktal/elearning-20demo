import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TOTAL_SECONDS = 180; // 3 minutes

const steps = [
  {
    id: 1,
    title: "Bienvenue",
    description: "Présentation rapide de l'entreprise et objectifs du parcours.",
  },
  {
    id: 2,
    title: "Règles clés",
    description: "Principales règles et bonnes pratiques à connaître.",
  },
  {
    id: 3,
    title: "Quiz rapide",
    description: "Validez vos connaissances avec un petit quiz interactif.",
  },
];

export default function Onboarding() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    if (started && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      // auto-finish when timer hits zero
      setStarted(false);
    }
    return () => window.clearInterval(timer);
  }, [started, timeLeft]);

  const progress = useMemo(() => Math.min(1, (TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS), [timeLeft]);

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const nextStep = () => {
    setCurrentStep((c) => Math.min(steps.length - 1, c + 1));
  };

  const prevStep = () => {
    setCurrentStep((c) => Math.max(0, c - 1));
  };

  const start = () => {
    setStarted(true);
  };

  const restart = () => {
    setTimeLeft(TOTAL_SECONDS);
    setCurrentStep(0);
    setStarted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="container">
        <nav className="mb-8 flex items-center justify-between">
          <div className="logo font-bold text-lg">Onboardly</div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-slate-600 hover:text-slate-800">Retour</Link>
          </div>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left - Steps */}
          <aside className="col-span-1">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Onboarding — 3 minutes</h4>
                  <div className="text-xs text-slate-500">Durée restante : <span className="font-mono">{formatTime(timeLeft)}</span></div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{Math.round(progress * 100)}%</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-2 bg-primary" style={{ width: `${progress * 100}%` }}></div>
                </div>
                <ul className="mt-4 space-y-3">
                  {steps.map((s, i) => (
                    <li key={s.id} className={`flex items-start gap-3 ${i === currentStep ? "ring-2 ring-primary/20 rounded-md p-2" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= Math.floor(progress * steps.length - 1) ? "bg-primary text-primary-foreground" : "bg-slate-100 text-slate-600"}`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-xs text-slate-500">{s.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex gap-2">
                {!started ? (
                  <Button variant="default" size="sm" onClick={start}>Démarrer</Button>
                ) : (
                  <Button variant="destructive" size="sm" onClick={() => setStarted(false)}>Pause</Button>
                )}

                <Button variant="outline" size="sm" onClick={restart}>Redémarrer</Button>
              </div>
            </div>
          </aside>

          {/* Center - Content */}
          <section className="md:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <header className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
                  <p className="mt-2 text-slate-600">{steps[currentStep].description}</p>
                </div>
                <div className="text-sm text-slate-500">Etape {currentStep + 1} / {steps.length}</div>
              </header>

              <div className="mt-6 min-h-[220px] flex flex-col gap-4">
                {/* Example content per step */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <p className="text-slate-600">Bienvenue à bord ! En 3 minutes nous allons vous présenter l'essentiel pour bien démarrer.</p>
                    <div className="rounded-md overflow-hidden bg-slate-50 border border-border p-4">
                      <h3 className="font-semibold">Objectifs</h3>
                      <ul className="mt-2 list-disc list-inside text-slate-600">
                        <li>Comprendre la mission de l'équipe</li>
                        <li>Connaitre les outils essentiels</li>
                        <li>Savoir où trouver de l'aide</li>
                      </ul>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-slate-600">Voici les règles clés et bonnes pratiques à garder en tête.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-md border border-border">
                        <h4 className="font-medium">Communication</h4>
                        <p className="text-sm text-slate-500 mt-1">Utilisez Slack pour les questions rapides et les tickets pour les tâches.</p>
                      </div>
                      <div className="p-4 bg-white rounded-md border border-border">
                        <h4 className="font-medium">Sécurité</h4>
                        <p className="text-sm text-slate-500 mt-1">Ne partagez jamais vos identifiants. Activez l'authentification à deux facteurs.</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-slate-600">Petit quiz pour valider vos acquis.</p>
                    <div className="p-4 bg-white rounded-md border border-border">
                      <div className="font-medium">Question sample</div>
                      <div className="mt-2 text-sm text-slate-500">Quelle est la principale façon de poser une question technique ?</div>
                      <div className="mt-3 flex flex-col gap-2">
                        <button className="text-left p-3 border border-border rounded-md">Dans Slack</button>
                        <button className="text-left p-3 border border-border rounded-md">Par email</button>
                        <button className="text-left p-3 border border-border rounded-md">Sur un post-it</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <footer className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={prevStep} disabled={currentStep === 0}>Précédent</Button>
                  <Button variant="default" size="sm" onClick={nextStep} disabled={currentStep === steps.length - 1}>Suivant</Button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-500">Temps écoulé : <span className="font-mono">{formatTime(TOTAL_SECONDS - timeLeft)}</span></div>
                  <div>
                    {timeLeft === 0 ? (
                      <Button variant="secondary" size="sm" onClick={restart}>Terminé — Recommencer</Button>
                    ) : (
                      <Button variant="default" size="sm" onClick={() => { setTimeLeft(0); setStarted(false); }}>Terminer maintenant</Button>
                    )}
                  </div>
                </div>
              </footer>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
