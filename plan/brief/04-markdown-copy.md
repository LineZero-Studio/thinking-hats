# Story: Markdown Copy Export

## Status

Completed.

## Epic

Brief.

## Goal

Allow users to copy the current Decision Brief as Markdown.

## Scope

- Add deterministic Markdown generator.
- Add `Copy Markdown` button.
- Include all current brief fields.
- Include not-ready section when relevant.
- Show copied/error state.
- Fallback to selectable Markdown text if clipboard write fails.

## Out Of Scope

- PDF export.
- Share links.
- Email export.
- Notion/Docs integration.

## Dependencies

- `plan/brief/01-decision-brief-view.md`.
- `plan/brief/02-edit-brief-mode.md`.

## Implementation Notes

- Markdown should be generated from the current in-memory brief state, including manual edits.
- Keep formatting clean and predictable.

## Acceptance Criteria

- Markdown includes title and all required sections.
- Edited brief content is reflected in copied Markdown.
- Not-ready content appears only when status is `not_ready`.
- Clipboard success is visible.
- Clipboard failure fallback is usable.

## Verification

- Copy generated brief.
- Edit brief, copy again, confirm changes.
- Mark not ready, copy, confirm not-ready sections.
