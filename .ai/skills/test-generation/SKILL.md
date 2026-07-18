# Skill: test-generation

## When to use
Adding tests for new or changed behavior

## Inputs
Target module; public behavior

## Steps
1. Identify public behavior and edge cases
2. Match existing test style (Vitest under .ai/tests for AI; component tests if present)
3. Cover positive, negative, boundary cases
4. Avoid testing implementation details only
5. Ensure regression tests fail without the fix when applicable

## Required checks
- tests run
- assertions meaningful

## Expected result
Focused deterministic tests

## Forbidden
- Snapshot-only business logic
- Excessive mocking

## Done when
Tests pass and would catch the regression
