import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export default function AnimatedNumber({ value, className = "" }) {
  const numeric = Number(value);
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 110, damping: 24 });
  const rounded = useTransform(spring, (current) => Math.round(current).toLocaleString());
  useEffect(() => {
    if (Number.isFinite(numeric)) count.set(numeric);
  }, [count, numeric]);

  if (!Number.isFinite(numeric)) return <span className={className}>{value ?? "—"}</span>;
  return <motion.span className={className} aria-label={numeric.toLocaleString()}>{rounded}</motion.span>;
}
