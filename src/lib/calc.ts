import type {
  CapWarnings,
  DisplayMode,
  Division293Breakdown,
  HouseholdYear,
  NonConcessionalCapBreakdown,
  PersonInput,
  ProjectionYear,
  Rules
} from "@/lib/types";

export const round2 = (value: number): number => Math.round(value * 100) / 100;

export const calculateEmployerSG = (salaryBase: number, sgRate: number): number =>
  Math.max(0, salaryBase) * sgRate;

export const calculateDivision293 = (person: PersonInput, rules: Rules): Division293Breakdown => {
  const employerSG = calculateEmployerSG(person.salaryBase, rules.superGuarantee.rate);
  const cc = employerSG + person.salarySacrifice + person.personalDeductible;
  const incomeBase =
    person.salaryBase +
    person.bonus +
    person.rsuIncome +
    person.rentalNetIncome +
    person.dividends +
    person.interest +
    person.otherTaxableIncome;
  const combined = incomeBase + cc;
  const excess = Math.max(0, combined - rules.division293.threshold);
  const div293Taxable = Math.min(excess, cc);
  const div293Tax = div293Taxable * rules.division293.rate;
  const contributionsTax = cc * rules.contributionsTax.concessionalRate;

  return {
    cc: round2(cc),
    incomeBase: round2(incomeBase),
    combined: round2(combined),
    excess: round2(excess),
    div293Taxable: round2(div293Taxable),
    div293Tax: round2(div293Tax),
    contributionsTax: round2(contributionsTax)
  };
};

const resolveBringForwardMultiplier = (totalSuperBalance: number, rules: Rules): number => {
  const tier = rules.nonConcessionalBringForward.tiers.find(({ minBalanceInclusive, maxBalanceExclusive }) => {
    if (totalSuperBalance < minBalanceInclusive) {
      return false;
    }
    if (maxBalanceExclusive === null) {
      return true;
    }
    return totalSuperBalance < maxBalanceExclusive;
  });
  return tier?.capMultiplier ?? 0;
};

export const calculateNonConcessionalCap = (
  afterTaxContribution: number,
  ageAtStartOfFinancialYear: number,
  totalSuperBalance: number,
  rules: Rules
): NonConcessionalCapBreakdown => {
  const annualCap = rules.contributionCaps.nonConcessional;
  const bringForwardByBalance = resolveBringForwardMultiplier(totalSuperBalance, rules);
  const ageEligible = ageAtStartOfFinancialYear <= rules.nonConcessionalBringForward.maxAgeAtStartOfFinancialYear;
  const capMultiplier = ageEligible ? bringForwardByBalance : Math.min(1, bringForwardByBalance);
  const capUsed = annualCap * capMultiplier;
  const remaining = capUsed - afterTaxContribution;
  const excess = Math.max(0, afterTaxContribution - capUsed);

  return {
    annualCap,
    capMultiplier,
    capUsed: round2(capUsed),
    remaining: round2(remaining),
    excess: round2(excess),
    bringForwardEligible: ageEligible && bringForwardByBalance > 1
  };
};

export const calculateCapWarnings = (person: PersonInput, rules: Rules): CapWarnings => {
  const div293 = calculateDivision293(person, rules);
  const concessionalExceeded = div293.cc > rules.contributionCaps.concessional;
  const nonConcessional = calculateNonConcessionalCap(
    person.afterTaxContribution,
    person.currentAge,
    person.currentBalance,
    rules
  );
  const nonConcessionalExceeded = nonConcessional.excess > 0;
  const messages: string[] = [];

  if (concessionalExceeded) {
    messages.push(
      `Concessional contributions exceed the $${rules.contributionCaps.concessional.toLocaleString("en-AU")} annual cap.`
    );
  }
  if (nonConcessionalExceeded) {
    messages.push(
      `After-tax contributions exceed your modeled non-concessional cap of $${nonConcessional.capUsed.toLocaleString("en-AU")}.`
    );
  }

  return {
    concessionalExceeded,
    nonConcessionalExceeded,
    nonConcessionalCapUsed: nonConcessional.capUsed,
    messages
  };
};

export const toRealDollars = (nominalValue: number, inflation: number, yearsFromNow: number): number => {
  const real = nominalValue / Math.pow(1 + inflation, Math.max(0, yearsFromNow));
  return round2(real);
};

export const projectPerson = (person: PersonInput, rules: Rules): ProjectionYear[] => {
  const years = Math.max(0, person.retireAge - person.currentAge);
  let salaryBase = person.salaryBase;
  let balance = person.currentBalance;
  const rows: ProjectionYear[] = [];

  for (let yearIndex = 0; yearIndex < years; yearIndex += 1) {
    const age = person.currentAge + yearIndex;
    const employerSG = calculateEmployerSG(salaryBase, rules.superGuarantee.rate);
    const concessionalContributions = employerSG + person.salarySacrifice + person.personalDeductible;
    const nonConcessionalContributions = person.afterTaxContribution;
    const incomeBase =
      salaryBase +
      person.bonus +
      person.rsuIncome +
      person.rentalNetIncome +
      person.dividends +
      person.interest +
      person.otherTaxableIncome;
    const combined = incomeBase + concessionalContributions;
    const excess = Math.max(0, combined - rules.division293.threshold);
    const div293Taxable = Math.min(excess, concessionalContributions);
    const division293Tax = div293Taxable * rules.division293.rate;
    const contributionsTax = concessionalContributions * rules.contributionsTax.concessionalRate;

    const netContributionsAdded =
      concessionalContributions + nonConcessionalContributions - contributionsTax - division293Tax;
    const preReturn = balance + netContributionsAdded;
    const grossAfterReturn = preReturn * (1 + person.nominalReturn);
    const annualFees = grossAfterReturn * person.feePercent + person.adminFeeAnnual + person.insuranceAnnual;
    balance = Math.max(0, grossAfterReturn - annualFees);

    rows.push({
      age,
      yearIndex,
      salaryBase: round2(salaryBase),
      employerSG: round2(employerSG),
      concessionalContributions: round2(concessionalContributions),
      nonConcessionalContributions: round2(nonConcessionalContributions),
      contributionsTax: round2(contributionsTax),
      division293Tax: round2(division293Tax),
      netContributionsAdded: round2(netContributionsAdded),
      grossAfterReturn: round2(grossAfterReturn),
      annualFees: round2(annualFees),
      nominalBalanceEnd: round2(balance)
    });

    salaryBase *= 1 + person.salaryGrowth;
  }

  return rows;
};

export const projectHousehold = (
  personA: PersonInput,
  personB: PersonInput,
  rules: Rules
): { personA: ProjectionYear[]; personB: ProjectionYear[]; total: HouseholdYear[] } => {
  const projA = projectPerson(personA, rules);
  const projB = projectPerson(personB, rules);
  const maxYears = Math.max(projA.length, projB.length);
  const total: HouseholdYear[] = [];

  for (let i = 0; i < maxYears; i += 1) {
    const balA = projA[i]?.nominalBalanceEnd ?? projA[projA.length - 1]?.nominalBalanceEnd ?? 0;
    const balB = projB[i]?.nominalBalanceEnd ?? projB[projB.length - 1]?.nominalBalanceEnd ?? 0;
    total.push({
      yearIndex: i,
      ageA: personA.currentAge + i,
      ageB: personB.currentAge + i,
      totalNominalBalance: round2(balA + balB)
    });
  }

  return { personA: projA, personB: projB, total };
};

export const displayValue = (
  nominalValue: number,
  displayMode: DisplayMode,
  inflation: number,
  yearsFromNow: number
): number => {
  if (displayMode === "nominal") {
    return round2(nominalValue);
  }
  return toRealDollars(nominalValue, inflation, yearsFromNow);
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(value);
