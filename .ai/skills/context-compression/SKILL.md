# Skill: context-compression

## When to use
After 3–5 iterations on one task or context pressure is high

## Inputs
Current goal, decisions, files, checks

## Steps
1. Collect facts only
2. Remove repeats and stale plans
3. Write .ai/session/current-task.md via npm run ai:compress or manual template
4. Keep next step concrete

## Required checks
- decisions preserved
- test results preserved

## Expected result
Compact task state file

## Forbidden
- Dumping full logs into memory

## Done when
Task state updated
