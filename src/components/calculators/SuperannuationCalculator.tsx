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

/* Human-friendly labels and field metadata */
const fieldMeta: Record<string, { label: string; prefix?: string; suffix?: string; hint?: string }> = {
  currentAge: { label: "Current age", suffix: "years" },
  retireAge: { label: "Retirement age", suffix: "years" },
  currentBalance: { label: "Current super balance", prefix: "$" },
  salaryBase: { label: "Base salary", prefix: "$", hint: "Annual gross salary before tax" },
  bonus: { label: "Annual bonus", prefix: "$" },
  salarySacrifice: { label: "Salary sacrifice", prefix: "$", hint: "Pre-tax contributions from your pay" },
  personalDeductible: { label: "Personal deductible contributions", prefix: "$", hint: "Contributions you claim as a tax deduction" },
  afterTaxContribution: { label: "After-tax contributions", prefix: "$", hint: "Voluntary contributions from after-tax income" },
  rsuIncome: { label: "RSU / equity income", prefix: "$" },
  rentalNetIncome: { label: "Net rental income", prefix: "$" },
  dividends: { label: "Dividends", prefix: "$" },
  interest: { label: "Interest income", prefix: "$" },
  otherTaxableIncome: { label: "Other taxable income", prefix: "$" },
  salaryGrowth: { label: "Salary growth rate", suffix: "decimal", hint: "e.g. 0.03 = 3% per year" },
  nominalReturn: { label: "Investment return", suffix: "decimal", hint: "e.g. 0.065 = 6.5% per year" },
  inflation: { label: "Inflation rate", suffix: "decimal", hint: "e.g. 0.025 = 2.5% per year" },
  adminFeeAnnual: { label: "Annual admin fee", prefix: "$" },
  feePercent: { label: "Investment fee", suffix: "decimal", hint: "e.g. 0.007 = 0.7% of balance" },
  insuranceAnnual: { label: "Insurance premium", prefix: "$", hint: "Annual insurance deducted from super" }
};

/* Group fields into logical sections for progressive disclosure */
const fieldGroups = [
  { title: "About you", keys: ["currentAge", "retireAge", "currentBalance"] as (keyof PersonInput)[] },
  { title: "Income", keys: ["salaryBase", "bonus"] as (keyof PersonInput)[] },
  { title: "Contributions", keys: ["salarySacrifice", "personalDeductible", "afterTaxContribution"] as (keyof PersonInput)[] },
  { title: "Other income (for Division 293)", keys: ["rsuIncome", "rentalNetIncome", "dividends", "interest", "otherTaxableIncome"] as (keyof PersonInput)[], collapsed: true },
  { title: "Assumptions", keys: ["salaryGrowth", "nominalReturn", "inflation"] as (keyof PersonInput)[], collapsed: true },
  { title: "Fees & insurance", keys: ["adminFeeAnnual", "feePercent", "insuranceAnnual"] as (keyof PersonInput)[], collapsed: true }
];

export function SuperannuationCalculator({ rules }: Props) {
  const defaultsA = useMemo(() => buildDefaultPerson(rules), [rules]);
  const defaultsB = useMemo(() => ({ ...buildDefaultPerson(rules), salaryBase: 90000, currentBalance: 80000 }), [rules]);
  const [personA, setPersonA] = useState<PersonInput>(defaultsA);
  const [personB, setPersonB] = useState<PersonInput>(defaultsB);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("nominal");
  const [activeTab, setActiveTab] = useState<"A" | "B">("A");

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

  const activeDiv = activeTab === "A" ? divA : divB;
  const activeWarn = activeTab === "A" ? warnA : warnB;

  const renderPersonFields = (who: "A" | "B") => (
    <>
      {fieldGroups.map((group) => {
        const inner = (
          <div className={group.keys.length <= 3 ? "grid-3" : "grid-2"} style={{ marginBottom: 0 }}>
            {group.keys.map((key) => {
              const meta = fieldMeta[key] || { label: key };
              return (
                <NumberInput
                  key={`${who}-${key}`}
                  label={meta.label}
                  value={(who === "A" ? personA : personB)[key]}
                  onChange={(value) => update(who, key, value)}
                  step={fieldStep(key)}
                  min={fieldMin(key)}
                  prefix={meta.prefix}
                  suffix={meta.suffix}
                  hint={meta.hint}
                />
              );
            })}
          </div>
        );

        if (group.collapsed) {
          return (
            <details key={group.title} className="section-group">
              <summary className="section-group-header">
                {group.title}
                <span className="section-group-chevron" aria-hidden="true">&#9660;</span>
              </summary>
              <div className="section-group-body">{inner}</div>
            </details>
          );
        }

        return (
          <div key={group.title} style={{ marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "0.88rem", margin: "0 0 0.5rem", color: "var(--color-text-secondary)" }}>{group.title}</h3>
            {inner}
          </div>
        );
      })}

      {/* Tax summary for this person */}
      <div className="result-highlight" style={{ marginTop: "0.75rem" }}>
        <div className="result-row">
          <span className="result-label">Contributions tax (15%)</span>
          <span className="result-value">{formatCurrency(activeDiv.contributionsTax)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Division 293 tax (15%)</span>
          <span className="result-value">{formatCurrency(activeDiv.div293Tax)}</span>
        </div>
      </div>

      {activeWarn.messages.map((message) => (
        <p key={message} className="warning">
          {message}
        </p>
      ))}
    </>
  );

  return (
    <section className="card">
      <h2>Super Projection Tool</h2>
      <p className="tiny" style={{ marginTop: "-0.5rem", marginBottom: "1rem" }}>
        Estimate combined retirement balances for two people, including employer contributions, salary sacrifice, taxes and fees.
      </p>

      {/* Display mode toggle */}
      <div className="toggle-row" role="group" aria-label="Display mode">
        <button
          type="button"
          className={displayMode === "nominal" ? "active" : ""}
          onClick={() => setDisplayMode("nominal")}
        >
          Future dollars
        </button>
        <button type="button" className={displayMode === "real" ? "active" : ""} onClick={() => setDisplayMode("real")}>
          Today&apos;s dollars
        </button>
      </div>

      {/* Main result */}
      <div className="headline">
        Projected combined balance at retirement
        <strong>{formatCurrency(displayFinal)}</strong>
      </div>

      {/* Person tabs */}
      <div className="person-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "A"}
          className={`person-tab ${activeTab === "A" ? "active" : ""}`}
          onClick={() => setActiveTab("A")}
        >
          Person A (You)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "B"}
          className={`person-tab ${activeTab === "B" ? "active" : ""}`}
          onClick={() => setActiveTab("B")}
        >
          Person B (Spouse)
        </button>
      </div>
      <div className="person-panel" role="tabpanel">
        {activeTab === "A" ? renderPersonFields("A") : renderPersonFields("B")}
      </div>

      {/* Chart */}
      <LineChart points={chartPoints} title={`Combined balance over time (${displayMode === "nominal" ? "future" : "today's"} dollars)`} />

      {/* Year-by-year table */}
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
