"use client";

import { useMemo, useState } from "react";
import type { DecisionBrief } from "../lib/brief-schema";
import { decisionBriefToMarkdown } from "../lib/markdown";

type MarkdownCopyButtonProps = {
  brief: DecisionBrief;
};

export default function MarkdownCopyButton({ brief }: MarkdownCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const markdown = useMemo(() => decisionBriefToMarkdown(brief), [brief]);

  async function copy() {
    setCopied(false);
    setShowFallback(false);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setShowFallback(true);
    }
  }

  return (
    <div className="copy-block">
      <button className="btn btn--primary" onClick={copy}>
        {copied ? "Copied" : "Copy Markdown"}
      </button>
      {showFallback && (
        <textarea
          className="copy-fallback"
          value={markdown}
          readOnly
          aria-label="Markdown fallback text"
        />
      )}
    </div>
  );
}
