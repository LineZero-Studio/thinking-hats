# Story: Local Draft Storage

## Status

Completed.

## Epic

Foundation.

## Goal

Persist the in-progress session locally in the user's browser and make that behavior transparent.

## Scope

- Store draft state in `localStorage`.
- Persist:
  - topic
  - hat entries
  - current step/view
  - generated/current brief
  - decision status
  - access code if provided
- Hydrate draft on app load.
- Add local draft notice:
  - `Drafts are saved locally in this browser only. Nothing is saved to our server.`
- Add `Clear draft` control.

## Out Of Scope

- Cloud storage.
- Login.
- Cross-device sync.

## Dependencies

- `plan/foundation/01-nextjs-migration.md`.
- `plan/foundation/02-shared-types-and-validation.md`.

## Implementation Notes

- Use a versioned localStorage key so future schema changes can be handled.
- Guard localStorage access for client-only execution.
- Clear draft should reset the app to the initial intro state.

## Acceptance Criteria

- Refresh restores the in-progress session.
- Generated/current brief restores after refresh.
- `Clear draft` removes local state and resets the app.
- Local storage notice is visible before meaningful content entry.
- No server persistence is introduced.

## Verification

- Fill multiple hats, refresh, confirm state restores.
- Generate/load a brief, refresh, confirm brief restores.
- Clear draft and refresh, confirm blank state.
