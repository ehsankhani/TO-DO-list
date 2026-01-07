import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { t } from "../../../shared/i18n/dictionary";
import { APP_CONFIG } from "../../../app/config/appConfig.js";
import { TaskForm } from "./TaskForm.jsx";
import { TaskItem } from "./TaskItem.jsx";
import emptyArt from "../../../assets/empty-state.svg";
import { VirtualList } from "../../../shared/ui/virtual/VirtualList.jsx";

export function TaskList({ tasks, selectedIds, onToggleSelected, actions }) {
  const [editingId, setEditingId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [exiting, setExiting] = useState(() => ({}));
  const itemRefs = useRef(new Map());

  useEffect(() => {
    if (!activeId && tasks[0]) setActiveId(tasks[0].id);
    if (activeId && !tasks.find((t) => t.id === activeId)) {
      setActiveId(tasks[0]?.id || null);
    }
  }, [activeId, tasks]);

  const focusId = useCallback((id) => {
    const el = itemRefs.current.get(id);
    el?.focus?.();
  }, []);

  const onKeyDown = useCallback(
    (e) => {
      const target = e.target;
      if (target && typeof target === "object" && "tagName" in target) {
        const tag = String(target.tagName).toUpperCase();
        // Don't steal keys from form fields/buttons (typing spaces, Enter submit, etc).
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON") return;
      }
      if (!activeId) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = tasks.findIndex((t) => t.id === activeId);
        if (idx < 0) return;
        const nextIdx = e.key === "ArrowDown" ? Math.min(tasks.length - 1, idx + 1) : Math.max(0, idx - 1);
        const nextId = tasks[nextIdx]?.id;
        if (nextId) {
          setActiveId(nextId);
          focusId(nextId);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        setEditingId((prev) => (prev === activeId ? null : activeId));
      } else if (e.key === " ") {
        e.preventDefault();
        actions.toggleComplete(activeId);
      } else if (e.key === "Escape") {
        if (editingId) {
          e.preventDefault();
          setEditingId(null);
        }
      }
    },
    [activeId, actions, editingId, focusId, tasks],
  );

  const handleDelete = useCallback(
    (id) => {
      setExiting((prev) => ({ ...prev, [id]: true }));
      window.setTimeout(() => actions.deleteTask(id), APP_CONFIG.ANIMATION_MS);
    },
    [actions],
  );

  const selectedCount = useMemo(() => Object.keys(selectedIds || {}).length, [selectedIds]);

  if (tasks.length === 0) {
    return (
      <div className="panel" style={{ padding: "var(--sp-6)", textAlign: "center" }}>
        <img
          src={emptyArt}
          alt=""
          style={{ width: "100%", maxWidth: "400px", borderRadius: "var(--r-xl)", marginBottom: "var(--sp-4)" }}
        />
        <div style={{ fontSize: "var(--text-xl)", fontWeight: 720, marginBottom: "var(--sp-2)" }}>
          {t("empty.title")}
        </div>
        <div className="muted" style={{ marginTop: "var(--sp-2)", fontSize: "var(--text-base)" }}>
          {t("empty.body")}
        </div>
        <div className="muted" style={{ marginTop: "var(--sp-3)", fontSize: "var(--text-sm)" }}>
          {t("empty.hint")}
        </div>
      </div>
    );
  }

  return (
    <div className="taskListWrap" aria-label={t("a11y.taskList")}>
      {tasks.length > 500 ? (
        <div role="list" aria-label={t("a11y.taskList")}>
          <VirtualList
            items={tasks}
            itemHeight={92}
            height={560}
            getKey={(task) => task.id}
            renderItem={(task) => (
              <div
                role="listitem"
                className="taskItem"
                style={{
                  opacity: exiting[task.id] ? 0 : 1,
                  transform: exiting[task.id] ? "translateY(6px)" : "translateY(0)",
                }}
              >
                <TaskItem
                  task={task}
                  isSelected={Boolean(selectedIds?.[task.id])}
                  onToggleSelected={onToggleSelected}
                  onToggleComplete={actions.toggleComplete}
                  onEdit={() => setEditingId(null)}
                  onDelete={handleDelete}
                />
              </div>
            )}
          />
        </div>
      ) : (
        <ul className="taskList" onKeyDown={onKeyDown}>
          {tasks.map((task) => {
            const isActive = task.id === activeId;
            const isEditing = task.id === editingId;
            const isExiting = Boolean(exiting[task.id]);
            return (
              <li
                key={task.id}
                className="taskItem"
                style={{
                  opacity: isExiting ? 0 : 1,
                  transform: isExiting ? "translateY(6px)" : "translateY(0)",
                }}
              >
                <div
                  ref={(el) => {
                    if (el) itemRefs.current.set(task.id, el);
                  }}
                  tabIndex={isActive ? 0 : -1}
                  onFocus={() => setActiveId(task.id)}
                  style={{ outline: "none", display: "contents" }}
                >
                  <TaskItem
                    task={task}
                    isSelected={Boolean(selectedIds?.[task.id])}
                    onToggleSelected={onToggleSelected}
                    onToggleComplete={actions.toggleComplete}
                    onEdit={(id) => setEditingId((prev) => (prev === id ? null : id))}
                    onDelete={handleDelete}
                  />
                </div>

                {isEditing ? (
                  <div className="inlineEdit" role="region" aria-label={t("actions.edit")}>
                    <TaskForm
                      mode="edit"
                      initialValues={task}
                      onSubmit={(patch) => {
                        actions.updateTask(task.id, patch);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                      submitLabel={t("actions.save")}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {selectedCount > 0 ? (
        <div className="panel" style={{ padding: "var(--sp-3)" }}>
          <div className="muted" style={{ fontSize: "var(--text-sm)" }}>
            {t("stats.selected")}: {selectedCount}
          </div>
        </div>
      ) : null}
    </div>
  );
}


