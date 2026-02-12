import type { Metadata } from "next";
import { Disclaimer } from "@/components/Disclaimer";
import { FaqSection } from "@/components/FaqSection";
import { InternalLinks } from "@/components/InternalLinks";
import { JsonLdFaq } from "@/components/JsonLdFaq";
import { Division293Calculator } from "@/components/calculators/Division293Calculator";
import { activeRules } from "@/lib/rules";
import type { FAQ } from "@/lib/types";

export const metadata: Metadata = {
  title: "Division 293 Calculator Australia - Extra Super Tax Estimator",
  description:
    "Free Division 293 tax calculator. Estimate if you owe extra tax on super contributions using FY 2025-26 thresholds."
};

const faqs: FAQ[] = [
  {
    question: "What is Division 293 tax?",
    answer:
      "Division 293 is an additional tax applied to some concessional super contributions for higher-income individuals. It is generally 15% on the taxable portion and sits on top of standard 15% contributions tax. The practical effect is that part of your concessional contributions can be taxed at a total of up to 30%, depending on your assessed income and contribution levels."
  },
  {
    question: "Who has to pay Division 293?",
    answer:
      "People with combined income and concessional contributions above the Division 293 threshold may be liable. In this calculator, the threshold is $250,000 for 2025-26. Liability depends on both your taxable income components and your concessional contribution amount. The additional tax is limited by a taxable contribution calculation, so not every concessional dollar is always affected."
  },
  {
    question: "What income counts towards Division 293?",
    answer:
      "This estimator includes salary, bonus, RSU income, net rental income, dividends, interest and other taxable income. It then adds concessional contributions to determine the combined figure used for threshold testing. Actual assessments can include further legislative detail, so this output is a planning estimate. Confirm final treatment with official ATO materials or professional advice tailored to your position."
  },
  {
    question: "Does salary sacrifice count towards Division 293?",
    answer:
      "Yes. Salary sacrifice is a concessional contribution and is included in the concessional total used in Division 293 calculations. In this tool, concessional contributions are employer Super Guarantee plus salary sacrifice plus personal deductible contributions. Those values are central to both standard contributions tax and the Division 293 taxable amount once the threshold test is applied."
  },
  {
    question: "How is the additional 15% tax calculated?",
    answer:
      "The calculator first computes combined income by adding assessable income items and concessional contributions. It then calculates excess above $250,000. Division 293 taxable contributions are the lesser of that excess and total concessional contributions. The additional tax is 15% of that taxable contribution amount. Standard contributions tax at 15% is shown separately so both tax layers are visible."
  },
  {
    question: "Is Division 293 applied automatically?",
    answer:
      "In practice, Division 293 assessments are issued by the ATO based on reported income and contribution data. The tax is not simply self-applied in payroll. This calculator gives a forward estimate only. It helps you understand potential exposure before year end, but your official position is determined through ATO assessment processes and relevant superannuation reporting timelines."
  },
  {
    question: "Can Division 293 push my super tax above 30%?",
    answer:
      "Division 293 generally adds an extra 15% on the affected concessional amount, and standard contributions tax is already 15%. That means the effective rate on that portion can reach 30%, but not higher under this mechanism alone. The calculation is limited to a taxable amount defined by excess above threshold and concessional contribution totals, which this tool shows explicitly."
  },
  {
    question: "How can I reduce Division 293 exposure?",
    answer:
      "Potential strategies may include adjusting salary sacrifice levels, timing deductible contributions, or balancing contributions between years where appropriate. However, decisions should consider broader tax outcomes, retirement goals, cash flow and legislative rules. This estimator helps compare scenarios but cannot recommend personal strategy. Use it to frame options, then seek licensed advice before making contribution changes."
  },
  {
    question: "Does Division 293 apply to non-concessional contributions?",
    answer:
      "No, Division 293 is linked to concessional contributions. Non-concessional contributions are generally after-tax contributions and are managed under separate cap rules. This tool therefore focuses on concessional totals when estimating Division 293 exposure. You should still monitor non-concessional contributions separately because exceeding that cap can trigger different consequences and correction processes."
  },
  {
    question: "Is this an official ATO calculator?",
    answer:
      "No. This website is an independent educational calculator built to model common rules in a transparent way. It is not operated by the ATO and does not replace official guidance, notices or determinations. Always verify critical tax settings and assessment outcomes through current ATO publications, and obtain professional advice if you are making high-impact decisions."
  }
];

export default function Division293Page() {
  return (
    <>
      <JsonLdFaq faqs={faqs} />
      <h1>Division 293 Calculator Australia</h1>
      <p className="page-intro">
        Find out if you may owe extra tax on your super contributions. Division 293 applies an additional 15% tax
        when your income plus concessional contributions exceed $250,000.
      </p>
      <Division293Calculator rules={activeRules} />
      <section className="card">
        <h2>What This Estimator Shows</h2>
        <p>
          Enter your salary, bonus and other income sources to see whether your combined income exceeds the
          Division 293 threshold. The tool shows both the standard 15% contributions tax and any additional
          Division 293 tax separately, so you can understand the full impact on your super contributions.
        </p>
        <p>
          <span className="updated-badge">Updated {activeRules.lastUpdated}</span>
        </p>
      </section>
      <section className="card">
        <h2>How to Use This Estimator</h2>
        <p>
          Small changes in salary sacrifice and bonus levels can materially change Division 293 outcomes. Use the
          fields to run best-case and worst-case ranges before finalising year-end contribution decisions.
        </p>
      </section>
      <FaqSection faqs={faqs} />
      <InternalLinks currentPath="/division-293-calculator/" />
      <Disclaimer />
    </>
  );
}
