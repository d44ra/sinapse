"use client";

import Image from "next/image";
import AnimatedStar from "@/components/AnimatedStar";

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-white overflow-hidden select-none">
      
      {/* --- APENAS O SLOGAN (Topo Esquerdo) --- */}
      <div className="absolute top-12 left-13 z-20 flex flex-col pointer-events-none">
        <p className="mt-2 w-[350px] pl-20 text-base text-[#000000] leading-tight font-medium">
          explore o site como você explora<br />
          a cidade de São Paulo
        </p>
      </div>

      {/* 1. IMAGEM CENTRAL (MAPA) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/images/mapa-sp.png"
          alt="Mapa da cidade de São Paulo"
          width={600}
          height={600}
          className="object-contain opacity-90"
          priority
        />
      </div>

      {/* 2. ESTRELAS DE NAVEGAÇÃO (Voando pelo mapa) */}
      <div className="relative w-full h-full z-30">
        <AnimatedStar
          label="Sobre Nós"
          href="/sobre-nos"
          initialX={20}
          initialY={10}
          duration={20}
          src="/images/vectors/star1.svg"
        />
        <AnimatedStar
          label="Mídia"
          href="/midia"
          initialX={70}
          initialY={20}
          duration={19}
          src="/images/vectors/star2.svg"
        />
        <AnimatedStar
          label="Jogo"
          href="/jogo"
          initialX={50}
          initialY={75}
          duration={18}
          src="/images/vectors/star3.svg"
        />
        <AnimatedStar
          label="Os Sentidos"
          href="/os-sentidos"
          initialX={25}
          initialY={65}
          duration={23}
          src="/images/vectors/star4.svg"
        />
        <AnimatedStar
          label="Loja"
          href="/loja"
          initialX={80}
          initialY={70}
          duration={20}
          src="/images/vectors/star5.svg"
        />
        <AnimatedStar
          label="Comunidade"
          href="/comunidade"
          initialX={50}
          initialY={80}
          duration={15}
          src="/images/vectors/star6.svg"
          />
      </div>

      {/* 3. LOGO DE FUNDO (Canto Inferior Esquerdo) */}
      <div className="absolute bottom-10 left-10 z-0 opacity-100 pointer-events-none">
        <Image 
          src="/images/sinapse_logo.png" 
          alt="Logo Sinapse Fundo" 
          width={400} 
          height={130} 
          className="h-auto"
        />
      </div>
      
    </main>
  );
}