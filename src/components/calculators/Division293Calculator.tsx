"use client";

import { useEffect, useMemo, useState } from "react";
import { NumberInput } from "@/components/NumberInput";
import { calculateDivision293, formatCurrency } from "@/lib/calc";
import type { PersonInput, Rules } from "@/lib/types";
import { parseNum, writeUrl } from "@/lib/urlState";

type Props = {
  rules: Rules;
};

const initialPerson: PersonInput = {
  currentAge: 40,
  retireAge: 67,
  currentBalance: 0,
  salaryBase: 260000,
  bonus: 20000,
  salarySacrifice: 10000,
  personalDeductible: 0,
  afterTaxContribution: 0,
  rsuIncome: 0,
  rentalNetIncome: 0,
  dividends: 0,
  interest: 0,
  otherTaxableIncome: 0,
  salaryGrowth: 0.03,
  nominalReturn: 0.065,
  inflation: 0.025,
  adminFeeAnnual: 120,
  feePercent: 0.007,
  insuranceAnnual: 0
};

export function Division293Calculator({ rules }: Props) {
  const [person, setPerson] = useState<PersonInput>(initialPerson);
  const result = useMemo(() => calculateDivision293(person, rules), [person, rules]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPerson((prev) => ({
      ...prev,
      salaryBase: parseNum(params, "d293_salaryBase", initialPerson.salaryBase),
      bonus: parseNum(params, "d293_bonus", initialPerson.bonus),
      salarySacrifice: parseNum(params, "d293_salarySacrifice", initialPerson.salarySacrifice),
      personalDeductible: parseNum(params, "d293_personalDeductible", initialPerson.personalDeductible),
      rsuIncome: parseNum(params, "d293_rsuIncome", initialPerson.rsuIncome),
      rentalNetIncome: parseNum(params, "d293_rentalNetIncome", initialPerson.rentalNetIncome),
      dividends: parseNum(params, "d293_dividends", initialPerson.dividends),
      interest: parseNum(params, "d293_interest", initialPerson.interest),
      otherTaxableIncome: parseNum(params, "d293_otherTaxableIncome", initialPerson.otherTaxableIncome)
    }));
  }, []);

  useEffect(() => {
    writeUrl({
      d293_salaryBase: person.salaryBase,
      d293_bonus: person.bonus,
      d293_salarySacrifice: person.salarySacrifice,
      d293_personalDeductible: person.personalDeductible,
      d293_rsuIncome: person.rsuIncome,
      d293_rentalNetIncome: person.rentalNetIncome,
      d293_dividends: person.dividends,
      d293_interest: person.interest,
      d293_otherTaxableIncome: person.otherTaxableIncome
    });
  }, [person]);

  const update = (key: keyof PersonInput, value: number) => {
    setPerson((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : 0 }));
  };

  const isAboveThreshold = result.excess > 0;

  return (
    <section className="card">
      <h2>Division 293 Estimator</h2>
      <p className="tiny" style={{ marginTop: "-0.5rem", marginBottom: "1rem" }}>
        Division 293 is an extra 15% tax on some super contributions if your income plus contributions exceed $250,000.
      </p>

      <div style={{ marginBottom: "0.75rem" }}>
        <h3 style={{ fontSize: "0.88rem", margin: "0 0 0.5rem", color: "var(--color-text-secondary)" }}>Income &amp; contributions</h3>
        <div className="grid-3">
          <NumberInput label="Base salary" prefix="$" value={person.salaryBase} onChange={(value) => update("salaryBase", value)} />
          <NumberInput label="Annual bonus" prefix="$" value={person.bonus} onChange={(value) => update("bonus", value)} />
          <NumberInput label="Salary sacrifice" prefix="$" value={person.salarySacrifice} onChange={(value) => update("salarySacrifice", value)} hint="Pre-tax contributions from your pay" />
        </div>
      </div>

      <details className="section-group">
        <summary className="section-group-header">
          More income &amp; deductions
          <span className="section-group-chevron" aria-hidden="true">&#9660;</span>
        </summary>
        <div className="section-group-body">
          <div className="grid-3">
            <NumberInput label="Personal deductible" prefix="$" value={person.personalDeductible} onChange={(value) => update("personalDeductible", value)} hint="Contributions you claim as a tax deduction" />
            <NumberInput label="RSU / equity income" prefix="$" value={person.rsuIncome} onChange={(value) => update("rsuIncome", value)} />
            <NumberInput label="Net rental income" prefix="$" value={person.rentalNetIncome} onChange={(value) => update("rentalNetIncome", value)} />
            <NumberInput label="Dividends" prefix="$" value={person.dividends} onChange={(value) => update("dividends", value)} />
            <NumberInput label="Interest income" prefix="$" value={person.interest} onChange={(value) => update("interest", value)} />
            <NumberInput label="Other taxable income" prefix="$" value={person.otherTaxableIncome} onChange={(value) => update("otherTaxableIncome", value)} />
          </div>
        </div>
      </details>

      {/* Results */}
      <div className="results" style={{ marginTop: "1rem" }}>
        <div className="result-row">
          <span className="result-label">Concessional contributions (CC)</span>
          <span className="result-value">{formatCurrency(result.cc)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Taxable income</span>
          <span className="result-value">{formatCurrency(result.incomeBase)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Combined income + CC</span>
          <span className="result-value">{formatCurrency(result.combined)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Excess over $250,000 threshold</span>
          <span className={`result-value ${isAboveThreshold ? "cap-exceeded" : ""}`}>{formatCurrency(result.excess)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Division 293 taxable amount</span>
          <span className="result-value">{formatCurrency(result.div293Taxable)}</span>
        </div>
      </div>

      <div className="result-highlight">
        <div className="result-row">
          <span className="result-label">Standard contributions tax (15%)</span>
          <span className="result-value">{formatCurrency(result.contributionsTax)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Additional Division 293 tax (15%)</span>
          <span className="result-value" style={{ color: isAboveThreshold ? "var(--color-warn)" : undefined }}>
            {formatCurrency(result.div293Tax)}
          </span>
        </div>
      </div>
    </section>
  );
}
