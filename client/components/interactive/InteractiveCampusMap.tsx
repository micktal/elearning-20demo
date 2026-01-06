import { useState } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type CampusZone = {
  id: string;
  label: string;
  description: string;
  access: string;
  icon?: string;
};

export type InteractiveCampusMapProps = {
  title?: string;
  intro?: string;
  zones: CampusZone[];
};

export function InteractiveCampusMap({ title, intro, zones }: InteractiveCampusMapProps) {
  const [activeZone, setActiveZone] = useState(zones[0]?.id ?? "");
  const currentZone = zones.find((zone) => zone.id === activeZone) ?? zones[0];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      {title && <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">{title}</p>}
      {intro && <p className="mt-2 text-sm text-slate-300">{intro}</p>}
      <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="grid grid-cols-2 gap-3">
          {zones.map((zone) => (
            <button
              key={zone.id}
              type="button"
              onClick={() => setActiveZone(zone.id)}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left text-sm transition",
                activeZone === zone.id
                  ? "border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-white"
                  : "border-white/10 bg-slate-900/40 text-slate-200 hover:bg-white/10",
              )}
            >
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Zone</p>
              <p className="text-base font-semibold">{zone.label}</p>
              <p className="text-xs text-slate-400">{zone.access}</p>
            </button>
          ))}
        </div>
        {currentZone && (
          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-200">Brief</p>
            <h3 className="mt-1 text-2xl font-semibold text-white">{currentZone.label}</h3>
            <p className="mt-3 text-sm text-slate-200">{currentZone.description}</p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
              Accès · {currentZone.access}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
