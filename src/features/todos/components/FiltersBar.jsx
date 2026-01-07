import React from "react";
import { t } from "../../../shared/i18n/dictionary";
import { TagChips } from "./TagChips.jsx";

export function FiltersBar({ filters, allTags, onSetFilters }) {
  return (
    <section className="panel" aria-label={t("a11y.filters")} style={{ padding: "var(--sp-4)" }}>
      <div className="filters">
        <label>
          <div className="fieldLabel">{t("fields.status")}</div>
          <select
            className="field"
            value={filters.status}
            onChange={(e) => onSetFilters({ status: e.target.value })}
          >
            <option value="all">{t("common.all")}</option>
            <option value="todo">{t("status.todo")}</option>
            <option value="in-progress">{t("status.inProgress")}</option>
            <option value="done">{t("status.done")}</option>
          </select>
        </label>

        <label>
          <div className="fieldLabel">{t("fields.priority")}</div>
          <select
            className="field"
            value={filters.priority}
            onChange={(e) => onSetFilters({ priority: e.target.value })}
          >
            <option value="all">{t("common.all")}</option>
            <option value="low">{t("priority.low")}</option>
            <option value="medium">{t("priority.medium")}</option>
            <option value="high">{t("priority.high")}</option>
          </select>
        </label>

        <label>
          <div className="fieldLabel">{t("fields.sortBy")}</div>
          <select
            className="field"
            value={filters.sortBy}
            onChange={(e) => onSetFilters({ sortBy: e.target.value })}
          >
            <option value="dueDateAsc">{t("sort.dueDateAsc")}</option>
            <option value="dueDateDesc">{t("sort.dueDateDesc")}</option>
            <option value="titleAsc">{t("sort.titleAsc")}</option>
            <option value="titleDesc">{t("sort.titleDesc")}</option>
          </select>
        </label>

        <label>
          <div className="fieldLabel">{t("fields.tags")}</div>
          <div className="fieldHelp">{t("filters.tagsHelp")}</div>
        </label>
      </div>

      {allTags.length > 0 ? (
        <div style={{ marginTop: "var(--sp-3)" }}>
          <TagChips
            tags={allTags}
            selected={filters.tags}
            onToggle={(tag) => {
              const set = new Set(filters.tags);
              if (set.has(tag)) set.delete(tag);
              else set.add(tag);
              onSetFilters({ tags: Array.from(set) });
            }}
          />
        </div>
      ) : null}
    </section>
  );
}


