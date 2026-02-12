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

  return (
    <section className="card">
      <h2>Division 293 estimator</h2>
      <div className="grid-3">
        <NumberInput label="Salary base" value={person.salaryBase} onChange={(value) => update("salaryBase", value)} />
        <NumberInput label="Bonus" value={person.bonus} onChange={(value) => update("bonus", value)} />
        <NumberInput label="Salary sacrifice" value={person.salarySacrifice} onChange={(value) => update("salarySacrifice", value)} />
        <NumberInput label="Personal deductible" value={person.personalDeductible} onChange={(value) => update("personalDeductible", value)} />
        <NumberInput label="RSU income" value={person.rsuIncome} onChange={(value) => update("rsuIncome", value)} />
        <NumberInput label="Rental net income" value={person.rentalNetIncome} onChange={(value) => update("rentalNetIncome", value)} />
        <NumberInput label="Dividends" value={person.dividends} onChange={(value) => update("dividends", value)} />
        <NumberInput label="Interest" value={person.interest} onChange={(value) => update("interest", value)} />
        <NumberInput label="Other taxable income" value={person.otherTaxableIncome} onChange={(value) => update("otherTaxableIncome", value)} />
      </div>
      <div className="results">
        <p>Concessional contributions (CC): {formatCurrency(result.cc)}</p>
        <p>Income base: {formatCurrency(result.incomeBase)}</p>
        <p>Combined income + CC: {formatCurrency(result.combined)}</p>
        <p>Excess over threshold: {formatCurrency(result.excess)}</p>
        <p>Division 293 taxable amount: {formatCurrency(result.div293Taxable)}</p>
        <p>
          Standard concessional contributions tax (15%): <strong>{formatCurrency(result.contributionsTax)}</strong>
        </p>
        <p>
          Additional Division 293 tax (15%): <strong>{formatCurrency(result.div293Tax)}</strong>
        </p>
      </div>
    </section>
  );
}
