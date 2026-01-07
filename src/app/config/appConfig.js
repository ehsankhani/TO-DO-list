/**
 * Vite-injected config (via `vite.config.mjs` -> `define`).
 * In tests, we set `globalThis.__APP_CONFIG__` in `src/setupTests.js`.
 */

const defaults = {
  LOCAL_STORAGE_KEY: "todo.state",
  THEME_STORAGE_KEY: "todo.theme",
  ANIMATION_MS: 180,
};

// eslint-disable-next-line no-undef
const injected = typeof __APP_CONFIG__ !== "undefined" ? __APP_CONFIG__ : undefined;

export const APP_CONFIG = { ...defaults, ...(injected || {}) };


