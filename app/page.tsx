import Link from "next/link";

const calculators = [
  {
    href: "/superannuation-calculator/",
    title: "Superannuation Calculator",
    description: "Two-person projection with taxes, caps, fees and inflation display modes."
  },
  {
    href: "/division-293-calculator/",
    title: "Division 293 Calculator",
    description: "Estimate concessional tax layering for higher-income contribution scenarios."
  },
  {
    href: "/concessional-contributions-cap/",
    title: "Concessional Contributions Cap",
    description: "Check SG plus salary-sacrifice totals against the annual concessional limit."
  },
  {
    href: "/non-concessional-contributions-cap/",
    title: "Non-concessional Contributions Cap",
    description: "Model after-tax contribution room including bring-forward cap multipliers."
  },
  {
    href: "/super-guarantee-rate/",
    title: "Super Guarantee Rate",
    description: "Fast SG estimate on salary and bonus with FY 2025-26 assumptions."
  }
];

export default function HomePage() {
  return (
    <>
      <section className="card">
        <h1>Australian Super Calculator Hub</h1>
        <p>
          Explore calculators designed for scenario planning, on-page readability and search-friendly static content.
          Each page includes transparent assumptions, FAQs and fast local calculations.
        </p>
      </section>

      <section className="card">
        <h2>Choose a calculator</h2>
        <div className="home-grid">
          {calculators.map((calculator) => (
            <Link key={calculator.href} href={calculator.href} className="home-link">
              <strong>{calculator.title}</strong>
              <span>{calculator.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
