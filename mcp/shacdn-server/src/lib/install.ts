import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { getComponentMeta } from '../catalog.js';
import { getProvidersForComponents, resolveDependencyTree } from './deps.js';
import { readComponentFiles, readDesignSystemFile } from './fs.js';
import { REPO_ROOT } from './paths.js';

const FORBIDDEN_PREFIXES = [
  '/etc',
  '/usr',
  '/bin',
  '/sbin',
  '/dev',
  '/proc',
  '/sys',
  '/System',
  '/Library',
  '/private/etc',
];

const ENTRY_CANDIDATES = [
  'src/main.tsx',
  'src/main.ts',
  'src/main.jsx',
  'src/index.tsx',
  'src/index.ts',
  'src/app/layout.tsx',
  'app/layout.tsx',
  'src/pages/_app.tsx',
  'pages/_app.tsx',
];

export interface InstallOptions {
  targetDir: string;
  components?: string[];
  force?: boolean;
  dryRun?: boolean;
  srcDir?: string;
}

export interface InstallResult {
  targetDir: string;
  written: string[];
  skipped: string[];
  warnings: string[];
  nextSteps: string[];
  dryRun: boolean;
}

const posix = (value: string): string => value.replace(/\\/g, '/');

const isForbiddenPath = (absPath: string): boolean => {
  const normalized = posix(absPath);
  if (normalized === '/' || /^[A-Za-z]:\/?$/.test(normalized)) {
    return true;
  }
  return FORBIDDEN_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
};

const resolveTargetDir = (input: string): string => {
  const resolved = resolve(input);
  if (!existsSync(resolved)) {
    throw new Error(`Target directory does not exist: ${resolved}`);
  }
  if (!statSync(resolved).isDirectory()) {
    throw new Error(`Target is not a directory: ${resolved}`);
  }

  const real = realpathSync(resolved);
  if (isForbiddenPath(real)) {
    throw new Error(`Refusing to write to system path: ${real}`);
  }

  return real;
};

const toTargetRelative = (targetDir: string, absPath: string): string =>
  posix(relative(targetDir, absPath));

const writeTextFile = (
  absPath: string,
  content: string,
  options: { force: boolean; dryRun: boolean; targetDir: string },
  result: InstallResult,
): void => {
  const rel = toTargetRelative(options.targetDir, absPath);

  if (existsSync(absPath) && !options.force) {
    const existing = readFileSync(absPath, 'utf-8');
    if (existing === content) {
      result.skipped.push(`${rel} (identical)`);
      return;
    }
    result.skipped.push(`${rel} (exists — pass force to overwrite)`);
    return;
  }

  if (options.dryRun) {
    result.written.push(`${rel} (dry-run)`);
    return;
  }

  mkdirSync(dirname(absPath), { recursive: true });
  writeFileSync(absPath, content, 'utf-8');
  result.written.push(rel);
};

const relativeImport = (fromFile: string, toFile: string): string => {
  let rel = posix(relative(dirname(fromFile), toFile));
  if (!rel.startsWith('.')) {
    rel = `./${rel}`;
  }
  return rel.replace(/\.ts$/, '');
};

const findEntryFile = (targetDir: string): string | null => {
  for (const candidate of ENTRY_CANDIDATES) {
    const abs = join(targetDir, candidate);
    if (existsSync(abs) && statSync(abs).isFile()) {
      return abs;
    }
  }
  return null;
};

const patchEntryImports = (
  targetDir: string,
  srcDir: string,
  options: { force: boolean; dryRun: boolean },
  result: InstallResult,
): void => {
  const entry = findEntryFile(targetDir);
  if (!entry) {
    result.warnings.push(
      `No entry file found (${ENTRY_CANDIDATES.slice(0, 4).join(', ')}, …). Add:\n  import './${srcDir}/styles/theme-init';\n  import './${srcDir}/styles/globals.scss';`,
    );
    return;
  }

  const themeInitAbs = join(targetDir, srcDir, 'styles/theme-init.ts');
  const globalsAbs = join(targetDir, srcDir, 'styles/globals.scss');
  const themeImport = `import '${relativeImport(entry, themeInitAbs)}';`;
  const globalsImport = `import '${relativeImport(entry, globalsAbs)}';`;

  const source = readFileSync(entry, 'utf-8');
  const hasGlobals = source.includes('globals.scss');
  const hasThemeInit = source.includes('theme-init');

  if (hasGlobals && hasThemeInit) {
    result.skipped.push(`${toTargetRelative(targetDir, entry)} (imports already present)`);
    return;
  }

  const lines: string[] = [];
  if (!hasThemeInit) lines.push(themeImport);
  if (!hasGlobals) lines.push(globalsImport);

  const patched = `${lines.join('\n')}\n${source}`;
  const rel = toTargetRelative(targetDir, entry);

  if (options.dryRun) {
    result.written.push(`${rel} (dry-run patch)`);
    return;
  }

  writeFileSync(entry, patched, 'utf-8');
  result.written.push(`${rel} (patched imports)`);
};

const readPackageJson = (targetDir: string): { dependencies?: Record<string, string>; devDependencies?: Record<string, string> } | null => {
  const pkgPath = join(targetDir, 'package.json');
  if (!existsSync(pkgPath)) return null;
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
  } catch {
    return null;
  }
};

const collectUnknownComponents = (names: string[]): string[] =>
  names.filter((name) => !getComponentMeta(name));

export const installToProject = (options: InstallOptions): InstallResult => {
  const targetDir = resolveTargetDir(options.targetDir);
  const srcDir = options.srcDir ?? 'src';
  const force = options.force ?? false;
  const dryRun = options.dryRun ?? false;
  const requested = options.components ?? [];

  const result: InstallResult = {
    targetDir,
    written: [],
    skipped: [],
    warnings: [],
    nextSteps: [],
    dryRun,
  };

  const repoReal = existsSync(REPO_ROOT) ? realpathSync(REPO_ROOT) : resolve(REPO_ROOT);
  if (targetDir === repoReal) {
    throw new Error('Refusing to install into the shacdn repository itself. Pass a consumer project folder.');
  }

  const writeOpts = { force, dryRun, targetDir };

  const designSystem = readDesignSystemFile('both');
  for (const [repoPath, content] of Object.entries(designSystem)) {
    const dest = join(targetDir, repoPath.replace(/^src\//, `${srcDir}/`));
    writeTextFile(dest, content, writeOpts, result);
  }

  const demo = requested.filter((name) => getComponentMeta(name)?.demoOnly);
  if (demo.length > 0) {
    result.warnings.push(
      `Demo-only (skip in consumer apps): ${demo.join(', ')}. Locale/SiteHeader belong to this repo's showcase.`,
    );
  }

  const unknown = collectUnknownComponents(requested);
  if (unknown.length > 0) {
    throw new Error(`Unknown component(s): ${unknown.join(', ')}`);
  }

  const tree = requested.length > 0 ? resolveDependencyTree(requested) : [];
  for (const name of tree) {
    const files = readComponentFiles(name);
    if (!files) {
      result.warnings.push(`Component not found in repo: ${name}`);
      continue;
    }

    const destTsx = join(targetDir, srcDir, 'components', name, `${name}.tsx`);
    writeTextFile(destTsx, files.tsx, writeOpts, result);

    if (files.scss) {
      const destScss = join(targetDir, srcDir, 'components', name, `${name}.module.scss`);
      writeTextFile(destScss, files.scss, writeOpts, result);
    }

    for (const extra of files.extras) {
      const fileName = extra.path.split('/').pop();
      if (!fileName) continue;
      const destExtra = join(targetDir, srcDir, 'components', name, fileName);
      writeTextFile(destExtra, extra.content, writeOpts, result);
    }
  }

  patchEntryImports(targetDir, srcDir, { force: true, dryRun }, result);

  const pkg = readPackageJson(targetDir);
  if (!pkg) {
    result.warnings.push('No package.json in target — could not check for `sass`.');
  } else {
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (!deps.sass) {
      result.warnings.push('Missing `sass`. Run: npm install -D sass');
    }
    if (tree.includes('Locale') && !deps['lucide-react']) {
      result.warnings.push('Locale uses lucide-react. Run: npm install lucide-react');
    }
  }

  const providers = getProvidersForComponents(tree);
  if (providers.length > 0) {
    result.nextSteps.push(`Wrap the app with: ${providers.join('; ')}`);
  }

  result.nextSteps.push(
    `Import tokens in SCSS modules: @use '${posix(join('..', '..', 'styles', 'variables.scss'))}' as *;`,
  );
  result.nextSteps.push('Set theme with document.documentElement.setAttribute("data-theme", "dark") or use ThemeSwitcher.');
  result.nextSteps.push('Verify in the consumer project: npm run lint && npm run build');

  return result;
};

export const formatInstallResult = (result: InstallResult): string => {
  const lines = [
    `# shacdn install${result.dryRun ? ' (dry-run)' : ''}`,
    '',
    `Target: \`${result.targetDir}\``,
    '',
    `## Written (${result.written.length})`,
    result.written.length > 0 ? result.written.map((f) => `- ${f}`).join('\n') : '- none',
    '',
    `## Skipped (${result.skipped.length})`,
    result.skipped.length > 0 ? result.skipped.map((f) => `- ${f}`).join('\n') : '- none',
  ];

  if (result.warnings.length > 0) {
    lines.push('', '## Warnings', ...result.warnings.map((w) => `- ${w}`));
  }

  lines.push('', '## Next steps', ...result.nextSteps.map((s) => `- ${s}`));
  return lines.join('\n');
};

export const parseInstallArgs = (argv: string[]): InstallOptions => {
  const rest = argv[0] === 'install' || argv[0] === 'init' ? argv.slice(1) : argv;
  let targetDir = '';
  let components: string[] | undefined;
  let force = false;
  let dryRun = false;
  let srcDir: string | undefined;

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === '--force') {
      force = true;
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg === '--styles-only') {
      components = [];
    } else if (arg === '--components' || arg === '-c') {
      i += 1;
      components = (rest[i] ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (arg === '--target' || arg === '-t') {
      i += 1;
      targetDir = rest[i] ?? '';
    } else if (arg === '--src-dir') {
      i += 1;
      srcDir = rest[i];
    } else if (arg === '--help' || arg === '-h') {
      throw new Error('HELP');
    } else if (!arg.startsWith('-') && !targetDir) {
      targetDir = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!targetDir) {
    throw new Error('Missing target directory');
  }

  return { targetDir, components, force, dryRun, srcDir };
};

export const INSTALL_USAGE = `Usage:
  shacdn install <target-dir> [--components Button,Card] [--force] [--dry-run] [--src-dir src]

Copies the shacdn style guide (tokens + theme) into another project.
Omit --components to copy only design tokens (variables.scss, globals.scss, theme.ts).

Examples:
  npm run shacdn:install -- ../my-app
  npm run shacdn:install -- ../my-app --components Button,Input,Label,Card
`;
