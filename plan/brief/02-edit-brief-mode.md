# Story: Edit Brief Mode

## Status

Completed.

## Epic

Brief.

## Goal

Allow intentional manual editing of the Decision Brief without making the default brief view accidentally editable.

## Scope

- Add `Edit brief` button.
- Switch brief view into edit mode.
- Render editable fields for brief text and list sections.
- Add `Save edits` and `Cancel`.
- Save edits to local brief state.
- Ensure Markdown export uses edited state.

## Out Of Scope

- Inline editing in read mode.
- Rich text editing.
- Collaborative editing.

## Dependencies

- `plan/brief/01-decision-brief-view.md`.
- `plan/foundation/03-local-draft-storage.md`.

## Implementation Notes

- Text areas are acceptable for MVP.
- Keep list editing simple; newline-separated values are acceptable if fastest.
- Cancel should restore the pre-edit brief.

## Acceptance Criteria

- Read mode is not editable.
- Edit mode clearly exposes editable fields.
- Save updates rendered brief.
- Cancel discards unsaved changes.
- Refresh after save preserves edited brief.

## Verification

- Edit every major field.
- Save and copy after Markdown story exists.
- Cancel a change and confirm original remains.
