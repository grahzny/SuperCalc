import type { Metadata } from "next";
import { Disclaimer } from "@/components/Disclaimer";
import { FaqSection } from "@/components/FaqSection";
import { InternalLinks } from "@/components/InternalLinks";
import { JsonLdFaq } from "@/components/JsonLdFaq";
import { SuperGuaranteeMiniCalculator } from "@/components/calculators/SuperGuaranteeMiniCalculator";
import { activeRules } from "@/lib/rules";
import type { FAQ } from "@/lib/types";

export const metadata: Metadata = {
  title: "Super Guarantee Rate Australia",
  description:
    "Check the Australian Super Guarantee rate and estimate annual employer super contributions with a simple calculator."
};

const faqs: FAQ[] = [
  {
    question: "What is the Super Guarantee rate in Australia?",
    answer:
      "For the 2025-26 financial year, this page uses a Super Guarantee (SG) rate of 12%. SG is the compulsory minimum contribution most employers pay into eligible workers' super funds based on ordinary time earnings. It forms part of your concessional contributions total for cap purposes. Always confirm your personal payroll treatment if your work arrangement has special conditions."
  },
  {
    question: "When did the Super Guarantee increase to 12%?",
    answer:
      "The SG rate reached 12% from 1 July 2025. This calculator applies that rate for 2025-26 projections and examples. Historical SG rates were lower in earlier periods, so long-term modelling across many years should account for changing rates over time. For compliance-sensitive calculations, refer to current ATO and payroll guidance for exact effective dates."
  },
  {
    question: "Does Super Guarantee apply to bonuses?",
    answer:
      "Bonuses can be included in SG calculations depending on whether they are treated as ordinary time earnings under relevant rules and payroll interpretation. This mini calculator shows both a salary-only estimate and a salary-plus-bonus estimate to help with scenario planning. Your employer's exact obligation can depend on classification and legal details, so verify with payroll records and official guidance."
  },
  {
    question: "Is there a maximum contribution base?",
    answer:
      "A quarterly maximum contribution base can limit the earnings amount on which SG must be paid above certain thresholds. This page does not apply that cap automatically and instead gives a simplified estimate using your entered income. If your earnings are high, adjust expectations accordingly and review current ATO thresholds to understand the practical SG limit in your case."
  },
  {
    question: "What happens if an employer does not pay super?",
    answer:
      "If an employer fails to pay required super on time, they may become liable for the Super Guarantee Charge and associated reporting obligations. Employees can raise concerns through payroll channels or with the ATO where appropriate. This calculator is educational and does not determine compliance breaches, but it can help you estimate expected SG contributions for comparison."
  },
  {
    question: "Does Super Guarantee count towards the concessional cap?",
    answer:
      "Yes. Employer SG contributions count towards your concessional contributions cap, alongside salary sacrifice and eligible deductible personal contributions. This is important for annual contribution planning because SG alone can use a large share of cap space at higher incomes. Monitoring total concessional contributions across all sources helps reduce the risk of cap exceedance."
  }
];

export default function SuperGuaranteeRatePage() {
  return (
    <>
      <JsonLdFaq faqs={faqs} />
      <h1>Super Guarantee Rate Australia</h1>
      <SuperGuaranteeMiniCalculator rules={activeRules} />
      <section className="card">
        <p>
          This Super Guarantee rate page explains the current compulsory employer super contribution setting in
          Australia and provides a fast estimate tool for yearly SG amounts. Enter salary and optional bonus to view
          indicative employer contributions at the current SG rate. The page is designed to support practical planning
          around contribution caps and retirement savings expectations, while keeping assumptions clear and transparent.
          It does not replace payroll interpretation or legal advice, particularly where maximum contribution base
          limits or complex employment arrangements apply. Use it as a general guide, then confirm details with ATO and
          payroll sources before making decisions.
        </p>
        <p>
          Last updated: <strong>{activeRules.lastUpdated}</strong>
        </p>
      </section>
      <section className="card">
        <h2>Using the SG estimate</h2>
        <p>
          Compare the salary-only and salary-plus-bonus outputs to understand how bonus treatment can change annual SG
          totals. Then check that expected concessional contributions remain within your annual cap when combined with
          other before-tax super amounts.
        </p>
      </section>
      <FaqSection faqs={faqs} />
      <InternalLinks currentPath="/super-guarantee-rate/" />
      <Disclaimer />
    </>
  );
}
