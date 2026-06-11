"use client";

import { useMemo, useState } from "react";
import DecisionBriefView from "../../components/DecisionBriefView";
import HatStep from "../../components/HatStep";
import Progress from "../../components/Progress";
import SiteHeader from "../../components/SiteHeader";
import type { DecisionBrief } from "../../lib/brief-schema";
import { EXAMPLE_DECISION_BRIEF } from "../../lib/example-brief";
import {
  EXAMPLE_SESSION,
  HATS,
  hasEntryContent,
  type HatEntries,
} from "../../lib/hats";

type DemoView = "step" | "brief";

export default function DemoPage() {
  const [view, setView] = useState<DemoView>("step");
  const [stepIdx, setStepIdx] = useState(0);
  const [entries, setEntries] = useState<HatEntries>(() => cloneExampleEntries());
  const [brief, setBrief] = useState<DecisionBrief>(EXAMPLE_DECISION_BRIEF);

  const currentHat = HATS[stepIdx];
  const githubUrl =
    process.env.NEXT_PUBLIC_GITHUB_URL ||
    "https://github.com/LineZero-Studio/thinking-hats";

  const completed = useMemo(() => {
    const done = new Set<number>();
    HATS.forEach((hat, index) => {
      if (hasEntryContent(entries, hat.id)) done.add(index);
    });
    return done;
  }, [entries]);

  function updateEntry(hatId: keyof HatEntries, value: string[]) {
    setEntries((prev) => ({
      ...prev,
      [hatId]: value,
    }));
  }

  function next() {
    if (stepIdx === HATS.length - 1) {
      setBrief(EXAMPLE_DECISION_BRIEF);
      setView("brief");
      return;
    }
    setStepIdx((idx) => Math.min(idx + 1, HATS.length - 1));
  }

  function prev() {
    setStepIdx((idx) => Math.max(idx - 1, 0));
  }

  function jump(index: number) {
    setView("step");
    setStepIdx(index);
  }

  function resetDemo() {
    setEntries(cloneExampleEntries());
    setBrief(EXAMPLE_DECISION_BRIEF);
    setStepIdx(0);
    setView("step");
  }

  return (
    <div className="app">
      <SiteHeader topic={EXAMPLE_SESSION.topic} />

      <Progress
        hats={HATS}
        currentIdx={view === "brief" ? HATS.length : stepIdx}
        completedSet={completed}
        onJump={jump}
        finalAvailable
        onFinalJump={() => setView("brief")}
      />

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
          isLoading={false}
          finalActionLabel="View Final Brief"
        />
      )}

      {view === "brief" && (
        <DecisionBriefView
          brief={brief}
          isLoading={null}
          onBriefChange={setBrief}
          onAccept={() => setBrief((prev) => ({ ...prev, status: "accepted" }))}
          onRevise={() => undefined}
          onNotReady={() => undefined}
          onEditAnswers={() => setView("step")}
          onStartOver={resetDemo}
          aiEnabled={false}
          githubUrl={githubUrl}
        />
      )}
    </div>
  );
}

function cloneExampleEntries(): HatEntries {
  return JSON.parse(JSON.stringify(EXAMPLE_SESSION.entries)) as HatEntries;
}
