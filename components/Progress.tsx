"use client";

import type { CSSProperties } from "react";
import type { HatConfig } from "../lib/hats";

type ProgressProps = {
  hats: HatConfig[];
  currentIdx: number;
  completedSet: Set<number>;
  onJump: (index: number) => void;
  finalAvailable: boolean;
  onFinalJump: () => void;
};

export default function Progress({
  hats,
  currentIdx,
  completedSet,
  onJump,
  finalAvailable,
  onFinalJump,
}: ProgressProps) {
  const finalIdx = hats.length;

  return (
    <nav className="progress" aria-label="Hat progress">
      {hats.map((hat, index) => {
        const isCurrent = index === currentIdx;
        const isDone = completedSet.has(index);
        const isLocked = !isDone && !isCurrent && index > currentIdx;
        const classes = [
          "progress__step",
          isCurrent && "is-current",
          isDone && "is-done",
          isLocked && "is-locked",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={hat.id}
            className={classes}
            data-hat={hat.id}
            style={
              {
                "--hat-current": hat.color,
                "--dot-color": hat.color,
              } as CSSProperties
            }
            disabled={isLocked}
            onClick={() => onJump(index)}
          >
            <span
              className={`progress__dot ${isDone ? "is-filled" : ""} ${
                isCurrent ? "is-current" : ""
              }`}
            >
              {isDone && <span className="progress__check">&#10003;</span>}
            </span>
            <span>
              <span style={{ color: "var(--color-fg-subtle)", marginRight: 8 }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              {hat.name}
            </span>
          </button>
        );
      })}
      <button
        className={[
          "progress__step",
          "progress__step--final",
          currentIdx === finalIdx && "is-current",
          finalAvailable && "is-done",
          !finalAvailable && "is-locked",
        ]
          .filter(Boolean)
          .join(" ")}
        disabled={!finalAvailable}
        onClick={onFinalJump}
      >
        <span>Final brief</span>
      </button>
    </nav>
  );
}
