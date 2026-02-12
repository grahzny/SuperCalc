"use client";

import { useEffect, useState } from "react";
import { NumberInput } from "@/components/NumberInput";
import { calculateNonConcessionalCap, formatCurrency } from "@/lib/calc";
import type { Rules } from "@/lib/types";
import { parseNum, writeUrl } from "@/lib/urlState";

type Props = {
  rules: Rules;
};

export function NonConcessionalCapChecker({ rules }: Props) {
  const [afterTaxContribution, setAfterTaxContribution] = useState(10000);
  const [ageAtStartOfFinancialYear, setAgeAtStartOfFinancialYear] = useState(40);
  const [totalSuperBalance, setTotalSuperBalance] = useState(300000);

  const cap = calculateNonConcessionalCap(
    afterTaxContribution,
    ageAtStartOfFinancialYear,
    totalSuperBalance,
    rules
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAfterTaxContribution(parseNum(params, "ncc_afterTaxContribution", 10000));
    setAgeAtStartOfFinancialYear(parseNum(params, "ncc_ageAtStartOfFinancialYear", 40));
    setTotalSuperBalance(parseNum(params, "ncc_totalSuperBalance", 300000));
  }, []);

  useEffect(() => {
    writeUrl({
      ncc_afterTaxContribution: afterTaxContribution,
      ncc_ageAtStartOfFinancialYear: ageAtStartOfFinancialYear,
      ncc_totalSuperBalance: totalSuperBalance
    });
  }, [afterTaxContribution, ageAtStartOfFinancialYear, totalSuperBalance]);

  return (
    <section className="card">
      <h2>Non-concessional cap checker</h2>
      <NumberInput label="After-tax contributions (annual)" value={afterTaxContribution} onChange={setAfterTaxContribution} />
      <NumberInput
        label="Age at start of financial year"
        value={ageAtStartOfFinancialYear}
        min={0}
        step={1}
        onChange={setAgeAtStartOfFinancialYear}
      />
      <NumberInput
        label="Total super balance at previous 30 June"
        value={totalSuperBalance}
        min={0}
        step={1000}
        onChange={setTotalSuperBalance}
      />
      <p>Annual NCC cap: {formatCurrency(cap.annualCap)}</p>
      <p>Modeled cap available this year: {formatCurrency(cap.capUsed)}</p>
      {cap.bringForwardEligible && <p>Bring-forward modeled: yes ({cap.capMultiplier}x annual cap).</p>}
      {!cap.bringForwardEligible && <p>Bring-forward modeled: no.</p>}
      <p>
        Status:{" "}
        {cap.remaining >= 0 ? (
          <strong>{formatCurrency(cap.remaining)} remaining this year</strong>
        ) : (
          <strong className="warning">{formatCurrency(cap.excess)} above modeled cap</strong>
        )}
      </p>
      <p className="tiny">
        This models one-year bring-forward eligibility from age and total-balance tiers. It does not track existing
        bring-forward periods already triggered in prior years.
      </p>
    </section>
  );
}
