import "@testing-library/jest-dom";

// Provide the same config shape our app expects from Vite's `define`.
globalThis.__APP_CONFIG__ = {
  LOCAL_STORAGE_KEY: "todo.state",
  THEME_STORAGE_KEY: "todo.theme",
  ANIMATION_MS: 180,
};

// JSDOM doesn't implement matchMedia by default; our theme logic relies on it.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});


