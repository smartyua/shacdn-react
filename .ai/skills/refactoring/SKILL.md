# Skill: refactoring

## When to use
Improving structure without intended behavior change

## Inputs
Target scope

## Steps
1. Keep diff focused
2. Add characterization tests if behavior is unclear
3. Avoid mixing refactors with features
4. Run lint/tests/build

## Required checks
- behavior preserved

## Expected result
Cleaner code, same behavior

## Forbidden
- Drive-by renames outside scope

## Done when
Verification green
