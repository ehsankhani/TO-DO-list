import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * @template T
 * @typedef {{
 *  version: number,
 *  validate?: (data: any) => data is T,
 *  migrate?: (stored: any) => T,
 *  serialize?: (value: T) => string,
 *  deserialize?: (raw: string) => any,
 *  writeDelayMs?: number,
 * }} UseLocalStorageOptions
 */

/**
 * LocalStorage hook with schema validation + versioning.
 * - Stores a wrapper: { v, data }
 * - If version mismatch, uses `migrate` (if provided) or falls back to initialValue.
 * - Never throws; surfaces last error in meta.
 *
 * @template T
 * @param {string} key
 * @param {T | (() => T)} initialValue
 * @param {UseLocalStorageOptions<T>} options
 * @returns {[T, (next: T | ((prev: T) => T)) => void, { error: null | Error, hasHydrated: boolean }]}
 */
export function useLocalStorage(key, initialValue, options) {
  const {
    version,
    validate,
    migrate,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    writeDelayMs = 150,
  } = options || {};

  const init = useMemo(() => {
    const iv = typeof initialValue === "function" ? initialValue() : initialValue;
    return /** @type {T} */ (iv);
  }, [initialValue]);

  const [state, setState] = useState(() => init);
  const [error, setError] = useState(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const lastSavedRef = useRef(init);
  const pendingWriteRef = useRef(/** @type {number | null} */ (null));
  const keyRef = useRef(key);
  keyRef.current = key;

  const hydrate = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(keyRef.current);
      if (!raw) {
        setState(init);
        lastSavedRef.current = init;
        return;
      }

      const parsed = deserialize(raw);
      const wrapper =
        parsed && typeof parsed === "object" && "data" in parsed
          ? parsed
          : { v: version, data: parsed };

      const wrapperVersion =
        wrapper && typeof wrapper === "object" && "v" in wrapper ? wrapper.v : version;
      const data = wrapper.data;

      if (typeof version === "number" && wrapperVersion !== version) {
        if (typeof migrate === "function") {
          const migrated = migrate(wrapper);
          setState(migrated);
          lastSavedRef.current = migrated;
        } else {
          setState(init);
          lastSavedRef.current = init;
        }
        return;
      }

      if (typeof validate === "function") {
        if (validate(data)) {
          setState(data);
          lastSavedRef.current = data;
        } else {
          setState(init);
          lastSavedRef.current = init;
        }
      } else {
        setState(/** @type {T} */ (data));
        lastSavedRef.current = /** @type {T} */ (data);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error("LocalStorage hydrate error"));
      setState(init);
      lastSavedRef.current = init;
    }
  }, [deserialize, init, migrate, validate, version]);

  useEffect(() => {
    hydrate();
    setHasHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const persist = useCallback(
    (value) => {
      try {
        const wrapper = typeof version === "number" ? { v: version, data: value } : value;
        window.localStorage.setItem(keyRef.current, serialize(wrapper));
        lastSavedRef.current = value;
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("LocalStorage write error"));
        throw e;
      }
    },
    [serialize, version],
  );

  const setValue = useCallback(
    (next) => {
      setState((prev) => {
        const computed = typeof next === "function" ? next(prev) : next;
        if (pendingWriteRef.current) window.clearTimeout(pendingWriteRef.current);
        pendingWriteRef.current = window.setTimeout(() => {
          try {
            persist(computed);
          } catch {
            // keep UI state optimistic; caller can decide rollback strategy
          }
        }, Math.max(0, writeDelayMs));
        return computed;
      });
    },
    [persist, writeDelayMs],
  );

  const resetToLastSaved = useCallback(() => {
    setState(lastSavedRef.current);
  }, []);

  return [
    state,
    setValue,
    { error, hasHydrated, lastSavedValue: lastSavedRef.current, resetToLastSaved },
  ];
}


