import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";
import { cn } from "@/lib/utils";

const epiStats = [
  { label: "Couverture sites", value: "32 implantations" },
  { label: "Taux conformité cible", value: "99 %" },
  { label: "Temps d'enfilage", value: "< 90 s" },
];

const gearMatrix = [
  {
    id: "chimie",
    zone: "Labos & chimie douce",
    exposure: "Vapeurs, projections contrôlées",
    checklist: ["Lunettes étanches", "Gants nitrile long", "Blouse retardante de flamme"],
    insight: "Kit bleu PulseLab, validité 12 mois",
  },
  {
    id: "atelier",
    zone: "Ateliers mécaniques",
    exposure: "Bruit >85 dB, copeaux, solvants",
    checklist: ["Casque antibruit connecté", "Gants grip", "Visière relevable"],
    insight: "Déclenchement auto via badge atelier",
  },
  {
    id: "chantier",
    zone: "Chantiers extérieurs",
    exposure: "Chute d'objet, météo variable",
    checklist: ["Casque MIPS", "Harnais double longe", "Veste haute visibilité"],
    insight: "Kit traçable via QR code PulseField",
  },
  {
    id: "energie",
    zone: "Pôles énergie & batteries",
    exposure: "Arc électrique, risque thermique",
    checklist: ["Combinaison arc flash", "Gants composite", "Visière IR"],
    insight: "Kit rouge Delta+, contrôle hebdomadaire",
  },
];

const learningTracks = [
  {
    id: "preparation",
    title: "Préparation du kit",
    prompt: "Vous recevez un ordre de mission express pour un chantier extérieur. Comment sécuriser la vérification des EPI ?",
    tip: "Le double check badge + photo réduit de 70 % les oublis de harnais.",
    options: [
      {
        id: "visuel",
        label: "Contrôle visuel rapide avant départ",
        result: "Kit incomplet détecté tardivement sur site, mission retardée.",
        status: "warning",
      },
      {
        id: "checklist",
        label: "Scanner le QR code kit + checklist digitale",
        result: "Traçabilité complète, conformité enregistrée.",
        status: "success",
      },
      {
        id: "delegue",
        label: "Déléguer la vérification au manager",
        result: "Responsabilité floue, alerte conformité ouverte.",
        status: "risk",
      },
    ],
  },
  {
    id: "usage",
    title: "Port en situation",
    prompt: "Lors d'un audit interne, un opérateur retire ses gants pour gagner de la précision. Quelle réaction adopter ?",
    tip: "Les micro-pauses calibrées évitent 40 % des blessures main.",
    options: [
      {
        id: "ignorer",
        label: "Ignorer si la tâche reste courte",
        result: "Signalement disciplinaire, risque d'accident immédiat.",
        status: "risk",
      },
      {
        id: "public",
        label: "Recadrer publiquement devant l'équipe",
        result: "Tension inutile, adoption en baisse.",
        status: "warning",
      },
      {
        id: "micro",
        label: "Arrêter l'opération, proposer micro-pause et remise des gants",
        result: "Conformité maintenue, posture exemplaire.",
        status: "success",
      },
    ],
  },
  {
    id: "maintenance",
    title: "Maintenance & recyclage",
    prompt: "Une série de casques haute visibilité arrive en fin de cycle. Quelle procédure enclencher ?",
    tip: "Le programme PulseCycle réduit de 35 % les déchets EPI.",
    options: [
      {
        id: "stock",
        label: "Les conserver jusqu'à usure visibles",
        result: "Non-conformité majeure lors d'un audit externe.",
        status: "risk",
      },
      {
        id: "remplacement",
        label: "Planifier un échange standard via PulseCycle",
        result: "Traçabilité RSE validée, budget maîtrisé.",
        status: "success",
      },
      {
        id: "mix",
        label: "Recycler partiellement et mixer les lots",
        result: "Doutes sur la certification, réclamation fournisseurs.",
        status: "warning",
      },
    ],
  },
];

const innovationIdeas = [
  {
    title: "Lockers intelligents",
    detail: "Casiers autonomes qui délivrent le bon EPI selon le badge et consignent l'heure de retrait.",
  },
  {
    title: "Coaching AR",
    detail: "Une surcouche réalité augmentée rappelle l'ordre d'enfilage et valide la posture.",
  },
  {
    title: "Capteurs textiles",
    detail: "Les gants connectés remontent température et vibrations pour anticiper la fatigue.",
  },
];

const controlChecklist = [
  {
    stage: "Avant la mission",
    checklist: ["Scanner le badge et sélectionner la zone", "Vérifier dates d'expiration", "Associer le kit au dossier Nova Bleu"],
  },
  {
    stage: "Pendant",
    checklist: ["Observer l'état des EPI toutes les 30 min", "Remplacer tout EPI endommagé", "Reporter les incidents visibles"],
  },
  {
    stage: "Après",
    checklist: ["Nettoyer ou envoyer au service dédié", "Enregistrer le retour dans PulseCycle", "Programmer le prochain contrôle"],
  },
];

export default function OnboardingPpe() {
  const [activeZone, setActiveZone] = useState(gearMatrix[0].id);
  const [activeTrack, setActiveTrack] = useState(learningTracks[0].id);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const zone = useMemo(() => gearMatrix.find((item) => item.id === activeZone) ?? gearMatrix[0], [activeZone]);
  const track = useMemo(() => learningTracks.find((item) => item.id === activeTrack) ?? learningTracks[0], [activeTrack]);
  const currentOption = track.options.find((option) => option.id === selectedOption);

  const handleTrackChange = (id: string) => {
    setActiveTrack(id);
    setSelectedOption(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />
      <main className="px-6 pb-24 pt-16">
        <section className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Étape 6 · Port des EPI</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8">
              <h1 className="text-4xl font-semibold">Garantir une tenue EPI irréprochable</h1>
              <p className="mt-4 text-slate-300">
                Ce module associe matrices de risques, innovations Pulse et simulations de décision pour ancrer les bons réflexes de port des EPI sur tous les
                sites HelioNova.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {epiStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-sm text-slate-300">{item.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="ghost" size="lg" asChild>
                  <Link to="/onboarding/incendie">← Module incendie</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link to="/">Clore le parcours</Link>
                </Button>
              </div>
            </article>

            <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/20">
              <h2 className="text-xl font-semibold text-white">Matrice EPI par zone</h2>
              <p className="text-sm text-slate-300">Sélectionnez un environnement pour afficher l'exposition et le kit requis.</p>
              <div className="mt-6 grid gap-3">
                {gearMatrix.map((gear) => (
                  <button
                    key={gear.id}
                    type="button"
                    onClick={() => setActiveZone(gear.id)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                      activeZone === gear.id
                        ? "border-indigo-400 bg-gradient-to-r from-indigo-400/20 to-cyan-500/20"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                    )}
                  >
                    <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">{gear.zone}</p>
                    <p className="text-xs text-slate-400">{gear.insight}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-300">Exposition : {zone.exposure}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.4em] text-cyan-200">Kit requis</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-200">
                  {zone.checklist.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Simulateur de conformité</p>
              <h2 className="mt-2 text-3xl font-semibold">Choisissez la meilleure réaction</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Chaque scénario illustre un moment clé : préparation du kit, port en situation et traitement de fin de cycle. Explorez les conséquences immédiates.
              </p>
            </div>
            <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">Reporting Nova Bleu automatique</div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
            <div className="flex flex-col gap-3">
              {learningTracks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTrackChange(item.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                    activeTrack === item.id
                      ? "border-emerald-400 bg-gradient-to-r from-emerald-400/20 to-cyan-500/20"
                      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Scénario</p>
                  <p className="text-base font-semibold text-white">{item.title}</p>
                </button>
              ))}
            </div>

            <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Challenge en cours</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{track.title}</h3>
              <p className="mt-2 text-slate-200">{track.prompt}</p>

              <div className="mt-6 space-y-3">
                {track.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOption(option.id)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                      selectedOption === option.id
                        ? option.status === "success"
                          ? "border-emerald-400 bg-emerald-400/20 text-emerald-100"
                          : option.status === "warning"
                            ? "border-amber-400 bg-amber-400/20 text-amber-100"
                            : "border-rose-500 bg-rose-500/20 text-rose-100"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                    )}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-white/80">{option.result}</p>
                  </button>
                ))}
              </div>

              {selectedOption && (
                <div
                  className={cn(
                    "mt-4 rounded-2xl border p-4 text-sm",
                    currentOption?.status === "success"
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-100"
                      : currentOption?.status === "warning"
                        ? "border-amber-400 bg-amber-400/10 text-amber-100"
                        : "border-rose-500 bg-rose-500/10 text-rose-100",
                  )}
                >
                  {currentOption?.status === "success" ? track.tip : "Reprenez le référentiel PulseEPI pour corriger la décision."}
                </div>
              )}
            </article>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Innovation EPI</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {innovationIdeas.map((idea) => (
              <div key={idea.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold text-white">{idea.title}</p>
                <p className="mt-2 text-sm text-slate-300">{idea.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Contrôle qualité</p>
                <h2 className="mt-2 text-3xl font-semibold">Checklist digitale</h2>
                <p className="mt-2 max-w-2xl text-slate-300">Cette séquence assure la traçabilité réglementaire et la bonne rotation des équipements.</p>
              </div>
              <Button variant="secondary" asChild>
                <Link to="/onboarding/protocoles">Consulter le référentiel</Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {controlChecklist.map((step) => (
                <div key={step.stage} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">{step.stage}</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {step.checklist.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
