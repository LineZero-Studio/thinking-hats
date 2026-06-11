"use client";

import { useMemo, useState } from "react";
import type { BriefMode, DecisionBrief } from "../lib/brief-schema";
import { HATS, type HatId } from "../lib/hats";
import { INPUT_LIMITS } from "../lib/validation";
import MarkdownCopyButton from "./MarkdownCopyButton";

type DecisionBriefViewProps = {
  brief: DecisionBrief;
  isLoading: BriefMode | null;
  onBriefChange: (brief: DecisionBrief) => void;
  onAccept: () => void;
  onRevise: (instruction: string) => void;
  onNotReady: (blocker: string) => void;
  onEditAnswers: () => void;
  onStartOver: () => void;
  aiEnabled: boolean;
  githubUrl: string;
};

export default function DecisionBriefView({
  brief,
  isLoading,
  onBriefChange,
  onAccept,
  onRevise,
  onNotReady,
  onEditAnswers,
  onStartOver,
  aiEnabled,
  githubUrl,
}: DecisionBriefViewProps) {
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(brief);
  const [revisionInstruction, setRevisionInstruction] = useState("");
  const [notReadyBlocker, setNotReadyBlocker] = useState("");
  const [activePanel, setActivePanel] = useState<"revise" | "not_ready" | null>(null);

  const loadingLabel = useMemo(() => {
    if (isLoading === "revise") return "Revising brief...";
    if (isLoading === "not_ready") return "Finding missing inputs...";
    if (isLoading === "generate") return "Generating brief...";
    return "";
  }, [isLoading]);

  function beginEdit() {
    setDraft(brief);
    setEditMode(true);
  }

  function saveEdit() {
    onBriefChange(draft);
    setEditMode(false);
  }

  function updateDraft<K extends keyof DecisionBrief>(key: K, value: DecisionBrief[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  const renderedBrief = editMode ? draft : brief;

  return (
    <div className="report fade-in">
      <h1 className="report__title">Final Decision Brief</h1>
      <p className="report__topic">{renderedBrief.suggestedDecision}</p>

      {loadingLabel && <div className="loading-panel">{loadingLabel}</div>}

      {editMode ? (
        <BriefEditor
          draft={draft}
          updateDraft={updateDraft}
          onSave={saveEdit}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <BriefCards brief={renderedBrief} />
      )}

      {aiEnabled && !editMode && (
        <div className="decision-controls">
          <button className="btn btn--primary" onClick={onAccept}>
            Accept
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => {
              setActivePanel(activePanel === "revise" ? null : "revise");
            }}
          >
            Needs Revision
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => {
              setActivePanel(activePanel === "not_ready" ? null : "not_ready");
            }}
          >
            Not Ready
          </button>
          <button className="btn btn--ghost" onClick={beginEdit}>
            Edit brief
          </button>
          <MarkdownCopyButton brief={renderedBrief} />
        </div>
      )}

      {!aiEnabled && !editMode && (
        <div className="notice notice--accent report-notice">
          Example-only demo: AI generation, revision, and not-ready follow-up are
          disabled for this public deployment.
        </div>
      )}

      {activePanel === "revise" && !editMode && (
        <div className="action-panel">
          <label htmlFor="revision-instruction">What should change?</label>
          <textarea
            id="revision-instruction"
            value={revisionInstruction}
            maxLength={INPUT_LIMITS.revisionInstruction}
            onChange={(event) => setRevisionInstruction(event.target.value)}
            placeholder="e.g. Make the decision more cautious and add a smaller first step."
          />
          <div className="panel-actions">
            <span className="char-counter">
              {revisionInstruction.length}/{INPUT_LIMITS.revisionInstruction}
            </span>
            <button
              className="btn btn--accent"
              onClick={() => onRevise(revisionInstruction)}
              disabled={!revisionInstruction.trim() || Boolean(isLoading)}
            >
              Revise with AI
            </button>
          </div>
        </div>
      )}

      {activePanel === "not_ready" && !editMode && (
        <div className="action-panel">
          <label htmlFor="not-ready-blocker">What is blocking the decision?</label>
          <textarea
            id="not-ready-blocker"
            value={notReadyBlocker}
            maxLength={INPUT_LIMITS.notReadyBlocker}
            onChange={(event) => setNotReadyBlocker(event.target.value)}
            placeholder="e.g. We do not know how much writing time this will take each day."
          />
          <div className="panel-actions">
            <span className="char-counter">
              {notReadyBlocker.length}/{INPUT_LIMITS.notReadyBlocker}
            </span>
            <button
              className="btn btn--accent"
              onClick={() => onNotReady(notReadyBlocker)}
              disabled={!notReadyBlocker.trim() || Boolean(isLoading)}
            >
              Mark not ready
            </button>
          </div>
        </div>
      )}

      {aiEnabled ? (
        <div className="report__actions">
          <span className="report__actions-text">
            Drafts stay local to this browser. AI requests are not stored by this app.
          </span>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn--ghost" onClick={onEditAnswers}>
              &lt;- Edit hat notes
            </button>
            <button className="btn btn--ghost" onClick={onStartOver}>
              Clear draft
            </button>
          </div>
        </div>
      ) : (
        <div className="report__actions report__actions--center">
          <a className="btn btn--primary btn--fixed" href={githubUrl} target="_blank" rel="noreferrer">
            View GitHub
          </a>
        </div>
      )}
    </div>
  );
}

function BriefCards({ brief }: { brief: DecisionBrief }) {
  return (
    <>
      <div className="report__grid">
        <BriefCard title="Rationale" body={brief.rationale} span="col-8" hatId="blue" />
        <BriefCard
          title="Main Tradeoff"
          body={brief.mainTradeoff}
          span="col-4"
          hatId="white"
        />
        <BriefCard
          title="Biggest Risk"
          body={brief.biggestRisk}
          span="col-6"
          hatId="black"
        />
        <BriefCard
          title="Best Upside"
          body={brief.bestUpside}
          span="col-6"
          hatId="yellow"
        />
        <BriefCard
          title="Creative Alternative"
          body={brief.creativeAlternative}
          span="col-12"
          hatId="green"
        />
      </div>

      <h2 className="report-section-title">Next</h2>
      <div className="report__grid">
        <ListCard title="Next Actions" items={brief.nextActions} span="col-6" prefix="" />
        <ListCard title="Open Questions" items={brief.openQuestions} span="col-6" prefix="Q" />
      </div>

      {brief.status === "not_ready" && brief.notReady && (
        <>
          <h2 className="report-section-title">Not Ready</h2>
          <div className="report__grid">
            <BriefCard
              title="Not Ready Because"
              body={brief.notReady.blocker}
              span="col-4"
              hatId="red"
            />
            <ListCard
              title="Missing Inputs"
              items={brief.notReady.missingInputs}
              span="col-4"
              prefix="M"
            />
            <BriefCard
              title="Suggested Next Step"
              body={brief.notReady.suggestedNextStep}
              span="col-4"
              hatId="blue"
            />
          </div>
        </>
      )}
    </>
  );
}

function BriefCard({
  title,
  body,
  span,
  hatId,
}: {
  title: string;
  body: string;
  span: string;
  hatId: HatId;
}) {
  const hat = HATS.find((item) => item.id === hatId);

  return (
    <div className={`report-card ${span}`} data-hat={hatId}>
      <div className="report-card__head">
        {hat && <img className="report-card__hat-icon" src={hat.iconSrc} alt="" aria-hidden="true" />}
        <span className="report-card__chip">{title}</span>
      </div>
      <p className="report-card__body">{body}</p>
    </div>
  );
}

function ListCard({
  title,
  items,
  span,
  prefix,
}: {
  title: string;
  items: string[];
  span: string;
  prefix: string;
}) {
  return (
    <div className={`report-card report-card--accent ${span}`}>
      <div className="report-card__head">
        <span className="report-card__chip">{title}</span>
      </div>
      <ul className="report-list">
        {(items.length ? items : ["None noted."]).map((item, index) => (
          <li className="report-list__item" key={`${item}-${index}`}>
            <span className="report-list__num">
              {prefix ? `${prefix}${index + 1}` : String(index + 1).padStart(2, "0")}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BriefEditor({
  draft,
  updateDraft,
  onSave,
  onCancel,
}: {
  draft: DecisionBrief;
  updateDraft: <K extends keyof DecisionBrief>(key: K, value: DecisionBrief[K]) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="brief-editor">
      <EditField
        label="Suggested decision"
        value={draft.suggestedDecision}
        onChange={(value) => updateDraft("suggestedDecision", value)}
      />
      <EditField label="Rationale" value={draft.rationale} onChange={(value) => updateDraft("rationale", value)} />
      <EditField
        label="Main tradeoff"
        value={draft.mainTradeoff}
        onChange={(value) => updateDraft("mainTradeoff", value)}
      />
      <EditField
        label="Biggest risk"
        value={draft.biggestRisk}
        onChange={(value) => updateDraft("biggestRisk", value)}
      />
      <EditField
        label="Best upside"
        value={draft.bestUpside}
        onChange={(value) => updateDraft("bestUpside", value)}
      />
      <EditField
        label="Creative alternative"
        value={draft.creativeAlternative}
        onChange={(value) => updateDraft("creativeAlternative", value)}
      />
      <EditField
        label="Next actions"
        value={draft.nextActions.join("\n")}
        onChange={(value) => updateDraft("nextActions", splitLines(value))}
      />
      <EditField
        label="Open questions"
        value={draft.openQuestions.join("\n")}
        onChange={(value) => updateDraft("openQuestions", splitLines(value))}
      />
      <div className="editor-actions">
        <button className="btn btn--primary" onClick={onSave}>
          Save edits
        </button>
        <button className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="edit-field">
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
