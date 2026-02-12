import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { AdSlot } from "@/components/AdSlot";
import "./globals.css";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "SuperCalc - Australian Superannuation Calculators",
  description:
    "Free Australian superannuation calculators covering projections, contribution caps, Super Guarantee and Division 293. Plan your retirement with clear, transparent tools."
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
            <div className="site-header-inner">
              <div className="site-brand">
                <div className="site-logo" aria-hidden="true">S</div>
                <div className="site-brand-text">
                  <p className="eyebrow">Australia FY 2025-26</p>
                  <h1 className="site-title">
                    <Link href="/">SuperCalc</Link>
                  </h1>
                </div>
              </div>
              <nav className="site-nav" aria-label="Main navigation">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <AdSlot slot="1000000001" label="Top banner ad" className="ad-slot-banner" />

          <div className="content-grid">
            <main>{children}</main>
            <aside className="rail" aria-label="Sponsored">
              <AdSlot slot="1000000002" label="Sidebar ad slot one" className="ad-slot-rail" />
              <AdSlot slot="1000000003" label="Sidebar ad slot two" className="ad-slot-rail" />
            </aside>
          </div>

          <footer className="site-footer">
            <p>SuperCalc &mdash; Free superannuation planning tools for Australians.</p>
            <p>Educational information only, not personal financial advice.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
