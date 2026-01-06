import { useState } from "react";
import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

export type ClassificationItem = {
  id: string;
  label: string;
  detail?: string;
};

export type ClassificationBoardProps = {
  title?: string;
  prompt?: string;
  categories: { id: string; label: string }[];
  items: ClassificationItem[];
};

export function ClassificationBoard({ title, prompt, categories, items }: ClassificationBoardProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const handleAssign = (itemId: string, categoryId: string) => {
    setAssignments((prev) => ({ ...prev, [itemId]: prev[itemId] === categoryId ? "" : categoryId }));
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      {title && <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">{title}</p>}
      {prompt && <p className="mt-2 text-sm text-slate-300">{prompt}</p>}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-sm font-semibold text-white">{category.label}</p>
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <button
                  key={`${category.id}-${item.id}`}
                  type="button"
                  onClick={() => handleAssign(item.id, category.id)}
                  className={cn(
                    "block w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm transition",
                    assignments[item.id] === category.id && "border-emerald-400 bg-emerald-500/10 text-emerald-100",
                  )}
                >
                  <p className="font-semibold">{item.label}</p>
                  {item.detail && <p className="text-xs text-slate-400">{item.detail}</p>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
