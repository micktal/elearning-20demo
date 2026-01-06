import { useMemo, useState } from "react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type AnomalyPoint = {
  id: string;
  label: string;
  description: string;
  position: { top: string; left: string };
};

export type AnomalySpotterProps = {
  imageUrl: string;
  title?: string;
  intro?: string;
  points: AnomalyPoint[];
};

export function AnomalySpotter({ imageUrl, title, intro, points }: AnomalySpotterProps) {
  const [found, setFound] = useState<Record<string, boolean>>({});
  const completed = useMemo(() => points.every((point) => found[point.id]), [points, found]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      {title && <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">{title}</p>}
      {intro && <p className="mt-2 text-sm text-slate-300">{intro}</p>}
      <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40">
          <img src={imageUrl} alt="Scène à analyser" className="h-full w-full object-cover" loading="lazy" />
          {points.map((point) => (
            <button
              key={point.id}
              type="button"
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1 text-xs font-semibold",
                found[point.id]
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                  : "border-white/60 bg-slate-900/80 text-white/80 hover:border-cyan-400",
              )}
              style={point.position}
              onClick={() => setFound((prev) => ({ ...prev, [point.id]: true }))}
            >
              {found[point.id] ? "✔" : "?"}
            </button>
          ))}
          {completed && (
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-emerald-400/60 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              Toutes les anomalies ont été repérées.
            </div>
          )}
        </div>
        <div className="space-y-3">
          {points.map((point) => (
            <div
              key={point.id}
              className={cn(
                "rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm",
                found[point.id] && "border-emerald-400 text-emerald-100",
              )}
            >
              <p className="font-semibold text-white">{point.label}</p>
              <p className="text-slate-300">{point.description}</p>
              <p className="mt-1 text-xs text-slate-500">Cliquez sur la scène pour signaler.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
