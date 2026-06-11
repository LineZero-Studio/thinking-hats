# Story: Vercel Deployment Readiness

## Status

Completed.

## Epic

Deployment.

## Goal

Prepare the app for public Vercel deployment behind access-code protected AI actions.

## Scope

- Ensure build works in production.
- Document required Vercel env vars.
- Add optional Vercel Analytics if quick.
- Confirm no server-side content retention is introduced.
- Confirm OpenAI key is server-only.

## Out Of Scope

- Custom domain.
- Database setup.
- Authentication provider.

## Dependencies

- All MVP implementation stories.

## Implementation Notes

- Required env vars:
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`
  - `OPENAI_REASONING_EFFORT`
  - `MVP_ACCESS_CODE`
- Analytics should be page views only if included.

## Acceptance Criteria

- `npm run build` passes.
- App can run locally in production mode.
- Env vars are documented.
- AI route fails safely when env vars are missing.
- No content analytics or server persistence is added.

## Verification

- Run `npm run build`.
- Run local production preview if practical.
- Generate brief with env vars configured.
