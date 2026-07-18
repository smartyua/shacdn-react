# Skill: dependency-upgrade

## When to use
Changing package versions

## Inputs
Package; target version

## Steps
1. Read current version from package-lock.json
2. Check release notes for that major
3. Upgrade deliberately; run lint/tests/build
4. Avoid unrelated major bumps

## Required checks
- lockfile updated
- build passes

## Expected result
Safe upgrade

## Forbidden
- Blind major upgrades

## Done when
App and AI checks pass
