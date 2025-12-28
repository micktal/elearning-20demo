import { Link, useNavigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryHeader } from "@/components/layout/PrimaryHeader";

const protocols = [
  {
    title: "Accès & badges",
    rules: [
      "Badge nominatif obligatoire",
      "Aucun prêt de badge",
      "Visiteur toujours accompagné",
    ],
    contact: "PC Sécurité",
  },
  {
    title: "Sécurité numérique",
    rules: [
      "Verrouiller son poste",
      "Ne jamais cliquer sur un lien suspect",
      "Signaler immédiatement",
    ],
    contact: "SecOps",
  },
  {
    title: "Visiteurs & partenaires",
    rules: [
      "Badge invité visible",
      "Brief sécurité obligatoire",
      "Traçabilité des passages",
    ],
    contact: "Accueil / Sûreté",
  },
];

export default function OnboardingProtocols() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PrimaryHeader theme="dark" />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-10">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Module · Codes & consignes</p>

          <h1 className="mt-4 text-4xl font-semibold">Connaître et appliquer les règles essentielles</h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Ces consignes sont obligatoires pour tous. Elles garantissent la sécurité des personnes, des données
            et des installations.
          </p>

          {/* VIDEO DE PRÉSENTATION */}
          <div className="mt-6">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
              <video
                controls
                src="https://cdn.builder.io/o/assets%2Fd93d9a0ec7824aa1ac4d890a1f90a2ec%2Fa23d3bdd92ff477885ae1cc5d6298281?alt=media&token=34f5d8fe-dc0e-42b2-b8ce-c9a96b31a72a&apiKey=d93d9a0ec7824aa1ac4d890a1f90a2ec"
                className="w-full h-auto max-h-[480px] object-cover"
              />
            </div>
          </div>

          {protocols.map((protocol) => (
            <div key={protocol.title} className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">{protocol.title}</h2>

              <ul className="mt-3 list-inside list-disc space-y-2 text-slate-200">
                {protocol.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>

              <p className="mt-3 text-sm text-slate-400">Contact référent : <strong>{protocol.contact}</strong></p>
            </div>
          ))}

          <div className="mt-12 flex flex-wrap gap-4">
            <Button size="lg" onClick={() => navigate("/onboarding/protocoles/badge")}>Passer à la mise en situation</Button>

            <Button variant="ghost" size="lg" asChild>
              <Link to="/onboarding/intro">← Module précédent</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
