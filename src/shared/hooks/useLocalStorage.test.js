import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test("hydrates initial value when storage empty and persists on set", () => {
    const { result } = renderHook(() =>
      useLocalStorage("k1", { a: 1 }, { version: 1, validate: (v) => typeof v?.a === "number", writeDelayMs: 0 }),
    );

    expect(result.current[0]).toEqual({ a: 1 });

    act(() => {
      result.current[1]({ a: 2 });
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(result.current[0]).toEqual({ a: 2 });
    const raw = window.localStorage.getItem("k1");
    expect(raw).toContain('"v":1');
    expect(raw).toContain('"a":2');
  });

  test("migrates when version changes", () => {
    window.localStorage.setItem("k2", JSON.stringify({ v: 0, data: { old: true } }));
    const { result } = renderHook(() =>
      useLocalStorage("k2", { ok: false }, { version: 1, migrate: () => ({ ok: true }), writeDelayMs: 0 }),
    );
    expect(result.current[0]).toEqual({ ok: true });
  });

  test("exposes error and resetToLastSaved on write failure", () => {
    const spy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("fail");
    });

    const { result } = renderHook(() =>
      useLocalStorage("k3", { n: 1 }, { version: 1, writeDelayMs: 0 }),
    );

    act(() => {
      result.current[1]({ n: 2 });
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(result.current[0]).toEqual({ n: 2 });
    expect(result.current[2].error).toBeTruthy();

    act(() => {
      result.current[2].resetToLastSaved();
    });
    expect(result.current[0]).toEqual({ n: 1 });

    spy.mockRestore();
  });
});


