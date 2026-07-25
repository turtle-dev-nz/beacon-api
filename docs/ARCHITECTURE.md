# Business Card App

## Vision

The app is not a business card scanner.

The app helps professionals remember the people they meet.

Business card scanning is simply the fastest way to create a structured contact.

---

## Product Goal

Turn quick in-person encounters into accurate, searchable, and memorable contact records.

The card scan is an input method, not the final product experience.

---

## Non-Goals

- Not a generic OCR demo app.
- Not an autonomous contact writer.
- Not a replacement for user judgment during review.

---

## MVP Flow

Launch

↓

Login

↓

Home

↓

Scan Card

↓

Capture Image

↓

Upload to backend

↓

OCR

↓

LLM

↓

Review

↓

Save

↓

Home

---

## Home Screen

Displays all saved contacts.

Primary action:

- Scan New Card

Secondary actions:

- Search contacts
- Open existing contact
- Settings

---

## Scanning Flow Requirements

1. Capture business card image.
2. Upload image to backend.
3. Backend performs image cleanup if needed.
4. OCR extracts visible text.
5. LLM converts OCR text into structured JSON.
6. LLM must never invent data.
7. User reviews and edits fields before save.
8. Save contact.
9. Return to Home ready for next scan.

---

## Tech Stack

Frontend

React Native
Expo SDK 54
TypeScript
Expo Router (file-based navigation)
TanStack Query
Zustand
Axios
React Hook Form
Zod

Backend

Node
Express
PostgreSQL
Prisma
Google Gemini 2.0 Flash (OCR + structured extraction in one step)

LLM Strategy

Gemini 2.0 Flash handles both OCR and structuring in a single multimodal call.
The mobile app sends the card image to the API, which forwards it to Gemini with a strict JSON schema prompt.
Gemini returns structured contact JSON directly — no separate OCR step required.
The LLM is instructed never to invent data; all fields default to null when not visible.

Image Storage

Card images are stored on the API server under the uploads/ directory.
The file path is saved in the Card.imageUrl field.
This is suitable for local development and single-machine deployments.
For production, swap uploads/ for an object store (S3, Cloudflare R2, GCS).

Authentication

Not implemented in the current dev build.
A DEV_USER_ID environment variable is used to bypass auth for local testing.
Planned: Google OAuth as primary provider, email/password as fallback (future ADR required).

---

## State Management

TanStack Query owns all server state:

- Contacts
- OCR
- User profile

Zustand owns client-only state:

- Authentication
- Current Scan
- Draft Contact
- Theme
- App settings

Never duplicate server state inside Zustand.

---

## Folder Structure

Use feature-based architecture.

```text
src/
	features/
		auth/
			screens/
			hooks/
			components/
			services/
			types/
		cards/
			screens/
			hooks/
			components/
			services/
			types/
		scanner/
			screens/
			hooks/
			components/
			services/
			types/
		settings/
			screens/
			hooks/
			components/
			services/
			types/
	components/
```

Rules:

- Each feature owns screens, hooks, components, services, and types.
- Shared UI belongs in src/components.
- Keep feature boundaries explicit.

---

## Engineering Principles

- Keep components small and focused.
- Use strict TypeScript.
- Prefer composition over inheritance.
- Prefer readability over cleverness.
- Avoid unnecessary abstraction.
- Use modern React patterns and hooks.
- Avoid class components.
- Build reusable UI components where appropriate.
- Favor scalable solutions over quick hacks.

---

## Context Retention System

This is the most important section for long-term consistency.

1. Use this file as the source of truth for product and architecture.
2. Add ADRs for major decisions in docs/adr.
3. Keep a UI system doc for styling decisions in docs/UI_SYSTEM.md.
4. Keep API contracts versioned and typed in code and docs.
5. Keep feature contracts documented per flow (screen inputs, outputs, and dependencies).
6. Keep AI agent instructions in AGENTS.md concise and enforceable.
7. Keep a repository memory note updated with stable conventions.

### Decision Logging (ADR)

Create one short ADR per important decision:

- Why this decision was made.
- Alternatives considered.
- Tradeoffs and consequences.
- Date and owner.

If a future request conflicts with a past decision, update ADR first, then code.

### UI Consistency and Styling Memory

Define and keep stable:

- Color tokens
- Typography scale
- Spacing scale
- Radius and elevation system
- Motion principles
- Reusable component variants

Store these in:

- code tokens (theme files)
- docs/UI_SYSTEM.md (human-readable guidance)

When creating a new page, always read tokens first and compose from existing components.

### API and Data Contracts

Every backend payload used by frontend should have:

- Zod schema
- TypeScript type inference
- One place for request/response typing

This prevents drift and keeps generated pages aligned with real data.

### Agent Working Agreement

When asking for implementation:

- Reference this ARCHITECTURE doc.
- Reference UI_SYSTEM and relevant ADRs.
- State the feature and target screen.
- State if new behavior changes an existing decision.

Suggested prompt shape:

"Implement <screen/feature> using current architecture. Follow docs/ARCHITECTURE.md and docs/UI_SYSTEM.md. Reuse existing components and tokens. If any decision conflicts, propose an ADR update before coding."

### Definition of Done for New Screens

- Uses feature folder boundaries.
- Uses TanStack Query for server state.
- Uses Zustand only for client state.
- Uses typed API contracts.
- Reuses shared components and design tokens.
- Includes loading, error, and empty states.
- Includes a short note in docs if new patterns are introduced.

---

## Maintenance Cadence

- Update this document when architecture changes.
- Add ADR when a non-trivial decision is made.
- Update UI_SYSTEM when styling rules evolve.
- Review docs for drift at least once per sprint.
