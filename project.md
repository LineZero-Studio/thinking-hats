# Project Spec

## Status

Product direction accepted for architecture discovery.

## Product Summary

Build `Thinking Hats`, a solo Six Thinking Hats MVP that turns scattered thoughts about a messy business or product decision into a clear decision brief.

The MVP should feel like a structured decision tool, not a generic AI wrapper and not a basic notes app with an AI summary button. The LinkedIn campaign decision is the flagship example, but the product should support broader founder, builder, and small agency decisions.

## Target User

Primary MVP users:

- Solo founders.
- Solo builders.
- Small agency operators.

The MVP should not optimize for teams yet. Collaboration, permissions, facilitation, disagreement handling, and shared workspaces are explicitly out of scope.

## Core Problem

The user has a real business or product decision where facts, emotions, risks, upside, and creative alternatives are mixed together. They need a guided way to separate those modes of thinking and turn the result into a clear next move.

Initial flagship use case:

- Deciding whether and how to commit to a daily LinkedIn or project-sharing campaign.

Other lightweight examples:

- Evaluating a new product idea.
- Prioritizing a client or project.

## Positioning

The MVP should use Six Thinking Hats as the explicit framing for now. No renamed sections are required for V1.

Preferred product framing:

- A Six Hats decision tool.
- A solo decision brief generator.
- A guided decision clarity workflow.

Future versions may broaden beyond Six Hats if validation supports that direction.

Avoid:

- Feeling like a generic chat app.
- Feeling like an unstructured notes app with an AI summary button.

## MVP Promise

In one short session, the user can move from scattered thoughts to a decision brief they can copy, save, or act on.

The app should help the user decide, but the user owns the decision. AI may propose a decision and rationale, but it should not present its answer as final or authoritative.

## MVP Flow

1. User enters the decision they are trying to make.
2. User works through guided thinking sections.
3. The app identifies thin sections and may ask lightweight follow-up questions.
4. The app generates a decision brief.
5. User reaches an ownership step:
   - Accept the proposed decision.
   - Revise the decision.
   - Mark the decision as not ready.
6. If the user marks the decision as not ready, the app asks what is blocking the decision and adds a short unresolved-decision section.
7. User copies the decision brief as Markdown.

## Thinking Sections

The MVP should keep the current hat-based structure and user-facing section names:

- Blue Hat: decision objective.
- White Hat: facts and known context.
- Red Hat: feelings, intuition, or gut read.
- Black Hat: risks and constraints.
- Yellow Hat: upside and opportunities.
- Green Hat: alternatives and creative options.

## Decision Brief Output

The final output should be called `Decision Brief` in the UI.

The output should include:

- Suggested decision.
- Rationale.
- Main tradeoff.
- Biggest risk.
- Best upside.
- Creative alternative.
- Next actions.
- Open questions.
- AI confidence level.

The brief should be crisp enough to copy into a note, document, Slack message, or planning artifact.

## Decision Ownership

The MVP should preserve user ownership of the decision. The AI can propose a decision, but the user must classify the result.

Supported decision statuses:

- `Accepted`: user agrees with the proposed decision.
- `Needs Revision`: user wants the AI to modify the decision brief.
- `Not Ready`: user needs more information, time, or reflection before deciding.

For MVP, `Not Ready` should:

- Mark the decision status as `Not Ready`.
- Ask the user what is blocking the decision.
- Generate a short list of missing inputs or unresolved questions.
- Avoid treating the session as failed.

The `Not Ready` follow-up section should use this structure:

```md
## Not Ready Because
...

## Missing Inputs
...

## Suggested Next Step
...
```

## AI Role

AI should focus on the end-of-session decision brief.

Allowed in MVP:

- Synthesize user notes into a decision brief.
- Propose a decision while making clear that the user owns it.
- Ask lightweight follow-up questions when a section is thin.

Avoid in MVP:

- Full chat-app behavior.
- Open-ended assistant conversation.
- Complex facilitation.
- Strong claims that the AI has determined the correct decision.

The exact provider, API shape, fallback behavior, and cost controls are architecture decisions and are intentionally not specified here.

## Persistence And Export

MVP requirements:

- No login.
- No cloud-saved sessions.
- No user account history.
- Copy as Markdown.

Nice if easy:

- None for MVP.

Roadmap:

- Local draft persistence so accidental refreshes do not destroy work.

Out of scope:

- Share links.
- PDF export.
- Email export.
- Notion integration.
- Google Docs integration.
- Cloud history.

## Privacy Posture

Users may enter sensitive business or personal reasoning, including:

- Business strategy.
- Client decisions.
- Hiring or firing thoughts.
- Financial decisions.
- Team conflict.
- Product ideas.
- Personal emotional reasoning.

MVP privacy requirement:

- Clearly warn users not to enter confidential, legal, medical, HR, financial, or highly sensitive personal information.
- Do not overpromise privacy or security.
- Show the privacy notice before the user enters sensitive content.
- Place a small notice near the main decision input.
- Repeat a lighter version near examples/templates if those examples imply business, client, HR, or financial decisions.

Suggested notice:

> Prototype note: avoid entering confidential client information, secrets, legal/medical details, HR issues, or highly sensitive personal information.

The notice should be visible but not scary. It should feel like a responsible prototype constraint, not a legal wall.

More detailed data handling, AI retention, logging, and hosting choices are architecture decisions.

## Decision Categories

The MVP is for clarifying everyday business, creative, product, and planning decisions. It should not be used as a substitute for professional advice or for urgent/high-stakes personal decisions.

Encouraged categories:

- Product ideas.
- Marketing and campaign decisions.
- Project prioritization.
- Content strategy.
- Founder and solo-builder planning.
- Creative alternatives.
- Internal operating decisions without sensitive personnel data.

Discouraged categories:

- Legal decisions.
- Medical or mental health decisions.
- Emergency or safety decisions.
- Hiring, firing, or disciplinary decisions involving identifiable employees.
- High-stakes financial or investment decisions.
- Decisions involving confidential client data or trade secrets.
- Relationship or family conflict where the app could escalate emotional certainty.
- Decisions requiring professional judgment from a lawyer, doctor, therapist, accountant, or HR specialist.

The app may help with low-stakes framing around some discouraged areas, but it should not present itself as a decision-maker for them.

## Brand Direction

Keep LineZero branding in the MVP.

The product can still be treated as an MVP or lab-stage product until the concept proves useful.

## Platform And UX Requirements

The MVP should work well on both desktop and mobile from the start.

Baseline accessibility:

- Keyboard-operable controls.
- Clear labels.
- Readable type.
- Good contrast.
- Responsive layout that remains usable on mobile.

## MVP Success Criteria

The MVP succeeds if users complete sessions and say the resulting decision brief helped them clarify or act on a real decision.

Success does not require:

- Paid users.
- Team adoption.
- Cloud accounts.
- Advanced analytics.

## Non-Goals

- Team collaboration.
- Login.
- Cloud history.
- Share links.
- PDF export.
- Notion or Google Docs integration.
- Payments.
- Analytics-heavy product instrumentation.
- Real-time facilitation.
- Full decision graph.
- Team disagreement workflows.

## One-Day MVP Scope

Scope should stay brutally small.

The three highest-priority improvements beyond the current prototype are:

1. Guided prompts per thinking section.
2. A crisp `Decision Brief` output.
3. An accept / revise / not-ready step so the user owns the final decision.

## Confirmed Product Decisions

- MVP name: `Thinking Hats`.
- Final output label: `Decision Brief`.
- Confidence level means AI confidence.
- Keep the LinkedIn campaign example built in as a sample session.
- Defer local draft persistence to the roadmap.
- `Not Ready` marks the decision status, asks what is blocking the decision, and generates missing inputs/unresolved questions.
- Privacy warning appears before sensitive content entry near the main decision input, with lighter repetition near sensitive examples/templates if needed.
- Discourage high-stakes legal, medical, emergency, HR, financial, confidential, and professional-advice decisions.

## Conflicts With Current Prototype

These prototype-to-MVP changes are confirmed:

- Keep the explicit Six Hats framing.
- Keep the current hat names and hat-first structure.
- Keep LineZero branding.

These prototype-to-MVP gaps remain:

- Current prototype has a static/example-oriented summary; MVP needs a real decision brief workflow.
- Current prototype does not include accept / revise / not-ready ownership.
- Current prototype does not include Markdown copy export.
- Current prototype is mostly desktop-shaped; MVP requires mobile and desktop to both work well.
- Current prototype has no privacy warning; MVP requires one.

## Open Product Questions

None blocking architecture discovery.
