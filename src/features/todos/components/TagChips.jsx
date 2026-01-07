import React from "react";
import { t } from "../../../shared/i18n/dictionary";

export function TagChips({ tags, selected, onToggle }) {
  const selectedSet = new Set(selected);
  return (
    <div className="row wrap" aria-label={t("a11y.tags")}>
      {tags.map((tag) => {
        const active = selectedSet.has(tag);
        return (
          <button
            key={tag}
            type="button"
            className={`chip ${active ? "pillAccent" : ""}`}
            onClick={() => onToggle(tag)}
            aria-pressed={active}
            title={tag}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}


