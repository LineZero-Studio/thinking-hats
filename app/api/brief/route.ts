import { NextResponse } from "next/server";
import type { BriefResponse } from "../../../lib/brief-schema";
import { createDecisionBrief } from "../../../lib/openai";
import { validateBriefPayload } from "../../../lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse<BriefResponse>> {
  const accessCode = process.env.MVP_ACCESS_CODE;
  if (!process.env.OPENAI_API_KEY || !accessCode) {
    return NextResponse.json({ ok: false, error: "ai_unavailable" }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const validation = validateBriefPayload(payload);
  if (!validation.ok) {
    const status = validation.error === "input_too_long" ? 413 : 400;
    return NextResponse.json({ ok: false, error: validation.error }, { status });
  }

  if (validation.value.accessCode !== accessCode) {
    return NextResponse.json({ ok: false, error: "access_denied" }, { status: 401 });
  }

  try {
    const brief = await createDecisionBrief(validation.value);
    return NextResponse.json({ ok: true, brief });
  } catch {
    return NextResponse.json({ ok: false, error: "ai_unavailable" }, { status: 503 });
  }
}
