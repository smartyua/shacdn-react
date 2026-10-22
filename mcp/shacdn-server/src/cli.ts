#!/usr/bin/env node
import { join } from 'node:path';
import { formatInstallResult, INSTALL_USAGE, installToProject, parseInstallArgs } from './lib/install.js';
import { writeLlmsFiles } from './lib/llms.js';
import { toRepoRelative } from './lib/fs.js';
import { REPO_ROOT } from './lib/paths.js';

const main = (): void => {
  const argv = process.argv.slice(2);
  const command = argv[0];

  if (!command || command === '--help' || command === '-h') {
    process.stdout.write(INSTALL_USAGE);
    process.exit(command ? 0 : 1);
  }

  if (command === 'llms') {
    const written = writeLlmsFiles(join(REPO_ROOT, 'public'));
    process.stdout.write(`Wrote ${written.map(toRepoRelative).join(', ')}\n`);
    return;
  }

  if (command !== 'install' && command !== 'init') {
    process.stderr.write(`Unknown command: ${command}\n\n${INSTALL_USAGE}`);
    process.exit(1);
  }

  try {
    const options = parseInstallArgs(argv);
    const result = installToProject(options);
    process.stdout.write(`${formatInstallResult(result)}\n`);
    if (result.warnings.length > 0 && result.written.length === 0 && result.skipped.length === 0) {
      process.exit(1);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === 'HELP') {
      process.stdout.write(INSTALL_USAGE);
      process.exit(0);
    }
    process.stderr.write(`${message}\n\n${INSTALL_USAGE}`);
    process.exit(1);
  }
};

main();
