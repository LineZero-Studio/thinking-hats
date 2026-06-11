# Agent Plan

## Goal

Move the current Six Hats prototype from a working React/Vite prototype to an MVP through a collaborative specification process. The user owns all architectural decisions. The agent's role is to surface options, identify unknowns, write the specs, and keep implementation tasks traceable back to approved decisions.

## Current Prototype State

- React 18 app running on Vite.
- Single-session Six Thinking Hats workflow.
- Local component state only.
- Static/example summary generation with a deterministic fallback from captured notes.
- LineZero visual assets and CSS are present.
- Prototype-only runtime files and protocol references have been removed.

## Specification Order

1. `plan.md` - Agent plan and collaboration workflow.
2. `project.md` - Product idea solidification: user, problem, MVP promise, scope, non-goals, success criteria, open risks.
3. `architecture.md` - Architecture specification after the user chooses architecture direction and tradeoffs.
4. `implementation.md` - Implementation specification derived from the approved architecture.
5. `plan/[epic]/[story].md` - Task sequencing specs, one story file per implementation task.

## Collaboration Gates

Each artifact must be completed and accepted before moving to the next artifact.

- Gate 1: User answers product discovery questions, then `project.md` is drafted.
- Gate 2: User confirms or edits `project.md`.
- Gate 3: Agent presents architecture questions/options; user makes architecture decisions.
- Gate 4: `architecture.md` is drafted and accepted.
- Gate 5: `implementation.md` is drafted from accepted architecture and accepted.
- Gate 6: Task files are created under `plan/[epic]/[story].md`.

## Decision Ownership

The agent may recommend options and explain tradeoffs, but should not decide:

- Hosting target.
- Persistence model.
- Authentication model.
- AI/provider strategy.
- Backend/API shape.
- Data privacy posture.
- Monetization/account model.
- Analytics/telemetry policy.
- Deployment and operations expectations.

## Working Rules

- Keep specs concise but complete enough to implement against.
- Track unresolved questions explicitly in each spec.
- Avoid implementation commitments before architecture is accepted.
- Prefer MVP scope that can be shipped and tested with real users.
- Separate prototype cleanup from MVP product work.

## Next Step

Collect product discovery answers for `project.md`.
