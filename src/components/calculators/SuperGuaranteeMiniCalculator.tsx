"use client";

import { useEffect, useMemo, useState } from "react";
import { NumberInput } from "@/components/NumberInput";
import { calculateEmployerSG, formatCurrency } from "@/lib/calc";
import type { Rules } from "@/lib/types";
import { parseNum, writeUrl } from "@/lib/urlState";

type Props = {
  rules: Rules;
};

export function SuperGuaranteeMiniCalculator({ rules }: Props) {
  const [salaryBase, setSalaryBase] = useState(100000);
  const [bonus, setBonus] = useState(0);
  const sgOnSalary = useMemo(() => calculateEmployerSG(salaryBase, rules.superGuarantee.rate), [rules, salaryBase]);
  const sgOnSalaryAndBonus = useMemo(
    () => calculateEmployerSG(salaryBase + bonus, rules.superGuarantee.rate),
    [bonus, rules, salaryBase]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSalaryBase(parseNum(params, "sg_salaryBase", 100000));
    setBonus(parseNum(params, "sg_bonus", 0));
  }, []);

  useEffect(() => {
    writeUrl({ sg_salaryBase: salaryBase, sg_bonus: bonus });
  }, [bonus, salaryBase]);

  return (
    <section className="card">
      <h2>Super Guarantee Calculator</h2>
      <p className="tiny" style={{ marginTop: "-0.5rem", marginBottom: "1rem" }}>
        Estimate your employer&apos;s compulsory super contribution at the current {(rules.superGuarantee.rate * 100).toFixed(0)}% rate.
      </p>

      <div className="grid-2">
        <NumberInput label="Base salary" prefix="$" hint="Annual gross salary" value={salaryBase} onChange={setSalaryBase} />
        <NumberInput label="Bonus (optional)" prefix="$" value={bonus} onChange={setBonus} />
      </div>

      <div className="result-highlight" style={{ marginTop: "0.5rem" }}>
        <div className="result-row">
          <span className="result-label">SG rate</span>
          <span className="result-value">{(rules.superGuarantee.rate * 100).toFixed(0)}%</span>
        </div>
        <div className="result-row">
          <span className="result-label">Annual SG on salary only</span>
          <span className="result-value">{formatCurrency(sgOnSalary)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Annual SG including bonus</span>
          <span className="result-value">{formatCurrency(sgOnSalaryAndBonus)}</span>
        </div>
      </div>

      <p className="tiny" style={{ marginTop: "0.75rem" }}>
        Employers can have additional conditions such as a maximum contribution base. Confirm with your payroll.
      </p>
    </section>
  );
}
