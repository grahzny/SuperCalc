import type { Metadata } from "next";
import { Disclaimer } from "@/components/Disclaimer";
import { FaqSection } from "@/components/FaqSection";
import { InternalLinks } from "@/components/InternalLinks";
import { JsonLdFaq } from "@/components/JsonLdFaq";
import { ConcessionalCapChecker } from "@/components/calculators/ConcessionalCapChecker";
import { activeRules } from "@/lib/rules";
import type { FAQ } from "@/lib/types";

export const metadata: Metadata = {
  title: "Concessional Contributions Cap Australia - Before-Tax Super Limit",
  description:
    "Free concessional contributions cap checker. See if your before-tax super contributions are within the annual limit for FY 2025-26."
};

const faqs: FAQ[] = [
  {
    question: "What is the concessional contributions cap?",
    answer:
      "The concessional contributions cap is the annual limit on before-tax super contributions that receive concessional tax treatment. For 2025-26, this calculator uses a $30,000 cap. Concessional contributions generally include employer Super Guarantee, salary sacrifice and eligible personal deductible contributions. If you exceed the cap, additional tax and reporting consequences can apply, so regular monitoring during the year is important."
  },
  {
    question: "What counts towards the concessional cap?",
    answer:
      "Common amounts counted are employer Super Guarantee contributions, salary sacrifice arrangements and personal contributions for which you claim a tax deduction. The cap test focuses on total concessional contributions for the financial year, not just voluntary amounts. This checker estimates your total by combining those components so you can see whether your current settings are likely to remain within the annual cap."
  },
  {
    question: "Does employer super count towards the cap?",
    answer:
      "Yes. Employer Super Guarantee contributions count towards your concessional contributions cap. People sometimes overlook this because those contributions are compulsory and paid by the employer, but they still use part of your annual concessional space. This is why higher salary earners can approach the cap quickly, especially when salary sacrifice is also in place."
  },
  {
    question: "What happens if I exceed the cap?",
    answer:
      "If concessional contributions exceed the cap, the excess is typically included in assessable income and taxed at your marginal rate, with a tax offset for contributions tax already paid in super. Additional charges can also apply. The exact outcome depends on your situation and ATO processing. This page provides planning guidance only and is not a substitute for personal advice."
  },
  {
    question: "What is carry-forward concessional contributions?",
    answer:
      "Carry-forward concessional contributions can allow eligible people to use unused concessional cap amounts from previous years, subject to super balance conditions and legislative rules. It can create flexibility for irregular income patterns, such as large one-off years. This page focuses on the standard annual cap checker and does not calculate personalised carry-forward availability."
  },
  {
    question: "Does Division 293 affect the cap?",
    answer:
      "Division 293 and the concessional cap are related but separate concepts. The cap determines how much concessional contribution space you have, while Division 293 applies extra tax for higher-income individuals on relevant concessional amounts. You can stay within the concessional cap and still have Division 293 exposure, depending on your combined income and contributions."
  },
  {
    question: "Is the cap indexed each year?",
    answer:
      "Concessional caps can change over time through indexation and policy updates, so yearly values should be checked before planning large contributions. This website uses a versioned rules file for the selected financial year and shows a last updated date on-page. Even so, confirm figures against current ATO references before acting, especially near year-end."
  },
  {
    question: "Can I withdraw excess concessional contributions?",
    answer:
      "There are processes that may allow release of some excess concessional contributions, but eligibility and tax outcomes depend on ATO determinations and timing requirements. It is not automatic in all cases. If you believe you have exceeded the cap, review the relevant ATO options promptly and seek professional advice to understand the consequences for your specific circumstances."
  }
];

export default function ConcessionalCapPage() {
  return (
    <>
      <JsonLdFaq faqs={faqs} />
      <h1>Concessional Contributions Cap</h1>
      <p className="page-intro">
        Check whether your before-tax super contributions (employer SG + salary sacrifice + personal deductible)
        are within the annual ${activeRules.contributionCaps.concessional.toLocaleString()} limit.
      </p>
      <ConcessionalCapChecker rules={activeRules} />
      <section className="card">
        <h2>What Counts Towards the Cap</h2>
        <p>
          Concessional contributions include your employer&apos;s compulsory Super Guarantee, any salary sacrifice
          you arrange through payroll, and personal contributions you claim as a tax deduction. All three are added
          together and compared against the annual cap. The visual bar above shows how much of your cap you&apos;ve used.
        </p>
        <p>
          <span className="updated-badge">Updated {activeRules.lastUpdated}</span>
        </p>
      </section>
      <section className="card">
        <h2>How to Use This Checker</h2>
        <p>
          Start with your expected base salary and add any salary sacrifice and deductible personal contributions. The
          tool then compares your total concessional estimate with the annual cap and highlights the remaining amount
          or estimated overage.
        </p>
      </section>
      <FaqSection faqs={faqs} />
      <InternalLinks currentPath="/concessional-contributions-cap/" />
      <Disclaimer />
    </>
  );
}
