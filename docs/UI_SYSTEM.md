# UI System

## Purpose

This document preserves visual and interaction decisions so new screens stay consistent.

## Design Principles

- Prioritize readability and fast scanning.
- Keep hierarchy obvious at a glance.
- Use consistent spacing and typography.
- Use motion to support understanding, not decoration.

## Tokens

Define and maintain these tokens in code (single source):

- Colors: semantic tokens (background, surface, text, border, accent, success, warning, danger)
- Typography: font families, sizes, line heights, weights
- Spacing: base scale (for example 4, 8, 12, 16, 24, 32)
- Radius: small, medium, large, pill
- Elevation: surface levels for cards, modals, overlays
- Motion: durations and easings

## Component Standards

Each reusable component should define:

- Variants (for example primary, secondary, destructive)
- States (default, pressed, disabled, loading, error)
- Size options (small, medium, large)
- Accessibility requirements

## Screen Standards

Every screen should include:

- Loading state
- Error state
- Empty state (when applicable)
- Offline or retry behavior when networking is involved

## Change Protocol

When introducing a new visual pattern:

1. Add or update tokens first.
2. Reuse existing shared components when possible.
3. Document the new pattern in this file.
4. If the pattern changes a prior decision, add an ADR.
