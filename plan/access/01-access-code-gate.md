# Story: Access Code Gate For AI Actions

## Status

Completed.

## Epic

Access.

## Goal

Require a shared access code before any paid AI action while allowing the intro, examples, and local workflow to remain visible.

## Scope

- Add access-code prompt/modal when user triggers:
  - Generate brief.
  - Revise brief.
  - Not-ready generation.
- Store valid access code locally.
- Include access code in each AI request.
- API route validates against `MVP_ACCESS_CODE`.
- Show clear error for wrong code.

## Out Of Scope

- Login.
- JWTs.
- Signed cookies.
- Role-based access.

## Dependencies

- `plan/foundation/03-local-draft-storage.md`.
- `plan/ai/01-brief-api-route.md`.

## Implementation Notes

- The page should not be blocked before code entry.
- The expensive action is the API call, not viewing/filling the workflow.
- Avoid leaking whether a specific environment value exists.

## Acceptance Criteria

- User can view intro/examples without code.
- User can fill hat inputs without code.
- AI action prompts for code if missing.
- Wrong code prevents API call.
- Correct code allows API request and is reused locally.
- Server rejects missing or incorrect access code.

## Verification

- Try generate without code.
- Try wrong code.
- Try correct code.
- Confirm subsequent AI action does not require re-entry.
