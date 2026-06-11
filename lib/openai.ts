import OpenAI from "openai";
import type { BriefRequest, DecisionBrief } from "./brief-schema";
import { decisionBriefJsonSchema, HAT_LABELS } from "./brief-schema";
import { HAT_IDS } from "./hats";

const DEFAULT_MODEL = "gpt-5.5";
const DEFAULT_FALLBACK_MODEL = "gpt-5-mini";
const DEFAULT_REASONING_EFFORT = "low";

export async function createDecisionBrief(request: BriefRequest): Promise<DecisionBrief> {
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const fallbackModel = process.env.OPENAI_FALLBACK_MODEL || DEFAULT_FALLBACK_MODEL;

  try {
    return await callModel(model, request);
  } catch (error) {
    if (model !== fallbackModel && isModelUnavailable(error)) {
      return await callModel(fallbackModel, request);
    }
    throw error;
  }
}

async function callModel(model: string, request: BriefRequest): Promise<DecisionBrief> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model,
    reasoning: {
      effort: process.env.OPENAI_REASONING_EFFORT || DEFAULT_REASONING_EFFORT,
    },
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: SYSTEM_PROMPT,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildUserPrompt(request),
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "decision_brief",
        strict: true,
        schema: decisionBriefJsonSchema,
      },
    },
  } as never);

  const output = response.output_text;
  if (!output) {
    throw new Error("missing_output_text");
  }

  return JSON.parse(output) as DecisionBrief;
}

const SYSTEM_PROMPT = `
You create concise Decision Briefs for Thinking Hats, a solo Six Thinking Hats decision tool.

Rules:
- Produce only the structured JSON requested by the schema.
- The user owns the decision. You propose, you do not decide for them.
- Do not claim professional authority.
- Do not give legal, medical, emergency, HR, high-stakes financial, or other professional advice.
- Keep the output crisp, specific, and useful.
- Prefer practical next actions over abstract advice.
- Confidence is AI confidence in the brief based on the available notes, not certainty that the decision is correct.
- If mode is not_ready, set status to "not_ready" and focus on missing inputs, unresolved questions, and the next step. Do not force a decision.
`.trim();

function buildUserPrompt(request: BriefRequest): string {
  const notes = HAT_IDS.map((hatId) => {
    const entries = request.entries[hatId].filter((entry) => entry.trim());
    return {
      hat: HAT_LABELS[hatId],
      entries,
    };
  });

  return JSON.stringify(
    {
      mode: request.mode,
      decisionTopic: request.topic,
      notes,
      currentBrief: request.currentBrief || null,
      revisionInstruction: request.revisionInstruction || null,
      notReadyBlocker: request.notReadyBlocker || null,
      outputGuidance: {
        generate:
          "Create a proposed Decision Brief. Use status proposed and notReady null.",
        revise:
          "Revise the current brief according to the revision instruction. Use status needs_revision unless the instruction clearly asks otherwise. notReady should be null unless the user asks to mark it not ready.",
        not_ready:
          "Mark the brief not ready. Include the blocker, missing inputs, and one suggested next step. Keep any suggested decision tentative.",
      }[request.mode],
    },
    null,
    2,
  );
}

function isModelUnavailable(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const maybe = error as { status?: number; code?: string; message?: string };
  return (
    maybe.status === 404 ||
    maybe.code === "model_not_found" ||
    maybe.message?.toLowerCase().includes("model") === true
  );
}
