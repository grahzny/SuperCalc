"use client";

import { useEffect, useMemo, useState } from "react";
import { NumberInput } from "@/components/NumberInput";
import { calculateDivision293, formatCurrency } from "@/lib/calc";
import type { PersonInput, Rules } from "@/lib/types";
import { parseNum, writeUrl } from "@/lib/urlState";

type Props = {
  rules: Rules;
};

const starter: PersonInput = {
  currentAge: 35,
  retireAge: 67,
  currentBalance: 0,
  salaryBase: 120000,
  bonus: 0,
  salarySacrifice: 0,
  personalDeductible: 0,
  afterTaxContribution: 0,
  otherIncome: 0,
  salaryGrowth: 0,
  nominalReturn: 0,
  inflation: 0,
  adminFeeAnnual: 0,
  feePercent: 0,
  insuranceAnnual: 0
};

export function ConcessionalCapChecker({ rules }: Props) {
  const [person, setPerson] = useState<PersonInput>(starter);
  const res = useMemo(() => calculateDivision293(person, rules), [person, rules]);
  const cap = rules.contributionCaps.concessional;
  const remaining = cap - res.cc;
  const usedPercent = Math.min(100, Math.max(0, (res.cc / cap) * 100));
  const isExceeded = remaining < 0;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPerson((prev) => ({
      ...prev,
      salaryBase: parseNum(params, "cc_salaryBase", starter.salaryBase),
      salarySacrifice: parseNum(params, "cc_salarySacrifice", starter.salarySacrifice),
      personalDeductible: parseNum(params, "cc_personalDeductible", starter.personalDeductible)
    }));
  }, []);

  useEffect(() => {
    writeUrl({
      cc_salaryBase: person.salaryBase,
      cc_salarySacrifice: person.salarySacrifice,
      cc_personalDeductible: person.personalDeductible
    });
  }, [person.personalDeductible, person.salaryBase, person.salarySacrifice]);

  return (
    <section className="card">
      <h2>Concessional Cap Checker</h2>
      <p className="tiny" style={{ marginTop: "-0.5rem", marginBottom: "1rem" }}>
        Check if your before-tax (concessional) super contributions are within the annual {formatCurrency(cap)} limit.
      </p>

      <div className="grid-3">
        <NumberInput label="Base salary" prefix="$" hint="Annual gross salary" value={person.salaryBase} onChange={(value) => setPerson((prev) => ({ ...prev, salaryBase: value }))} />
        <NumberInput label="Salary sacrifice" prefix="$" hint="Pre-tax super contributions" value={person.salarySacrifice} onChange={(value) => setPerson((prev) => ({ ...prev, salarySacrifice: value }))} />
        <NumberInput label="Personal deductible" prefix="$" hint="Contributions claimed as deduction" value={person.personalDeductible} onChange={(value) => setPerson((prev) => ({ ...prev, personalDeductible: value }))} />
      </div>

      {/* Visual cap bar */}
      <div className="cap-status">
        <div className="cap-labels">
          <span>Total concessional: {formatCurrency(res.cc)}</span>
          <span>Cap: {formatCurrency(cap)}</span>
        </div>
        <div className="cap-bar-container">
          <div
            className={`cap-bar ${isExceeded ? "cap-bar-warn" : "cap-bar-ok"}`}
            style={{ width: `${Math.min(usedPercent, 100)}%` }}
          />
        </div>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.92rem" }}>
          {isExceeded ? (
            <span className="cap-exceeded">{formatCurrency(Math.abs(remaining))} above cap</span>
          ) : (
            <span className="cap-ok">{formatCurrency(remaining)} remaining before cap</span>
          )}
        </p>
      </div>
    </section>
  );
}
