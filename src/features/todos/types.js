/**
 * @typedef {"low" | "medium" | "high"} Priority
 * @typedef {"todo" | "in-progress" | "done"} Status
 *
 * @typedef {{
 *   id: string,
 *   title: string,
 *   description: string,
 *   dueDate: string, // ISO date string YYYY-MM-DD or ""
 *   priority: Priority,
 *   tags: string[],
 *   status: Status,
 *   completed: boolean,
 *   createdAt: number,
 *   updatedAt: number,
 * }} Task
 *
 * @typedef {{
 *   status: "all" | Status,
 *   priority: "all" | Priority,
 *   tags: string[],
 *   sortBy: "dueDateAsc" | "dueDateDesc" | "titleAsc" | "titleDesc",
 *   search: string,
 * }} TodoFilters
 *
 * @typedef {{
 *   tasks: Task[],
 *   filters: TodoFilters,
 *   selectedIds: Record<string, true>,
 * }} TodosState
 */

export {};


