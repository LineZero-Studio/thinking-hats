"use client";

import { useState } from "react";
import type { HatConfig } from "../lib/hats";
import { INPUT_LIMITS } from "../lib/validation";

type HatInputProps = {
  hat: HatConfig;
  value: string[];
  onChange: (value: string[]) => void;
};

export default function HatInput({ hat, value, onChange }: HatInputProps) {
  const [draft, setDraft] = useState("");
  const items = value.filter((item) => item.trim());

  function add() {
    const next = draft.trim();
    if (!next || next.length > INPUT_LIMITS.bullet) return;
    onChange([...items, next]);
    setDraft("");
  }

  function remove(index: number) {
    const next = items.slice();
    next.splice(index, 1);
    onChange(next);
  }

  return (
    <div className="bullets">
      {items.length > 0 && (
        <ul className="bullets__list">
          {items.map((item, index) => (
            <li className="bullet" key={`${item}-${index}`}>
              <span className="bullet__dot" />
              <span className="bullet__text">{item}</span>
              <button
                className="bullet__remove"
                aria-label={`Remove thought ${index + 1}`}
                onClick={() => remove(index)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="bullets__form">
        <input
          className="bullets__input"
          placeholder={items.length === 0 ? hat.placeholder : "Add another..."}
          value={draft}
          maxLength={INPUT_LIMITS.bullet}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
        />
        <button className="bullets__add" onClick={add} disabled={!draft.trim()}>
          Add
        </button>
      </div>
      <div className="char-counter">
        {draft.length}/{INPUT_LIMITS.bullet}
      </div>
    </div>
  );
}
