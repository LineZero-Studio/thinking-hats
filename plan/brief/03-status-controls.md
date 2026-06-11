# Story: Decision Status Controls

## Status

Completed.

## Epic

Brief.

## Goal

Add user ownership controls for accepting, revising, or marking a decision as not ready.

## Scope

- Add status controls:
  - `Accept`
  - `Needs Revision`
  - `Not Ready`
- `Accept` updates local status.
- `Needs Revision` opens revision input.
- `Not Ready` opens blocker input.
- Persist status locally.

## Out Of Scope

- AI revision implementation details beyond calling the existing route.
- Markdown export.

## Dependencies

- `plan/brief/01-decision-brief-view.md`.
- `plan/access/01-access-code-gate.md`.
- `plan/ai/01-brief-api-route.md`.

## Implementation Notes

- AI actions should invoke access-code flow if needed.
- Keep loading and error states clear.
- Preserve current brief on AI failure.

## Acceptance Criteria

- Accept status updates the brief status locally.
- Revision instruction is required and length-limited.
- Not-ready blocker is required and length-limited.
- Wrong/missing access code prevents revision/not-ready API calls.
- AI failure preserves current brief.

## Verification

- Accept a generated brief.
- Revise with a valid instruction.
- Mark not ready with a blocker.
- Try over-limit revision/blocker text.
