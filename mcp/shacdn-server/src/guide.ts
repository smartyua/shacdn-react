import {
  COMPONENT_CATALOG,
  NPM_DEPENDENCIES,
  SCREEN_PATTERNS,
  getComponentMeta,
  searchCatalog,
} from './catalog.js';
import { consumerCopyPaths, consumerImportPath } from './lib/paths.js';
import { getProvidersForComponents, resolveDependencyTree } from './lib/deps.js';
import { listComponentFolders, readComponentFiles, readDesignSystemFile, readScreenPattern } from './lib/fs.js';

export const buildIntegrationGuide = (options?: {
  components?: string[];
  targetFramework?: string;
}): string => {
  const components = options?.components ?? ['Button', 'Card', 'Input', 'Label'];
  const tree = resolveDependencyTree(components);
  const providers = getProvidersForComponents(tree);

  return `# shacdn Integration Guide

## Stack
- React 19 + TypeScript (strict)
- SCSS Modules — **no Tailwind**
- Design tokens via \`src/styles/variables.scss\` + CSS variables in \`globals.scss\`

## 1. Install dependencies

\`\`\`bash
npm install sass${NPM_DEPENDENCIES.optional.includes('lucide-react') ? ' lucide-react' : ''}
\`\`\`

Required: \`${NPM_DEPENDENCIES.required.join('`, `')}\`
Optional: \`${NPM_DEPENDENCIES.optional.join('`, `')}\` — ${NPM_DEPENDENCIES.note}

## 2. Copy design system first (order matters)

1. \`src/styles/variables.scss\`
2. \`src/styles/globals.scss\`

Import in entry (\`main.tsx\` or \`App.tsx\`):

\`\`\`tsx
import './styles/globals.scss';
\`\`\`

## 3. Copy components (with dependencies)

Requested: **${components.join(', ')}**

Full dependency tree (copy in this order):

${tree.map((n, i) => `${i + 1}. \`${consumerCopyPaths(n).tsx}\` + \`${consumerCopyPaths(n).scss}\``).join('\n')}

## 4. Import pattern

\`\`\`tsx
import { Button } from '${consumerImportPath('Button')}';
import { Card, CardHeader, CardTitle, CardContent } from '${consumerImportPath('Card')}';
\`\`\`

**No barrel exports** — import directly from component folder.

## 5. Providers (if needed)

${providers.length > 0 ? providers.map((p) => `- ${p}`).join('\n') : '- None for selected components'}

Example:

\`\`\`tsx
import { ToastProvider } from './components/Toast/Toast';
import { TooltipProvider } from './components/Tooltip/Tooltip';

<ToastProvider>
  <TooltipProvider>
    <App />
  </TooltipProvider>
</ToastProvider>
\`\`\`

## 6. Theming

Set on \`<html>\`:

\`\`\`ts
document.documentElement.setAttribute('data-theme', 'light'); // or 'dark', 'light blue', etc.
\`\`\`

Schemes: default, blue, green, purple, orange, rose.

## 7. SCSS in consumer project

Each \`*.module.scss\` uses:

\`\`\`scss
@use '../../styles/variables.scss' as *;
\`\`\`

Adjust relative path if your folder depth differs.

## 8. Verify

\`\`\`bash
npm run lint
npm run build
\`\`\`

## Docs in shacdn repo
- \`docs/AI_AGENT_GUIDE.md\` — full migration guide
- \`docs/STYLE_GUIDE.md\` — tokens & patterns
- \`docs/COMPONENTS_AI_REFERENCE.md\` — task → component matrix
`;
};

export const formatComponentList = (): string => {
  const folders = listComponentFolders();
  const lines = COMPONENT_CATALOG.map((c) => {
    const inRepo = folders.includes(c.folder) ? '✓' : '✗';
    const alias = c.aliasOf ? ` (alias → ${c.aliasOf})` : '';
    const provider = c.requiresProvider ? ` [needs ${c.requiresProvider}]` : '';
    return `- ${inRepo} **${c.name}**${alias}${provider}: ${c.description}`;
  });
  return `# shacdn Components (${COMPONENT_CATALOG.length})\n\n${lines.join('\n')}`;
};

export const formatSearchResults = (query: string): string => {
  const results = searchCatalog(query);
  if (results.length === 0) return `No components found for "${query}"`;

  return results
    .map(
      (c) =>
        `## ${c.name}\n- Folder: \`src/components/${c.folder}/\`\n- ${c.description}\n- Tasks: ${c.tasks.join(', ')}\n- Exports: ${c.exports.join(', ')}`,
    )
    .join('\n\n');
};

export const formatComponentBundle = (names: string[]): string => {
  const tree = resolveDependencyTree(names);
  const sections: string[] = [`# Component bundle\n\nCopy order: ${tree.join(' → ')}\n`];

  for (const name of tree) {
    const meta = getComponentMeta(name);
    const files = readComponentFiles(name);
    if (!files) {
      sections.push(`## ${name}\n\n⚠️ Not found in repo\n`);
      continue;
    }

    sections.push(`## ${name}${meta?.aliasOf ? ` (alias of ${meta.aliasOf})` : ''}`);
    sections.push(`\n### ${files.tsxPath}\n\`\`\`tsx\n${files.tsx}\n\`\`\``);
    if (files.scss) {
      sections.push(`\n### ${files.scssPath}\n\`\`\`scss\n${files.scss}\n\`\`\``);
    }
  }

  const providers = getProvidersForComponents(tree);
  if (providers.length > 0) {
    sections.push(`\n## Required providers\n${providers.map((p) => `- ${p}`).join('\n')}`);
  }

  return sections.join('\n');
};

export const formatScreenPattern = (patternId: string): string => {
  const pattern = SCREEN_PATTERNS.find((p) => p.id === patternId || p.name.toLowerCase() === patternId.toLowerCase());
  if (!pattern) {
    return `Unknown pattern. Available: ${SCREEN_PATTERNS.map((p) => p.id).join(', ')}`;
  }

  const files = readScreenPattern(pattern.path);
  const bundle = formatComponentBundle(pattern.components);

  return `# Screen pattern: ${pattern.name}

${pattern.description}

Path: \`${pattern.path}\`
Uses components: ${pattern.components.join(', ')}

${Object.entries(files)
  .map(([path, content]) => `## ${path}\n\`\`\`\n${content}\n\`\`\``)
  .join('\n\n')}

---

# Required component files

${bundle}`;
};

export { SCREEN_PATTERNS, NPM_DEPENDENCIES, readDesignSystemFile };
