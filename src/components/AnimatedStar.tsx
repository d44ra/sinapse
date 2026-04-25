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
  src: string;
}

export default function AnimatedStar({
  label,
  href,
  initialX,
  initialY,
  duration = 70,
  src,
}: AnimatedStarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const progress = useMotionValue(0);
  const animationRef = useRef<any>(null);

  // caminho fixo após montar
  const pathRef = useRef<{ x: number[]; y: number[] }>({
    x: [initialX],
    y: [initialY],
  });

  const seed = label.length * 0.7 + initialX * 0.01;

  const rotationDuration = 4 + (seed % 5);
  const rotationDirection = seed % 2 === 0 ? 360 : -360;
  const rotationDelay = seed % 3;

  const generatePath = () => {
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

      posX = Math.min(Math.max(posX, minX), maxX);
      posY = Math.min(Math.max(posY, minY), maxY);

      x.push(posX);
      y.push(posY);
    }

    // fechar loop
    x.push(x[0]);
    y.push(y[0]);

    pathRef.current = { x, y };
  };

  const getPosition = (v: number) => {
    const { x, y } = pathRef.current;

    if (x.length < 2) return { x: initialX, y: initialY };

    const total = x.length - 1;
    const index = Math.floor(v * total);
    const next = (index + 1) % x.length;

    const t = (v * total) % 1;

    return {
      x: x[index] + (x[next] - x[index]) * t,
      y: y[index] + (y[next] - y[index]) * t,
    };
  };

  useEffect(() => {
    setIsMounted(true);

    generatePath();

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

  const x = useTransform(progress, (v) => getPosition(v).x);
  const y = useTransform(progress, (v) => getPosition(v).y);

  if (!isMounted) return null;

  return (
    <motion.div
      className="absolute z-10"
      style={{ x, y }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="absolute -inset-6 rounded-full">
          <div className="absolute inset-0 rounded-full bg-white/40 blur-xl" />
          <div className="absolute inset-0 rounded-full bg-white/20 blur-md" />
        </div>
      )}

      <Link href={href} className="relative flex items-center gap-2">
        <motion.div
          animate={{ rotate: rotationDirection }}
          transition={{
            duration: rotationDuration,
            repeat: Infinity,
            ease: "linear",
            delay: rotationDelay,
          }}
        >
         <img
  src={src}
  alt={label}
  width={60}
  height={60}
/>
        </motion.div>

        {isHovered && (
          <span className="text-sm font-medium text-[#0004FF] drop-shadow-[0_0_10px_rgba(0,4,255,0.8)]">
            {label}
          </span>
        )}
      </Link>
    </motion.div>
  );
}