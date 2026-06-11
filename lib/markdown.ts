import type { DecisionBrief } from "./brief-schema";

export function decisionBriefToMarkdown(brief: DecisionBrief): string {
  const lines = [
    "# Decision Brief",
    "",
    "## Status",
    statusLabel(brief.status),
    "",
    "## Suggested Decision",
    brief.suggestedDecision,
    "",
    "## Rationale",
    brief.rationale,
    "",
    "## Main Tradeoff",
    brief.mainTradeoff,
    "",
    "## Biggest Risk",
    brief.biggestRisk,
    "",
    "## Best Upside",
    brief.bestUpside,
    "",
    "## Creative Alternative",
    brief.creativeAlternative,
    "",
    "## Next Actions",
    ...asBullets(brief.nextActions),
    "",
    "## Open Questions",
    ...(brief.openQuestions.length > 0 ? asBullets(brief.openQuestions) : ["None noted."]),
    "",
    "## AI Confidence",
    `${capitalize(brief.confidence.label)} - ${brief.confidence.rationale}`,
  ];

  if (brief.status === "not_ready" && brief.notReady) {
    lines.push(
      "",
      "## Not Ready Because",
      brief.notReady.blocker,
      "",
      "## Missing Inputs",
      ...asBullets(brief.notReady.missingInputs),
      "",
      "## Suggested Next Step",
      brief.notReady.suggestedNextStep,
    );
  }

  return `${lines.join("\n").trim()}\n`;
}

function asBullets(items: string[]): string[] {
  return items.map((item) => `- ${item}`);
}

function statusLabel(status: DecisionBrief["status"]): string {
  if (status === "accepted") return "Accepted";
  if (status === "needs_revision") return "Needs Revision";
  if (status === "not_ready") return "Not Ready";
  return "Proposed";
}

function capitalize(value: string): string {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}
