import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getNextModule, getPreviousModule } from "@/lib/moduleProgress";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { ModuleCompletionCard } from "@/components/interactive/ModuleCompletionCard";

// General safety scenarios
const safetyScenarios = [
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

// Conflict-specific scenarios (de-escalation focused)
const conflictScenarios = [
  {
    id: "conflict-verbal",
    title: "Conflit verbal en atelier",
    context: "Deux collègues ont une discussion qui monte en tension devant les autres.",
    options: [
      { id: "ignorer", label: "Ignorer et continuer", ok: false },
      { id: "intervenir", label: "Intervenir en privé pour clarifier", ok: true },
      { id: "punir", label: "Sanctionner publiquement", ok: false },
    ],
    feedback: "Intervenir en privé permet de désamorcer la situation et préserver la dignité des personnes.",
  },
  {
    id: "conflict-manager",
    title: "Conflit avec un manager",
    context: "Un manager tient des propos qui mettent un collaborateur en difficulté.",
    options: [
      { id: "defendre", label: "Prendre le parti sans faits", ok: false },
      { id: "escalade", label: "Documenter et informer RH/Comex", ok: true },
      { id: "affronter", label: "Répondre sur le ton", ok: false },
    ],
    feedback: "Documenter et alerter les bonnes instances garantit imparcialité et traçabilité.",
  },
  {
    id: "conflict-client",
    title: "Client en désaccord",
    context: "Un client conteste une action et la discussion devient conflictuelle.",
    options: [
      { id: "retourner", label: "Retourner la critique contre le client", ok: false },
      { id: "calmer", label: "Proposer un point de calme et écouter", ok: true },
      { id: "ignorer2", label: "Ignorer et laisser filer", ok: false },
    ],
    feedback: "Calmer et écouter permet souvent de trouver un terrain d’entente rapidement.",
  },
];

// Fire-specific scenarios
const fireScenarios = [
  {
    id: "incendie-alerte",
    title: "Départ de feu - Alerte",
    context: "Vous remarquez de la fumée provenant d’un équipement proche d’une zone de production.",
    options: [
      { id: "ignorer", label: "Ne rien faire et surveiller", ok: false },
      { id: "alerter", label: "Alerter immédiatement le PC Sécurité et évacuer", ok: true },
      { id: "retirer", label: "Tenter d’éteindre seul(e)", ok: false },
    ],
    feedback: "Alerter et évacuer garantit la sécurité des personnes et active les procédures d’intervention.",
  },
  {
    id: "incendie-evac",
    title: "Evacuation ordonnée",
    context: "Une alerte incendie est déclenchée dans votre bâtiment.",
    options: [
      { id: "panique", label: "Courir vers la sortie la plus proche sans ordre", ok: false },
      { id: "suivre", label: "Suivre les consignes d’évacuation et les points de rassemblement", ok: true },
      { id: "reprendre", label: "Retourner récupérer un objet personnel", ok: false },
    ],
    feedback: "Suivre les consignes d’évacuation protège tout le monde et facilite l’intervention des secours.",
  },
];

export default function OnboardingSimulations() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const requested = params.get("scenario");

  // detect context from path
  const path = location.pathname || "";
  const pathSegments = path.split("/").filter(Boolean);
  const moduleKey = pathSegments[1] ?? null; // e.g. 'conflits', 'protocoles', 'epi', 'ethique', 'simulations'
  const pathScenarioId = pathSegments.length >= 3 ? pathSegments[2] : null;
  const isConflicts = moduleKey === "conflits";

  // choose the scenario set based on context
  let scenarios = safetyScenarios;
  if (moduleKey === "conflits") scenarios = conflictScenarios;
  if (moduleKey === "incendie") scenarios = fireScenarios;

  // compute current module id based on path
  const currentModuleId = (moduleKey ?? (isConflicts ? "conflits" : "simulations")) as any;
  const nextMod = getNextModule(currentModuleId) ?? null;
  const prevMod = getPreviousModule(currentModuleId) ?? null;
  const nextPath = nextMod?.path ?? null;
  const nextLabel = nextMod?.label ?? null;
  const prevPath = prevMod?.path ?? null;
  const prevLabel = prevMod?.label ?? null;

  // fallback mapping for module base paths -> default scenario id
  const pathFallbackMap: Record<string, string> = {
    "/onboarding/protocoles": "badge",
    "/onboarding/conflits": conflictScenarios[0].id,
    "/onboarding/incendie": fireScenarios[0].id,
    "/onboarding/epi": "visiteur",
    "/onboarding/ethique": "phishing",
  };

  const initialId = requested ?? pathScenarioId ?? pathFallbackMap[path] ?? scenarios[0].id;

  const [activeId, setActiveId] = useState(initialId);
  const [answer, setAnswer] = useState<string | null>(null);

  const scenario = useMemo(() => scenarios.find((s) => s.id === activeId) ?? scenarios[0], [activeId, scenarios]);
  const correct = useMemo(() => scenario.options.find((o) => o.ok)?.id, [scenario]);

  useEffect(() => {
    setAnswer(null);
  }, [activeId]);

  const navigate = useNavigate();

  useEffect(() => {
    // if a requested scenario exists and differs from current, update
    if (!requested || requested === activeId) return;

    const exists = scenarios.some((s) => s.id === requested);
    if (exists) {
      setActiveId(requested);
      return;
    }

    // The requested scenario does not belong to the current module's scenario set.
    // If it's part of the OTHER set (e.g. safety when we are in conflicts), inform the user and
    // navigate to a sensible fallback for the current module.
    const otherScenarios = isConflicts ? safetyScenarios : conflictScenarios;
    const inOther = otherScenarios.some((s) => s.id === requested);

    if (inOther) {
      // notify user and redirect to the canonical path for this module's first scenario
      toast(
        `Le scénario demandé appartient à un autre module. Affichage des cas de ${isConflicts ? "gestion des conflits" : "sécurité"}.`
      );

      const fallbackId = scenarios[0].id;
      const targetPath = moduleKey
        ? `/onboarding/${moduleKey}/${fallbackId}`
        : `/onboarding/simulations?scenario=${fallbackId}`;

      navigate(targetPath, { replace: true });
      setActiveId(fallbackId);
      return;
    }

    // If the requested id isn't found anywhere, silently ignore and keep current activeId
  }, [requested, scenarios, activeId, isConflicts, navigate]);

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
            {nextPath ? (
              <Button asChild>
                <Link to={nextPath}>Module suivant · {nextLabel}</Link>
              </Button>
            ) : (
              <Button size="lg" disabled>
                Module suivant
              </Button>
            )}

            {prevPath ? (
              <Button variant="ghost" asChild>
                <Link to={prevPath}>← Consignes · {prevLabel}</Link>
              </Button>
            ) : (
              <Button variant="ghost" disabled>
                ← Consignes
              </Button>
            )}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-5xl">
          {/* Hide the module completion card for the explicit conflict 'conflict-verbal' scenario */}
          {!(isConflicts && activeId === "conflict-verbal") && (
            <ModuleCompletionCard
              moduleId={isConflicts ? "conflits" : "simulations"}
              checklist={
                isConflicts
                  ? [
                      { id: "deescalade", label: "Je peux désamorcer un conflit verbal" },
                      { id: "escalade", label: "Je sais quand escalader formellement" },
                      { id: "client-gestion", label: "Je maîtrise l’accueil et la reprise client" },
                    ]
                  : [
                      { id: "badge", label: "Je sais gérer un badge refusé" },
                      { id: "mail", label: "Je sais signaler un phishing" },
                      { id: "visit", label: "Je maîtrise l’accueil visiteur" },
                    ]
              }
              description={isConflicts ? "Validez vos réflexes de gestion de conflit." : "Validez vos réflexes avant de poursuivre."}
            />
          )}
        </section>
      </main>
    </div>
  );
}
