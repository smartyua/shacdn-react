#!/usr/bin/env tsx
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { logger } from '../lib/logger.js';
import { TASK_STATE_PATH } from '../lib/paths.js';
import { ensureAiDirectories } from '../lib/runtime.js';

const template = (input: {
  goal: string;
  requirements: string[];
  decisions: string[];
  files: string[];
  implemented: string[];
  tests: string[];
  checks: string[];
  openIssues: string[];
  nextStep: string;
  doNotRepeat: string[];
}): string => `# Task State

## Goal
${input.goal}

## Confirmed Requirements
${input.requirements.map((r) => `- ${r}`).join('\n') || '- (none)'}

## Decisions
${input.decisions.map((r) => `- ${r}`).join('\n') || '- (none)'}

## Files
${input.files.map((r) => `- ${r}`).join('\n') || '- (none)'}

## Implemented
${input.implemented.map((r) => `- ${r}`).join('\n') || '- (none)'}

## Tests
${input.tests.map((r) => `- ${r}`).join('\n') || '- (none)'}

## Checks
${input.checks.map((r) => `- ${r}`).join('\n') || '- (none)'}

## Open Issues
${input.openIssues.map((r) => `- ${r}`).join('\n') || '- (none)'}

## Next Step
${input.nextStep}

## Do Not Repeat
${input.doNotRepeat.map((r) => `- ${r}`).join('\n') || '- (none)'}
`;

const parseArgs = (): Record<string, string> => {
  const out: Record<string, string> = {};
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i];
    if (!key.startsWith('--')) continue;
    out[key.slice(2)] = args[i + 1] ?? '';
    i += 1;
  }
  return out;
};

const main = (): void => {
  ensureAiDirectories();
  const args = parseArgs();
  const goal = args.goal || 'Continue current task';
  const markdown = template({
    goal,
    requirements: (args.requirements || '').split('|').filter(Boolean),
    decisions: (args.decisions || '').split('|').filter(Boolean),
    files: (args.files || '').split('|').filter(Boolean),
    implemented: (args.implemented || '').split('|').filter(Boolean),
    tests: (args.tests || '').split('|').filter(Boolean),
    checks: (args.checks || '').split('|').filter(Boolean),
    openIssues: (args.openIssues || '').split('|').filter(Boolean),
    nextStep: args.nextStep || 'Determine next concrete action',
    doNotRepeat: (args.doNotRepeat || '').split('|').filter(Boolean),
  });

  if (!existsSync(dirname(TASK_STATE_PATH))) {
    mkdirSync(dirname(TASK_STATE_PATH), { recursive: true });
  }
  writeFileSync(TASK_STATE_PATH, markdown, 'utf8');
  logger.info('Context compressed', { path: TASK_STATE_PATH });
  console.log(`[OK] Wrote ${TASK_STATE_PATH}`);
  console.log(markdown);
};

main();
