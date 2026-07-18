# Skill: knowledge-update

## When to use
Architecture/conventions/components changed meaningfully

## Inputs
What changed

## Steps
1. Run npm run ai:knowledge:update or edit knowledge files carefully
2. Update semantic memory facts if needed
3. Reindex with npm run ai:index:incremental
4. Add ADR for significant decisions

## Required checks
- no invented content
- links valid

## Expected result
Fresh knowledge + index

## Forbidden
- Leaving stale contradictions

## Done when
Knowledge matches repo
