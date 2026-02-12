"use client";

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
            value={Number.isFinite(value) ? value : 0}
            min={min}
            step={step}
            onChange={(event) => onChange(Number(event.target.value))}
          />
          {suffix && <span className="input-suffix">{suffix}</span>}
        </div>
      ) : (
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      )}
    </label>
  );
}
