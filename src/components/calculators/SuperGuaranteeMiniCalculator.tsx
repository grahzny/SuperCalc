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
      <h2>Super Guarantee mini calculator</h2>
      <div className="grid-2">
        <NumberInput label="Base salary" value={salaryBase} onChange={setSalaryBase} />
        <NumberInput label="Bonus (optional)" value={bonus} onChange={setBonus} />
      </div>
      <p>SG rate used: {(rules.superGuarantee.rate * 100).toFixed(0)}%</p>
      <p>Estimated annual SG on salary: {formatCurrency(sgOnSalary)}</p>
      <p>Estimated annual SG including bonus: {formatCurrency(sgOnSalaryAndBonus)}</p>
      <p className="tiny">Employers can have additional conditions such as a maximum contribution base.</p>
    </section>
  );
}
