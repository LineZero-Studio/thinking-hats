# Story: Responsive And Accessible Flow

## Status

Completed.

## Epic

UX.

## Goal

Make the MVP flow usable on both desktop and mobile with baseline accessibility.

## Scope

- Review and adjust responsive layouts.
- Ensure progress rail works on mobile.
- Ensure inputs, controls, and brief sections do not overlap.
- Improve labels and accessible names.
- Ensure keyboard operation for major controls.
- Maintain readable contrast.

## Out Of Scope

- Full accessibility audit.
- Screen-reader-specific advanced workflow.
- Design system rebuild.

## Dependencies

- All core UI stories.

## Implementation Notes

- Do not scale font size with viewport width.
- Use stable dimensions for repeated controls where needed.
- Keep touch targets usable.

## Acceptance Criteria

- Intro, hat steps, brief, edit mode, status controls, and copy flow are usable on mobile.
- Keyboard users can complete the core flow.
- Buttons and inputs have clear labels.
- Text does not overlap or overflow awkwardly.

## Verification

- Browser QA on desktop viewport.
- Browser QA on mobile viewport.
