"use client";

import * as React from "react";

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
}

/** Numero que sobe de 0 ate o valor com easing. Respeita reduced-motion. */
export function CountUp({ value, duration = 900, className }: CountUpProps) {
  const [n, setN] = React.useState(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }

    let raf = 0;
    const t0 = performance.now();

    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={className} aria-label={String(value)}>
      {n}
    </span>
  );
}
