import React from "react";
import { t } from "../../../shared/i18n/dictionary";

function priorityClass(p) {
  if (p === "high") return "pillDanger";
  if (p === "low") return "pillOk";
  return "pillWarn";
}

export function TaskItem({
  task,
  isSelected,
  onToggleSelected,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  return (
    <div className="taskItemInner">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        aria-label={t("fields.completed")}
      />

      <div style={{ minWidth: 0 }}>
        <div className="taskTitle" style={{ textDecoration: task.completed ? "line-through" : "none" }}>
          {task.title}
        </div>
        {task.description ? <div className="taskDesc">{task.description}</div> : null}
        <div className="taskMeta">
          {task.dueDate ? <span className="pill pillAccent">{t("fields.dueDate")}: {task.dueDate}</span> : null}
          <span className={`pill ${priorityClass(task.priority)}`}>{t(`priority.${task.priority}`)}</span>
          <span className="pill">{t(task.status === "in-progress" ? "status.inProgress" : `status.${task.status}`)}</span>
          {task.tags?.length ? (
            <span className="pill">{task.tags.map((x) => `#${x}`).join(" ")}</span>
          ) : null}
        </div>
      </div>

      <div className="taskActions">
        <label className="chip" title={t("actions.select")}>
          <input type="checkbox" checked={isSelected} onChange={() => onToggleSelected(task.id)} />
          <span className="sr-only">{t("a11y.selectTask")}</span>
        </label>
        <button className="btn" type="button" onClick={() => onEdit(task.id)} title={t("actions.edit")}>
          {t("actions.edit")}
        </button>
        <button className="btn danger" type="button" onClick={() => onDelete(task.id)} title={t("actions.delete")}>
          {t("actions.delete")}
        </button>
      </div>
    </div>
  );
}


