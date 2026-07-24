# Architecture Decision Records (ADR)

## Why ADRs

ADRs preserve important technical and product decisions so the team and tools can stay consistent over time.

## File Naming

Use incremental naming:

- 0001-short-title.md
- 0002-short-title.md

## Template

Copy this template for each new ADR:

```md
# ADR 000X: Title

## Status
Accepted | Proposed | Deprecated | Superseded

## Date
YYYY-MM-DD

## Context
What problem are we solving?

## Decision
What was decided?

## Alternatives Considered
- Option A
- Option B

## Consequences
- Positive outcomes
- Tradeoffs or costs

## Follow-up
What should be updated in code/docs/tests?
```

## Rules

- Keep ADRs short and concrete.
- One decision per file.
- Update status if superseded by a later ADR.
