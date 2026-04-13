"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface AnimatedStarProps {
  label: string;
  href: string;
  initialX: number;
  initialY: number;
  duration?: number;
}

export default function AnimatedStar({
  label,
  href,
  initialX,
  initialY,
  duration = 20,
}: AnimatedStarProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute z-10"
      style={{ left: initialX, top: initialY }}
      animate={
        isHovered
          ? {}
          : {
              x: [0, 60, -40, 30, 0],
              y: [0, -50, 40, -20, 0],
            }
      }
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={href} className="relative flex items-center">
        {/* Rotação contínua */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Image
            src="/vectors/star.svg"
            alt={label}
            width={40}
            height={40}
            priority
          />
        </motion.div>

        {/* Tooltip */}
        {isHovered && (
          <span className="ml-2 whitespace-nowrap text-sm font-medium text-[#0004FF]">
            {label}
          </span>
        )}
      </Link>
    </motion.div>
  );
}