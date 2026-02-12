import type { Metadata } from "next";
import { Disclaimer } from "@/components/Disclaimer";
import { FaqSection } from "@/components/FaqSection";
import { InternalLinks } from "@/components/InternalLinks";
import { JsonLdFaq } from "@/components/JsonLdFaq";
import { NonConcessionalCapChecker } from "@/components/calculators/NonConcessionalCapChecker";
import { activeRules } from "@/lib/rules";
import type { FAQ } from "@/lib/types";

export const metadata: Metadata = {
  title: "Non-concessional Contributions Cap Australia - After-Tax Super Limit",
  description:
    "Free non-concessional contributions cap checker. See your after-tax super contribution room including bring-forward eligibility for FY 2025-26."
};

const faqs: FAQ[] = [
  {
    question: "What is the non-concessional contributions cap?",
    answer:
      "The non-concessional contributions (NCC) cap is the annual limit for after-tax super contributions. For 2025-26, this page uses a $120,000 annual cap as a baseline. These contributions are generally made from money that has already been taxed personally. Keeping track of NCC amounts is important because excess contributions can trigger penalties and correction requirements."
  },
  {
    question: "What is the bring-forward rule?",
    answer:
      "The bring-forward rule can allow eligible individuals to contribute multiple years of non-concessional cap space in a shorter period, subject to age, balance and legislative conditions. It is commonly used for larger one-off contributions. This page models bring-forward cap size from age and total-balance tiers, but does not track prior-year bring-forward periods."
  },
  {
    question: "What happens if I exceed the NCC cap?",
    answer:
      "Exceeding the non-concessional cap can lead to additional tax consequences and may require you to take action through ATO-directed correction processes. Outcomes can vary depending on the amount, timing and your personal circumstances. Because of that complexity, this checker provides warning guidance only and should be paired with current ATO instructions and professional advice."
  },
  {
    question: "Are after-tax contributions taxed?",
    answer:
      "After-tax contributions are generally made from money that has already been taxed at personal rates, so they are not usually taxed again as contributions tax when entering super. However, other rules can still apply, including cap limits and future tax treatment of earnings or withdrawals. This page focuses only on annual cap monitoring, not full lifecycle tax outcomes."
  },
  {
    question: "Does my total super balance affect the NCC cap?",
    answer:
      "Yes, your total super balance can affect eligibility to make non-concessional contributions and may influence bring-forward access. The exact thresholds and timing rules are set by legislation and ATO guidance for each year. This page models total-balance tiers for cap sizing, but does not replace formal eligibility checks."
  },
  {
    question: "Can I recontribute money after withdrawing super?",
    answer:
      "Recontribution strategies can be possible in some circumstances, but eligibility, timing and tax implications are nuanced and can change with law and age-based conditions. Because these decisions can materially affect retirement outcomes, use calculators to frame scenarios only. Confirm the latest rules and seek licensed advice before implementing a recontribution strategy."
  }
];

export default function NonConcessionalCapPage() {
  return (
    <>
      <JsonLdFaq faqs={faqs} />
      <h1>Non-concessional Contributions Cap</h1>
      <p className="page-intro">
        Check your after-tax super contribution room. This tool shows your annual cap and whether you&apos;re
        eligible for the bring-forward rule based on your age and total super balance.
      </p>
      <NonConcessionalCapChecker rules={activeRules} />
      <section className="card">
        <h2>Understanding the Cap</h2>
        <p>
          Non-concessional contributions are after-tax money you put into super voluntarily. The annual limit is
          ${activeRules.contributionCaps.nonConcessional.toLocaleString()}, but if you&apos;re eligible, the bring-forward
          rule lets you contribute up to 3 years&apos; worth at once. Your eligibility depends on your age at the
          start of the financial year and your total super balance.
        </p>
        <p>
          <span className="updated-badge">Updated {activeRules.lastUpdated}</span>
        </p>
      </section>
      <section className="card">
        <h2>Scope of This Checker</h2>
        <p>
          This tool models non-concessional cap size using age and total-balance tiers, including bring-forward cap
          multipliers where eligible. It does not track whether a bring-forward period was already triggered in prior
          years, so use it as a planning guide and confirm with current ATO guidance.
        </p>
      </section>
      <FaqSection faqs={faqs} />
      <InternalLinks currentPath="/non-concessional-contributions-cap/" />
      <Disclaimer />
    </>
  );
}
