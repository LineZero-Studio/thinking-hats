import type { DecisionBrief } from "./brief-schema";

export const EXAMPLE_DECISION_BRIEF: DecisionBrief = {
  status: "proposed",
  suggestedDecision:
    "Run a constrained LinkedIn sprint, but protect the project work with a post template, a time cap, and a ten-post review checkpoint.",
  rationale:
    "The campaign has meaningful upside because it can compound visibility around work you are already shipping. The main risk is not the posting itself; it is letting the writing workload steal time, energy, or confidence from the May sprint.",
  mainTradeoff:
    "Daily public consistency versus keeping the actual project sprint focused and sustainable.",
  biggestRisk:
    "The posts become a hidden time tax, get low engagement, and make the team feel like the work is not landing even if the projects are good.",
  bestUpside:
    "By week four, people start associating LineZero with shipping real work consistently, creating credibility, inbound conversations, and a stronger proof-of-work trail.",
  creativeAlternative:
    "Skip daily LinkedIn posts and publish a single end-of-month carousel or microsite that packages all projects into one stronger artifact.",
  nextActions: [
    "Write a reusable post template: problem, build, result, link.",
    "Pre-write the first three posts before the sprint starts.",
    "Set a 20-minute daily writing cap so posting cannot consume build time.",
    "Review after ten posts and switch to a weekly recap if the daily cadence is not worth it.",
  ],
  openQuestions: [
    "Who owns writing and publishing each day?",
    "What metric matters most: inbound DMs, replies, leads, or simply proof-of-work visibility?",
    "What is the kill-switch threshold if the campaign starts hurting the sprint?",
  ],
  confidence: {
    label: "high",
    rationale:
      "The notes are specific enough to recommend a constrained trial, but the actual writing workload still needs to be tested.",
  },
  notReady: null,
};
