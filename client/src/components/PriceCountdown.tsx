import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface PriceCountdownProps {
  start?: number;
  end: number;
  duration?: number;
  prefix?: string;
  isActive: boolean;
}

/**
 * Price countdown animation:
 * - Starts from `start` (default 50000) and counts down to `end` (19900)
 * - Fast at the beginning, starts slowing down around 25000
 * - When reaching the target, triggers a scale-up + shake emphasis effect
 */
export function PriceCountdown({
  start = 50000,
  end = 19900,
  duration = 2800,
  prefix = "NT$",
  isActive,
}: PriceCountdownProps) {
  const [displayValue, setDisplayValue] = useState(start);
  const [hasFinished, setHasFinished] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isActive) {
      setDisplayValue(start);
      setHasFinished(false);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const totalDrop = start - end; // 30100
    // The threshold where we start slowing down (as a ratio of totalDrop)
    const slowdownThreshold = (start - 25000) / totalDrop; // ~0.83 of the way

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const linearProgress = Math.min(elapsed / duration, 1);

      // Custom easing: fast at start, dramatically slows near end
      let eased: number;
      if (linearProgress <= slowdownThreshold) {
        // Fast phase: use a slightly accelerating curve for the first ~83%
        const phaseProgress = linearProgress / slowdownThreshold;
        // Map to 0-0.83 of the value range, using a gentle ease
        eased = phaseProgress * slowdownThreshold;
      } else {
        // Slow phase: dramatically decelerate for the last ~17%
        const phaseProgress =
          (linearProgress - slowdownThreshold) / (1 - slowdownThreshold);
        // Use a strong ease-out (power of 4) for dramatic slowdown
        const slowEased = 1 - Math.pow(1 - phaseProgress, 4);
        eased = slowdownThreshold + slowEased * (1 - slowdownThreshold);
      }

      const currentValue = Math.round(start - eased * totalDrop);
      setDisplayValue(currentValue);

      if (linearProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        setHasFinished(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, start, end, duration]);

  // Trigger emphasis animation when countdown finishes
  useEffect(() => {
    if (hasFinished) {
      controls.start({
        scale: [1, 1.25, 0.95, 1.15, 0.98, 1.08, 1],
        rotate: [0, -2, 2, -1.5, 1.5, -0.5, 0],
        transition: {
          duration: 0.8,
          ease: "easeOut",
          times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
        },
      });
    }
  }, [hasFinished, controls]);

  const formatted = displayValue.toLocaleString();

  return (
    <motion.span
      ref={containerRef}
      animate={controls}
      className="inline-block origin-center"
      style={{ display: "inline-block" }}
    >
      <span>{prefix}</span>
      <span>{formatted}</span>
      {hasFinished && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4, type: "spring", stiffness: 300 }}
          className="inline-block ml-1 md:ml-2"
        >
          <span className="text-lg md:text-3xl align-middle">🔥</span>
        </motion.span>
      )}
    </motion.span>
  );
}
