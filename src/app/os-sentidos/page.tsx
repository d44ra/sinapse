"use client";

import { useState } from "react";

const sections = [
  {
    text: "Na Antiguidade, Aristóteles (384-322 a.C.) já havia escrito sobre os cinco sentidos, os quais, ainda hoje, são considerados como os sentidos tradicionais: visão, audição, tato, olfato e paladar.",
    sense: "visao",
  },
  {
    text: "A visão se configura a partir da percepção que olhos têm da luz, que é parte radiação magnética de que estamos rodeados. O tato e a audição se constituem a partir de fenômenos que dependem de deformações mecânicas, portanto são sentidos mecânicos.",
    sense: "audicao",
  },
  {
    text: "Por último, temos o olfato e o paladar que são sentidos químicos, pois as informações chegam até nós por meio de moléculas químicas que se desprendem das substâncias.",
    sense: "tato",
  },
  {
    text: "De acordo com a pesquisadora de semiótica Santaella, o olho, que capta energia radiante, é o sentido que mais longe vai na sua exploração panorâmica até o horizonte. O ouvido, que capta energia mecânica vibratória, não atinge as mesmas distâncias que o olho.",
    sense: "olfato",
  },
  {
    text: "O tato interage no corpo-a-corpo com as coisas, toca, apalpa, tropeça. O olfato capta energia química numa troca de partículas que chegam pelo ar. No paladar essa troca de partículas se dá no próprio corpo. Assim, Santanella aponta que os órgãos sensoriais funcionam como janelas abertas para o exterior. Com isso em mente, ligamos os sentidos a experiências em São Paulo.",
    sense: "paladar",
  },
];

export default function SensoryPage() {
  const [activeImages, setActiveImages] = useState<Record<string, boolean>>({});

  const toggleImage = (sense: string) => {
    setActiveImages((prev) => {
      const isActive = prev[sense] ?? false;
      const newState = { ...prev, [sense]: !isActive };

      if (sense === "audicao") {
        const audio = new Audio("/images/audicao.mp3");
        audio.play();
      }

      return newState;
    });
  };

  const getImageSrc = (sense: string) => {
    return activeImages[sense]
      ? `/images/${sense}2.png`
      : `/images/${sense}.png`;
  };

  return (
    <main className="bg-[#f7f7f7] min-h-screen flex flex-col items-center py-16 gap-16">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`w-full max-w-6xl flex items-center justify-between ${
            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
          } gap-10`}
        >
          {/* Text Box */}
          <div className="w-1/2 text-black text-base leading-relaxed">
            {section.text}
          </div>

          {/* Image */}
          <div className="w-1/2 flex justify-center">
            <img
              src={getImageSrc(section.sense)}
              alt={section.sense}
              className="cursor-pointer max-h-64 object-contain"
              onClick={() => toggleImage(section.sense)}
            />
          </div>
        </div>
      ))}
    </main>
  );
}
