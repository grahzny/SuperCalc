import type { Metadata } from "next";
import { Disclaimer } from "@/components/Disclaimer";
import { FaqSection } from "@/components/FaqSection";
import { InternalLinks } from "@/components/InternalLinks";
import { JsonLdFaq } from "@/components/JsonLdFaq";
import { SuperannuationCalculator } from "@/components/calculators/SuperannuationCalculator";
import { activeRules } from "@/lib/rules";
import type { FAQ } from "@/lib/types";

export const metadata: Metadata = {
  title: "Superannuation Calculator Australia",
  description:
    "Estimate your Australian super with spouse support, Division 293, contribution caps and a nominal or today's dollars inflation toggle."
};

const faqs: FAQ[] = [
  {
    question: "How does this superannuation calculator work?",
    answer:
      "This calculator projects super balance year by year from your current age to retirement age. It adds employer Super Guarantee contributions, salary sacrifice, personal deductible amounts and after-tax contributions, then subtracts contributions tax, Division 293 tax and annual fees. Investment returns and salary growth are applied each year. You can model both partners, compare nominal and inflation-adjusted results, and review yearly values without relying on server-side processing."
  },
  {
    question: "What is the Super Guarantee rate in Australia?",
    answer:
      "For the 2025-26 financial year, the Super Guarantee rate used here is 12% of ordinary time earnings. This aligns with current Australian settings. Employers generally contribute this amount on eligible earnings, and it forms part of your concessional contribution total. Individual circumstances can differ, so you should confirm your own super arrangements with payroll records and ATO guidance."
  },
  {
    question: "What is the concessional contributions cap?",
    answer:
      "The annual concessional contributions cap used in this tool is $30,000 for 2025-26. Concessional contributions include employer SG, salary sacrifice and eligible personal deductible contributions. Exceeding the cap can create additional tax outcomes, so the calculator shows warning messages when your estimate goes above the cap. The warning helps planning, but it is not a substitute for personal tax or financial advice."
  },
  {
    question: "What is Division 293 tax?",
    answer:
      "Division 293 is an additional 15% tax that can apply to concessional contributions for higher-income earners. It sits on top of the standard 15% contributions tax. In practice, this can move effective tax on affected concessional amounts up to 30%. The tax is assessed against a capped taxable amount, so not all concessional contributions are necessarily subject to the extra tax."
  },
  {
    question: "How is Division 293 calculated?",
    answer:
      "This calculator follows a simple rules-driven approach. It sums taxable income components and adds concessional contributions to produce a combined figure. Any amount above the $250,000 threshold is treated as excess. Division 293 taxable contributions are the lesser of the excess and concessional contributions. The additional tax is then 15% of that taxable amount. Standard concessional contributions tax is shown separately for clarity."
  },
  {
    question: "What is the difference between nominal dollars and today's dollars?",
    answer:
      "Nominal dollars are future values before adjusting for inflation. Today's dollars convert those future amounts into present purchasing power, which can make long-term outcomes easier to interpret. This calculator uses one mode at a time and applies the same mode consistently to headline figures, charts and yearly table values. That avoids mixing nominal and real values in one view and reduces interpretation errors."
  },
  {
    question: "How much super do I need to retire comfortably?",
    answer:
      "There is no single amount that suits everyone. A comfortable retirement target depends on spending goals, housing status, health costs, government support eligibility and investment risk tolerance. This calculator helps you test scenarios by changing contributions, salary growth, returns and fees. Use it as a planning guide, then compare your assumptions with trusted benchmarks and consider licensed advice before major decisions."
  },
  {
    question: "Does this calculator include spouse super?",
    answer:
      "Yes. The main tool supports two individuals, labelled Person A and Person B (spouse), with separate ages, balances, earnings, contribution settings and tax estimates. Division 293 is assessed per person, then totals are combined for household projections. This allows you to model one-income or two-income households, compare partner strategies and see a combined retirement balance trajectory in one place."
  },
  {
    question: "Are these results guaranteed?",
    answer:
      "No. The projections are estimates based on your inputs and static assumptions for returns, inflation, salary growth, tax rates and fees. Real outcomes can differ because markets, employment, legislation and super fund charges change over time. Use the model to compare scenarios rather than predict a guaranteed value. For decisions with material financial impact, seek professional advice tailored to your circumstances."
  },
  {
    question: "How often are the rates updated?",
    answer:
      "Rates and thresholds are loaded from a versioned financial year rules file. This page displays the last updated date so you can see currency at a glance. Updates are applied when rules are changed in the source dataset and a new static build is published. You should still confirm critical figures against current ATO guidance before acting on contribution or tax planning decisions."
  }
];

export default function SuperannuationCalculatorPage() {
  return (
    <>
      <JsonLdFaq faqs={faqs} />
      <h1>Superannuation Calculator Australia</h1>
      <SuperannuationCalculator rules={activeRules} />
      <section className="card">
        <p>
          Use this Australian superannuation calculator to estimate retirement balances across both partners with one
          transparent, rules-driven model. The tool applies current Super Guarantee settings, concessional and
          non-concessional contribution caps, standard contributions tax and individual Division 293 impacts. You can
          switch between nominal future dollars and today&apos;s dollars for clearer long-term planning. Results include
          annual projections, cap warnings and tax breakdowns so you can test contribution strategies before
          implementation. It is designed for education and scenario comparison only and should be paired with current
          ATO information and personal professional advice.
        </p>
        <p>
          Last updated: <strong>{activeRules.lastUpdated}</strong>
        </p>
      </section>
      <section className="card">
        <h2>How to read the projection</h2>
        <p>
          Start with realistic salary and balance inputs for each person, then adjust salary sacrifice, personal
          deductible contributions, fees and return assumptions. The yearly table shows combined outcomes by age while
          the chart illustrates the long-term trajectory. Cap warnings indicate possible contribution cap breaches and
          do not block calculations.
        </p>
      </section>
      <FaqSection faqs={faqs} />
      <InternalLinks currentPath="/superannuation-calculator/" />
      <Disclaimer />
    </>
  );
}
