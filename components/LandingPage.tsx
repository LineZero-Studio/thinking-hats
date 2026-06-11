import type { CSSProperties } from "react";
import { HATS } from "../lib/hats";

type LandingPageProps = {
  githubUrl: string;
};

export default function LandingPage({ githubUrl }: LandingPageProps) {
  return (
    <div className="intro fade-in">
      <h1 className="intro__title">The thinking hats methodology</h1>
      <p className="intro__description">
        Six Thinking Hats is a framework developed by Dr. Edward de Bono to help
        individuals and groups think more clearly, deliberately, and
        collaboratively. The method guides people to approach an idea from six
        distinct perspectives, or &ldquo;hats,&rdquo; with each hat representing
        a different mode of thinking. By moving through these perspectives one
        at a time, the process creates a more structured conversation, reduces
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
            <img
              className="intro__hat-icon"
              src={hat.iconSrc}
              alt=""
              aria-hidden="true"
            />
            <span>
              {hat.name} -{" "}
              <span className="intro__hat-purpose">{hat.purpose}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="intro__actions intro__actions--home">
        <a className="btn btn--primary btn--fixed" href="/demo">
          View Example demo
        </a>
        <a
          className="btn btn--ghost btn--fixed"
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          View GitHub
        </a>
      </div>
    </div>
  );
}
