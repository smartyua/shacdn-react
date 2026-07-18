# Context compression after 3–5 iterations

## Status
Accepted

## Context
Long agent threads waste tokens and lose the next action.

## Decision
After 3–5 iterations (or under context pressure), write a structured Task State to `.ai/session/current-task.md` (gitignored). Provide `npm run ai:compress` and a skill.

## Alternatives
- Rely on model summarization only
- Commit task state to git

## Consequences
- Agents must refresh task state periodically
- Private task notes stay local

## Validation
Skill + script + rule `07-context-management.mdc`
