import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { AdSlot } from "@/components/AdSlot";
import "./globals.css";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Australian Superannuation Calculators",
  description:
    "Static SEO-friendly Australian superannuation calculators covering projections, caps, Super Guarantee and Division 293."
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/superannuation-calculator/", label: "Super Projection" },
  { href: "/division-293-calculator/", label: "Division 293" },
  { href: "/concessional-contributions-cap/", label: "Concessional Cap" },
  { href: "/non-concessional-contributions-cap/", label: "Non-concessional Cap" },
  { href: "/super-guarantee-rate/", label: "SG Rate" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en-AU">
      <body>
        {adClient ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <div className="site-shell">
          <header className="site-header">
            <div>
              <p className="eyebrow">Australia FY 2025-26</p>
              <h1 className="site-title">SuperCalc</h1>
              <p className="site-subtitle">Clear super calculators with transparent rules and practical planning outputs.</p>
            </div>
            <nav className="site-nav" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </header>

          <AdSlot slot="1000000001" label="Top banner ad" className="ad-slot-banner" />

          <div className="content-grid">
            <main>{children}</main>
            <aside className="rail" aria-label="Sponsored">
              <AdSlot slot="1000000002" label="Sidebar ad slot one" className="ad-slot-rail" />
              <AdSlot slot="1000000003" label="Sidebar ad slot two" className="ad-slot-rail" />
              <section className="card">
                <h2>Ad setup</h2>
                <p className="tiny">
                  These are fixed ad containers sized for common AdSense units. Keep them stable to improve layout
                  shift performance and indexing quality.
                </p>
              </section>
            </aside>
          </div>

          <footer className="site-footer">
            <p>SuperCalc planning tools. Educational information only, not personal financial advice.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
