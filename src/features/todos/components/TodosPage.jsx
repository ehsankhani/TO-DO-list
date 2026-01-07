import React, { useCallback, useMemo, useState } from "react";
import { t } from "../../../shared/i18n/dictionary";
import { useToasts } from "../../../shared/ui/toast/toastContext.js";
import { useTodosController } from "../hooks/useTodosController";
import "../todos.css";
import { SearchInput } from "./SearchInput.jsx";
import { FiltersBar } from "./FiltersBar.jsx";
import { StatsBar } from "./StatsBar.jsx";
import { BulkActions } from "./BulkActions.jsx";
import { TaskForm } from "./TaskForm.jsx";
import { TaskFormModal } from "./TaskFormModal.jsx";
import { TaskList } from "./TaskList.jsx";

export function TodosPage() {
  const { push } = useToasts();
  const { state, derived, actions } = useTodosController();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const onSearch = useCallback((q) => actions.setFilters({ search: q }), [actions]);

  const allTags = useMemo(() => {
    const set = new Set();
    for (const task of state.tasks) for (const tag of task.tags || []) set.add(tag);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [state.tasks]);

  const selectedCount = useMemo(() => Object.keys(state.selectedIds).length, [state.selectedIds]);

  return (
    <div className="todosGrid">
      <div className="toolbar">
        <div className="toolbarRow">
          <SearchInput value={state.filters.search} onDebouncedChange={onSearch} />
          <div className="row wrap" style={{ gap: "var(--sp-2)" }}>
            <button className="btn primary" type="button" onClick={() => setIsModalOpen(true)}>
              {t("actions.addTask")}
            </button>
            {!showQuickAdd && (
              <button
                className="btn"
                type="button"
                onClick={() => setShowQuickAdd(true)}
                title={t("ui.showQuickAdd")}
              >
                {t("ui.quickAdd")}
              </button>
            )}
          </div>
        </div>

        {showQuickAdd && (
          <div className="panel" style={{ padding: "var(--sp-4)" }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: "var(--sp-2)" }}>
              <div style={{ fontWeight: 750, fontSize: "var(--text-lg)" }}>{t("ui.quickAdd")}</div>
              <button
                className="btn"
                type="button"
                onClick={() => setShowQuickAdd(false)}
                title={t("ui.hideQuickAdd")}
              >
                ✕
              </button>
            </div>
            <TaskForm
              mode="create"
              onSubmit={(fields) => {
                const res = actions.addTask(fields);
                if (!res.ok) {
                  push({ title: t("validation.titleRequired"), variant: "warning" });
                } else {
                  push({ title: t("toasts.saved"), variant: "success" });
                }
              }}
            />
          </div>
        )}

        <StatsBar counts={derived.counts} selectedCount={selectedCount} />

        <div className="panel" style={{ padding: "var(--sp-2)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
            <button
              className="btn"
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              style={{ width: "100%", justifyContent: "flex-start" }}
            >
              {showFilters ? "▼" : "▶"} {t("ui.filters")} {showFilters ? "" : `(${t("ui.clickToShow")})`}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => setShowBulkActions(!showBulkActions)}
              aria-expanded={showBulkActions}
              style={{ width: "100%", justifyContent: "flex-start" }}
            >
              {showBulkActions ? "▼" : "▶"} {t("ui.bulkActions")}{" "}
              {selectedCount > 0 && `(${selectedCount} ${t("stats.selected")})`}
            </button>
          </div>
        </div>

        {showFilters && (
          <FiltersBar filters={state.filters} allTags={allTags} onSetFilters={actions.setFilters} />
        )}

        {showBulkActions && (
          <BulkActions
            selectedCount={selectedCount}
            onCompleteAll={() => {
              actions.bulkComplete();
              push({ title: t("toasts.completed"), variant: "success" });
            }}
            onClearCompleted={() => {
              actions.clearCompleted();
              push({ title: t("actions.clearCompleted"), variant: "info" });
            }}
            onSelectAllVisible={actions.selectAllVisible}
            onClearSelection={actions.clearSelected}
            onDeleteSelected={() => {
              actions.deleteSelected();
              push({ title: t("toasts.deleted"), variant: "danger" });
            }}
          />
        )}
      </div>

      <TaskList
        tasks={derived.tasks}
        selectedIds={state.selectedIds}
        onToggleSelected={actions.toggleSelected}
        actions={actions}
      />

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(fields) => {
          const res = actions.addTask(fields);
          if (!res.ok) push({ title: t("validation.titleRequired"), variant: "warning" });
          else push({ title: t("toasts.saved"), variant: "success" });
        }}
      />
    </div>
  );
}


