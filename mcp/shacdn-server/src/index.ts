#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { SCREEN_PATTERNS } from './catalog.js';
import {
  buildIntegrationGuide,
  formatComponentBundle,
  formatComponentList,
  formatScreenPattern,
  formatSearchResults,
  readDesignSystemFile,
} from './guide.js';
import { formatInstallResult, installToProject } from './lib/install.js';

const server = new McpServer({
  name: 'shacdn',
  version: '1.0.0',
});

server.tool(
  'list_components',
  'List all shacdn UI components (SCSS modules, shadcn/ui parity). Use before picking components for a consumer project.',
  {},
  async () => ({
    content: [{ type: 'text', text: formatComponentList() }],
  }),
);

server.tool(
  'search_components',
  'Search shacdn components by name, task, or use case (e.g. "modal", "form", "toast", "table").',
  {
    query: z.string().describe('Search query: component name, task, or keyword'),
  },
  async ({ query }) => ({
    content: [{ type: 'text', text: formatSearchResults(query) }],
  }),
);

server.tool(
  'get_component',
  'Get source files (TSX + SCSS module) for one shacdn component. Does not include transitive dependencies — use get_component_bundle for full copy set.',
  {
    name: z.string().describe('Component name, e.g. Button, Dialog, Toast'),
  },
  async ({ name }) => ({
    content: [{ type: 'text', text: formatComponentBundle([name]) }],
  }),
);

server.tool(
  'get_component_bundle',
  'Get component source files plus all internal shacdn dependencies in copy order. Use when integrating into another React project.',
  {
    components: z
      .array(z.string())
      .describe('Component names to include, e.g. ["DatePicker", "Card", "Button"]'),
  },
  async ({ components }) => ({
    content: [{ type: 'text', text: formatComponentBundle(components) }],
  }),
);

server.tool(
  'get_design_system',
  'Get design tokens (variables.scss) and/or theme globals (globals.scss). Copy these BEFORE components into consumer projects.',
  {
    files: z
      .enum(['variables', 'globals', 'theme', 'both'])
      .default('both')
      .describe('Which design system files to return'),
  },
  async ({ files }) => {
    const content = readDesignSystemFile(files);
    const sections = Object.entries(content).map(
      ([path, source]) => `## ${path}\n\`\`\`scss\n${source}\n\`\`\``,
    );
    return {
      content: [
        {
          type: 'text',
          text: `# shacdn Design System\n\nCopy the whole \`src/styles/\` folder first (or run \`install_to_project\`).\nImport \`theme-init\` then \`globals.scss\` in the app entry. Use \`variables.scss\` in every component module via \`@use '../../styles/variables.scss' as *;\`\n\n${sections.join('\n\n')}`,
        },
      ],
    };
  },
);

server.tool(
  'get_integration_guide',
  'Step-by-step guide to bootstrap shacdn in another React + Vite/SPA project: deps, copy order, imports, providers, theming.',
  {
    components: z
      .array(z.string())
      .optional()
      .describe('Components you plan to use; defaults to Button, Card, Input, Label'),
  },
  async ({ components }) => ({
    content: [{ type: 'text', text: buildIntegrationGuide({ components }) }],
  }),
);

server.tool(
  'install_to_project',
  'Write shacdn design tokens (style guide) and optional components into another project folder. Prefer this over manually copying get_design_system output. Does not overwrite existing files unless force is true.',
  {
    targetDir: z
      .string()
      .describe('Absolute or relative path to the consumer project root (must exist)'),
    components: z
      .array(z.string())
      .optional()
      .describe('Components to copy in addition to the design system. Omit for styles/tokens only.'),
    force: z
      .boolean()
      .optional()
      .default(false)
      .describe('Overwrite existing files that differ'),
    dryRun: z
      .boolean()
      .optional()
      .default(false)
      .describe('List files that would be written without writing'),
    srcDir: z
      .string()
      .optional()
      .default('src')
      .describe('Source directory inside the target project (default: src)'),
  },
  async ({ targetDir, components, force, dryRun, srcDir }) => {
    try {
      const result = installToProject({ targetDir, components, force, dryRun, srcDir });
      return { content: [{ type: 'text', text: formatInstallResult(result) }] };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { content: [{ type: 'text', text: `Install failed: ${message}` }], isError: true };
    }
  },
);

server.tool(
  'get_screen_pattern',
  'Get a full screen composition example (landing, showcase) with required component bundle. Patterns: sessy-landing, shadcn-home.',
  {
    pattern: z
      .string()
      .describe('Pattern id: sessy-landing | shadcn-home'),
  },
  async ({ pattern }) => ({
    content: [{ type: 'text', text: formatScreenPattern(pattern) }],
  }),
);

server.tool(
  'list_screen_patterns',
  'List available screen/layout patterns that demonstrate shacdn composition.',
  {},
  async () => ({
    content: [
      {
        type: 'text',
        text: SCREEN_PATTERNS.map(
          (p) =>
            `- **${p.id}** (${p.name}): ${p.description}\n  Path: \`${p.path}\`\n  Components: ${p.components.join(', ')}`,
        ).join('\n\n'),
      },
    ],
  }),
);

const main = async (): Promise<void> => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch((err: unknown) => {
  console.error('shacdn MCP server failed:', err);
  process.exit(1);
});
