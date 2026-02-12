"use client";

import { useEffect, useMemo, useState } from "react";
import { LineChart } from "@/components/LineChart";
import { NumberInput } from "@/components/NumberInput";
import {
  calculateCapWarnings,
  calculateDivision293,
  displayValue,
  formatCurrency,
  projectHousehold
} from "@/lib/calc";
import type { DisplayMode, PersonInput, Rules } from "@/lib/types";
import { parseNum, writeUrl } from "@/lib/urlState";

type Props = {
  rules: Rules;
};

const buildDefaultPerson = (rules: Rules): PersonInput => ({
  currentAge: 35,
  retireAge: 67,
  currentBalance: 120000,
  salaryBase: 120000,
  bonus: 0,
  salarySacrifice: 0,
  personalDeductible: 0,
  afterTaxContribution: 0,
  rsuIncome: 0,
  rentalNetIncome: 0,
  dividends: 0,
  interest: 0,
  otherTaxableIncome: 0,
  salaryGrowth: 0.03,
  nominalReturn: rules.defaults.nominalReturn,
  inflation: rules.defaults.inflation,
  adminFeeAnnual: rules.defaults.adminFeeAnnual,
  feePercent: rules.defaults.feePercent,
  insuranceAnnual: 0
});

const keys: (keyof PersonInput)[] = [
  "currentAge",
  "retireAge",
  "currentBalance",
  "salaryBase",
  "bonus",
  "salarySacrifice",
  "personalDeductible",
  "afterTaxContribution",
  "rsuIncome",
  "rentalNetIncome",
  "dividends",
  "interest",
  "otherTaxableIncome",
  "salaryGrowth",
  "nominalReturn",
  "inflation",
  "adminFeeAnnual",
  "feePercent",
  "insuranceAnnual"
];

export function SuperannuationCalculator({ rules }: Props) {
  const defaultsA = useMemo(() => buildDefaultPerson(rules), [rules]);
  const defaultsB = useMemo(() => ({ ...buildDefaultPerson(rules), salaryBase: 90000, currentBalance: 80000 }), [rules]);
  const [personA, setPersonA] = useState<PersonInput>(defaultsA);
  const [personB, setPersonB] = useState<PersonInput>(defaultsB);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("nominal");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasKnownQueryState = Array.from(params.keys()).some(
      (key) => key === "mode" || key.startsWith("a_") || key.startsWith("b_")
    );
    const nextA: PersonInput = { ...defaultsA };
    const nextB: PersonInput = { ...defaultsB };
    keys.forEach((key) => {
      nextA[key] = parseNum(params, `a_${key}`, defaultsA[key]);
      nextB[key] = parseNum(params, `b_${key}`, defaultsB[key]);
    });
    const mode = params.get("mode");
    if (hasKnownQueryState) {
      setPersonA(nextA);
      setPersonB(nextB);
      if (mode === "nominal" || mode === "real") {
        setDisplayMode(mode);
      }
      return;
    }

    const cached = localStorage.getItem("supercalc:household");
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { personA: PersonInput; personB: PersonInput; mode: DisplayMode };
        setPersonA(parsed.personA);
        setPersonB(parsed.personB);
        setDisplayMode(parsed.mode);
        return;
      } catch {
        // Ignore invalid cache and fallback to defaults.
      }
    }

    setPersonA(nextA);
    setPersonB(nextB);
    setDisplayMode("nominal");
  }, [defaultsA, defaultsB]);

  useEffect(() => {
    const out: Record<string, number | string> = { mode: displayMode };
    keys.forEach((key) => {
      out[`a_${key}`] = personA[key];
      out[`b_${key}`] = personB[key];
    });
    writeUrl(out);
    localStorage.setItem("supercalc:household", JSON.stringify({ personA, personB, mode: displayMode }));
  }, [displayMode, personA, personB]);

  const projection = useMemo(() => projectHousehold(personA, personB, rules), [personA, personB, rules]);
  const divA = useMemo(() => calculateDivision293(personA, rules), [personA, rules]);
  const divB = useMemo(() => calculateDivision293(personB, rules), [personB, rules]);
  const warnA = useMemo(() => calculateCapWarnings(personA, rules), [personA, rules]);
  const warnB = useMemo(() => calculateCapWarnings(personB, rules), [personB, rules]);

  const finalTotal = projection.total[projection.total.length - 1]?.totalNominalBalance ?? 0;
  const displayFinal = displayValue(finalTotal, displayMode, personA.inflation, projection.total.length);
  const chartPoints = projection.total.map((row) => ({
    xLabel: `Age ${row.ageA}/${row.ageB}`,
    yValue: displayValue(row.totalNominalBalance, displayMode, personA.inflation, row.yearIndex + 1)
  }));

  const update = (who: "A" | "B", key: keyof PersonInput, value: number) => {
    if (who === "A") {
      setPersonA((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : 0 }));
    } else {
      setPersonB((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : 0 }));
    }
  };

  const fieldStep = (key: keyof PersonInput) =>
    key === "currentAge" || key === "retireAge"
      ? 1
      : key === "salaryGrowth" || key === "nominalReturn" || key === "inflation" || key === "feePercent"
        ? 0.001
        : 100;

  const fieldMin = (key: keyof PersonInput) => (key === "currentAge" || key === "retireAge" ? 0 : undefined);

  return (
    <section className="card">
      <h2>Super projection tool</h2>
      <p>
        Estimate two-person super balances with annual SG, concessional and after-tax contributions, Division 293,
        fees and inflation-adjusted outputs.
      </p>
      <div className="toggle-row" role="group" aria-label="Display mode">
        <button
          type="button"
          className={displayMode === "nominal" ? "active" : ""}
          onClick={() => setDisplayMode("nominal")}
        >
          Nominal (future dollars)
        </button>
        <button type="button" className={displayMode === "real" ? "active" : ""} onClick={() => setDisplayMode("real")}>
          Today&apos;s dollars
        </button>
      </div>
      <p className="headline">
        Projected combined balance at retirement: <strong>{formatCurrency(displayFinal)}</strong>
      </p>

      <div className="grid-2">
        <fieldset>
          <legend>Person A</legend>
          {keys.map((key) => (
            <NumberInput
              key={`a-${key}`}
              label={key}
              value={personA[key]}
              onChange={(value) => update("A", key, value)}
              step={fieldStep(key)}
              min={fieldMin(key)}
            />
          ))}
          <p className="tiny">
            Contributions tax: {formatCurrency(divA.contributionsTax)} | Division 293: {formatCurrency(divA.div293Tax)}
          </p>
          {warnA.messages.map((message) => (
            <p key={message} className="warning">
              {message}
            </p>
          ))}
        </fieldset>

        <fieldset>
          <legend>Person B (Spouse)</legend>
          {keys.map((key) => (
            <NumberInput
              key={`b-${key}`}
              label={key}
              value={personB[key]}
              onChange={(value) => update("B", key, value)}
              step={fieldStep(key)}
              min={fieldMin(key)}
            />
          ))}
          <p className="tiny">
            Contributions tax: {formatCurrency(divB.contributionsTax)} | Division 293: {formatCurrency(divB.div293Tax)}
          </p>
          {warnB.messages.map((message) => (
            <p key={message} className="warning">
              {message}
            </p>
          ))}
        </fieldset>
      </div>

      <LineChart points={chartPoints} title={`Combined balance trajectory (${displayMode})`} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Age A</th>
              <th>Age B</th>
              <th>Combined balance</th>
            </tr>
          </thead>
          <tbody>
            {projection.total.map((row) => (
              <tr key={`${row.yearIndex}-${row.ageA}-${row.ageB}`}>
                <td>{row.yearIndex + 1}</td>
                <td>{row.ageA}</td>
                <td>{row.ageB}</td>
                <td>{formatCurrency(displayValue(row.totalNominalBalance, displayMode, personA.inflation, row.yearIndex + 1))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
