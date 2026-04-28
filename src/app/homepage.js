"use client";

import Image from "next/image";
import AnimatedStar from "@/components/AnimatedStar";

export default function Home() {
  return (
    // Mudei o bg-white para bg-red-500 só para você testar. 
    // Se a tela ficar vermelha, o código ATUALIZOU. Aí você volta para bg-white.
    <main className="relative w-full h-screen bg-white overflow-hidden select-none">
      
      {/* NOME DO PROJETO + SLOGAN */}
      <div className="absolute top-10 left-10 z-50 flex flex-col pointer-events-none">
        <Image
          src="/images/sinapse-logo.png"
          alt="Sinapse"
          width={350}
          height={100}
          className="w-[350px] h-auto"
          priority
        />
        <div className="mt-4">
          <p className="pl-16 text-lg text-black font-bold border-l-4 border-[#0004FF] ml-4 py-1 uppercase tracking-tighter">
            explore o site como você explora<br />
            a cidade de São Paulo
          </p>
        </div>
      </div>

      {/* MAPA CENTRAL */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/images/mapa-sp.png"
          alt="Mapa da cidade de São Paulo"
          width={600}
          height={600}
          className="object-contain opacity-80"
          priority
        />
      </div>

      {/* ESTRELAS (Com caminho corrigido para a sua pasta) */}
      <div className="relative w-full h-full z-30">
          <AnimatedStar
            label="Sobre Nós"
            href="/sobre-nos"
            initialX={15}
            initialY={30}
            duration={15}
            src="/images/vectors/star1.svg"
          />
          <AnimatedStar
            label="Mídia"
            href="/midia"
            initialX={75}
            initialY={25}
            duration={12}
            src="/images/vectors/star2.svg"
          />
          <AnimatedStar
            label="Os Sentidos"
            href="/os-sentidos"
            initialX={25}
            initialY={70}
            duration={10}
            src="/images/vectors/star4.svg"
          />
          <AnimatedStar
            label="Comunidade"
            href="/comunidade"
            initialX={55}
            initialY={70}
            duration={10}
            src="/images/vectors/star5.svg"
          />
      </div>

      {/* LOGO FUNDO */}
      <div className="absolute bottom-10 left-10 z-0 opacity-50 pointer-events-none">
        <Image 
          src="/images/sinapse_logo.png" 
          alt="Logo Grande" 
          width={450} 
          height={150} 
          className="h-auto"
        />
      </div>
      
    </main>
  );
}