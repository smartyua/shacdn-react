import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { COMPONENT_CATALOG, INTERNAL_DEPS, NPM_DEPENDENCIES, getComponentMeta, type ComponentMeta } from '../catalog.js';
import { consumerImportPath } from './paths.js';
import { resolveDependencyTree } from './deps.js';

/** Components meant for consumer apps (demo chrome excluded), sorted by name. */
const publicComponents = (): ComponentMeta[] =>
  COMPONENT_CATALOG.filter(entry => !entry.demoOnly).sort((a, b) => a.name.localeCompare(b.name));

const providersFor = (name: string): string[] => [
  ...new Set(
    resolveDependencyTree([name])
      .map(dep => getComponentMeta(dep)?.requiresProvider)
      .filter((provider): provider is string => Boolean(provider))
  ),
];

export const installCommand = (components: string[]): string =>
  components.length > 0
    ? `npm run shacdn:install -- /path/to/your-app --components ${components.join(',')}`
    : 'npm run shacdn:install -- /path/to/your-app';

const HEADER = `# shacdn

> shacdn is a React 19 + TypeScript implementation of shadcn/ui built on SCSS modules: no Tailwind, no Radix, no external UI libraries. Components are copied into your project (you own the source), share one token file (\`src/styles/variables.scss\`), and support light/dark themes with six color schemes.`;

const INSTALL = `## Install

From the shacdn repo, copy the design system and any components (internal dependencies are resolved for you):

\`\`\`bash
${installCommand([])}
${installCommand(['Button', 'Card', 'Input'])}
\`\`\`

Required npm packages: ${NPM_DEPENDENCIES.required.join(', ')}. Optional: ${NPM_DEPENDENCIES.optional.join(', ')}.
Import \`src/styles/theme-init\` and \`src/styles/globals.scss\` once in the app entry, then import each component from its folder (\`${consumerImportPath('Button')}\`).`;

const MCP = `## MCP server

Local stdio server (\`mcp/shacdn-server\`). Tools: list_components, search_components, get_component, get_component_bundle, get_install_command, get_design_system, get_integration_guide, install_to_project, list_screen_patterns, get_screen_pattern.`;

/** Short index: one line per component. Served as `/llms.txt`. */
export const buildLlmsTxt = (): string => {
  const lines = publicComponents().map(entry => {
    const alias = entry.aliasOf ? ` Alias of ${entry.aliasOf}.` : '';
    return `- ${entry.name}: ${entry.description}.${alias}`;
  });

  return `${HEADER}

This is the short index. More: [llms-full.txt](/llms-full.txt) (every component with exports, dependencies and usage), [catalog.json](/catalog.json) (machine-readable metadata).

${INSTALL}

${MCP}

## Components (${lines.length})

${lines.join('\n')}
`;
};

const componentSection = (entry: ComponentMeta): string => {
  const deps = INTERNAL_DEPS[entry.folder] ?? [];
  const providers = providersFor(entry.name);
  const primary = entry.exports[0] ?? entry.name;

  return [
    `### ${entry.name}`,
    '',
    `${entry.description}.`,
    '',
    `- Use for: ${entry.tasks.join(', ')}`,
    `- Exports: ${entry.exports.map(name => `\`${name}\``).join(', ')}`,
    `- Folder: \`src/components/${entry.folder}/\``,
    deps.length > 0 ? `- Depends on: ${deps.join(', ')}` : '- Depends on: nothing else in shacdn',
    providers.length > 0 ? `- Requires provider: ${providers.join(', ')}` : null,
    entry.aliasOf ? `- Alias of: ${entry.aliasOf}` : null,
    `- Install: \`${installCommand([entry.name])}\``,
    '',
    '```tsx',
    `import { ${primary} } from '${consumerImportPath(entry.folder)}';`,
    '```',
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
};

/** Whole library in one file for a single context load. Served as `/llms-full.txt`. */
export const buildLlmsFullTxt = (): string => `${HEADER}

${INSTALL}

${MCP}

## Rules for agents

- Use tokens from \`variables.scss\` (\`$primary\`, \`$border\`, \`$control-h-md\`, …); never hardcode colors.
- \`--border\` and \`--input\` carry alpha in dark mode: use \`alpha($border, 50%)\`, not \`hsl(var(--border) / 0.5)\`.
- Components use relative imports only; keep the folder layout \`components/Name/Name.tsx\`.
- Arrow functions, \`forwardRef\`, \`displayName\`, and correct ARIA roles are part of every component.

## Components

${publicComponents().map(componentSection).join('\n\n')}
`;

export interface CatalogJsonEntry {
  name: string;
  folder: string;
  description: string;
  tasks: string[];
  exports: string[];
  dependencies: string[];
  providers: string[];
  aliasOf?: string;
  install: string;
}

export const buildCatalogJson = (): { name: string; components: CatalogJsonEntry[] } => ({
  name: 'shacdn',
  components: publicComponents().map(entry => ({
    name: entry.name,
    folder: entry.folder,
    description: entry.description,
    tasks: entry.tasks,
    exports: entry.exports,
    dependencies: INTERNAL_DEPS[entry.folder] ?? [],
    providers: providersFor(entry.name),
    ...(entry.aliasOf ? { aliasOf: entry.aliasOf } : {}),
    install: installCommand([entry.name]),
  })),
});

export const LLMS_FILES = {
  'llms.txt': buildLlmsTxt,
  'llms-full.txt': buildLlmsFullTxt,
  'catalog.json': () => `${JSON.stringify(buildCatalogJson(), null, 2)}\n`,
} as const;

/** Write the agent-readable files into `publicDir` (the Vite `public/` folder). */
export const writeLlmsFiles = (publicDir: string): string[] => {
  mkdirSync(publicDir, { recursive: true });
  return Object.entries(LLMS_FILES).map(([file, build]) => {
    const target = join(publicDir, file);
    writeFileSync(target, build(), 'utf8');
    return target;
  });
};
