"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ value, prefix = "", suffix = "", className = "" }: AnimatedCounterProps) {
  const [mounted, setMounted] = useState(false);
  const count = useSpring(0, { stiffness: 80, damping: 20 });

  useEffect(() => {
    setMounted(true);
    count.set(value);
  }, [value, count]);

  const display = useTransform(count, (v) => 
    `${prefix}${Math.round(v).toLocaleString('en-IN')}${suffix}`
  );

  if (!mounted) {
    return <span className={className}>{prefix}0{suffix}</span>;
  }

  return <motion.span className={className}>{display}</motion.span>;
}
