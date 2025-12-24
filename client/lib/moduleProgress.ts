export const moduleSequence = [
  { id: "intro", label: "Introduction", path: "/onboarding/intro" },
  { id: "protocoles", label: "Consignes", path: "/onboarding/protocoles" },
  { id: "simulations", label: "Simulations", path: "/onboarding/simulations" },
  { id: "conflits", label: "Gestion des conflits", path: "/onboarding/conflits" },
  { id: "incendie", label: "Sécurité incendie", path: "/onboarding/incendie" },
  { id: "epi", label: "Port des EPI", path: "/onboarding/epi" },
  { id: "ethique", label: "Gouvernance éthique", path: "/onboarding/ethique" },
] as const;

export type ModuleKey = (typeof moduleSequence)[number]["id"];

const moduleIndexMap = new Map<ModuleKey, number>(moduleSequence.map((module, index) => [module.id, index]));

export function getModuleMeta(moduleId: ModuleKey) {
  return moduleSequence[moduleIndexMap.get(moduleId) ?? 0];
}

export function getPreviousModule(moduleId: ModuleKey) {
  const index = moduleIndexMap.get(moduleId) ?? 0;
  if (index <= 0) return undefined;
  return moduleSequence[index - 1];
}

export function getNextModule(moduleId: ModuleKey) {
  const index = moduleIndexMap.get(moduleId) ?? 0;
  if (index >= moduleSequence.length - 1) return undefined;
  return moduleSequence[index + 1];
}
