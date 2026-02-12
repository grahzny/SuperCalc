export type DisplayMode = "nominal" | "real";

export type PersonInput = {
  currentAge: number;
  retireAge: number;
  currentBalance: number;
  salaryBase: number;
  bonus: number;
  salarySacrifice: number;
  personalDeductible: number;
  afterTaxContribution: number;
  rsuIncome: number;
  rentalNetIncome: number;
  dividends: number;
  interest: number;
  otherTaxableIncome: number;
  salaryGrowth: number;
  nominalReturn: number;
  inflation: number;
  adminFeeAnnual: number;
  feePercent: number;
  insuranceAnnual: number;
};

export type Rules = {
  country: "AU";
  financialYear: string;
  lastUpdated: string;
  superGuarantee: {
    rate: number;
  };
  contributionCaps: {
    concessional: number;
    nonConcessional: number;
  };
  nonConcessionalBringForward: {
    maxAgeAtStartOfFinancialYear: number;
    tiers: {
      minBalanceInclusive: number;
      maxBalanceExclusive: number | null;
      capMultiplier: number;
    }[];
  };
  division293: {
    threshold: number;
    rate: number;
  };
  contributionsTax: {
    concessionalRate: number;
  };
  defaults: {
    inflation: number;
    nominalReturn: number;
    feePercent: number;
    adminFeeAnnual: number;
  };
};

export type Division293Breakdown = {
  cc: number;
  incomeBase: number;
  combined: number;
  excess: number;
  div293Taxable: number;
  div293Tax: number;
  contributionsTax: number;
};

export type CapWarnings = {
  concessionalExceeded: boolean;
  nonConcessionalExceeded: boolean;
  nonConcessionalCapUsed: number;
  messages: string[];
};

export type NonConcessionalCapBreakdown = {
  annualCap: number;
  capMultiplier: number;
  capUsed: number;
  remaining: number;
  excess: number;
  bringForwardEligible: boolean;
};

export type ProjectionYear = {
  age: number;
  yearIndex: number;
  salaryBase: number;
  employerSG: number;
  concessionalContributions: number;
  nonConcessionalContributions: number;
  contributionsTax: number;
  division293Tax: number;
  netContributionsAdded: number;
  grossAfterReturn: number;
  annualFees: number;
  nominalBalanceEnd: number;
};

export type HouseholdYear = {
  ageA: number;
  ageB: number;
  yearIndex: number;
  totalNominalBalance: number;
};

export type FAQ = {
  question: string;
  answer: string;
};
