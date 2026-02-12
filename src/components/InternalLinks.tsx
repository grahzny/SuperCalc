import Link from "next/link";

const links = [
  { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
  { href: "/division-293-calculator/", label: "Division 293 Calculator" },
  { href: "/concessional-contributions-cap/", label: "Concessional Contributions Cap" },
  { href: "/non-concessional-contributions-cap/", label: "Non-concessional Contributions Cap" },
  { href: "/super-guarantee-rate/", label: "Super Guarantee Rate" }
];

type Props = {
  currentPath: string;
};

export function InternalLinks({ currentPath }: Props) {
  return (
    <section className="card">
      <h2>Related Calculators</h2>
      <ul className="link-list">
        {links
          .filter((link) => link.href !== currentPath)
          .map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
