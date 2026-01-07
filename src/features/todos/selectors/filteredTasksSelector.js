/**
 * @typedef {import("../types").Task} Task
 * @typedef {import("../types").TodosState} TodosState
 */

function compareText(a, b) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function dueDateValue(task) {
  // "" dueDate sorts last for ascending.
  if (!task.dueDate) return Number.POSITIVE_INFINITY;
  const ms = Date.parse(task.dueDate);
  return Number.isFinite(ms) ? ms : Number.POSITIVE_INFINITY;
}

/**
 * @param {TodosState} state
 * @returns {{ tasks: Task[], visibleIds: string[], counts: { all: number, todo: number, inProgress: number, done: number, completed: number } }}
 */
export function filteredTasksSelector(state) {
  const { tasks, filters } = state;
  const q = filters.search.trim().toLowerCase();
  const filterTags = new Set(filters.tags);

  const counts = {
    all: tasks.length,
    todo: 0,
    inProgress: 0,
    done: 0,
    completed: 0,
  };

  /** @type {Task[]} */
  let list = [];
  for (const t of tasks) {
    if (t.status === "todo") counts.todo += 1;
    if (t.status === "in-progress") counts.inProgress += 1;
    if (t.status === "done") counts.done += 1;
    if (t.completed) counts.completed += 1;

    if (filters.status !== "all" && t.status !== filters.status) continue;
    if (filters.priority !== "all" && t.priority !== filters.priority) continue;
    if (filterTags.size > 0) {
      const tset = new Set(t.tags);
      let ok = true;
      for (const tag of filterTags) {
        if (!tset.has(tag)) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
    }
    if (q) {
      const hay = `${t.title}\n${t.description}\n${t.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) continue;
    }
    list.push(t);
  }

  const sortBy = filters.sortBy;
  list = list.slice().sort((a, b) => {
    if (sortBy === "dueDateAsc") return dueDateValue(a) - dueDateValue(b) || compareText(a.title, b.title);
    if (sortBy === "dueDateDesc") return dueDateValue(b) - dueDateValue(a) || compareText(a.title, b.title);
    if (sortBy === "titleDesc") return compareText(b.title, a.title);
    return compareText(a.title, b.title);
  });

  return { tasks: list, visibleIds: list.map((t) => t.id), counts };
}


