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
        <Image
          src="/images/mapa-sp.png"
          alt="Mapa da cidade de São Paulo"
          width={700}
          height={700}
          className="object-contain"
          priority
        />
      </div>

      {/* Estrelas Animadas */}
      <AnimatedStar
        label="Sobre Nós"
        href="/sobre-nos"
        initialX={120}
        initialY={150}
      />
      <AnimatedStar
        label="Mídia"
        href="/midia"
        initialX={300}
        initialY={100}
        duration={22}
      />
      <AnimatedStar
        label="Jogo"
        href="/jogo"
        initialX={600}
        initialY={180}
        duration={18}
      />
      <AnimatedStar
        label="Os Sentidos"
        href="/os-sentidos"
        initialX={850}
        initialY={300}
        duration={24}
      />
      <AnimatedStar
        label="Comunidade"
        href="/comunidade"
        initialX={450}
        initialY={450}
        duration={20}
      />        
      <AnimatedStar
        label="Loja"
        href="/loja"
        initialX={1000} // Ajuste para a direita
        initialY={500}  // Ajuste para baixo
/>
      
    </main>
  );
}