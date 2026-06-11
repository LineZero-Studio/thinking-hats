import type { HatEntries, HatId } from "./hats";

export type BriefMode = "generate" | "revise" | "not_ready";

export type DecisionStatus = "proposed" | "accepted" | "needs_revision" | "not_ready";

export type ConfidenceLabel = "low" | "medium" | "high";

export type NotReadyDetails = {
  blocker: string;
  missingInputs: string[];
  suggestedNextStep: string;
};

export type DecisionBrief = {
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
    label: ConfidenceLabel;
    rationale: string;
  };
  notReady: NotReadyDetails | null;
};

export type BriefRequest = {
  accessCode: string;
  mode: BriefMode;
  topic: string;
  entries: HatEntries;
  currentBrief?: DecisionBrief;
  revisionInstruction?: string;
  notReadyBlocker?: string;
};

export type BriefError =
  | "access_denied"
  | "invalid_request"
  | "input_too_long"
  | "ai_unavailable"
  | "invalid_ai_response";

export type BriefResponse =
  | { ok: true; brief: DecisionBrief }
  | { ok: false; error: BriefError };

export type StoredView = "intro" | "step" | "brief";

export type StoredSession = {
  version: 1;
  topic: string;
  entries: HatEntries;
  stepIdx: number;
  view: StoredView;
  brief: DecisionBrief | null;
  accessCode: string;
};

export const decisionBriefJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "status",
    "suggestedDecision",
    "rationale",
    "mainTradeoff",
    "biggestRisk",
    "bestUpside",
    "creativeAlternative",
    "nextActions",
    "openQuestions",
    "confidence",
    "notReady",
  ],
  properties: {
    status: {
      type: "string",
      enum: ["proposed", "accepted", "needs_revision", "not_ready"],
    },
    suggestedDecision: { type: "string" },
    rationale: { type: "string" },
    mainTradeoff: { type: "string" },
    biggestRisk: { type: "string" },
    bestUpside: { type: "string" },
    creativeAlternative: { type: "string" },
    nextActions: {
      type: "array",
      minItems: 1,
      maxItems: 5,
      items: { type: "string" },
    },
    openQuestions: {
      type: "array",
      minItems: 0,
      maxItems: 5,
      items: { type: "string" },
    },
    confidence: {
      type: "object",
      additionalProperties: false,
      required: ["label", "rationale"],
      properties: {
        label: { type: "string", enum: ["low", "medium", "high"] },
        rationale: { type: "string" },
      },
    },
    notReady: {
      type: ["object", "null"],
      additionalProperties: false,
      required: ["blocker", "missingInputs", "suggestedNextStep"],
      properties: {
        blocker: { type: "string" },
        missingInputs: {
          type: "array",
          minItems: 1,
          maxItems: 5,
          items: { type: "string" },
        },
        suggestedNextStep: { type: "string" },
      },
    },
  },
} as const;

export const HAT_LABELS: Record<HatId, string> = {
  blue: "Blue Hat",
  white: "White Hat",
  red: "Red Hat",
  black: "Black Hat",
  yellow: "Yellow Hat",
  green: "Green Hat",
};
