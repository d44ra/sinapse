import Image from "next/image";
import AnimatedStar from "@/components/AnimatedStar";

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-white overflow-hidden">
      {/* Nome do Projeto */}
      <h1 className="absolute top-6 right-8 text-2xl font-semibold text-[#0004FF]">
        Sinapse
      </h1>

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
        label="Comunidade"
        href="/comunidade"
        initialX={450}
        initialY={450}
        duration={50}
      />
    </main>
  );
}