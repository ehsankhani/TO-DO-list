/**
 * @typedef {import("../types").Task} Task
 * @typedef {import("../types").Priority} Priority
 * @typedef {import("../types").Status} Status
 */

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * Normalize user tags: " Work , home  " -> ["work","home"]
 * @param {string[] | string} raw
 * @returns {string[]}
 */
export function normalizeTags(raw) {
  const list = Array.isArray(raw) ? raw : String(raw).split(",");
  const cleaned = list
    .map((t) => String(t).trim())
    .filter(Boolean)
    .map((t) => t.toLowerCase());
  return Array.from(new Set(cleaned));
}

/**
 * @param {Partial<Task>} input
 * @returns {Task}
 */
export function createTask(input) {
  const now = Date.now();
  const title = String(input.title || "").trim();
  const description = String(input.description || "").trim();
  const dueDate = input.dueDate ? String(input.dueDate) : "";
  /** @type {Priority} */
  const priority = input.priority === "high" || input.priority === "low" ? input.priority : "medium";
  /** @type {Status} */
  const status =
    input.status === "in-progress" || input.status === "done" ? input.status : "todo";
  const completed = Boolean(input.completed || status === "done");
  const tags = normalizeTags(input.tags || []);

  return {
    id: makeId(),
    title,
    description,
    dueDate,
    priority,
    tags,
    status: completed ? "done" : status,
    completed,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * @param {any} value
 * @returns {value is Task}
 */
export function isTask(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.dueDate === "string" &&
    (value.priority === "low" || value.priority === "medium" || value.priority === "high") &&
    Array.isArray(value.tags) &&
    (value.status === "todo" || value.status === "in-progress" || value.status === "done") &&
    typeof value.completed === "boolean" &&
    typeof value.createdAt === "number" &&
    typeof value.updatedAt === "number"
  );
}


