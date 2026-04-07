import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  isActive: boolean;
  decimals?: number;
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  isActive,
  decimals = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, end, duration]);

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString();

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
}
