"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  duration = 70,
}: AnimatedStarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const progress = useMotionValue(0);
  const animationRef = useRef<any>(null);
  const pathRef = useRef<{ x: number[]; y: number[] } | null>(null);

  const seed = label.length * 0.7 + initialX * 0.01;

  const rotationDuration = 4 + (seed % 5);
  const rotationDirection = seed % 2 === 0 ? 360 : -360;
  const rotationDelay = seed % 3;

  const generatePath = (seed: number) => {
  const padding = 80;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const minX = padding;
  const maxX = width - padding;
  const minY = padding;
  const maxY = height - padding;

  const points = 8;
  const x: number[] = [];
  const y: number[] = [];

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;

    const offsetX =
      Math.sin(angle + seed) * (width * 0.25) +
      Math.cos(angle * 2 + seed) * (width * 0.08);

    const offsetY =
      Math.cos(angle + seed) * (height * 0.25) +
      Math.sin(angle * 2 + seed) * (height * 0.08);

    let posX = initialX + offsetX;
    let posY = initialY + offsetY;

    // 🔒 trava dentro da tela com margem
    posX = Math.min(Math.max(posX, minX), maxX);
    posY = Math.min(Math.max(posY, minY), maxY);

    x.push(posX);
    y.push(posY);
  }

  x.push(x[0]);
  y.push(y[0]);

  return { x, y };
};

  const getPathMetrics = (pathX: number[], pathY: number[]) => {
    const distances: number[] = [0];

    for (let i = 1; i < pathX.length; i++) {
      const dx = pathX[i] - pathX[i - 1];
      const dy = pathY[i] - pathY[i - 1];
      distances.push(distances[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }

    return {
      distances,
      total: distances[distances.length - 1],
    };
  };

  useEffect(() => {
    setIsMounted(true);

    pathRef.current = generatePath(seed);

    animationRef.current = animate(progress, 1, {
      duration,
      ease: "linear",
      repeat: Infinity,
    });

    return () => animationRef.current?.stop();
  }, []);

  useEffect(() => {
    if (!animationRef.current) return;

    if (isHovered) animationRef.current.pause();
    else animationRef.current.play();
  }, [isHovered]);

  const x = useTransform(progress, (v) => {
    if (!pathRef.current) return initialX;

    const { x: pathX, y: pathY } = pathRef.current;
    const { distances, total } = getPathMetrics(pathX, pathY);

    const target = v * total;

    let i = 0;
    while (i < distances.length - 1 && distances[i + 1] < target) i++;

    const t =
      (target - distances[i]) /
      (distances[i + 1] - distances[i] || 1);

    return pathX[i] + (pathX[i + 1] - pathX[i]) * t;
  });

  const y = useTransform(progress, (v) => {
    if (!pathRef.current) return initialY;

    const { x: pathX, y: pathY } = pathRef.current;
    const { distances, total } = getPathMetrics(pathX, pathY);

    const target = v * total;

    let i = 0;
    while (i < distances.length - 1 && distances[i + 1] < target) i++;

    const t =
      (target - distances[i]) /
      (distances[i + 1] - distances[i] || 1);

    return pathY[i] + (pathY[i + 1] - pathY[i]) * t;
  });

  if (!isMounted) return null;

  return (
    <motion.div
      className="absolute z-10"
      style={{ x, y }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* 🔥 GLOW NEON CONCENTRADO (ESTRELA + TEXTO) */}
      {isHovered && (
        <div className="absolute -inset-6 flex items-center gap-2 px-3 py-2 rounded-full">

          {/* camada 1 - brilho forte */}
          <div className="absolute inset-0 rounded-full bg-white/40 blur-xl" />

          {/* camada 2 - núcleo neon */}
          <div className="absolute inset-0 rounded-full bg-white/20 blur-md" />

        </div>
      )}

      <Link href={href} className="relative flex items-center gap-2">

        {/* estrela girando */}
        <motion.div
          animate={{ rotate: rotationDirection }}
          transition={{
            duration: rotationDuration,
            repeat: Infinity,
            ease: "linear",
            delay: rotationDelay,
          }}
        >
          <Image
            src="/vectors/star.svg"
            alt={label}
            width={60}
            height={60}
            priority
          />
        </motion.div>

        {/* label com glow próprio */}
        {isHovered && (
          <span className="text-sm font-medium text-[#0004FF]
                 drop-shadow-[0_0_10px_rgba(0,4,255,0.8)]">
  {label}
</span>
        )}

      </Link>
    </motion.div>
  );
}