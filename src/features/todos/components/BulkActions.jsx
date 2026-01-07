import React from "react";
import { t } from "../../../shared/i18n/dictionary";

export function BulkActions({
  selectedCount,
  onCompleteAll,
  onClearCompleted,
  onSelectAllVisible,
  onClearSelection,
  onDeleteSelected,
}) {
  return (
    <section className="panel" aria-label={t("a11y.bulkActions")} style={{ padding: "var(--sp-3)" }}>
      <div className="row wrap" style={{ justifyContent: "space-between" }}>
        <div className="row wrap">
          <button className="btn" type="button" onClick={onCompleteAll} title={t("actions.completeAll")}>
            {t("actions.completeAll")}
          </button>
          <button className="btn" type="button" onClick={onClearCompleted} title={t("actions.clearCompleted")}>
            {t("actions.clearCompleted")}
          </button>
        </div>
        <div className="row wrap">
          <button className="btn" type="button" onClick={onSelectAllVisible} title={t("actions.selectAll")}>
            {t("actions.selectAll")}
          </button>
          <button className="btn" type="button" onClick={onClearSelection} title={t("actions.clearSelection")}>
            {t("actions.clearSelection")}
          </button>
          <button
            className="btn danger"
            type="button"
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            title={t("actions.deleteSelected")}
          >
            {t("actions.deleteSelected")}
          </button>
        </div>
      </div>
      <div className="fieldHelp" style={{ marginTop: "var(--sp-2)" }}>
        {t("stats.selected")}: {selectedCount}
      </div>
    </section>
  );
}


