import { useId } from "react";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  tone?: "light" | "dark";
};

export function LogoMark({ tone = "dark" }: LogoMarkProps) {
  const gradientId = useId();
  const auroraId = `${gradientId}-aurora`;
  const orbitId = `${gradientId}-orbit`;
  const glowId = `${gradientId}-glow`;
  const pulseId = `${gradientId}-pulse`;

  const primaryText = tone === "dark" ? "text-white" : "text-slate-900";
  const secondaryText = tone === "dark" ? "text-slate-400" : "text-slate-600";
  const accentText = tone === "dark" ? "text-cyan-200" : "text-cyan-600";

  return (
    <div className="flex items-center gap-4">
      <svg
        width={72}
        height={72}
        viewBox="0 0 72 72"
        role="img"
        aria-label="Logo HelioNova Pulse"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="55%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <radialGradient id={auroraId} cx="30%" cy="25%" r="80%">
            <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={orbitId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="45%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id={pulseId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bef264" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#${glowId})`}>
          <rect width="72" height="72" rx="22" fill="#020617" />
          <rect width="72" height="72" rx="22" fill={`url(#${gradientId})`} fillOpacity={0.25} />
          <rect width="72" height="72" rx="22" fill={`url(#${auroraId})`} />
          <rect
            x="8"
            y="8"
            width="56"
            height="56"
            rx="18"
            fill="#020b1f"
            stroke={`url(#${gradientId})`}
            strokeOpacity={0.35}
          />
          <circle cx="36" cy="36" r="20" stroke={`url(#${orbitId})`} strokeWidth="1.6" fill="none" opacity="0.65" />
          <circle cx="36" cy="36" r="12" stroke={`url(#${gradientId})`} strokeWidth="1.2" strokeDasharray="6 4" opacity="0.8" fill="none" />
          <path
            d="M18 38h6l4-11 6 18 4-10 4 8h12"
            fill="none"
            stroke={`url(#${pulseId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 30c4-6 11-10 18-10 10 0 18 8 18 18 0 3-0.7 6-2 8"
            fill="none"
            stroke={`url(#${orbitId})`}
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="51" cy="42" r="3" fill="#38bdf8" />
          <circle cx="25" cy="22" r="2" fill="#facc15" />
          <circle cx="33" cy="51" r="1.8" fill="#a855f7" />
        </g>
      </svg>

      <div className="space-y-1">
        <p className={cn("text-xs uppercase tracking-[0.4em]", secondaryText)}>HelioNova</p>
        <div className="flex items-baseline gap-2">
          <p className={cn("text-2xl font-semibold leading-none", primaryText)}>Pulse</p>
          <span className={cn("text-sm font-medium tracking-[0.4em]", accentText)}>2030</span>
        </div>
        <p className={cn("text-[11px] uppercase tracking-[0.3em]", secondaryText)}>Immersion &amp; Sécurité</p>
      </div>
    </div>
  );
}
