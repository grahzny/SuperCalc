import { describe, expect, it } from "vitest";
import {
  calculateCapWarnings,
  calculateDivision293,
  calculateEmployerSG,
  calculateNonConcessionalCap,
  toRealDollars
} from "@/lib/calc";
import type { PersonInput, Rules } from "@/lib/types";
import rawRules from "@/rules/au/2025-26.json";

const rules = rawRules as Rules;

const basePerson: PersonInput = {
  currentAge: 40,
  retireAge: 67,
  currentBalance: 0,
  salaryBase: 0,
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
  nominalReturn: 0.065,
  inflation: 0.025,
  adminFeeAnnual: 120,
  feePercent: 0.007,
  insuranceAnnual: 0
};

describe("Division 293 calculation", () => {
  it("calculates additional tax when combined income exceeds threshold", () => {
    const person: PersonInput = {
      ...basePerson,
      salaryBase: 230000,
      bonus: 20000,
      salarySacrifice: 8000,
      personalDeductible: 4000
    };

    const employerSG = calculateEmployerSG(person.salaryBase, rules.superGuarantee.rate);
    expect(employerSG).toBe(27600);

    const result = calculateDivision293(person, rules);
    expect(result.cc).toBe(39600);
    expect(result.incomeBase).toBe(250000);
    expect(result.combined).toBe(289600);
    expect(result.excess).toBe(39600);
    expect(result.div293Taxable).toBe(39600);
    expect(result.div293Tax).toBe(5940);
    expect(result.contributionsTax).toBe(5940);
  });

  it("returns zero Division 293 tax when below threshold", () => {
    const person: PersonInput = {
      ...basePerson,
      salaryBase: 100000,
      salarySacrifice: 5000
    };

    const result = calculateDivision293(person, rules);
    expect(result.cc).toBe(17000);
    expect(result.combined).toBe(117000);
    expect(result.excess).toBe(0);
    expect(result.div293Tax).toBe(0);
    expect(result.contributionsTax).toBe(2550);
  });
});

describe("Inflation conversion", () => {
  it("converts nominal values to today's dollars", () => {
    const real = toRealDollars(200000, 0.025, 10);
    expect(real).toBeCloseTo(156239.68, 2);
  });
});

describe("Cap warnings", () => {
  it("flags both concessional and non-concessional cap breaches", () => {
    const person: PersonInput = {
      ...basePerson,
      salaryBase: 250000,
      salarySacrifice: 10000,
      personalDeductible: 20000,
      afterTaxContribution: 400000
    };

    const warnings = calculateCapWarnings(person, rules);
    expect(warnings.concessionalExceeded).toBe(true);
    expect(warnings.nonConcessionalExceeded).toBe(true);
    expect(warnings.nonConcessionalCapUsed).toBe(360000);
    expect(warnings.messages.length).toBe(2);
  });

  it("does not warn when both contribution totals are within caps", () => {
    const person: PersonInput = {
      ...basePerson,
      salaryBase: 120000,
      salarySacrifice: 2000,
      afterTaxContribution: 10000,
      currentAge: 75
    };

    const warnings = calculateCapWarnings(person, rules);
    expect(warnings.concessionalExceeded).toBe(false);
    expect(warnings.nonConcessionalExceeded).toBe(false);
    expect(warnings.nonConcessionalCapUsed).toBe(120000);
    expect(warnings.messages).toEqual([]);
  });
});

describe("Non-concessional cap", () => {
  it("uses a 3x bring-forward cap when age and balance are eligible", () => {
    const cap = calculateNonConcessionalCap(200000, 40, 1200000, rules);
    expect(cap.capMultiplier).toBe(3);
    expect(cap.capUsed).toBe(360000);
    expect(cap.excess).toBe(0);
    expect(cap.bringForwardEligible).toBe(true);
  });

  it("disables bring-forward when age is above the configured threshold", () => {
    const cap = calculateNonConcessionalCap(130000, 75, 1200000, rules);
    expect(cap.capMultiplier).toBe(1);
    expect(cap.capUsed).toBe(120000);
    expect(cap.excess).toBe(10000);
    expect(cap.bringForwardEligible).toBe(false);
  });

  it("returns zero cap when total super balance is in the blocked tier", () => {
    const cap = calculateNonConcessionalCap(1, 60, 2100000, rules);
    expect(cap.capMultiplier).toBe(0);
    expect(cap.capUsed).toBe(0);
    expect(cap.excess).toBe(1);
  });
});
