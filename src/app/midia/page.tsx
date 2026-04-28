"use client";
import { useState } from "react";
import Image from "next/image";
import Menu from "../../components/Menu";

// Definição do tipo para o TypeScript não reclamar
type Poster = {  
  id: number;  
  x: number;  
  y: number;  
  rotation: number;  
  src: string;
};

export default function Midia() {  
  const [posters, setPosters] = useState<Poster[]>([]);

  const posterImages = [    
    "/images/cartazes/poster1.png",    
    "/images/cartazes/poster2.png",    
    "/images/cartazes/poster3.png",  
    "/images/cartazes/poster4.png",
    "/images/cartazes/poster5.png",
    "/images/cartazes/poster6.png",
    "/images/cartazes/poster7.png",
  ];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {    
    // Impede de colar cartaz se clicar no Menu ou em botões
    if ((e.target as HTMLElement).closest('button')) return;

    const randomImage = posterImages[Math.floor(Math.random() * posterImages.length)];
    const rotation = Math.random() * 30 - 15;

    const newPoster: Poster = {      
      id: Date.now(),      
      x: e.pageX, // Usamos pageX para considerar o scroll se houver
      y: e.pageY,      
      rotation,      
      src: randomImage,    
    };

    setPosters((prev) => [...prev, newPoster]);  
  };

  return (    
    <main      
     onClick={handleClick}
  className="relative w-screen h-screen overflow-hidden select-none"
  style={{
    backgroundImage: "url('/images/parede-fora.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    // ADICIONE ESTA LINHA ABAIXO:
    cursor: "url('/images/cursor-rolo.png') 64 64, auto" 
  }}
    >      
      {/* Menu com ícone diferente para a Mídia */}
      <Menu iconePersonalizado="/images/menu3.png" tamanho={110} />

      {/* Título */}
      <div className="absolute top-10 left-10 z-10 pointer-events-none">
        <h1 className="text-5xl font-black text-white mix-blend-difference italic">
          MÍDIA / <span className="text-[#0004FF]">LAMBE-LAMBE</span>
        </h1>
      </div>

      {posters.map((poster) => (        
        <div          
          key={poster.id}          
          style={{            
            position: "absolute",            
            top: poster.y,            
            left: poster.x,            
            transform: `translate(-50%, -50%) rotate(${poster.rotation}deg)`,            
            width: "210px",            
            height: "297px",
            pointerEvents: "none" // Permite clicar "através" do cartaz      
          }}        
        >          
          <Image            
            src={poster.src}            
            alt="Poster"            
            fill            
            style={{ objectFit: "cover" }}
            className="shadow-2xl border border-black/10"          
          />        
        </div>      
      ))}    
    </main>  
  );
}