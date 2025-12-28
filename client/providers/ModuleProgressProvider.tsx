import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getPreviousModule, moduleSequence, type ModuleKey } from "@/lib/moduleProgress";

const STORAGE_KEY = "helionova-module-progress";

type ModuleStatus = {
  completed: boolean;
  score: number;
  completedAt?: string;
};

type ModuleProgressContextValue = {
  statuses: Record<ModuleKey, ModuleStatus>;
  initialized: boolean;
  markModuleComplete: (moduleId: ModuleKey, score: number) => void;
  isModuleCompleted: (moduleId: ModuleKey) => boolean;
  isModuleUnlocked: (moduleId: ModuleKey) => boolean;
  getModuleScore: (moduleId: ModuleKey) => number;
};

const defaultStatuses = moduleSequence.reduce<Record<ModuleKey, ModuleStatus>>((acc, module) => {
  acc[module.id] = { completed: false, score: 0 };
  return acc;
}, {} as Record<ModuleKey, ModuleStatus>);

const ModuleProgressContext = createContext<ModuleProgressContextValue | null>(null);

export function ModuleProgressProvider({ children }: { children: React.ReactNode }) {
  const [statuses, setStatuses] = useState(defaultStatuses);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<ModuleKey, ModuleStatus>;
        setStatuses({ ...defaultStatuses, ...parsed });
      } catch {
        setStatuses(defaultStatuses);
      }
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
  }, [statuses, initialized]);

  const markModuleComplete = useCallback((moduleId: ModuleKey, score: number) => {
    setStatuses((prev) => {
      const next = {
        ...prev,
        [moduleId]: {
          completed: true,
          score,
          completedAt: new Date().toISOString(),
        },
      };

      // persist immediately to localStorage to avoid navigation race conditions
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch (e) {
        // ignore localStorage errors silently
      }

      return next;
    });
  }, []);

  const isModuleCompleted = useCallback((moduleId: ModuleKey) => statuses[moduleId]?.completed ?? false, [statuses]);

  const isModuleUnlocked = useCallback(
    (moduleId: ModuleKey) => {
      const index = moduleSequence.findIndex((module) => module.id === moduleId);
      if (index === -1) return false;
      if (index === 0) return true;
      return moduleSequence.slice(0, index).every((module) => statuses[module.id]?.completed);
    },
    [statuses],
  );

  const getModuleScore = useCallback((moduleId: ModuleKey) => statuses[moduleId]?.score ?? 0, [statuses]);

  const value = useMemo<ModuleProgressContextValue>(
    () => ({ statuses, initialized, markModuleComplete, isModuleCompleted, isModuleUnlocked, getModuleScore }),
    [statuses, initialized, markModuleComplete, isModuleCompleted, isModuleUnlocked, getModuleScore],
  );

  return <ModuleProgressContext.Provider value={value}>{children}</ModuleProgressContext.Provider>;
}

export function useModuleProgress() {
  const context = useContext(ModuleProgressContext);
  if (!context) {
    throw new Error("useModuleProgress must be used within ModuleProgressProvider");
  }
  return context;
}

export function useModuleGuard(moduleId: ModuleKey) {
  const { initialized, isModuleUnlocked } = useModuleProgress();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    setLocked(!isModuleUnlocked(moduleId));
  }, [initialized, isModuleUnlocked, moduleId]);

  const previousModule = getPreviousModule(moduleId);

  return { locked, initialized, previousModule };
}
