"use client";

import type { CSSProperties } from "react";
import { Fragment } from "react";
import type { HatConfig } from "../lib/hats";
import HatInput from "./HatInput";

type HatStepProps = {
  hat: HatConfig;
  idx: number;
  total: number;
  value: string[];
  onChange: (value: string[]) => void;
  onPrev: () => void;
  onNext: () => void;
  isLast: boolean;
  isLoading: boolean;
  finalActionLabel: string;
};

export default function HatStep({
  hat,
  idx,
  total,
  value,
  onChange,
  onPrev,
  onNext,
  isLast,
  isLoading,
  finalActionLabel,
}: HatStepProps) {
  const itemCount = value.filter((item) => item.trim()).length;
  const hasContent = itemCount > 0;

  return (
    <main
      className="step fade-in"
      key={hat.id}
      data-hat={hat.id}
      style={{ "--hat-current": hat.color } as CSSProperties}
    >
      <section
        className="step__left step--wash"
        style={{ "--hat-current": hat.color, position: "relative" } as CSSProperties}
      >
        <img className="step__hat-icon" src={hat.iconSrc} alt={`${hat.name} hat`} />

        <h1 className="step__title">
          {hat.title.map((part, index) =>
            index === 1 ? (
              <em key={`${part}-${index}`}>{part} </em>
            ) : (
              <Fragment key={`${part}-${index}`}>{part} </Fragment>
            ),
          )}
        </h1>

        <p className="step__prompt">{hat.prompt}</p>
        <p className="step__hint">
          <strong>{hat.name} hat -</strong> {hat.hint}
        </p>
      </section>

      <section
        className="step__right"
        style={{ "--hat-current": hat.color, position: "relative" } as CSSProperties}
      >
        <HatInput hat={hat} value={value} onChange={onChange} />

        <span className="step__count">
          {hasContent
            ? `${itemCount} ${itemCount === 1 ? "thought" : "thoughts"} captured`
            : "Nothing captured yet"}
        </span>
      </section>

      <footer className="step__footer" style={{ gridColumn: "1 / -1" }}>
        <button className="btn btn--ghost" onClick={onPrev} disabled={idx === 0}>
          &lt;- Back
        </button>
        <div className="step__count">
          Step {idx + 1} of {total} - {hat.name} hat
        </div>
        <button
          className={`btn ${hasContent || isLast ? "btn--accent" : "btn--ghost"}`}
          onClick={onNext}
          disabled={isLoading}
          style={{ "--hat-current": hat.color } as CSSProperties}
        >
          {isLoading ? "Generating..." : isLast ? finalActionLabel : "Next hat"}{" "}
          {!isLoading && "->"}
        </button>
      </footer>
    </main>
  );
}
