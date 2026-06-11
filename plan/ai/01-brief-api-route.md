# Story: Brief API Route

## Status

Completed.

## Epic

AI.

## Goal

Implement `POST /api/brief` as the single serverless route for generating, revising, and marking decision briefs as not ready.

## Scope

- Add `app/api/brief/route.ts`.
- Support modes:
  - `generate`
  - `revise`
  - `not_ready`
- Validate access code.
- Validate request shape and input lengths server-side.
- Call OpenAI from server-side code only.
- Return structured `BriefResponse`.
- Avoid logging user-entered content.

## Out Of Scope

- Streaming responses.
- Multiple AI calls during hat entry.
- Provider abstraction.
- Database writes.

## Dependencies

- `plan/foundation/02-shared-types-and-validation.md`.

## Implementation Notes

- Use `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_REASONING_EFFORT`, and `MVP_ACCESS_CODE`.
- Default env values should be documented but not hard-coded for secrets.
- Use OpenAI Responses API and Structured Outputs.
- Keep route timeout and payload size reasonable.

## Acceptance Criteria

- Missing/wrong access code returns `access_denied`.
- Invalid mode or malformed payload returns `invalid_request`.
- Over-limit input returns `input_too_long`.
- Valid generate request returns a `DecisionBrief`.
- Valid revise request returns a revised `DecisionBrief`.
- Valid not-ready request returns a `DecisionBrief` with `status: "not_ready"` and `notReady`.
- OpenAI key is never exposed to the browser.

## Verification

- Run `npm run build`.
- Exercise route through UI after the UI story exists.
- Check server logs do not include user prompt bodies.
