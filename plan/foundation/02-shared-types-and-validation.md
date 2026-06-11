# Story: Shared Types And Validation

## Status

Completed.

## Epic

Foundation.

## Goal

Create shared TypeScript types and validation helpers for hats, brief requests, brief responses, and input limits.

## Scope

- Define `HatId`, hat config, and example session data.
- Define `DecisionBrief`, `DecisionStatus`, `BriefRequest`, and `BriefResponse`.
- Define input limits:
  - Decision title: 200 characters.
  - Bulleted entry: 140 characters.
  - Free-form section: 1000 characters.
  - Revision instruction: 500 characters.
  - Not-ready blocker: 500 characters.
- Add validation helpers reusable by client and API route.

## Out Of Scope

- API route implementation.
- AI prompt implementation.
- UI redesign.

## Dependencies

- `plan/foundation/01-nextjs-migration.md`.

## Implementation Notes

- Prefer `lib/hats.ts`, `lib/brief-schema.ts`, and `lib/validation.ts`.
- Keep validation deterministic and easy to test manually.

## Acceptance Criteria

- Shared types compile.
- Client can import hat config and validation limits.
- Server route can import the same validation helpers later.
- Over-limit conditions can be represented as structured validation errors.

## Verification

- Run `npm run build`.
