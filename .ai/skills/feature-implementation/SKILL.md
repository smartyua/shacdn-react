# Skill: feature-implementation

## When to use
Adding or changing feature behavior

## Inputs
Acceptance criteria; affected modules

## Steps
1. Find existing patterns in src/components or .ai/memory/patterns
2. Define acceptance criteria
3. Implement minimal change
4. Add/update tests for functional behavior
5. Run lint + relevant tests + build if needed
6. Self-review diff
7. Update docs/knowledge/memory when conventions change

## Required checks
- lint
- tests for new behavior
- requirement recheck

## Expected result
Working change with tests and verification notes

## Forbidden
- Drive-by refactors
- Claiming done without checks

## Done when
Checks green; docs/memory updated if needed
