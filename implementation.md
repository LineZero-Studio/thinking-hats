# Implementation Spec

## Status

Accepted for task sequencing.

## Objective

Convert the current Vite React prototype into a publicly deployable Next.js App Router MVP for `Thinking Hats`.

The MVP must let a solo user:

1. Enter a decision.
2. Work through six guided hat sections.
3. Generate an AI-backed `Decision Brief`.
4. Accept, revise, or mark the decision as not ready.
5. Copy the current brief as Markdown.
6. Preserve draft state locally in the browser.

## Tech Stack

- Next.js App Router.
- React.
- TypeScript for app code, API route contracts, and shared types.
- Plain CSS or CSS modules, reusing the current visual system where practical.
- OpenAI JavaScript SDK.
- Vercel deployment.
- Optional Vercel Analytics page views only.

## Environment Variables

```env
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.5
OPENAI_REASONING_EFFORT=low
OPENAI_FALLBACK_MODEL=gpt-5-mini
MVP_ACCESS_CODE=...
EXAMPLE_ONLY_DEMO=true
```

Model fallback:

- Default to `gpt-5.5`.
- If unavailable in the project, the API route can retry `OPENAI_FALLBACK_MODEL`.
- If needed, set `OPENAI_MODEL` to a cheaper available GPT-5-class model without changing app code.
- For a public example-only deployment without AI, set `EXAMPLE_ONLY_DEMO=true` and omit OpenAI/access-code secrets.

## Proposed File Structure

```txt
app/
  api/
    brief/
      route.ts
  layout.tsx
  page.tsx
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
  LocalDraftNotice.tsx
lib/
  brief-schema.ts
  hats.ts
  markdown.ts
  openai.ts
  storage.ts
  validation.ts
```

Exact filenames can change during implementation, but these ownership boundaries should stay clear:

- `components/`: UI only.
- `lib/hats.ts`: hat copy, prompts, examples.
- `lib/brief-schema.ts`: shared brief types and JSON schema.
- `lib/markdown.ts`: deterministic Markdown export.
- `lib/openai.ts`: server-only OpenAI call construction.
- `lib/storage.ts`: localStorage helpers.
- `lib/validation.ts`: shared input limits and validation helpers.

## Migration Plan

1. Replace Vite files with Next.js App Router structure.
2. Move current CSS into `app/globals.css` or import it from there.
3. Move current component logic into app-specific components.
4. Replace global state and browser globals with typed React state.
5. Add serverless `/api/brief` route.
6. Add local storage draft persistence.
7. Add access-code gate.
8. Add Decision Brief, revise, not-ready, and Markdown copy flows.
9. Build and browser QA.

## User Flow

### Access Gate

- Anyone can view the intro, explanation, privacy warning, and examples.
- User may fill the workflow locally before entering an access code.
- Access code is required before any AI request: generate, revise, or not-ready.
- When an AI action is requested without a valid code, prompt for the access code.
- If correct, store the access code locally for future API requests.
- If incorrect, show a short error and do not call AI.
- Do not create accounts, sessions, signed cookies, or JWTs.

### Intro

The intro screen includes:

- Product name: `Thinking Hats`.
- LineZero branding.
- Main decision input.
- Privacy notice near the decision input:

```txt
Prototype note: avoid entering confidential client information, secrets, legal/medical details, HR issues, or highly sensitive personal information.
```

- Local draft notice:

```txt
Drafts are saved locally in this browser only. Nothing is saved to our server.
```

- `Begin` button.
- `Load example session` button for the LinkedIn example.
- `Clear draft` button when a draft exists.

### Hat Steps

Keep the six current hats:

- Blue: decision objective.
- White: facts and known context.
- Red: feelings, intuition, or gut read.
- Black: risks and constraints.
- Yellow: upside and opportunities.
- Green: alternatives and creative options.

Each hat step includes:

- Hat name and purpose.
- Guided prompt.
- Hint.
- Bullet input list.
- Add/remove bullet controls.
- Progress rail.
- Back/next controls.

For MVP, bullet input is the primary entry mode.

### Brief Generation

After Green Hat:

- User clicks `Generate Decision Brief`.
- UI sends one request to `/api/brief` with `mode: "generate"`.
- UI shows a simple loading state.
- On success, UI renders `DecisionBriefView`.
- On failure, preserve all notes and show retry.

### Decision Brief

Render sections from structured JSON:

- Suggested decision.
- Rationale.
- Main tradeoff.
- Biggest risk.
- Best upside.
- Creative alternative.
- Next actions.
- Open questions.
- AI confidence.

The brief view should clearly say the user owns the decision.

### Status Controls

Decision statuses:

- `Accepted`
- `Needs Revision`
- `Not Ready`

Actions:

- `Accept`: sets status to accepted locally.
- `Revise`: opens revision instruction input.
- `Not Ready`: opens blocker input.

### Revision

Revision flow:

1. User clicks `Needs Revision`.
2. User enters a revision instruction.
3. Client validates instruction length.
4. UI sends `/api/brief` with `mode: "revise"`, original notes, current brief, and instruction.
5. API returns revised structured brief.
6. UI replaces current brief with the revised brief.

Manual edit flow:

- Default state renders the decision brief read-only.
- User clicks `Edit brief`.
- Fields become editable text areas/inputs.
- User can `Save edits` or `Cancel`.
- Saved edits update local brief state.
- Markdown export always uses the current edited state.

### Not Ready

Not-ready flow:

1. User clicks `Not Ready`.
2. User enters what is blocking the decision.
3. Client validates blocker length.
4. UI sends `/api/brief` with `mode: "not_ready"`, original notes, current brief, and blocker.
5. API returns a brief with `status: "not_ready"` and a `notReady` section.
6. UI renders:

```md
## Not Ready Because
...

## Missing Inputs
...

## Suggested Next Step
...
```

## API Contract

Endpoint:

```txt
POST /api/brief
```

Request:

```ts
type BriefMode = "generate" | "revise" | "not_ready";

type BriefRequest = {
  accessCode: string;
  mode: BriefMode;
  topic: string;
  entries: Record<HatId, string[]>;
  currentBrief?: DecisionBrief;
  revisionInstruction?: string;
  notReadyBlocker?: string;
};
```

Response:

```ts
type BriefResponse =
  | { ok: true; brief: DecisionBrief }
  | { ok: false; error: BriefError };

type BriefError =
  | "access_denied"
  | "invalid_request"
  | "input_too_long"
  | "ai_unavailable"
  | "invalid_ai_response";
```

## Decision Brief Contract

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

## Input Limits

Client and server must both enforce:

- Decision title / main decision prompt: 200 characters.
- Bulleted entry: 140 characters.
- Free-form section: 1000 characters.
- Revision instruction: 500 characters.
- Not-ready blocker text: 500 characters.

Validation behavior:

- Client should prevent or clearly show over-limit input.
- Server should reject over-limit input with `input_too_long`.
- API should not send over-limit content to OpenAI.

## OpenAI Prompting And Structured Output

The server route should:

- Validate access code.
- Validate request shape and limits.
- Build a concise prompt from topic, hat entries, mode, and optional current brief.
- Call OpenAI Responses API.
- Request Structured Outputs with the `DecisionBrief` JSON schema.
- Use `reasoning.effort` from `OPENAI_REASONING_EFFORT`.
- Return parsed JSON only.

Prompt behavior:

- Keep the decision advisory, not authoritative.
- Preserve user ownership.
- Avoid professional advice claims.
- Respect discouraged categories by framing the result as clarification, not expert judgment.
- Keep output crisp and action-oriented.
- For `not_ready`, focus on missing inputs and next step, not forcing a decision.

## Markdown Export

Generate Markdown deterministically from the current `DecisionBrief` object.

Include:

```md
# Decision Brief

## Status

## Suggested Decision

## Rationale

## Main Tradeoff

## Biggest Risk

## Best Upside

## Creative Alternative

## Next Actions

## Open Questions

## AI Confidence
```

If status is `not_ready`, also include:

```md
## Not Ready Because

## Missing Inputs

## Suggested Next Step
```

Copy action:

- Use clipboard API.
- Show copied state.
- If clipboard fails, show selectable Markdown text.

## Local Storage

Store:

- Access code.
- Topic.
- Hat entries.
- Current step/view.
- Generated/current brief.
- Decision status.

Do not store:

- Server logs.
- Any remote session state.
- Analytics content payloads.

Storage behavior:

- Save after meaningful changes.
- Hydrate on app load.
- Show local draft notice.
- `Clear draft` removes local draft and resets the app.

## Privacy And Safety UI

Include a visible prototype note before content entry.

Discouraged categories should appear in concise copy, not a long legal document.

For one-day MVP, use static guidance only. Do not build automatic category detection.

Suggested helper copy:

```txt
Thinking Hats is for everyday business, creative, product, and planning decisions. It is not a substitute for legal, medical, financial, HR, emergency, or other professional advice.
```

Optional guardrail:

- Add a checkbox before generation only if it does not make the flow feel heavy.
- Copy: `I understand this prototype is not for legal, medical, emergency, HR, high-stakes financial, or highly sensitive decisions.`

## Analytics

If quick:

- Add Vercel Analytics for page views.

Do not add:

- Custom event payloads with user content.
- Topic tracking.
- Hat entry tracking.
- Generated brief tracking.

If analytics setup takes time, skip it.

## Error States

Access errors:

- Wrong access code.
- Missing access code.

Input errors:

- Missing topic.
- Empty or thin notes.
- Over character limits.

AI errors:

- Provider unavailable.
- Invalid structured response.
- Timeout or network issue.

User-facing rule:

- Preserve all user-entered content.
- Offer retry.
- Do not silently replace AI output with a fake generated brief.

## QA Checklist

Build:

- `npm run build` passes.

Desktop browser:

- Access code gate works.
- Wrong access code fails.
- LinkedIn example loads.
- User can complete all six hats.
- Character limits are enforced.
- Decision brief generates.
- Manual edit works.
- AI revision works.
- Not-ready flow works.
- Markdown copy works.
- Clear draft works.
- Refresh restores local draft.

Mobile browser:

- Intro is usable.
- Progress does not break layout.
- Hat entry is comfortable.
- Decision brief is readable.
- Status controls fit without overlap.
- Copy action is reachable.

Privacy/safety:

- Privacy note appears before sensitive content entry.
- Local storage notice appears.
- Discouraged-category guidance appears near the main input.
- Server errors do not expose request content.

## Implementation Non-Goals

- Team collaboration.
- Login.
- Database.
- Cloud-saved sessions.
- Share links.
- PDF export.
- Streaming AI responses.
- Provider abstraction.
- Multi-call follow-up questions during hat entry.
- Custom analytics events unless trivial and content-free.

## Confirmed Implementation Decisions

- Manual brief editing uses a separate `Edit brief` mode.
- Intro, explanation, privacy warning, and examples are visible before code entry.
- Access code is required before AI requests only.
- Discouraged-category safety uses static guidance only in MVP.

## Open Implementation Questions

None blocking task sequencing.
