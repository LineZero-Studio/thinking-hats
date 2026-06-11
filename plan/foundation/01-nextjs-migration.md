# Story: Next.js App Router Migration

## Status

Completed.

## Epic

Foundation.

## Goal

Move the current Vite React app into a Next.js App Router project without changing product behavior yet.

## Scope

- Add Next.js App Router structure.
- Move global CSS into the Next.js app.
- Preserve existing LineZero visual styling and logo.
- Preserve the current six-hat workflow while preparing for later MVP changes.
- Remove obsolete Vite-only files once the Next app builds.

## Out Of Scope

- Live AI integration.
- Access code.
- Decision Brief revisions.
- Local storage.
- Major redesign.

## Dependencies

- `implementation.md` accepted.

## Implementation Notes

- Use `app/layout.tsx`, `app/page.tsx`, and `app/globals.css`.
- Convert component files to TypeScript where practical.
- Keep component behavior close to current prototype during migration.
- Avoid introducing a UI library.

## Acceptance Criteria

- App runs as a Next.js App Router app.
- Six-hat flow still works locally.
- Existing styling and LineZero branding still render.
- Old Vite entrypoints/config are removed or no longer used.
- `npm run build` passes.

## Verification

- Run `npm run build`.
- Open the local app and complete the existing example flow.
