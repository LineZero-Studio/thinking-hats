import type { BriefError, BriefMode, BriefRequest, DecisionBrief } from "./brief-schema";
import { createEmptyEntries, HAT_IDS, type HatEntries, type HatId } from "./hats";

export const INPUT_LIMITS = {
  topic: 200,
  bullet: 140,
  section: 1000,
  revisionInstruction: 500,
  notReadyBlocker: 500,
} as const;

type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: BriefError };

export function trimToLimit(value: string, limit: number): string {
  return value.length > limit ? value.slice(0, limit) : value;
}

export function validateBriefPayload(input: unknown): ValidationResult<BriefRequest> {
  if (!isRecord(input)) return { ok: false, error: "invalid_request" };

  const mode = input.mode;
  if (!isBriefMode(mode)) return { ok: false, error: "invalid_request" };

  const accessCode = input.accessCode;
  const topic = input.topic;
  if (typeof accessCode !== "string" || typeof topic !== "string" || !topic.trim()) {
    return { ok: false, error: "invalid_request" };
  }
  if (topic.length > INPUT_LIMITS.topic) return { ok: false, error: "input_too_long" };

  const entries = parseEntries(input.entries);
  if (!entries) return { ok: false, error: "invalid_request" };

  if (entriesTooLong(entries)) return { ok: false, error: "input_too_long" };

  const request: BriefRequest = {
    accessCode,
    mode,
    topic,
    entries,
  };

  if (input.currentBrief !== undefined && input.currentBrief !== null) {
    if (!isDecisionBriefLike(input.currentBrief)) {
      return { ok: false, error: "invalid_request" };
    }
    request.currentBrief = input.currentBrief;
  }

  if (mode === "revise") {
    if (typeof input.revisionInstruction !== "string" || !input.revisionInstruction.trim()) {
      return { ok: false, error: "invalid_request" };
    }
    if (input.revisionInstruction.length > INPUT_LIMITS.revisionInstruction) {
      return { ok: false, error: "input_too_long" };
    }
    request.revisionInstruction = input.revisionInstruction;
  }

  if (mode === "not_ready") {
    if (typeof input.notReadyBlocker !== "string" || !input.notReadyBlocker.trim()) {
      return { ok: false, error: "invalid_request" };
    }
    if (input.notReadyBlocker.length > INPUT_LIMITS.notReadyBlocker) {
      return { ok: false, error: "input_too_long" };
    }
    request.notReadyBlocker = input.notReadyBlocker;
  }

  return { ok: true, value: request };
}

export function parseEntries(input: unknown): HatEntries | null {
  if (!isRecord(input)) return null;

  const entries = createEmptyEntries();
  for (const hatId of HAT_IDS) {
    const value = input[hatId];
    if (!Array.isArray(value)) return null;
    entries[hatId] = value.filter((item): item is string => typeof item === "string");
  }
  return entries;
}

export function entriesTooLong(entries: HatEntries): boolean {
  return HAT_IDS.some((hatId) => {
    const sectionLength = entries[hatId].join("\n").length;
    return (
      sectionLength > INPUT_LIMITS.section ||
      entries[hatId].some((entry) => entry.length > INPUT_LIMITS.bullet)
    );
  });
}

export function hasEnoughInput(topic: string, entries: HatEntries): boolean {
  if (!topic.trim()) return false;
  return HAT_IDS.some((hatId) => entries[hatId].some((entry) => entry.trim()));
}

function isBriefMode(value: unknown): value is BriefMode {
  return value === "generate" || value === "revise" || value === "not_ready";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDecisionBriefLike(value: unknown): value is DecisionBrief {
  if (!isRecord(value)) return false;
  return (
    typeof value.suggestedDecision === "string" &&
    typeof value.rationale === "string" &&
    typeof value.mainTradeoff === "string" &&
    typeof value.biggestRisk === "string" &&
    typeof value.bestUpside === "string" &&
    typeof value.creativeAlternative === "string" &&
    Array.isArray(value.nextActions) &&
    Array.isArray(value.openQuestions)
  );
}
