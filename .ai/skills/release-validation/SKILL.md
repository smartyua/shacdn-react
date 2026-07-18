# Skill: release-validation

## When to use
Before tagging/publishing a meaningful change set

## Inputs
Change summary

## Steps
1. npm run lint
2. npm run test:ai
3. npm run build
4. npm run ai:verify
5. Review CHANGELOG if used

## Required checks
- all gates green

## Expected result
Go/no-go

## Forbidden
- Skipping failing checks

## Done when
Validation recorded
