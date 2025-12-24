import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { LogoMark } from "@/components/branding/LogoMark";
import { Button } from "@/components/ui/button";
import { type ModuleKey } from "@/lib/moduleProgress";
import { useModuleProgress } from "@/providers/ModuleProgressProvider";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Introduction", href: "/onboarding/intro", moduleId: "intro" as ModuleKey },
  { label: "Consignes", href: "/onboarding/protocoles", moduleId: "protocoles" as ModuleKey },
  { label: "Simulations", href: "/onboarding/simulations", moduleId: "simulations" as ModuleKey },
  { label: "Conflits", href: "/onboarding/conflits", moduleId: "conflits" as ModuleKey },
  { label: "Incendie", href: "/onboarding/incendie", moduleId: "incendie" as ModuleKey },
  { label: "EPI", href: "/onboarding/epi", moduleId: "epi" as ModuleKey },
  { label: "Éthique", href: "/onboarding/ethique", moduleId: "ethique" as ModuleKey },
];

type PrimaryHeaderProps = {
  theme?: "light" | "dark";
};

export function PrimaryHeader({ theme = "dark" }: PrimaryHeaderProps) {
  const isDark = theme === "dark";
  const baseText = isDark ? "text-slate-200" : "text-slate-600";
  const hoverText = isDark ? "hover:text-white" : "hover:text-slate-900";
  const { initialized, isModuleUnlocked } = useModuleProgress();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full backdrop-blur-xl border-b border-white/5",
        isDark ? "bg-slate-950/60" : "bg-white/80",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" aria-label="HelioNova Accueil">
          <LogoMark tone={isDark ? "dark" : "light"} />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navItems.map((item) => {
            const unlocked = initialized ? isModuleUnlocked(item.moduleId) : item.moduleId === "intro";
            if (!unlocked) {
              return (
                <span key={item.label} className={cn("flex items-center gap-1 text-slate-500/70", baseText)}>
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  {item.label}
                </span>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn("transition-colors", baseText, hoverText)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant={isDark ? "secondary" : "ghost"} size="sm" asChild>
            <Link to="/onboarding/intro">Lancer le module</Link>
          </Button>
          <Button variant={isDark ? "default" : "default"} size="sm" asChild>
            <Link to="/">Portail HelioNova</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
