"use client";

import { useState } from "react";

type AccessGateProps = {
  open: boolean;
  error: string;
  onCancel: () => void;
  onSubmit: (code: string) => void;
};

export default function AccessGate({ open, error, onCancel, onSubmit }: AccessGateProps) {
  const [code, setCode] = useState("");

  if (!open) return null;

  return (
    <div className="access-overlay" role="dialog" aria-modal="true" aria-labelledby="access-title">
      <div className="access-panel">
        <h2 id="access-title">Access code required</h2>
        <p>
          The app is public to view, but AI generation is protected for the MVP.
        </p>
        <input
          className="access-input"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter access code"
          autoFocus
        />
        {error && <div className="field-error">{error}</div>}
        <div className="access-actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={() => onSubmit(code.trim())}
            disabled={!code.trim()}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
