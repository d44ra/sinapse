import Image from "next/image";
import AnimatedStar from "@/components/AnimatedStar";

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-white overflow-hidden">
      
      {/* Nome do Projeto + Slogan */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-4">
        <h1 className="text-7xl font-semibold text-[#0004FF] leading-none">
          Sinapse
        </h1>

        <p className="text-base text-[#0004FF] leading-tight max-w-xs">
  explore o site como você explora<br />
  a cidade de São Paulo
</p>
      </div>

      {/* Imagem Central */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[90%] h-[90%]">
          <Image
            src="/images/mapa-sp.png"
            alt="Mapa da cidade de São Paulo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Estrelas Animadas */}
      <AnimatedStar
        label="Sobre Nós"
        href="/sobre-nos"
        initialX={120}
        initialY={150}
        duration={70}
      />
      <AnimatedStar
        label="Mídia"
        href="/midia"
        initialX={300}
        initialY={100}
        duration={55}
      />
      <AnimatedStar
        label="Jogo"
        href="/jogo"
        initialX={600}
        initialY={180}
        duration={45}
      />
      <AnimatedStar
        label="Os Sentidos"
        href="/os-sentidos"
        initialX={850}
        initialY={300}
        duration={65}
      />
      <AnimatedStar
        label="Loja"
        href="/loja"
        initialX={450}
        initialY={450}
        duration={50}
      />
      
    </main>
  );
}