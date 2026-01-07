/**
 * @typedef {import("../types").TodosState} TodosState
 */

export const TODOS_ACTIONS = /** @type {const} */ ({
  INIT: "INIT",
  ADD_TASK: "ADD_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  TOGGLE_COMPLETE: "TOGGLE_COMPLETE",
  BULK_COMPLETE: "BULK_COMPLETE",
  CLEAR_COMPLETED: "CLEAR_COMPLETED",
  SET_FILTERS: "SET_FILTERS",

  // extra (UI scalability)
  TOGGLE_SELECTED: "TOGGLE_SELECTED",
  CLEAR_SELECTED: "CLEAR_SELECTED",
  SELECT_ALL_VISIBLE: "SELECT_ALL_VISIBLE",
  DELETE_SELECTED: "DELETE_SELECTED",
});

export function getInitialTodosState() {
  return {
    tasks: [],
    filters: {
      status: "all",
      priority: "all",
      tags: [],
      sortBy: "dueDateAsc",
      search: "",
    },
    selectedIds: {},
  };
}

/**
 * @param {TodosState} state
 * @param {any} action
 * @returns {TodosState}
 */
export function todosReducer(state, action) {
  switch (action?.type) {
    case TODOS_ACTIONS.INIT: {
      return action?.payload ? action.payload : state;
    }

    case TODOS_ACTIONS.ADD_TASK: {
      const task = action.payload;
      return { ...state, tasks: [task, ...state.tasks] };
    }

    case TODOS_ACTIONS.UPDATE_TASK: {
      const { id, patch } = action.payload || {};
      if (!id) return state;
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t)),
      };
    }

    case TODOS_ACTIONS.DELETE_TASK: {
      const id = action.payload?.id;
      if (!id) return state;
      const nextSelected = { ...state.selectedIds };
      delete nextSelected[id];
      return { ...state, tasks: state.tasks.filter((t) => t.id !== id), selectedIds: nextSelected };
    }

    case TODOS_ACTIONS.TOGGLE_COMPLETE: {
      const id = action.payload?.id;
      if (!id) return state;
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== id) return t;
          const completed = !t.completed;
          return {
            ...t,
            completed,
            status: completed ? "done" : t.status === "done" ? "todo" : t.status,
            updatedAt: Date.now(),
          };
        }),
      };
    }

    case TODOS_ACTIONS.BULK_COMPLETE: {
      const now = Date.now();
      return {
        ...state,
        tasks: state.tasks.map((t) => ({ ...t, completed: true, status: "done", updatedAt: now })),
      };
    }

    case TODOS_ACTIONS.CLEAR_COMPLETED: {
      const remaining = state.tasks.filter((t) => !t.completed);
      const remainingIds = new Set(remaining.map((t) => t.id));
      const nextSelected = {};
      for (const id of Object.keys(state.selectedIds)) {
        if (remainingIds.has(id)) nextSelected[id] = true;
      }
      return { ...state, tasks: remaining, selectedIds: nextSelected };
    }

    case TODOS_ACTIONS.SET_FILTERS: {
      const patch = action.payload || {};
      return { ...state, filters: { ...state.filters, ...patch } };
    }

    case TODOS_ACTIONS.TOGGLE_SELECTED: {
      const id = action.payload?.id;
      if (!id) return state;
      const next = { ...state.selectedIds };
      if (next[id]) delete next[id];
      else next[id] = true;
      return { ...state, selectedIds: next };
    }

    case TODOS_ACTIONS.CLEAR_SELECTED: {
      return { ...state, selectedIds: {} };
    }

    case TODOS_ACTIONS.SELECT_ALL_VISIBLE: {
      const ids = action.payload?.ids || [];
      const next = {};
      for (const id of ids) next[id] = true;
      return { ...state, selectedIds: next };
    }

    case TODOS_ACTIONS.DELETE_SELECTED: {
      const selected = state.selectedIds;
      const remaining = state.tasks.filter((t) => !selected[t.id]);
      return { ...state, tasks: remaining, selectedIds: {} };
    }

    default:
      return state;
  }
}


