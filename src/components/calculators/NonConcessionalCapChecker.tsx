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

  const usedPercent = cap.capUsed > 0 ? Math.min(100, Math.max(0, (afterTaxContribution / cap.capUsed) * 100)) : 0;
  const isExceeded = cap.remaining < 0;

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
      <h2>Non-concessional Cap Checker</h2>
      <p className="tiny" style={{ marginTop: "-0.5rem", marginBottom: "1rem" }}>
        Check your after-tax contribution room, including bring-forward eligibility based on your age and total super balance.
      </p>

      <div className="grid-3">
        <NumberInput label="After-tax contributions" prefix="$" hint="Annual after-tax amount" value={afterTaxContribution} onChange={setAfterTaxContribution} />
        <NumberInput
          label="Age at start of FY"
          suffix="years"
          value={ageAtStartOfFinancialYear}
          min={0}
          step={1}
          onChange={setAgeAtStartOfFinancialYear}
        />
        <NumberInput
          label="Total super balance"
          prefix="$"
          hint="Balance at previous 30 June"
          value={totalSuperBalance}
          min={0}
          step={1000}
          onChange={setTotalSuperBalance}
        />
      </div>

      {/* Results */}
      <div className="results" style={{ marginTop: "0.5rem" }}>
        <div className="result-row">
          <span className="result-label">Annual NCC cap</span>
          <span className="result-value">{formatCurrency(cap.annualCap)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Cap available this year</span>
          <span className="result-value">{formatCurrency(cap.capUsed)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Bring-forward eligible</span>
          <span className="result-value">{cap.bringForwardEligible ? `Yes (${cap.capMultiplier}x annual cap)` : "No"}</span>
        </div>
      </div>

      {/* Visual cap bar */}
      <div className="cap-status">
        <div className="cap-labels">
          <span>Contribution: {formatCurrency(afterTaxContribution)}</span>
          <span>Cap: {formatCurrency(cap.capUsed)}</span>
        </div>
        <div className="cap-bar-container">
          <div
            className={`cap-bar ${isExceeded ? "cap-bar-warn" : "cap-bar-ok"}`}
            style={{ width: `${Math.min(usedPercent, 100)}%` }}
          />
        </div>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.92rem" }}>
          {isExceeded ? (
            <span className="cap-exceeded">{formatCurrency(cap.excess)} above cap</span>
          ) : (
            <span className="cap-ok">{formatCurrency(cap.remaining)} remaining this year</span>
          )}
        </p>
      </div>

      <p className="tiny" style={{ marginTop: "0.75rem" }}>
        This models one-year bring-forward eligibility from age and total-balance tiers. It does not track existing
        bring-forward periods already triggered in prior years.
      </p>
    </section>
  );
}
