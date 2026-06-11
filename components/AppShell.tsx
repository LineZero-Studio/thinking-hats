"use client";

import { useEffect, useMemo, useState } from "react";
import type { BriefError, BriefMode, BriefResponse, DecisionBrief, StoredView } from "../lib/brief-schema";
import { createEmptyEntries, EXAMPLE_SESSION, hasEntryContent, HATS, type HatEntries } from "../lib/hats";
import { EXAMPLE_DECISION_BRIEF } from "../lib/example-brief";
import { hasEnoughInput, INPUT_LIMITS } from "../lib/validation";
import { clearStoredSession, loadStoredSession, saveStoredSession } from "../lib/storage";
import AccessGate from "./AccessGate";
import DecisionBriefView from "./DecisionBriefView";
import Intro from "./Intro";
import Progress from "./Progress";
import HatStep from "./HatStep";

type PendingAction = {
  mode: BriefMode;
  revisionInstruction?: string;
  notReadyBlocker?: string;
};

type BriefRequestBody = {
  accessCode: string;
  mode: BriefMode;
  topic: string;
  entries: HatEntries;
  currentBrief?: DecisionBrief;
  revisionInstruction?: string;
  notReadyBlocker?: string;
};

const initialEntries = createEmptyEntries();

export default function AppShell({
  aiEnabled,
  githubUrl,
}: {
  aiEnabled: boolean;
  githubUrl: string;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<StoredView>("intro");
  const [topic, setTopic] = useState("");
  const [entries, setEntries] = useState<HatEntries>(initialEntries);
  const [stepIdx, setStepIdx] = useState(0);
  const [brief, setBrief] = useState<DecisionBrief | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [accessPromptOpen, setAccessPromptOpen] = useState(false);
  const [accessError, setAccessError] = useState("");
  const [flowError, setFlowError] = useState("");
  const [loadingMode, setLoadingMode] = useState<BriefMode | null>(null);

  const currentHat = HATS[stepIdx];

  const completed = useMemo(() => {
    const done = new Set<number>();
    HATS.forEach((hat, index) => {
      if (hasEntryContent(entries, hat.id)) done.add(index);
    });
    return done;
  }, [entries]);

  useEffect(() => {
    const stored = loadStoredSession();
    if (stored) {
      setTopic(stored.topic);
      setEntries(stored.entries);
      setStepIdx(Math.min(stored.stepIdx, HATS.length - 1));
      setView(stored.view);
      setBrief(stored.brief);
      setAccessCode(stored.accessCode);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveStoredSession({
      version: 1,
      topic,
      entries,
      stepIdx,
      view,
      brief,
      accessCode,
    });
  }, [accessCode, brief, entries, hydrated, stepIdx, topic, view]);

  function start() {
    if (!aiEnabled) {
      setFlowError("This public demo is example-only. Load the LinkedIn example to view the Decision Brief.");
      return;
    }
    const decisionTitle = topic.trim();
    if (decisionTitle) {
      setEntries((prev) => {
        if (prev.blue.some((entry) => entry.trim().length > 0)) return prev;
        return {
          ...prev,
          blue: [decisionTitle],
        };
      });
    }
    setBrief(null);
    setStepIdx(0);
    setFlowError("");
    setView("step");
  }

  function loadExample() {
    setTopic(EXAMPLE_SESSION.topic);
    setEntries(JSON.parse(JSON.stringify(EXAMPLE_SESSION.entries)) as HatEntries);
    setBrief(EXAMPLE_DECISION_BRIEF);
    setStepIdx(0);
    setFlowError("");
    setView("step");
  }

  function updateEntry(hatId: keyof HatEntries, value: string[]) {
    setEntries((prev) => ({
      ...prev,
      [hatId]: value,
    }));
  }

  function clearDraft() {
    clearStoredSession();
    setTopic("");
    setEntries(createEmptyEntries());
    setStepIdx(0);
    setView("intro");
    setBrief(null);
    setAccessCode("");
    setFlowError("");
  }

  function goHome() {
    setAccessPromptOpen(false);
    setPendingAction(null);
    setFlowError("");
    setView("intro");
  }

  function next() {
    setFlowError("");
    if (!aiEnabled) {
      if (stepIdx === HATS.length - 1) {
        setBrief(EXAMPLE_DECISION_BRIEF);
        setView("brief");
        return;
      }
      setStepIdx((idx) => Math.min(idx + 1, HATS.length - 1));
      return;
    }
    if (stepIdx === HATS.length - 1) {
      void requestBrief({ mode: "generate" });
      return;
    }
    setStepIdx((idx) => Math.min(idx + 1, HATS.length - 1));
  }

  function prev() {
    setFlowError("");
    if (stepIdx === 0) {
      setView("intro");
      return;
    }
    setStepIdx((idx) => Math.max(idx - 1, 0));
  }

  function jump(index: number) {
    setFlowError("");
    setView("step");
    setStepIdx(index);
  }

  function jumpToBrief() {
    if (!brief) return;
    setFlowError("");
    setView("brief");
  }

  async function requestBrief(action: PendingAction, codeOverride?: string) {
    if (!aiEnabled) {
      setFlowError("AI generation is disabled for this example-only demo.");
      return;
    }

    if (!hasEnoughInput(topic, entries)) {
      setFlowError("Add a decision and at least one thought before generating a brief.");
      return;
    }

    const code = codeOverride ?? accessCode;
    if (!code) {
      setPendingAction(action);
      setAccessError("");
      setAccessPromptOpen(true);
      return;
    }

    setLoadingMode(action.mode);
    setFlowError("");

    const body: BriefRequestBody = {
      accessCode: code,
      mode: action.mode,
      topic,
      entries,
    };

    if (brief) body.currentBrief = brief;
    if (action.revisionInstruction) body.revisionInstruction = action.revisionInstruction;
    if (action.notReadyBlocker) body.notReadyBlocker = action.notReadyBlocker;

    const response = await fetch("/api/brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);

    setLoadingMode(null);

    if (!response) {
      setFlowError("The brief service is unavailable. Your notes are still saved locally.");
      return;
    }

    const data = (await response.json().catch(() => null)) as BriefResponse | null;
    if (!data || !data.ok) {
      const error = data?.ok === false ? data.error : "ai_unavailable";
      if (error === "access_denied") {
        setAccessCode("");
        setPendingAction(action);
        setAccessError("That access code did not work.");
        setAccessPromptOpen(true);
        return;
      }
      setFlowError(errorMessage(error));
      return;
    }

    setAccessCode(code);
    setBrief(data.brief);
    setPendingAction(null);
    setView("brief");
  }

  function submitAccessCode(code: string) {
    const action = pendingAction;
    setAccessPromptOpen(false);
    if (action) {
      void requestBrief(action, code);
    }
  }

  function acceptBrief() {
    if (!brief) return;
    setBrief({ ...brief, status: "accepted" });
  }

  const hasDraft = hydrated && Boolean(topic || brief || Object.values(entries).some((items) => items.length));

  return (
    <div className="app">
      <Header topic={topic} view={view} onHome={goHome} />

      {view !== "intro" && (
        <Progress
          hats={HATS}
          currentIdx={view === "brief" ? HATS.length : stepIdx}
          completedSet={completed}
          onJump={jump}
          finalAvailable={Boolean(brief)}
          onFinalJump={jumpToBrief}
        />
      )}

      {flowError && <div className="app-alert">{flowError}</div>}

      {view === "intro" && (
        <Intro
          topic={topic}
          setTopic={(value) => setTopic(value.slice(0, INPUT_LIMITS.topic))}
          onStart={start}
          onLoadExample={loadExample}
          onClearDraft={clearDraft}
          hasDraft={hasDraft}
          exampleOnly={!aiEnabled}
          githubUrl={githubUrl}
        />
      )}

      {view === "step" && (
        <HatStep
          hat={currentHat}
          idx={stepIdx}
          total={HATS.length}
          value={entries[currentHat.id]}
          onChange={(value) => updateEntry(currentHat.id, value)}
          onPrev={prev}
          onNext={next}
          isLast={stepIdx === HATS.length - 1}
          isLoading={loadingMode === "generate"}
          finalActionLabel={aiEnabled ? "Generate Decision Brief" : "View Final Brief"}
        />
      )}

      {view === "brief" && brief && (
        <DecisionBriefView
          brief={brief}
          isLoading={loadingMode}
          onBriefChange={setBrief}
          onAccept={acceptBrief}
          onRevise={(revisionInstruction) =>
            requestBrief({ mode: "revise", revisionInstruction })
          }
          onNotReady={(notReadyBlocker) =>
            requestBrief({ mode: "not_ready", notReadyBlocker })
          }
          onEditAnswers={() => setView("step")}
          onStartOver={clearDraft}
          aiEnabled={aiEnabled}
          githubUrl={githubUrl}
        />
      )}

      <AccessGate
        open={accessPromptOpen}
        error={accessError}
        onCancel={() => {
          setAccessPromptOpen(false);
          setPendingAction(null);
        }}
        onSubmit={submitAccessCode}
      />
    </div>
  );
}

function Header({
  topic,
  view,
  onHome,
}: {
  topic: string;
  view: StoredView;
  onHome: () => void;
}) {
  return (
    <header className="top-bar">
      <button className="top-bar__brand" type="button" onClick={onHome}>
        <img className="top-bar__logo" src="/design/linezero-logo.svg" alt="LineZero Studio" />
        <span className="top-bar__label">Thinking Hats</span>
      </button>

      {view !== "intro" && topic && (
        <div className="top-bar__topic">
          <strong>Deciding:</strong> {topic}
        </div>
      )}
    </header>
  );
}

function errorMessage(error: BriefError): string {
  if (error === "input_too_long") return "One or more inputs are over the MVP character limits.";
  if (error === "invalid_request") return "Something in the request is missing or invalid.";
  if (error === "invalid_ai_response") return "The AI returned an unexpected response. Try again.";
  return "The brief service is unavailable. Your notes are still saved locally.";
}
