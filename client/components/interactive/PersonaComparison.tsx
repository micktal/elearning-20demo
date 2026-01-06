import { useState } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type Persona = {
  id: string;
  label: string;
  role: string;
  recommendedAction: string;
  rationale: string;
};

export type PersonaComparisonProps = {
  title?: string;
  intro?: string;
  personas: Persona[];
};

export function PersonaComparison({ title, intro, personas }: PersonaComparisonProps) {
  const [activePersona, setActivePersona] = useState(personas[0]?.id ?? "");
  const currentPersona = personas.find((persona) => persona.id === activePersona) ?? personas[0];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      {title && <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">{title}</p>}
      {intro && <p className="mt-2 text-sm text-slate-300">{intro}</p>}
      <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-3">
          {personas.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => setActivePersona(persona.id)}
              className={cn(
                "w-full rounded-2xl border border-white/10 px-4 py-3 text-left text-sm transition",
                activePersona === persona.id
                  ? "border-indigo-400 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white"
                  : "bg-slate-900/50 text-slate-300 hover:bg-white/10",
              )}
            >
              <p className="text-xs uppercase tracking-[0.4em]">Persona</p>
              <p className="text-base font-semibold">{persona.label}</p>
              <p className="text-xs text-slate-400">{persona.role}</p>
            </button>
          ))}
        </div>
        {currentPersona && (
          <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Action recommandée</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{currentPersona.recommendedAction}</h3>
            <p className="mt-3 text-sm text-slate-200">{currentPersona.rationale}</p>
          </article>
        )}
      </div>
    </div>
  );
}
