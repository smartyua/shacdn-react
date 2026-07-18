# Skill: performance-analysis

## When to use
UI jank, large renders, or indexing slowness

## Inputs
Symptom; target paths

## Steps
1. Measure or reproduce
2. Identify hot paths (render, CSS, index walk)
3. Prefer minimal targeted fixes
4. Re-verify after change

## Required checks
- no premature memoization unless needed

## Expected result
Findings + recommended fix

## Forbidden
- Broad rewrite for micro-opts

## Done when
Issue mitigated or documented as accepted
