# Skill: database-migration

## When to use
N/A for this repository

## Inputs
None

## Steps
1. Confirm there is no application database
2. If AI index schema changes, document in docs/adr and bump vector record version
3. Do not invent SQL migrations for the UI library

## Required checks
- no fake DB code

## Expected result
N/A note or AI index schema ADR

## Forbidden
- Adding PostgreSQL without explicit product need

## Done when
Scope clarified
