# Architecture Spec

## Status

Accepted for implementation spec.

## Architecture Summary

`Thinking Hats` will move from a Vite React prototype to a Next.js app deployed on Vercel.

The MVP uses:

- Next.js frontend and serverless API routes.
- OpenAI called only from server-side code.
- A single AI summarize call at the end of the session.
- JSON output from AI, rendered by the UI.
- Markdown generated locally from the JSON for copy/export.
- Local browser storage for draft resilience.
- Access-code gate to control public usage and AI cost.
- No login, no database, and no server-side prompt/response retention.

## Primary Constraints

- One-day MVP.
- Publicly deployable.
- No accounts.
- No database.
- No exposed AI provider keys.
- No server-side storage of sensitive decision content.
- Keep LineZero branding.
- Preserve Six Hats framing.
- Mobile and desktop both need to work well.

## Runtime Architecture

```txt
Browser
  |
  | Next.js pages/components
  | localStorage draft state
  | access code entry
  |
  v
Next.js App on Vercel
  |
  | Serverless API route
  | validates access code
  | validates request payload
  | calls OpenAI with structured output schema
  |
  v
OpenAI API
  |
  v
JSON decision brief
  |
  v
Next.js API route returns JSON to browser
  |
  v
UI renders Decision Brief and generates Markdown copy text
```

## Framework

Decision:

- Move to Next.js for MVP.

Recommended implementation shape pending confirmation:

- Use the Next.js App Router.
- Keep the app as a mostly client-rendered workflow.
- Use server route handlers for AI calls.

Reasoning:

- The workflow is stateful and interactive in the browser.
- The API route is needed for secure OpenAI key handling.
- Server rendering is not a major MVP need.

## Hosting

Decision:

- Deploy on Vercel.

Deployment shape:

- Next.js app deployed as one Vercel project.
- Serverless API route deployed with the app.
- Environment variables configured in Vercel.
- Public URL protected by app-level access code, not platform auth.

## Environment Variables

Required:

- `OPENAI_API_KEY`: server-side only.
- `MVP_ACCESS_CODE`: shared MVP access code.
- `OPENAI_MODEL`: selected OpenAI model for decision brief generation.
- `OPENAI_REASONING_EFFORT`: reasoning effort setting for the selected model.
- `OPENAI_FALLBACK_MODEL`: optional fallback if the selected model is unavailable.

Optional:

- `NEXT_PUBLIC_ANALYTICS_ENABLED`: controls privacy-light completion events if analytics is included.

## Access Control

Decision:

- Require an access code for MVP.

Architecture:

- Access code is entered in the browser.
- The browser stores an access-granted flag locally after successful entry.
- Every AI API request includes the access code.
- The serverless route validates the submitted code against `MVP_ACCESS_CODE`.

Preferred one-day implementation:

- Submit the access code with AI requests.
- Do not build sessions, accounts, magic links, or JWT auth.

Tradeoff:

- This is not strong auth. It is cost-control friction for a small test audience.

## AI Integration

Decision:

- Use OpenAI directly.
- Call OpenAI from a serverless API route only.
- Use one summarize call at the end.
- Use JSON output for UI rendering.

OpenAI API pattern:

- Use the OpenAI JavaScript SDK in server-side Next.js code.
- Use the Responses API.
- Use Structured Outputs with a JSON Schema response format for the decision brief.
- Default to `OPENAI_MODEL=gpt-5.5`.
- Default to `OPENAI_REASONING_EFFORT=low`.
- If the project does not have access to `gpt-5.5`, fall back to a cheaper available GPT-5-class model rather than blocking the MVP.

Reasoning:

- OpenAI docs describe the Responses API as the current interface for generating text or JSON outputs.
- OpenAI docs recommend Structured Outputs over basic JSON mode when schema adherence matters.
- The UI needs reliable fields for rendering, revision, not-ready handling, and Markdown generation.
- OpenAI docs list GPT-5.5 as supporting `reasoning.effort` values including `low`, with `medium` as the default.

## AI Request Types

MVP API routes:

- `POST /api/brief`

The route accepts:

- Decision topic.
- Six hat entries.
- Optional revision instruction.
- Optional existing brief when revising.
- Optional not-ready blocker text.

The route returns:

- Structured `DecisionBrief` JSON.
- Refusal or validation error if applicable.

The same route can support initial brief generation and revision by accepting a `mode` field:

- `generate`
- `revise`
- `not_ready`

Alternative:

- Split into `/api/brief`, `/api/revise`, and `/api/not-ready`.

Decision:

- Use one `/api/brief` route with explicit `mode` to minimize one-day wiring while keeping behavior typed.

## Decision Brief Data Contract

The UI should render from a structured object, not raw Markdown.

Proposed TypeScript shape:

```ts
type DecisionStatus = "proposed" | "accepted" | "needs_revision" | "not_ready";

type DecisionBrief = {
  status: DecisionStatus;
  suggestedDecision: string;
  rationale: string;
  mainTradeoff: string;
  biggestRisk: string;
  bestUpside: string;
  creativeAlternative: string;
  nextActions: string[];
  openQuestions: string[];
  confidence: {
    label: "low" | "medium" | "high";
    rationale: string;
  };
  notReady?: {
    blocker: string;
    missingInputs: string[];
    suggestedNextStep: string;
  };
};
```

Notes:

- `confidence` means AI confidence.
- `notReady` is only required when status is `not_ready`.
- Markdown export is generated from this object in the frontend.

## Revision Flow

Decision:

- Support both manual editing and AI revision.

Architecture:

- Brief view renders editable fields.
- Manual edits update local client state.
- AI revision sends current brief, original hat entries, and revision instruction to `/api/brief` with `mode: "revise"`.
- Revised JSON replaces the editable brief state.

Reasoning:

- Manual editing preserves user ownership.
- AI revision preserves product value without becoming a full chat app.

## Not-Ready Flow

Decision:

- Deterministic UI form plus AI-generated missing inputs.

Architecture:

- User selects `Not Ready`.
- UI asks: "What is blocking this decision?"
- App sends hat entries, current brief, and blocker text to `/api/brief` with `mode: "not_ready"`.
- AI returns the same `DecisionBrief` structure with:
  - `status: "not_ready"`
  - `notReady.blocker`
  - `notReady.missingInputs`
  - `notReady.suggestedNextStep`

The UI renders a follow-up section:

```md
## Not Ready Because
...

## Missing Inputs
...

## Suggested Next Step
...
```

## Local Persistence

Decision:

- Use local browser storage only.

Architecture:

- Store draft workflow state in `localStorage`.
- Store:
  - topic
  - hat entries
  - current step
  - generated brief
  - decision status
  - access-granted flag
- Do not sync to a server.
- Provide a clear way to start over and clear local state.
- Enable local storage by default.
- Make local storage transparent with copy such as: "Drafts are saved locally in this browser only. Nothing is saved to our server."
- Add a `Clear draft` button.

Privacy note:

- Because users may enter sensitive content, local persistence should be disclosed or kept easy to clear.

## Privacy And Retention

Decision:

- Do not store prompts or responses server-side.

Architecture:

- API route processes request in memory and returns response.
- No database writes.
- No server-side session history.
- Avoid logging request bodies or model outputs.
- Error logs should not include user-entered decision content.

The app should show the prototype privacy notice before content entry:

> Prototype note: avoid entering confidential client information, secrets, legal/medical details, HR issues, or highly sensitive personal information.

## Analytics

Decision:

- Privacy-light completion events only, if any.
- Skip analytics if it slows the one-day build.

Architecture:

- Vercel Analytics is acceptable if it is quick to add.
- Page views are enough for V1.
- Do not add custom analytics events unless they are extremely lightweight.
- Do not track decision content, prompts, or generated brief text.

## Frontend Structure

Decision:

- Refactor into a smaller app structure without introducing a UI library.

Proposed structure:

```txt
app/
  api/
    brief/
      route.ts
  page.tsx
  layout.tsx
  globals.css
components/
  AccessGate.tsx
  AppShell.tsx
  Intro.tsx
  Progress.tsx
  HatStep.tsx
  HatInput.tsx
  DecisionBriefView.tsx
  DecisionStatusControls.tsx
  MarkdownCopyButton.tsx
  PrivacyNotice.tsx
lib/
  hats.ts
  brief-schema.ts
  markdown.ts
  storage.ts
  openai.ts
```

Notes:

- Exact filenames can change during implementation.
- Keep components simple and app-specific.
- No component library for MVP.

## Validation And Error Handling

API route should validate:

- Access code is present and correct.
- Topic is present.
- Hat entries are arrays of strings.
- Request mode is one of the allowed modes.
- Revision instruction is present for `revise`.
- Blocker text is present for `not_ready`.
- Decision topic is 200 characters or fewer.
- Each bulleted entry is 140 characters or fewer.
- Each free-form section is 1000 characters or fewer.
- Revision instruction is 500 characters or fewer.
- Not-ready blocker text is 500 characters or fewer.

Client-side limits are for UX. Server-side validation is required for safety and cost control.

AI errors should result in user-facing states:

- Access denied.
- Missing required input.
- AI unavailable.
- Invalid AI response.

Fallback behavior:

- If AI fails, preserve all user-entered notes.
- Do not fabricate an AI decision brief silently.
- Allow retry.

## Testing And QA

Decision:

- Build-only plus browser QA checklist.
- Add unit tests for prompt/output parsing only if JSON parsing becomes fragile.

Required verification:

- `npm run build` passes.
- Browser QA validates desktop and mobile flow.
- Access gate blocks AI use without code.
- AI brief generation works with the LinkedIn example.
- Manual edit works.
- AI revision works.
- Not-ready flow works.
- Markdown copy includes the current edited/generated brief.
- Local storage preserves draft after refresh.
- Start over clears local draft.
- No sensitive user content appears in server logs during normal operation.

Browser QA should cover both desktop and mobile.

## Roadmap Architecture Items

Not in MVP:

- Login.
- User accounts.
- Cloud session history.
- Database.
- Share links.
- PDF export.
- Notion or Google Docs integration.
- Team collaboration.
- Provider-agnostic AI abstraction.
- Multi-step AI follow-up during hat entry.
- Robust auth.
- Fine-grained rate limiting.

## Confirmed Architecture Decisions

- Use Next.js App Router.
- Deploy on Vercel.
- Use serverless API routes.
- Use OpenAI directly.
- Default model: `gpt-5.5`.
- Default reasoning effort: `low`.
- Fall back to a cheaper available GPT-5-class model if `gpt-5.5` is unavailable.
- Use one `/api/brief` route with `mode: "generate" | "revise" | "not_ready"`.
- Enable local storage by default.
- Submit access code with each AI request.
- Use `MVP_ACCESS_CODE` for route validation.
- Vercel Analytics page views are acceptable if quick; no content analytics.
- Use simple wait-then-render AI responses.
- Enforce client-side and server-side input limits.

## Open Architecture Questions

None blocking `implementation.md`.
