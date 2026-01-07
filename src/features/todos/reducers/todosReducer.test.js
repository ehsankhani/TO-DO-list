import { TODOS_ACTIONS, getInitialTodosState, todosReducer } from "./todosReducer";

function makeTask(overrides = {}) {
  const now = 1000;
  return {
    id: "t1",
    title: "Hello",
    description: "",
    dueDate: "",
    priority: "medium",
    tags: [],
    status: "todo",
    completed: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("todosReducer", () => {
  test("ADD_TASK adds to the front", () => {
    const s0 = getInitialTodosState();
    const t1 = makeTask({ id: "a" });
    const t2 = makeTask({ id: "b" });
    const s1 = todosReducer(s0, { type: TODOS_ACTIONS.ADD_TASK, payload: t1 });
    const s2 = todosReducer(s1, { type: TODOS_ACTIONS.ADD_TASK, payload: t2 });
    expect(s2.tasks.map((t) => t.id)).toEqual(["b", "a"]);
  });

  test("UPDATE_TASK patches by id", () => {
    const s0 = { ...getInitialTodosState(), tasks: [makeTask({ id: "x", title: "Old" })] };
    const s1 = todosReducer(s0, {
      type: TODOS_ACTIONS.UPDATE_TASK,
      payload: { id: "x", patch: { title: "New", status: "in-progress" } },
    });
    expect(s1.tasks[0].title).toBe("New");
    expect(s1.tasks[0].status).toBe("in-progress");
  });

  test("TOGGLE_COMPLETE sets completed and status done", () => {
    const s0 = { ...getInitialTodosState(), tasks: [makeTask({ id: "x", status: "todo" })] };
    const s1 = todosReducer(s0, { type: TODOS_ACTIONS.TOGGLE_COMPLETE, payload: { id: "x" } });
    expect(s1.tasks[0].completed).toBe(true);
    expect(s1.tasks[0].status).toBe("done");
  });

  test("CLEAR_COMPLETED removes completed tasks", () => {
    const s0 = {
      ...getInitialTodosState(),
      tasks: [makeTask({ id: "a", completed: true, status: "done" }), makeTask({ id: "b" })],
      selectedIds: { a: true, b: true },
    };
    const s1 = todosReducer(s0, { type: TODOS_ACTIONS.CLEAR_COMPLETED });
    expect(s1.tasks.map((t) => t.id)).toEqual(["b"]);
    expect(s1.selectedIds).toEqual({ b: true });
  });
});


