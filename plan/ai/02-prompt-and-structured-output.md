# Story: Prompt And Structured Output Contract

## Status

Completed.

## Epic

AI.

## Goal

Create the OpenAI prompt and JSON schema that reliably returns a useful Decision Brief.

## Scope

- Define Structured Outputs JSON schema for `DecisionBrief`.
- Build prompt content for:
  - Generate.
  - Revise.
  - Not ready.
- Include safety/product constraints:
  - Advisory, not authoritative.
  - User owns the decision.
  - Not a substitute for professional advice.
  - Crisp and action-oriented.
- Parse and validate model output.

## Out Of Scope

- Prompt tuning beyond MVP.
- Multi-provider prompt abstraction.
- Automatic discouraged-category detection.

## Dependencies

- `plan/ai/01-brief-api-route.md`.

## Implementation Notes

- Keep schema close to `implementation.md`.
- For `not_ready`, do not force a suggested final decision if the user is not ready; focus on missing inputs and next step.
- If structured output parsing fails, return `invalid_ai_response`.

## Acceptance Criteria

- Generated brief includes every required field.
- Revision respects user instruction and current brief.
- Not-ready response includes blocker, missing inputs, and suggested next step.
- Confidence is one of `low`, `medium`, or `high`.
- Output remains concise enough for the UI.

## Verification

- Generate from LinkedIn example.
- Revise with a concrete instruction.
- Mark not ready with a blocker.
