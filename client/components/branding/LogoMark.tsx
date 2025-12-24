import React from "react";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  tone?: "light" | "dark";
};

export function LogoMark({ tone = "dark" }: LogoMarkProps) {
  const primaryText = tone === "dark" ? "text-white" : "text-slate-900";
  const secondaryText = tone === "dark" ? "text-slate-400" : "text-slate-500";

  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-base font-semibold text-white shadow-lg shadow-cyan-500/40 flex items-center justify-center">
        HN
      </div>
      <div>
        <p className={cn("text-xs uppercase tracking-[0.35em]", secondaryText)}>HelioNova</p>
        <p className={cn("text-lg font-semibold leading-tight", primaryText)}>Pulse Onboarding</p>
      </div>
    </div>
  );
}
