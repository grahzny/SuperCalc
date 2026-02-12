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
  rsuIncome: 0,
  rentalNetIncome: 0,
  dividends: 0,
  interest: 0,
  otherTaxableIncome: 0,
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
  const remaining = rules.contributionCaps.concessional - res.cc;

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
      <h2>Concessional cap checker</h2>
      <div className="grid-3">
        <NumberInput label="Salary base" value={person.salaryBase} onChange={(value) => setPerson((prev) => ({ ...prev, salaryBase: value }))} />
        <NumberInput label="Salary sacrifice" value={person.salarySacrifice} onChange={(value) => setPerson((prev) => ({ ...prev, salarySacrifice: value }))} />
        <NumberInput label="Personal deductible" value={person.personalDeductible} onChange={(value) => setPerson((prev) => ({ ...prev, personalDeductible: value }))} />
      </div>
      <p>Total concessional contributions: {formatCurrency(res.cc)}</p>
      <p>Annual concessional cap: {formatCurrency(rules.contributionCaps.concessional)}</p>
      <p>
        Status:{" "}
        {remaining >= 0 ? (
          <strong>{formatCurrency(remaining)} remaining before cap</strong>
        ) : (
          <strong className="warning">{formatCurrency(Math.abs(remaining))} above cap</strong>
        )}
      </p>
    </section>
  );
}
