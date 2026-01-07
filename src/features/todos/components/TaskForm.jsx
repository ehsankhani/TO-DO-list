import React, { useEffect, useId, useMemo, useState } from "react";
import { t } from "../../../shared/i18n/dictionary";
import { normalizeTags } from "../services/tasksService";

function toTagsString(tags) {
  return Array.isArray(tags) ? tags.join(", ") : "";
}

export function TaskForm({
  mode = "create",
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
}) {
  const uid = useId();
  const init = useMemo(() => {
    const base = {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      status: "todo",
      completed: false,
      ...(initialValues || {}),
    };
    return { ...base, tags: toTagsString(base.tags) };
  }, [initialValues]);

  const [values, setValues] = useState(init);
  const [touched, setTouched] = useState(false);

  useEffect(() => setValues(init), [init]);

  const titleError = touched && !values.title.trim() ? t("validation.titleRequired") : "";

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!values.title.trim()) return;

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate || "",
      priority: values.priority,
      tags: normalizeTags(values.tags),
      status: values.status,
      completed: Boolean(values.completed || values.status === "done"),
    };

    onSubmit(payload);
    if (mode === "create") {
      setValues((v) => ({ ...v, title: "", description: "", tags: "" }));
      setTouched(false);
    }
  }

  return (
    <form className="taskFormGrid" onSubmit={handleSubmit}>
      <label htmlFor={`${uid}_title`}>
        <div className="fieldLabel">{t("fields.title")}</div>
        <input
          id={`${uid}_title`}
          className="field"
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          onBlur={() => setTouched(true)}
          required
        />
        {titleError ? <div className="errorText">{titleError}</div> : null}
      </label>

      <label htmlFor={`${uid}_desc`}>
        <div className="fieldLabel">{t("fields.description")}</div>
        <textarea
          id={`${uid}_desc`}
          className="field"
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          rows={3}
        />
      </label>

      <div className="taskFormRow">
        <label htmlFor={`${uid}_due`}>
          <div className="fieldLabel">{t("fields.dueDate")}</div>
          <input
            id={`${uid}_due`}
            className="field"
            type="date"
            value={values.dueDate}
            onChange={(e) => setField("dueDate", e.target.value)}
          />
        </label>
        <label htmlFor={`${uid}_prio`}>
          <div className="fieldLabel">{t("fields.priority")}</div>
          <select
            id={`${uid}_prio`}
            className="field"
            value={values.priority}
            onChange={(e) => setField("priority", e.target.value)}
          >
            <option value="low">{t("priority.low")}</option>
            <option value="medium">{t("priority.medium")}</option>
            <option value="high">{t("priority.high")}</option>
          </select>
        </label>
      </div>

      <div className="taskFormRow">
        <label htmlFor={`${uid}_status`}>
          <div className="fieldLabel">{t("fields.status")}</div>
          <select
            id={`${uid}_status`}
            className="field"
            value={values.status}
            onChange={(e) => setField("status", e.target.value)}
          >
            <option value="todo">{t("status.todo")}</option>
            <option value="in-progress">{t("status.inProgress")}</option>
            <option value="done">{t("status.done")}</option>
          </select>
        </label>
        <label>
          <div className="fieldLabel">{t("fields.completed")}</div>
          <div className="row" style={{ alignItems: "center", paddingTop: 6 }}>
            <input
              type="checkbox"
              checked={values.completed}
              onChange={(e) => setField("completed", e.target.checked)}
            />
            <span className="muted" style={{ fontSize: "var(--text-sm)" }}>
              {t("validation.completedHint")}
            </span>
          </div>
        </label>
      </div>

      <label htmlFor={`${uid}_tags`}>
        <div className="fieldLabel">{t("fields.tags")}</div>
        <input
          id={`${uid}_tags`}
          className="field"
          value={values.tags}
          onChange={(e) => setField("tags", e.target.value)}
          placeholder={t("validation.tagsPlaceholder")}
        />
        <div className="fieldHelp">{t("validation.tagsHelp")}</div>
      </label>

      <div className="row wrap" style={{ justifyContent: "flex-end" }}>
        {onCancel ? (
          <button className="btn" type="button" onClick={onCancel}>
            {t("actions.cancel")}
          </button>
        ) : null}
        <button className="btn primary" type="submit">
          {submitLabel || (mode === "create" ? t("actions.addTask") : t("actions.save"))}
        </button>
      </div>
    </form>
  );
}


