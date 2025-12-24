import React from "react";
import { Link } from "react-router-dom";
import { LogoMark } from "@/components/branding/LogoMark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Introduction", href: "/onboarding/intro" },
  { label: "Consignes", href: "/onboarding/protocoles" },
  { label: "Simulations", href: "/onboarding/simulations" },
  { label: "Conflits", href: "/onboarding/conflits" },
  { label: "Incendie", href: "/onboarding/incendie" },
  { label: "EPI", href: "/onboarding/epi" },
  { label: "Éthique", href: "/onboarding/ethique" },
];

type PrimaryHeaderProps = {
  theme?: "light" | "dark";
};

export function PrimaryHeader({ theme = "dark" }: PrimaryHeaderProps) {
  const isDark = theme === "dark";
  const baseText = isDark ? "text-slate-200" : "text-slate-600";
  const hoverText = isDark ? "hover:text-white" : "hover:text-slate-900";

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
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn("transition-colors", baseText, hoverText)}
            >
              {item.label}
            </Link>
          ))}
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
