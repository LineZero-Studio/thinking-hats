# Story: Decision Brief View

## Status

Completed.

## Epic

Brief.

## Goal

Render the AI-generated `Decision Brief` from structured JSON.

## Scope

- Add `DecisionBriefView`.
- Render:
  - Suggested decision.
  - Rationale.
  - Main tradeoff.
  - Biggest risk.
  - Best upside.
  - Creative alternative.
  - Next actions.
  - Open questions.
  - AI confidence.
- Show decision status.
- Include ownership copy that the user owns the final decision.

## Out Of Scope

- Manual edit mode.
- AI revision.
- Markdown copy.

## Dependencies

- `plan/ai/01-brief-api-route.md`.
- `plan/ai/02-prompt-and-structured-output.md`.

## Implementation Notes

- The view should be readable on mobile and desktop.
- Avoid dense cards inside cards.
- Keep the output crisp and scannable.

## Acceptance Criteria

- Brief renders every required field.
- Empty arrays or missing optional not-ready fields do not break the UI.
- Mobile layout is readable and controls do not overlap.

## Verification

- Generate or load a sample brief.
- Inspect desktop and mobile layouts.
