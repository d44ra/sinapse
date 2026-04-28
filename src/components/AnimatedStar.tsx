"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface AnimatedStarProps {
  label: string;
  href: string;
  initialX: number; // Posição inicial em % (0 a 100)
  initialY: number; // Posição inicial em % (0 a 100)
  duration?: number;
  src: string;
  size?: number;
}

export default function AnimatedStar({
  label,
  href,
  initialX,
  initialY,
  duration = 60, // Aumentei o tempo padrão para ser mais calmo
  src,
  size = 65,
}: AnimatedStarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const progress = useMotionValue(0);
  const animationRef = useRef<any>(null);

  // Armazena o caminho gerado para não mudar a cada render
  const pathRef = useRef<{ x: number[]; y: number[] }>({ x: [], y: [] });

  // Gera um número único baseado no nome da estrela para o trajeto ser diferente
  const seed = label.length * 0.5 + initialX * 0.1;

  const generatePath = () => {
    // Pegamos o tamanho da janela
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // ZONA LIMITE: 150px de distância das bordas para a estrela nunca "bater" no canto
    const padding = 150; 

    // Posição inicial convertida para pixels
    const startX = (initialX / 100) * width;
    const startY = (initialY / 100) * height;

    const points = 12; // Mais pontos para o trajeto ser bem circular e suave
    const xCoords: number[] = [];
    const yCoords: number[] = [];

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;

      // Reduzi de 0.35 para 0.25 para o voo ser grande, mas não exagerado
      let destX = startX + Math.sin(angle + seed) * (width * 0.25);
      let destY = startY + Math.cos(angle + seed) * (height * 0.25);

      // TRAVA DE SEGURANÇA (ZONA LIMITE)
      // Garante que a estrela fique entre 'padding' e 'tamanho da tela - padding'
      destX = Math.max(padding, Math.min(destX, width - padding));
      destY = Math.max(padding, Math.min(destY, height - padding));

      xCoords.push(destX);
      yCoords.push(destY);
    }

    pathRef.current = { x: xCoords, y: yCoords };
  };

  const getPosition = (v: number) => {
    const { x, y } = pathRef.current;
    if (x.length < 2) return { x: 0, y: 0 };

    const totalSegments = x.length - 1;
    const rawIndex = v * totalSegments;
    const index = Math.min(Math.floor(rawIndex), totalSegments - 1);
    const t = rawIndex - index;

    return {
      x: x[index] + (x[index + 1] - x[index]) * t,
      y: y[index] + (y[index + 1] - y[index]) * t,
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
  }, [duration]);

  // Lógica de Pausa no Hover
  useEffect(() => {
    if (!animationRef.current) return;
    isHovered ? animationRef.current.pause() : animationRef.current.play();
  }, [isHovered]);

  const posX = useTransform(progress, (v) => getPosition(v).x);
  const posY = useTransform(progress, (v) => getPosition(v).y);

  if (!isMounted) return null;

  return (
    <motion.div
      className="absolute z-30"
      style={{ x: posX, y: posY, left: 0, top: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={href} className="relative flex items-center group cursor-pointer no-underline">
        {isHovered && (
          <div className="absolute inset-0 -m-8 bg-white/50 blur-3xl rounded-full" />
        )}
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="relative z-10"
        >
          <img 
            src={src} 
            alt={label} 
            width={size} 
            height={size} 
            className="drop-shadow-2xl"
          />
        </motion.div>

        {isHovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-4 text-[#0004FF] font-black text-2xl uppercase tracking-tighter bg-white/90 px-4 py-1 rounded-full shadow-xl border border-zinc-200"
          >
            {label}
          </motion.span>
        )}
      </Link>
    </motion.div>
  );
}