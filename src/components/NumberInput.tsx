"use client";

import type { FocusEvent } from "react";

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
};

export function NumberInput({ label, value, onChange, step = 1, min, prefix, suffix, hint }: Props) {
  const hasGroup = prefix || suffix;
  const displayValue = Number.isFinite(value) ? value : 0;
  const selectAll = (e: FocusEvent<HTMLInputElement>) => e.target.select();

  return (
    <label className="field">
      <span>{label}</span>
      {hint && <span className="field-hint">{hint}</span>}
      {hasGroup ? (
        <div className="input-group">
          {prefix && <span className="input-prefix">{prefix}</span>}
          <input
            type="number"
            inputMode="decimal"
            value={displayValue}
            min={min}
            step={step}
            onFocus={selectAll}
            onChange={(event) => onChange(Number(event.target.value))}
          />
          {suffix && <span className="input-suffix">{suffix}</span>}
        </div>
      ) : (
        <input
          type="number"
          inputMode="decimal"
          value={displayValue}
          min={min}
          step={step}
          onFocus={selectAll}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      )}
    </label>
  );
}
