"use client";

import { useState } from "react";
import Menu from "../../components/Menu";

const sections = [
  {
    text: "A visão é o sentido que percebe a luz e a transforma em imagens, cores e formas. Em São Paulo, ela aparece nos prédios, grafites, ruas e cultura da cidade. O efeito “vibrance” intensifica as cores da imagem, reforçando a ideia do sentido.",
    sense: "eye",
  },
  {
    text: "A audição capta ondas que se propagam no ar e fazem o tímpano vibrar. São Paulo é uma cidade barulhenta, e buscamos imagens que representem isso: sirene, caixa de som, construção, avião, etc. O efeito “noise” traduz a ideia de som nas imagens com o ruído.",
    sense: "ear",
  },
  {
    text: "O tato percebe estímulos mecânicos na superfície do corpo. Na cidade de São Paulo, está nas texturas do asfalto, concreto e metal. O efeito “torn edges” reforça essa textura.",
    sense: "hand",
  },
  {
    text: "O olfato é ativado por partículas químicas que chegam pelo ar. Pensando em São Paulo, associamos com cheiro de café, esgoto, cigarro, gasolina e padaria. O efeito “box blur” representa esse sentido com um desfoque, como a representação de cheiro.",
    sense: "nose",
  },
  {
    text: "O paladar percebe substâncias que entram em contato com a língua, enviando sinais ao cérebro. Associamos os sabores de São Paulo ao café, comidas de restaurantes e feiras. O efeito “glass” traz sensação de algo salivando.",
    sense: "mouth",
  },
];

export default function SensoryPage() {
  // Removi o <Record<string, boolean>> que causava o erro no .js
  const [activeImages, setActiveImages] = useState({});

  const assetsPath = "/images/";

  const toggleImage = (sense) => { // Removi o :string
    setActiveImages((prev) => ({
      ...prev,
      [sense]: !prev[sense],
    }));

    // Adicionei as crases corretas para o caminho do som
    const audio = new Audio(`${assetsPath}${sense}.mp3`);
    audio.play().catch((err) => {
      console.warn(`Erro ao tocar o som para ${sense}:`, err);
    });
  };

  const getImageSrc = (sense) => {
    const isSecondImage = activeImages[sense];

    if (isSecondImage) {
      if (sense === "ear") return `${assetsPath}ear2_.png`;
      return `${assetsPath}${sense}2.png`;
    }
    
    return `${assetsPath}${sense}1.png`;
  };

  return (
    
    
    <main className="bg-[#f7f7f7] min-h-screen flex flex-col items-center py-16 gap-16">

      {/* MENU ADICIONADO AQUI */}
      <Menu iconePersonalizado="/images/menu1.png" tamanho={100} />

      {sections.map((section, index) => (
        <div
          key={index}
          className={`w-full max-w-6xl flex items-center justify-between ${
            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
          } gap-10 px-10`}
        >
          {/* Texto com a mesma fonte e estilo */}
          <div className="w-1/2 text-black text-lg leading-relaxed font-medium">
            {section.text}
          </div>

          {/* Imagem interativa */}
          <div className="w-1/2 flex justify-center">
            <img
              src={getImageSrc(section.sense)}
              alt={`Sentido ${section.sense}`}
              className="cursor-pointer max-h-72 w-auto transition-transform duration-300 hover:scale-105"
              onClick={() => toggleImage(section.sense)}
            />
          </div>
        </div>
      ))}
    </main>
  );
}