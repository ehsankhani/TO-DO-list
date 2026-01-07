import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";
import { useToasts } from "../../../shared/ui/toast/toastContext.js";
import { t } from "../../../shared/i18n/dictionary";
import { filteredTasksSelector } from "../selectors/filteredTasksSelector";
import { createTask, isTask } from "../services/tasksService";
import { getInitialTodosState, TODOS_ACTIONS, todosReducer } from "../reducers/todosReducer";
import { APP_CONFIG } from "../../../app/config/appConfig.js";

const STORAGE_KEY = APP_CONFIG.LOCAL_STORAGE_KEY;
const STORAGE_VERSION = 1;

function validateTodosState(data) {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.tasks) &&
    data.tasks.every(isTask) &&
    data.filters &&
    typeof data.filters === "object" &&
    typeof data.filters.search === "string" &&
    typeof data.filters.sortBy === "string" &&
    typeof data.selectedIds === "object"
  );
}

export function useTodosController() {
  const { push } = useToasts();

  const [persisted, setPersisted, storageMeta] = useLocalStorage(
    STORAGE_KEY,
    getInitialTodosState,
    {
      version: STORAGE_VERSION,
      validate: validateTodosState,
      migrate: (wrapper) => {
        const initial = getInitialTodosState();
        const data = wrapper?.data ?? wrapper;
        return validateTodosState(data) ? { ...initial, ...data } : initial;
      },
      writeDelayMs: APP_CONFIG.ANIMATION_MS,
    },
  );
  const { error: storageError, hasHydrated, resetToLastSaved } = storageMeta;

  const [state, dispatchBase] = useReducer(todosReducer, getInitialTodosState());
  const lastToastErrorRef = useRef(0);

  // hydrate reducer from persisted once storage hook loads
  useEffect(() => {
    if (!hasHydrated) return;
    dispatchBase({ type: TODOS_ACTIONS.INIT, payload: persisted });
  }, [hasHydrated, persisted]);

  // if storage write fails, revert to last good snapshot and toast once
  useEffect(() => {
    if (!storageError) return;
    const now = Date.now();
    if (now - lastToastErrorRef.current > 800) {
      push({ title: t("toasts.storageError"), variant: "danger", timeoutMs: 4200 });
      lastToastErrorRef.current = now;
    }
    resetToLastSaved();
  }, [push, resetToLastSaved, storageError]);

  const dispatch = useCallback(
    (action) => {
      dispatchBase(action);
      setPersisted((prev) => todosReducer(prev, action));
    },
    [setPersisted],
  );

  const derived = useMemo(() => filteredTasksSelector(state), [state]);
  const visibleIdsRef = useRef(derived.visibleIds);
  useEffect(() => {
    visibleIdsRef.current = derived.visibleIds;
  }, [derived.visibleIds]);

  const actions = useMemo(() => {
    return {
      addTask: (fields) => {
        const task = createTask(fields);
        if (!task.title) return { ok: false, error: "TITLE_REQUIRED" };
        dispatch({ type: TODOS_ACTIONS.ADD_TASK, payload: task });
        return { ok: true };
      },
      updateTask: (id, patch) =>
        dispatch({ type: TODOS_ACTIONS.UPDATE_TASK, payload: { id, patch } }),
      deleteTask: (id) => dispatch({ type: TODOS_ACTIONS.DELETE_TASK, payload: { id } }),
      toggleComplete: (id) => dispatch({ type: TODOS_ACTIONS.TOGGLE_COMPLETE, payload: { id } }),
      bulkComplete: () => dispatch({ type: TODOS_ACTIONS.BULK_COMPLETE }),
      clearCompleted: () => dispatch({ type: TODOS_ACTIONS.CLEAR_COMPLETED }),
      setFilters: (patch) => dispatch({ type: TODOS_ACTIONS.SET_FILTERS, payload: patch }),
      toggleSelected: (id) => dispatch({ type: TODOS_ACTIONS.TOGGLE_SELECTED, payload: { id } }),
      clearSelected: () => dispatch({ type: TODOS_ACTIONS.CLEAR_SELECTED }),
      selectAllVisible: () =>
        dispatch({
          type: TODOS_ACTIONS.SELECT_ALL_VISIBLE,
          payload: { ids: visibleIdsRef.current || [] },
        }),
      deleteSelected: () => dispatch({ type: TODOS_ACTIONS.DELETE_SELECTED }),
    };
  }, [dispatch]);

  return { state, derived, actions, storageError };
}


