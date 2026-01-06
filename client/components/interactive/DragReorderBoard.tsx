import { useMemo, useState } from "react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type DragReorderItem = {
  id: string;
  label: string;
  detail?: string;
};

export type DragReorderBoardProps = {
  title?: string;
  description?: string;
  items: DragReorderItem[];
  correctOrder: string[];
  successCopy?: string;
  accent?: "cyan" | "amber" | "emerald";
};

const accentClasses: Record<NonNullable<DragReorderBoardProps["accent"]>, string> = {
  cyan: "border-cyan-400 bg-cyan-400/10",
  amber: "border-amber-400 bg-amber-400/10",
  emerald: "border-emerald-400 bg-emerald-400/10",
};

export function DragReorderBoard({
  title,
  description,
  items,
  correctOrder,
  successCopy = "Ordre validé",
  accent = "cyan",
}: DragReorderBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [order, setOrder] = useState<string[]>(() => shuffle(items));

  const orderedItems = useMemo(() => order.map((id) => items.find((item) => item.id === id)).filter(Boolean) as DragReorderItem[], [order, items]);

  const isSolved = useMemo(
    () =>
      correctOrder.length === order.length &&
      order.every((id, index) => id === correctOrder[index]),
    [order, correctOrder],
  );

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setOrder((prev) => {
      const next = [...prev];
      const fromIndex = next.indexOf(draggedId);
      const toIndex = next.indexOf(targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, draggedId);
      return next;
    });
    setDraggedId(null);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      {title && <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">{title}</p>}
      {description && <p className="mt-1 text-sm text-slate-300">{description}</p>}
      <div className="mt-4 space-y-3">
        {orderedItems.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDraggedId(item.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(item.id)}
            className={cn(
              "flex cursor-grab items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm transition",
              draggedId === item.id && "opacity-80",
            )}
          >
            <span className="mt-0.5 text-xs font-semibold text-cyan-200">{index + 1}</span>
            <div>
              <p className="font-semibold text-white">{item.label}</p>
              {item.detail && <p className="text-xs text-slate-300">{item.detail}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => setOrder(shuffle(items))}
          className="rounded-full border border-white/10 px-4 py-1 text-slate-200 hover:border-cyan-400/60"
        >
          Réinitialiser l'ordre
        </button>
        {isSolved && (
          <span className={cn("rounded-full px-4 py-1 text-xs font-semibold", accentClasses[accent])}>{successCopy}</span>
        )}
      </div>
    </div>
  );
}

function shuffle(items: DragReorderItem[]) {
  return [...items]
    .sort(() => Math.random() - 0.5)
    .map((item) => item.id);
}
