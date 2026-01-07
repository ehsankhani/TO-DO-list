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
          <div className="row wrap">
            <button className="btn primary" type="button" onClick={() => setIsModalOpen(true)}>
              {t("actions.openTaskModal")}
            </button>
          </div>
        </div>

        <div className="panel" style={{ padding: "var(--sp-4)" }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 750, fontSize: "var(--text-lg)" }}>{t("actions.addTask")}</div>
              <div className="muted" style={{ fontSize: "var(--text-sm)" }}>
                {t("validation.quickAddHint")}
              </div>
            </div>
          </div>
          <div style={{ marginTop: "var(--sp-3)" }}>
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
        </div>

        <FiltersBar filters={state.filters} allTags={allTags} onSetFilters={actions.setFilters} />
        <StatsBar counts={derived.counts} selectedCount={selectedCount} />
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


