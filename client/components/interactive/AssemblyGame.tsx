import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type AssemblyCard = {
  id: string;
  title: string;
  description?: string;
  category?: string;
};

export type AssemblyGameProps = {
  title?: string;
  prompt?: string;
  cards: AssemblyCard[];
  targetIds: string[];
  maxSelection?: number;
  successCopy?: string;
  accent?: "cyan" | "amber" | "indigo";
};

const accentMap: Record<NonNullable<AssemblyGameProps["accent"]>, string> = {
  cyan: "bg-cyan-500/20 text-cyan-100 border-cyan-500/40",
  amber: "bg-amber-500/20 text-amber-100 border-amber-500/40",
  indigo: "bg-indigo-500/20 text-indigo-100 border-indigo-500/40",
};

export function AssemblyGame({
  title,
  prompt,
  cards,
  targetIds,
  maxSelection = targetIds.length,
  successCopy = "Assemblage validé",
  accent = "cyan",
}: AssemblyGameProps) {
  const [selection, setSelection] = useState<string[]>([]);
  const selectedAll = useMemo(
    () =>
      selection.length === targetIds.length &&
      targetIds.every((id) => selection.includes(id)),
    [selection, targetIds],
  );

  const toggleCard = (id: string) => {
    setSelection((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= maxSelection) return prev;
      return [...prev, id];
    });
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      {title && (
        <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">
          {title}
        </p>
      )}
      {prompt && <p className="mt-2 text-sm text-slate-300">{prompt}</p>}
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const selected = selection.includes(card.id);
          const required = targetIds.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => toggleCard(card.id)}
              className={cn(
                "rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left text-sm transition",
                selected && accentMap[accent],
                selected && !required && "border-rose-500/50 text-rose-100",
              )}
            >
              <p className="text-base font-semibold text-white">{card.title}</p>
              {card.description && (
                <p className="text-slate-300">{card.description}</p>
              )}
              {card.category && (
                <p className="mt-1 text-xs text-slate-500">{card.category}</p>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full border border-white/10 px-4 py-1 text-slate-300">
          {selection.length}/{maxSelection} éléments sélectionnés
        </span>
        <Button size="sm" variant="ghost" onClick={() => setSelection([])}>
          Réinitialiser
        </Button>
        {selectedAll && (
          <span
            className={cn(
              "rounded-full border px-4 py-1 text-xs",
              accentMap[accent],
            )}
          >
            {successCopy}
          </span>
        )}
      </div>
    </div>
  );
}
