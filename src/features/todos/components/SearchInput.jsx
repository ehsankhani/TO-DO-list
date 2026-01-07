import React, { useEffect, useState } from "react";
import { t } from "../../../shared/i18n/dictionary";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";

export function SearchInput({ value, onDebouncedChange }) {
  const [local, setLocal] = useState(value);
  const debounced = useDebouncedValue(local, 250);

  useEffect(() => setLocal(value), [value]);
  useEffect(() => {
    if (debounced === value) return;
    onDebouncedChange(debounced);
  }, [debounced, onDebouncedChange, value]);

  return (
    <label style={{ width: "min(460px, 100%)" }}>
      <span className="sr-only">{t("fields.search")}</span>
      <input
        className="field"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={t("fields.search")}
        inputMode="search"
      />
    </label>
  );
}


