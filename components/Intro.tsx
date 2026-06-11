"use client";

import type { CSSProperties } from "react";
import { HATS } from "../lib/hats";
import { INPUT_LIMITS } from "../lib/validation";
import LocalDraftNotice from "./LocalDraftNotice";
import PrivacyNotice from "./PrivacyNotice";

type IntroProps = {
  topic: string;
  setTopic: (topic: string) => void;
  onStart: () => void;
  onLoadExample: () => void;
  onClearDraft: () => void;
  hasDraft: boolean;
  exampleOnly: boolean;
  githubUrl: string;
};

export default function Intro({
  topic,
  setTopic,
  onStart,
  onLoadExample,
  onClearDraft,
  hasDraft,
  exampleOnly,
  githubUrl,
}: IntroProps) {
  return (
    <div className="intro fade-in">
      <h1 className="intro__title">
        The thinking hats methodology:
      </h1>
      <p className="intro__description">
        Six Thinking Hats is a framework developed by Dr. Edward de Bono to help
        individuals and groups think more clearly, deliberately, and
        collaboratively. The method guides people to approach an idea from six
        distinct perspectives, or &ldquo;hats,&rdquo; with each hat representing a
        different mode of thinking. By moving through these perspectives one at a
        time, the process creates a more structured conversation, reduces
        confusion, and helps uncover a fuller picture of the idea, challenge, or
        decision being explored.
      </p>

      <div className="intro__hats">
        {HATS.map((hat) => (
          <div
            className="intro__hat"
            key={hat.id}
            data-hat={hat.id}
            style={{ "--hat-current": hat.color } as CSSProperties}
          >
            <img className="intro__hat-icon" src={hat.iconSrc} alt="" aria-hidden="true" />
            <span>
              {hat.name} -{" "}
              <span className="intro__hat-purpose">{hat.purpose}</span>
            </span>
          </div>
        ))}
      </div>

      {exampleOnly ? (
        <div className="intro__actions intro__actions--home">
          <button className="btn btn--primary btn--fixed" onClick={onLoadExample}>
            View Example demo
          </button>
          <a className="btn btn--ghost btn--fixed" href={githubUrl} target="_blank" rel="noreferrer">
            View GitHub
          </a>
        </div>
      ) : (
        <>
          <div className="intro__topic-label">Decision title</div>
          <input
            className="intro__topic-input"
            value={topic}
            maxLength={INPUT_LIMITS.topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. Daily LinkedIn campaign for the May sprint"
          />
          <div className="char-counter">
            {topic.length}/{INPUT_LIMITS.topic}
          </div>
          <div className="intro__field-hint">
            Short title only. The Blue Hat sharpens the exact scope next.
          </div>

          <div className="notice-stack">
            <PrivacyNotice />
            <LocalDraftNotice />
          </div>

          <div className="intro__actions">
            <button
              className="btn btn--primary"
              onClick={onStart}
              disabled={!topic.trim()}
            >
              Begin -&gt;
            </button>
            <button className="btn btn--ghost" onClick={onLoadExample}>
              Load LinkedIn example
            </button>
            <a className="btn btn--ghost" href={githubUrl} target="_blank" rel="noreferrer">
              View GitHub
            </a>
            {hasDraft && (
              <button className="btn btn--ghost" onClick={onClearDraft}>
                Clear draft
              </button>
            )}
            <span className="intro__hint">~ 8 minutes - 6 hats - 1 brief</span>
          </div>
        </>
      )}
    </div>
  );
}
