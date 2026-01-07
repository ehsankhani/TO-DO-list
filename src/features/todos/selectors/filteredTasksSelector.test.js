import { filteredTasksSelector } from "./filteredTasksSelector";
import { getInitialTodosState } from "../reducers/todosReducer";

function task(id, title, overrides = {}) {
  return {
    id,
    title,
    description: "",
    dueDate: "",
    priority: "medium",
    tags: [],
    status: "todo",
    completed: false,
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
  };
}

describe("filteredTasksSelector", () => {
  test("filters by status and tags and search", () => {
    const state = {
      ...getInitialTodosState(),
      tasks: [
        task("a", "Buy milk", { tags: ["home"], status: "todo" }),
        task("b", "Ship release", { tags: ["work"], status: "in-progress" }),
        task("c", "Write docs", { tags: ["work"], status: "done", completed: true }),
      ],
      filters: { status: "in-progress", priority: "all", tags: ["work"], sortBy: "titleAsc", search: "ship" },
    };
    const out = filteredTasksSelector(state);
    expect(out.tasks.map((t) => t.id)).toEqual(["b"]);
  });

  test("sorts by due date (empty due dates last in asc)", () => {
    const state = {
      ...getInitialTodosState(),
      tasks: [
        task("a", "A", { dueDate: "" }),
        task("b", "B", { dueDate: "2026-01-01" }),
        task("c", "C", { dueDate: "2025-12-31" }),
      ],
      filters: { ...getInitialTodosState().filters, sortBy: "dueDateAsc" },
    };
    const out = filteredTasksSelector(state);
    expect(out.tasks.map((t) => t.id)).toEqual(["c", "b", "a"]);
  });
});


