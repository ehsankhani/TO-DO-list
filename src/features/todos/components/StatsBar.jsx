import React from "react";
import { t } from "../../../shared/i18n/dictionary";

export function StatsBar({ counts, selectedCount }) {
  return (
    <section className="panel statsBar" aria-label={t("a11y.stats")}>
      <div className="statsPills" aria-label={t("a11y.stats")}>
        <span className="pill">{t("stats.all")}: {counts.all}</span>
        <span className="pill">{t("status.todo")}: {counts.todo}</span>
        <span className="pill">{t("status.inProgress")}: {counts.inProgress}</span>
        <span className="pill">{t("status.done")}: {counts.done}</span>
        <span className="pill pillOk">{t("stats.completed")}: {counts.completed}</span>
      </div>
      <div className="muted" style={{ fontSize: "var(--text-sm)" }}>
        {t("stats.selected")}: {selectedCount}
      </div>
    </section>
  );
}


