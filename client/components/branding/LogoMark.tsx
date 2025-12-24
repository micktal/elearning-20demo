import React from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  tone?: "light" | "dark";
};

export function LogoMark({ tone = "dark" }: LogoMarkProps) {
  const primaryText = tone === "dark" ? "text-white" : "text-slate-900";
  const secondaryText = tone === "dark" ? "text-slate-400" : "text-slate-500";
  const gradientId = useId();
  const glowId = `${gradientId}-glow`;

  return (
    <div className="flex items-center gap-4">
      <svg
        width={60}
        height={60}
        viewBox="0 0 60 60"
        role="img"
        aria-label="Logo HelioNova Pulse"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="45%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="60" height="60" rx="18" fill={`url(#${gradientId})`} filter={`url(#${glowId})`} />
        <path
          d="M16 18v24h6V33.5l10.5 8.5 11-9.2V42h6V18h-6L32.5 30 22 18z"
          fill="none"
          stroke="white"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M18 44c7 2.5 17 2.5 24 0" stroke="white" strokeOpacity={0.2} strokeWidth={2} strokeLinecap="round" />
      </svg>
      <div>
        <p className={cn("text-xs uppercase tracking-[0.35em]", secondaryText)}>HelioNova</p>
        <p className={cn("text-xl font-semibold leading-tight", primaryText)}>Pulse</p>
        <p className={cn("text-xs tracking-[0.4em]", secondaryText)}>Onboarding</p>
      </div>
    </div>
  );
}
