import Image from "next/image";
import AnimatedStar from "@/components/AnimatedStar";

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-white overflow-hidden">
      
      {/* Nome do Projeto + Slogan */}
      <div className="absolute top-6 left-8 z-20 flex flex-col">
  <Image
    src="/images/sinapse-logo.png"
    alt="Sinapse"
    width={0}
    height={0}
    sizes="100vw"
    className="w-[350px] h-auto"
  />

</div>

<div className="absolute top-37 left-13 z-20 flex flex-col">
  <p className="mt-2 w-[300px] pl-20 text-base text-[#000000] leading-tight">
    explore o site como você explora<br />
    a cidade de São Paulo
  </p>
</div>

      {/* Imagem Central */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[110%] h-[110%]">
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
        src="/vectors/star1.svg"
      />

      <AnimatedStar
        label="Mídia"
        href="/midia"
        initialX={300}
        initialY={100}
        duration={55}
        src="/vectors/star2.svg"
      />

      <AnimatedStar
        label="Jogo"
        href="/jogo"
        initialX={600}
        initialY={180}
        duration={45}
        src="/vectors/star3.svg"
      />

      <AnimatedStar
        label="Os Sentidos"
        href="/os-sentidos"
        initialX={850}
        initialY={300}
        duration={65}
        src="/vectors/star4.svg"
      />

      <AnimatedStar
        label="Loja"
        href="/loja"
        initialX={450}
        initialY={450}
        duration={50}
        src="/vectors/star5.svg"
      />
      
    </main>
  );
}