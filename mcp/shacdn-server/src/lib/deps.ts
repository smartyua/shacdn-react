import { INTERNAL_DEPS } from '../catalog.js';

export const resolveDependencyTree = (componentNames: string[]): string[] => {
  const visited = new Set<string>();
  const queue = [...componentNames];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const deps = INTERNAL_DEPS[current] ?? [];
    for (const dep of deps) {
      if (!visited.has(dep)) queue.push(dep);
    }
  }

  // Topological-ish order: deps first
  const ordered: string[] = [];
  const added = new Set<string>();

  const addWithDeps = (name: string): void => {
    if (added.has(name)) return;
    for (const dep of INTERNAL_DEPS[name] ?? []) {
      addWithDeps(dep);
    }
    if (!added.has(name)) {
      ordered.push(name);
      added.add(name);
    }
  };

  for (const name of visited) {
    addWithDeps(name);
  }

  return ordered;
};

export const getProvidersForComponents = (componentNames: string[]): string[] => {
  const providers: string[] = [];
  if (componentNames.some((n) => n === 'Toast' || n === 'useToast')) {
    providers.push('ToastProvider — wrap app root; import from Toast/Toast');
  }
  if (componentNames.some((n) => n === 'Tooltip')) {
    providers.push('TooltipProvider — wrap tree above first Tooltip');
  }
  return providers;
};
