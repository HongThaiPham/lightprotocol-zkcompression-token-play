"use client";

import { useEffect, useState } from "react";

interface ContinuousCounterProps {
  end: number;
  duration: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function ContinuousCounter({
  end,
  duration,
  prefix = "",
  suffix = "",
  className = "",
}: ContinuousCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animationId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
