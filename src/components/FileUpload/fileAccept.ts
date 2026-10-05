export const fileMatchesAccept = (file: File, accept?: string): boolean => {
  if (!accept || accept.trim() === '' || accept.trim() === '*') return true;
  const rules = accept
    .split(',')
    .map(rule => rule.trim().toLowerCase())
    .filter(rule => rule.length > 0);
  if (rules.length === 0) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return rules.some(rule => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
};

export const takeFiles = (files: File[], accept: string | undefined, maxFiles: number): File[] => {
  const allowed = files.filter(file => fileMatchesAccept(file, accept));
  if (!Number.isFinite(maxFiles) || maxFiles < 0) return allowed;
  return allowed.slice(0, maxFiles);
};
