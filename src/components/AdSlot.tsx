"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type Props = {
  slot: string;
  label: string;
  className?: string;
};

export function AdSlot({ slot, label, className }: Props) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!adClient) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ignore push failures while slots are mounting or blocked.
    }
  }, [adClient]);

  return (
    <section className={`ad-slot ${className ?? ""}`.trim()} aria-label={label}>
      <p className="ad-slot-label">Advertisement</p>
      {adClient ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <p className="ad-slot-placeholder">
          Configure `NEXT_PUBLIC_ADSENSE_CLIENT` and replace slot ids to activate this placement.
        </p>
      )}
    </section>
  );
}
