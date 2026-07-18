# Skill: bug-investigation

## When to use
Fixing a defect

## Inputs
Symptom; reproduction steps if known

## Steps
1. Capture symptom precisely
2. Search .ai/memory/failures
3. Create failing regression test when possible
4. Find root cause in code
5. Fix root cause
6. Run related + broader tests
7. Add failure memory entry

## Required checks
- regression test
- lint
- no symptom-only patch

## Expected result
Fix + regression coverage + failure note

## Forbidden
- Deleting failing tests to pass
- Masking with weaker assertions

## Done when
Bug cannot be reproduced; memory updated
