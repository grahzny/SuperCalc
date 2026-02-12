import Link from "next/link";

const calculators = [
  {
    href: "/superannuation-calculator/",
    title: "Superannuation Calculator",
    description: "Project your retirement balance for you and your partner, with contributions, taxes and fees modelled year by year.",
    color: "#dbeafe",
    iconColor: "#1e40af"
  },
  {
    href: "/division-293-calculator/",
    title: "Division 293 Calculator",
    description: "Find out if you may owe extra tax on your super contributions as a higher-income earner.",
    color: "#fce7f3",
    iconColor: "#9d174d"
  },
  {
    href: "/concessional-contributions-cap/",
    title: "Concessional Contributions Cap",
    description: "Check whether your before-tax super contributions are within the annual limit.",
    color: "#d1fae5",
    iconColor: "#065f46"
  },
  {
    href: "/non-concessional-contributions-cap/",
    title: "Non-concessional Contributions Cap",
    description: "See how much after-tax contribution room you have, including bring-forward eligibility.",
    color: "#fef3c7",
    iconColor: "#92400e"
  },
  {
    href: "/super-guarantee-rate/",
    title: "Super Guarantee Rate",
    description: "Quickly estimate your employer's compulsory super contribution based on your salary.",
    color: "#ede9fe",
    iconColor: "#5b21b6"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="card home-hero">
        <h1>Plan Your Super With Confidence</h1>
        <p>
          Free, transparent calculators to help you understand your Australian superannuation.
          No sign-up required &mdash; just enter your numbers and get instant answers.
        </p>
      </section>

      <div className="home-grid">
        {calculators.map((calc) => (
          <Link key={calc.href} href={calc.href} className="home-link">
            <div
              className="home-link-icon"
              style={{ background: calc.color, color: calc.iconColor }}
              aria-hidden="true"
            >
              {calc.title.charAt(0)}
            </div>
            <strong>{calc.title}</strong>
            <span>{calc.description}</span>
          </Link>
        ))}
      </div>

      <section className="card" style={{ marginTop: "1rem" }}>
        <h2>How it works</h2>
        <p>
          Each calculator uses the official FY 2025-26 rates and thresholds published by the ATO. All calculations
          happen instantly in your browser &mdash; nothing is sent to a server. You can bookmark or share any result
          using the URL, which updates automatically as you change inputs.
        </p>
      </section>
    </>
  );
}
