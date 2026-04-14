// ... (mantenha os imports e a interface)
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react"; // Adicione esta linha!
export default function AnimatedStar({ label, href, initialX, initialY, duration = 20 }: AnimatedStarProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute z-10"
      style={{ left: initialX, top: initialY }}
      animate={
        isHovered
          ? { scale: 1.2 } // Aumenta um pouquinho quando passa o mouse
          : {
              y: [0, -20, 0], // Sobe e desce suavemente
              x: [0, 10, 0],  // Balanço lateral leve
            }
      }
      transition={{
        duration: isHovered ? 0.2 : 4, // Mais rápido no hover, lento no flutuar
        repeat: Infinity,
        ease: "easeInOut", // Suave
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={href} className="relative flex items-center group">
        {/* REMOVIDO: animate={{ rotate: 360 }} */}
        <div> 
          <Image
            src="/vectors/star.svg"
            alt={label}
            width={40}
            height={40}
            priority
            className="drop-shadow-[0_0_8px_rgba(0,4,255,0.3)]" // Brilho azul opcional
          />
        </div>

        {/* Tooltip melhorado */}
        <span className={`ml-2 whitespace-nowrap text-sm font-bold text-[#0004FF] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {label}
        </span>
      </Link>
    </motion.div>
  );
}