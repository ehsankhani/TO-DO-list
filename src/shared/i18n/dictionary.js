import { en } from "./en";

/**
 * Simple i18n-ready dictionary.
 * Keep all user-facing text in here so we can swap languages later.
 */
const dictionaries = { en };

/**
 * @param {string} path dot-path key e.g. "actions.save"
 * @param {{ lang?: "en" }} [options]
 */
export function t(path, options = {}) {
  const lang = options.lang || "en";
  const dict = dictionaries[lang] || dictionaries.en;

  const parts = String(path).split(".");
  /** @type {any} */
  let node = dict;

  for (const p of parts) {
    if (node && typeof node === "object" && p in node) node = node[p];
    else return path;
  }

  return typeof node === "string" ? node : path;
}


