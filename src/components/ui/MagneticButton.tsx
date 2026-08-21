"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface MagneticButtonProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  magneticPull?: number;
}

export function MagneticButton({
  children,
  className = "",
  magneticPull,
  ...props
}: MagneticButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
}
