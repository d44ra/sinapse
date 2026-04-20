"use client";

import { useState } from "react";
import Image from "next/image";

type Poster = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  src: string;
};

export default function SobreNos() {
  const [posters, setPosters] = useState<Poster[]>([]);

  const posterImages = [
    "/images/midia/cartazes/poster1.jpg",
    "/images/midia/cartazes/poster2.jpg",
    "/images/midia/cartazes/poster3.jpg",
  ];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const randomImage =
      posterImages[Math.floor(Math.random() * posterImages.length)];

    const rotation = Math.random() * 30 - 15;

    const newPoster: Poster = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      rotation,
      src: randomImage,
    };

    setPosters((prev) => [...prev, newPoster]);
  };

  return (
    <main
      onClick={handleClick}
      className="relative w-screen h-screen overflow-hidden cursor-pointer"
      style={{
        backgroundImage: "url('/images/midia/parede-fora.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
          }}
        >
          <Image
            src={poster.src}
            alt="Poster"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
    </main>
  );
}