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

  // Evita erros de hidratação no Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Gera trajetórias orgânicas e contínuas
  const generatePath = (seed: number) => {
    if (typeof window === "undefined") {
      return { x: [initialX], y: [initialY] };
    }

    const width = window.innerWidth - 80;
    const height = window.innerHeight - 80;

    const points = 8;
    const x: number[] = [];
    const y: number[] = [];

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;

      const offsetX =
        Math.sin(angle + seed) * (width * 0.35) +
        Math.cos(angle * 2 + seed) * (width * 0.1);

      const offsetY =
        Math.cos(angle + seed) * (height * 0.35) +
        Math.sin(angle * 2 + seed) * (height * 0.1);

      const posX = Math.min(Math.max(initialX + offsetX, 0), width);
      const posY = Math.min(Math.max(initialY + offsetY, 0), height);

      x.push(posX);
      y.push(posY);
    }

    // Fecha o loop para evitar movimentos bruscos
    x.push(x[0]);
    y.push(y[0]);

    return { x, y };
  };

  // Cada estrela recebe um caminho único
  const seed = label.length * 0.7;
  const pathRef = useRef(generatePath(seed));

  // Interpolação suave do movimento
  const x = useTransform(progress, (v) => {
    const path = pathRef.current.x;
    const normalized = v % 1;
    const index = normalized * (path.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const fraction = index - lower;

    if (upper >= path.length) return path[path.length - 1];

    return path[lower] + (path[upper] - path[lower]) * fraction;
  });

  const y = useTransform(progress, (v) => {
    const path = pathRef.current.y;
    const normalized = v % 1;
    const index = normalized * (path.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const fraction = index - lower;

    if (upper >= path.length) return path[path.length - 1];

    return path[lower] + (path[upper] - path[lower]) * fraction;
  });

  // Animação contínua e fluida
  useEffect(() => {
    if (!isMounted) return;

    if (!isHovered) {
      const current = progress.get();

      animationRef.current = animate(progress, current + 1, {
        duration,
        ease: "linear",
        repeat: Infinity,
      });
    } else {
      animationRef.current?.stop();
    }

    return () => animationRef.current?.stop();
  }, [isHovered, duration, progress, isMounted]);

  if (!isMounted) return null;

  return (
    <motion.div
      className="absolute z-10"
      style={{ x, y }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={href} className="relative flex items-center">
        {/* Rotação contínua */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Image
            src="/vectors/star.svg"
            alt={label}
            width={100}
            height={100}
            style={{ width: "60px", height: "auto" }}
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